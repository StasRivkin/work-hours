// service-worker.js
const CACHE_NAME = 'worktime-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
//   '/path/to/your/styles.css',
//   '/path/to/your/scripts.js',
  './src/images/clock-logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
