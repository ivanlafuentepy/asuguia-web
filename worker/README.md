# asuguia-router (Cloudflare Worker)

Sirve los subdominios de negocios `*.asuguia.org` trayendo la página desde el
agente (Genesis, Railway) por la ruta `/web/<slug>`.

## Por qué existe
El custom domain wildcard de Railway se quedó trabado emitiendo el certificado
(`authorize.railwaydns.net` no resolvía → Let's Encrypt nunca validaba; es un
problema del lado de Railway). Este Worker saltea eso por completo: el TLS lo da
el Universal SSL de Cloudflare (cubre `*.asuguia.org`) y la página la trae del
dominio `*.up.railway.app` del agente, que siempre tiene cert válido. Un solo
Worker cubre todos los demos, sin tocar Railway.

## Ruteo
- `<slug>.asuguia.org/` → `RAILWAY/web/<slug>` (página del negocio)
- `<slug>.asuguia.org/media/*` → `RAILWAY/media/*` (logo y fotos)
- `www` y reservados → la landing oficial (Cloudflare Pages)

## Cómo se desplegó (API de Cloudflare, sin wrangler)
- `PUT  /accounts/{acc}/workers/scripts/asuguia-router`  (body = asuguia-router.js, Content-Type: application/javascript)
- `POST /zones/{zone}/workers/routes`  → `{ "pattern": "*.asuguia.org/*", "script": "asuguia-router" }`
- El registro DNS `*.asuguia.org` debe estar **proxied (naranja)** para que el Worker intercepte.

Si lo editás, re-deployá con el mismo PUT. (Cuando Railway arregle su wildcard,
se podría volver al custom domain nativo y quitar el Worker — pero no hace falta.)
