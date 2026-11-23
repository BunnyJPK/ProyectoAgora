// SERVICE WORKER DE ÁGORA
// Guarda únicamente recursos públicos de la interfaz; nunca sesiones ni asistentes.

const VERSION = "v1";
const CACHE_BASE = `agora-base-${VERSION}`;
const CACHE_ESTATICOS = `agora-estaticos-${VERSION}`;
const PREFIJO = "agora-";
const DESARROLLO = new URL(self.location.href).searchParams.get("dev") === "1";

const RECURSOS_BASE = [
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/brand/agora_icon.png",
];

// INSTALACIÓN Y ACTUALIZACIÓN
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_BASE);
      await cache.addAll(RECURSOS_BASE);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    (async () => {
      const nombres = await caches.keys();
      await Promise.all(
        nombres
          .filter(
            (nombre) =>
              nombre.startsWith(PREFIJO) &&
              nombre !== CACHE_BASE &&
              nombre !== CACHE_ESTATICOS
          )
          .map((nombre) => caches.delete(nombre))
      );
      await self.clients.claim();
    })()
  );
});

// CACHE DE ARCHIVOS ESTÁTICOS
async function guardarSiEsPublico(cache, solicitud, respuesta) {
  if (!respuesta.ok || respuesta.type === "opaque") return;

  try {
    await cache.put(solicitud, respuesta.clone());

    // Evita que el caché crezca indefinidamente con versiones antiguas.
    const claves = await cache.keys();
    if (claves.length > 80) {
      await cache.delete(claves[0]);
    }
  } catch {
    // Si el almacenamiento está lleno, la aplicación sigue funcionando en línea.
  }
}

async function desdeCache(solicitud) {
  const cache = await caches.open(CACHE_ESTATICOS);
  const guardado = await cache.match(solicitud);
  if (guardado) return guardado;

  const respuesta = await fetch(solicitud);
  await guardarSiEsPublico(cache, solicitud, respuesta);
  return respuesta;
}

async function desdeRed(solicitud) {
  const cache = await caches.open(CACHE_ESTATICOS);

  try {
    const respuesta = await fetch(solicitud);
    await guardarSiEsPublico(cache, solicitud, respuesta);
    return respuesta;
  } catch {
    return (await cache.match(solicitud)) || (await caches.match(solicitud)) || Response.error();
  }
}

// SOLICITUDES
self.addEventListener("fetch", (evento) => {
  const solicitud = evento.request;
  if (solicitud.method !== "GET") return;

  const url = new URL(solicitud.url);
  if (url.origin !== self.location.origin) return;

  // Las páginas de Next.js siempre se consultan en línea.
  // No guardar HTML privado ni respuestas RSC de usuarios autenticados.
  if (solicitud.mode === "navigate") {
    evento.respondWith(
      (async () => {
        try {
          return await fetch(solicitud);
        } catch {
          return (await caches.match("/offline.html")) || Response.error();
        }
      })()
    );
    return;
  }

  // Recursos de compilación de Next.js: nombres versionados por contenido.
  // En desarrollo no se guardan para no interferir con Turbopack/HMR.
  if (url.pathname.startsWith("/_next/static/")) {
    if (!DESARROLLO) evento.respondWith(desdeCache(solicitud));
    return;
  }

  // Solamente archivos públicos. NO interceptar Server Actions ni Supabase.
  const esPublico =
    url.pathname.startsWith("/brand/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/fontello/") ||
    url.pathname === "/manifest.json";

  if (esPublico) {
    evento.respondWith(desdeRed(solicitud));
  }
});
