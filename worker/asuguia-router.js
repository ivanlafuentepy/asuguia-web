// asuguia-router — Cloudflare Worker que sirve los subdominios de AsuGuía.
//
// Por qué existe: las páginas de cada negocio demo viven en el agente (Genesis,
// en Railway) bajo la ruta /web/<slug>, que SÍ funciona. El custom domain
// wildcard de Railway se quedó trabado emitiendo el cert (problema del lado de
// Railway: authorize.railwaydns.net no resuelve). Este Worker saltea ese
// problema por completo: corre sobre *.asuguia.org (TLS = Universal SSL de
// Cloudflare) y trae la página directo desde el dominio *.up.railway.app del
// agente, que siempre tiene cert válido.
//
// Ruteo:
//   <slug>.asuguia.org/        -> RAILWAY/web/<slug>     (la página del negocio)
//   <slug>.asuguia.org/media/* -> RAILWAY/media/*         (logo y fotos)
//   www / reservados           -> la landing oficial (Pages)
//
// Deploy: por API de Cloudflare (no wrangler). Si lo editás, re-deployá.

const RESERVED = new Set(["www", "api", "demo", "panel"]);
const RAILWAY = "https://genesis-production-3614.up.railway.app";
const PAGES = "https://asuguia-web.pages.dev";

addEventListener("fetch", (event) => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  const slug = url.hostname.split(".")[0];

  // No reenviamos el Host original: Railway debe ver su propio dominio para
  // rutear por path (/web/<slug>), no el subdominio (que tiraría 404).
  const headers = new Headers(request.headers);
  headers.delete("host");
  const init = { method: request.method, headers, body: request.body, redirect: "follow" };

  // www y reservados -> la página oficial (Cloudflare Pages)
  if (RESERVED.has(slug)) {
    return fetch(PAGES + url.pathname + url.search, init);
  }

  // Página del negocio: "/" se sirve desde /web/<slug>; el resto (assets como
  // /media/...) pasa con el mismo path.
  const path = url.pathname === "/" ? "/web/" + slug : url.pathname;
  return fetch(RAILWAY + path + url.search, init);
}
