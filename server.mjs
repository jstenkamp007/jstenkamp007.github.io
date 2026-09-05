import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectDirectory = dirname(fileURLToPath(import.meta.url));
const port = Number.parseInt(process.env.PORT ?? "8080", 10);
const pages = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/admin.html", "admin.html"],
]);

const securityHeaders = {
  "Cache-Control": "no-store",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self' https://iezjojbuyzugfguhizyw.supabase.co wss://iezjojbuyzugfguhizyw.supabase.co",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; "),
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

createServer(async (request, response) => {
  const method = request.method ?? "GET";

  if (method !== "GET" && method !== "HEAD") {
    response.writeHead(405, { ...securityHeaders, Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const fileName = pages.get(pathname);

  if (!fileName) {
    response.writeHead(404, securityHeaders);
    response.end("Not found");
    return;
  }

  try {
    const body = await readFile(join(projectDirectory, fileName));
    response.writeHead(200, {
      ...securityHeaders,
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": body.length,
    });

    response.end(method === "HEAD" ? undefined : body);
  } catch (error) {
    console.error(error);
    response.writeHead(500, securityHeaders);
    response.end("Internal server error");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Apo-Web läuft unter http://127.0.0.1:${port}`);
});

