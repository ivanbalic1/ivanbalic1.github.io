const CACHE_NAME = 'mno-kalkulator-cache-v1';
// Lista svih resursa koji su potrebni za offline rad.
const urlsToCache = [
    './KalkulatorSkupova.html',
    './manifest.json'
    // Dodajte putanje do ikona ovdje: './icon-192x192.png', './icon-512x512.png'
];

// Faza instalacije: keširanje svih bitnih resursa
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Otvoren cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Faza dohvaćanja: posluživanje sadržaja iz keša (za offline podršku)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Ako je pronađeno u kešu, vratimo keširanu verziju
                if (response) {
                    return response;
                }
                // Inače, dohvaćamo s mreže
                return fetch(event.request);
            })
    );
});

// Faza aktivacije: čišćenje starih keševa
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});
