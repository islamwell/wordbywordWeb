// Service Worker for offline functionality
const CACHE_VERSION = 'v1';
const CACHE_NAME = `quran-app-${CACHE_VERSION}`;

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.css',
  '/manifest.json'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      console.log('[Service Worker] Skip waiting');
      self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests (like Google Generative AI calls)
  if (url.origin !== self.location.origin) {
    // Network-first for external APIs
    event.respondWith(
      fetch(request).catch(() => {
        // If network fails, try cache
        return caches.match(request).catch(() => {
          // Return offline page if available
          return new Response('Offline - Feature requires internet', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
    );
    return;
  }

  // Cache-first strategy for same-origin requests (assets)
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        console.log('[Service Worker] Serving from cache:', request.url);
        return response;
      }

      console.log('[Service Worker] Fetching from network:', request.url);
      return fetch(request).then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the response for future use
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      }).catch((error) => {
        console.log('[Service Worker] Fetch failed:', request.url, error);
        // Return cached version if available
        return caches.match(request).catch(() => {
          return new Response('Offline - Resource not available', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
