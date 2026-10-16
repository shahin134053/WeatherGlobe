const CACHE_NAME = 'weatherguru-gold-v2.1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Install Event - Precache essential assets and force immediate activation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Precache partial warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale caches from previous versions & claim all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Dynamic Stale-While-Revalidate for app assets, Network-First for APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests or browser extensions
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Network-first for live weather APIs, TTS audio streams, and GitHub releases
  if (
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('open-meteo.com') ||
    url.hostname.includes('google.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('github.com')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Stale-while-revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Message listener to trigger instant skipWaiting when new update is downloaded
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
