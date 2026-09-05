const projectUrl = "https://iezjojbuyzugfguhizyw.supabase.co";
const allowedOrigins = new Set([
  "https://jstenkamp007.github.io",
  "http://127.0.0.1:8080",
  "http://localhost:8080",
]);

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Vary": "Origin",
};

function corsHeaders(origin: string | null) {
  return origin && allowedOrigins.has(origin)
    ? { ...jsonHeaders, "Access-Control-Allow-Origin": origin }
    : jsonHeaders;
}

function response(body: Record<string, unknown>, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });
}

function sameValue(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readString(value: unknown, maximumLength: number) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maximumLength ? trimmed : null;
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    if (!origin || !allowedOrigins.has(origin)) {
      return response({ error: "Origin not allowed" }, 403, origin);
    }
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders(origin),
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, apikey, prefer",
        "Access-Control-Max-Age": "600",
      },
    });
  }

  if (request.method !== "POST" || !origin || !allowedOrigins.has(origin)) {
    return response({ error: "Request not allowed" }, 403, origin);
  }

  const publishableKeys = JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS") ?? "{}");
  const expectedPublishableKey = publishableKeys.default;
  const providedPublishableKey = request.headers.get("apikey") ?? "";
  if (typeof expectedPublishableKey !== "string" || !sameValue(providedPublishableKey, expectedPublishableKey)) {
    return response({ error: "Unauthorized" }, 401, origin);
  }

  const secretKeys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
  const orderSubmitterKey = secretKeys.order_submitter;
  const rateLimitSalt = Deno.env.get("ORDER_RATE_LIMIT_SALT");
  if (typeof orderSubmitterKey !== "string" || !rateLimitSalt) {
    console.error("Required order submission configuration is unavailable");
    return response({ error: "Service unavailable" }, 503, origin);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return response({ error: "Invalid request" }, 400, origin);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return response({ error: "Invalid request" }, 400, origin);
  }

  const firstName = readString(payload.first_name, 100);
  const lastName = readString(payload.last_name, 100);
  const phone = readString(payload.phone, 50);
  const medicine = readString(payload.medicine, 500);
  const message = typeof payload.message === "string" ? payload.message.trim() || null : null;
  const callback = payload.callback;

  if (!firstName || !lastName || !phone || !medicine ||
      (payload.message != null && typeof payload.message !== "string") ||
      (message !== null && message.length > 2000) || typeof callback !== "boolean") {
    return response({ error: "Invalid order data" }, 400, origin);
  }
  if (phone.length < 5 || !/^[0-9+() ./-]+$/.test(phone)) {
    return response({ error: "Invalid order data" }, 400, origin);
  }

  // Cloudflare sets this header at the edge and does not pass through a value
  // chosen by the browser. The fallback uses the proxy-added final address.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = request.headers.get("cf-connecting-ip")
    ?? forwardedFor?.split(",").at(-1)?.trim();
  if (!clientIp) {
    return response({ error: "Request cannot be verified" }, 400, origin);
  }
  const rateKey = await sha256(`${rateLimitSalt}:${clientIp}`);

  const reserve = await fetch(`${projectUrl}/rest/v1/rpc/reserve_order_submission`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": orderSubmitterKey,
    },
    body: JSON.stringify({ p_rate_key: rateKey }),
  });
  if (!reserve.ok) {
    console.error("Could not reserve order submission", reserve.status);
    return response({ error: "Service unavailable" }, 503, origin);
  }
  if (await reserve.json() !== true) {
    return response({ error: "Too many requests. Please try again later." }, 429, origin);
  }

  const insert = await fetch(`${projectUrl}/rest/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": orderSubmitterKey,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      phone,
      medicine,
      message,
      callback,
    }),
  });

  if (!insert.ok) {
    console.error("Could not create order", insert.status);
    return response({ error: "Order could not be saved" }, 503, origin);
  }

  return response({ ok: true }, 201, origin);
});
