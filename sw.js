/* Service worker commun : accueil, La Grue et Cap au Sud */
const CACHE = 'vacances-v10';
const FICHIERS = [
  './',
  './index.html',
  './la-grue.html',
  './la-grue.webmanifest',
  './icon-512.png',
  './cap-au-sud.html',
  './cap-au-sud.webmanifest',
  './icon-trajet.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(FICHIERS.map(f => c.add(f).catch(()=>{}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(rep => rep || fetch(e.request).then(res => {
      const copie = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copie)).catch(()=>{});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
