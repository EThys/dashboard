// Simple Service Worker for aggressive caching of Hero images and Logo
const CACHE_NAME = 'casanayo-hero-cache-v1';
const ASSETS_TO_CACHE = [
  '/logoCasa.png',
  // External hero from home
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cache-First strategy for images
  if (
    url.pathname.includes('logoCasa') || 
    url.hostname.includes('unsplash.com') ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/i) ||
    event.request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        // Return from cache, but also update the cache in background (Stale-While-Revalidate)
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
        
        return cacheResponse || fetchPromise;
      })
    );
  }
});
