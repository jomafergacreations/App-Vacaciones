/* Control Planning: service worker mínimo para que la app se pueda instalar.
   No guarda nada en caché: así siempre se carga la versión publicada y el aviso de actualización sigue funcionando. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
