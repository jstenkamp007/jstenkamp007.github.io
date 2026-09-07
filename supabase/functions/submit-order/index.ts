const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

// The public medication pre-order flow was retired in Phase 5. Keep the
// deployed endpoint closed so an old bookmark or a forged browser request
// cannot create or expose health-related enquiry data.
Deno.serve(() => new Response(JSON.stringify({
  error: "This service is no longer available. Please use IhreApotheken.de for prescriptions and orders.",
}), {
  status: 410,
  headers,
}));

