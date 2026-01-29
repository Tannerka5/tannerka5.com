const CACHE_NAME = 'tannerka5-v2';
const urlsToCache = [
  '/',
  '/about',
  '/projects',
  '/contact',
  '/blog',
];

// Clear old caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

self.addEventListener('install', (event) => {
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return; // Let browser handle external requests
  }

  // Never cache or intercept admin routes - let browser handle them
  if (url.pathname.startsWith('/admin')) {
    return;
  }

  // Always fetch assets (JS, CSS, images, fonts) directly from network
  // Never cache these to avoid MIME type issues
  const isAsset = 
    url.pathname.startsWith('/_astro/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.ttf') ||
    url.pathname.endsWith('.eot') ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i);

  if (isAsset) {
    // For assets, always fetch from network (bypass service worker completely)
    return;
  }

  // For navigation requests (HTML pages), try cache first, then network
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            // Only cache successful HTML responses
            if (response.status === 200 && response.type === 'basic') {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          }).catch(() => {
            // If fetch fails, try again (let browser handle the error)
            return fetch(request);
          });
        })
    );
  }
  // For all other requests, don't intercept (let browser handle)
});
