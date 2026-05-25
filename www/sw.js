const CACHE = 'carlens-v1';
const SHELL = ['/', '/index.html', '/manifest.json', '/icon.png', '/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for API calls, cache-first for app shell
self.addEventListener('fetch', e => {
  if (e.request.url.includes('anthropic.com')) return; // never cache API calls
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});
