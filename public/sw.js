const CACHE_NAME = 'kredobank-pwa-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.svg' 
];

// Install: cache the app shell
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: clearing old cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', event => {
    // For navigation requests, use network-first.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                // If network fails, fall back to the cached index.html.
                return caches.match('/index.html');
            })
        );
        return;
    }

    // For other requests (JS, CSS, images), use cache-first, then network & cache.
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // If found in cache, return it.
                if (response) {
                    return response;
                }

                // If not in cache, fetch from network.
                return fetch(event.request).then(
                    networkResponse => {
                        // Check if we received a valid response.
                        // We don't want to cache errors or opaque third-party responses.
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone the response because it's a stream and can be consumed only once.
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                ).catch(error => {
                    console.error('SW fetch failed for:', event.request.url, error);
                });
            })
    );
});

self.addEventListener('push', event => {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/icon.svg'
    });
});