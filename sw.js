;
//https://www.pwabuilder.com/serviceworker
//This is the service worker with the Cache-first network

//asignar un nombre y versión al cache
const CACHE_NAME = 'kiss-cache-v1',
  urlsToCache = [
    /* Add an array of files to precache for your app */
    'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;600;700&display=swap',
    'https://use.fontawesome.com/releases/v5.5.0/css/all.css',
    'https://use.fontawesome.com/releases/v5.5.0/webfonts/fa-solid-900.woff2',
    'https://use.fontawesome.com/releases/v5.5.0/webfonts/fa-brands-400.woff2',
    'https://use.fontawesome.com/releases/v5.5.0/webfonts/fa-regular-400.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/hamburgers/1.1.3/hamburgers.min.css',
    './style.css',
    './script.js',
    './humans.txt',
    './sitemap.xml',
    '/img/Icon-1024.png',
    '/img/Icon-512.png',
    '/img/Icon-384.png',
    '/img/Icon-256.png',
    '/img/Icon-192.png',
    '/img/Icon-128.png',
    '/img/Icon-96.png',
    '/img/Icon-64.png',
    '/img/Icon-32.png',
    './img/Icon-16.png',
    './img/apple-touch-startup-image.png',
    './img/apple-touch-icon.png',
    './assets/logo_soymizra.svg',
    '/',
    '/mentoria',
    '/podcast',
    '/blog',
    '/catalogo'
  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})
