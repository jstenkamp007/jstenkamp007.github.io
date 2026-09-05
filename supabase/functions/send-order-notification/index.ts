function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let difference = 0;

  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const suppliedSecret = request.headers.get("x-order-webhook-secret") ?? "";
  const suppliedSecretHash = await sha256Hex(suppliedSecret);
  const expectedSecretHash = Deno.env.get("ORDER_NOTIFICATION_WEBHOOK_VERIFIER") ?? "";

  if (
    !suppliedSecret ||
    !expectedSecretHash ||
    !timingSafeEqual(suppliedSecretHash, expectedSecretHash)
  ) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  let payload: Record<string, unknown>;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  if (payload.test === true) {
    return jsonResponse({ ok: true, test: true }, 200);
  }

  const orderId = Number(payload.order_id);

  if (
    payload.type !== "INSERT" ||
    payload.schema !== "public" ||
    payload.table !== "orders" ||
    !Number.isSafeInteger(orderId) ||
    orderId <= 0
  ) {
    return jsonResponse({ error: "Invalid webhook payload" }, 400);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not configured");
    return jsonResponse({ error: "Notification service unavailable" }, 500);
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Apotheke am Stadtpark <onboarding@resend.dev>",
        to: ["jasper.stenkamp@icloud.com"],
        subject: "Neue Vorbestellung - Apotheke am Stadtpark",
        html: `
<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background:#f5f7f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#102a43">
    <div style="max-width:600px;margin:40px auto;padding:0 20px">
      <div style="background:white;border-radius:24px;padding:32px;box-shadow:0 10px 30px rgba(16,42,67,.08)">
        <h1 style="margin:0 0 10px;font-size:24px">Neue Vorbestellung</h1>
        <p style="color:#627d98;font-size:16px;line-height:1.6">
          In der Apotheke am Stadtpark ist eine neue Vorbestellung eingegangen.
        </p>
        <div style="margin:25px 0;padding:18px;background:#f5f7f8;border-radius:16px">
          <strong>Neue Anfrage</strong>
          <p style="margin:8px 0 0;color:#627d98">
            Bitte öffnen Sie den geschützten Verwaltungsbereich, um die Vorbestellung zu bearbeiten.
          </p>
        </div>
        <a href="https://jstenkamp007.github.io/admin.html" style="display:inline-block;background:#15966f;color:white;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:600">
          Vorbestellungen öffnen
        </a>
        <p style="margin-top:30px;font-size:13px;color:#627d98;line-height:1.5">
          Diese E-Mail wurde automatisch durch die Website der Apotheke am Stadtpark erzeugt.
        </p>
      </div>
    </div>
  </body>
</html>`,
      }),
    });

    if (!response.ok) {
      console.error(`Resend request failed with status ${response.status}`);
      return jsonResponse({ error: "Notification delivery failed" }, 502);
    }

    return jsonResponse({ success: true }, 200);
  } catch (error) {
    console.error("Notification request failed", error);
    return jsonResponse({ error: "Notification delivery failed" }, 502);
  }
});

