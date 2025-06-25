const CACHE_NAME = 'shop-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/filterSearch.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/delivery.html',
  '/contacts.html',
  '/address.html',
  '/terms.html',
  '/category.html',
  '/favorites.html',
  '/up-button.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ⚠ Не кэшируем внешние запросы (например, таблицу или фото из i.ibb.co)
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
