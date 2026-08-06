/* Service worker de La Grue, portee limitee a son dossier */
const CACHE = 'grue-v1';
const FICHIERS = ['./', './la-grue.html', './la-grue.webmanifest', './icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FICHIERS.map(f => c.add(f).catch(()=>{})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)).catch(()=>{}); return res;
  }).catch(() => caches.match('./la-grue.html'))));
});
