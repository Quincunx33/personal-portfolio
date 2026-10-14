export function onRequest() {
  return new Response("Direct Access Blocked", {
    status: 403,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, noarchive",
    },
  });
}
