// Definiramo ime i verziju cache-a
const CACHE_NAME = 'mno-kalkulator-cache-v1';
// Lista datoteka koje želimo spremiti u cache za offline rad
const urlsToCache = [
  '/',
  '/index.html'
  // Možeš dodati i ostale stranice ako želiš da rade offline
  '/HEP Kalkulator.html'
  '/KalkulatorMNO.html',
  // itd.
];

// Događaj 'install' - pokreće se kada se Service Worker instalira
self.addEventListener('install', event => {
  // Čekamo da se cache otvori i dodamo sve datoteke s naše liste
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Događaj 'fetch' - pokreće se za svaki mrežni zahtjev sa stranice
self.addEventListener('fetch', event => {
  event.respondWith(
    // Prvo provjeravamo postoji li odgovor u cache-u
    caches.match(event.request)
      .then(response => {
        // Ako postoji, vraćamo ga iz cache-a
        if (response) {
          return response;
        }
        // Ako ne postoji, šaljemo zahtjev prema mreži
        return fetch(event.request);
      }
    )
  );
});

// Događaj 'activate' - briše stare verzije cache-a
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

