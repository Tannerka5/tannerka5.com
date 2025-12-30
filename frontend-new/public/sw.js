const CACHE_NAME = 'tannerka5-v1';
const urlsToCache = [
  '/',
  '/about',
  '/projects',
  '/contact',
  '/blog',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
