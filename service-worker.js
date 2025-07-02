const CACHE_NAME = 'shop-cache-v4';

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/favorites.js',
  '/category.html',
  '/favorites.html',
  '/contacts.html',
  '/delivery.html',
  '/address.html',
  '/terms.html',
  '/manifest.json',
  '/up-button.js',
  '/images/reklama1.jpg',
  '/images/reklama2.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Установка (кешируем необходимые файлы)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// ⚠ Не кешировать внешние источники
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (url.origin !== location.origin) {
    // Внешние — не кешируем
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Удаление старых кэшей при обновлении
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
});
