const CACHE_NAME = 'kredobank-pwa-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.svg' 
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // Network-first strategy for navigation requests (HTML pages).
    // This prevents serving a stale index.html which might point to old, non-existent JS assets.
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                // If the network fails, fall back to the main cached page.
                return caches.match('/');
            })
        );
        return;
    }

    // Cache-first strategy for all other requests (assets like icons, etc.)
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return from cache or fetch from network
                return response || fetch(event.request);
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