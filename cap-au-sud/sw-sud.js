/* Service worker de Cap au Sud, portee limitee a son dossier */
const CACHE = 'sud-v1';
const FICHIERS = ['./', './cap-au-sud.html', './cap-au-sud.webmanifest', './icon-trajet.png'];
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
  }).catch(() => caches.match('./cap-au-sud.html'))));
});
