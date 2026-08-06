/* Ancien service worker de la racine : il se desinstalle et vide ses caches.
   Necessaire pour qu'il cesse d'intercepter les deux jeux, desormais dans leurs
   propres dossiers avec leurs propres service workers. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const cles = await caches.keys();
    await Promise.all(cles.map(k => caches.delete(k)));
    await self.registration.unregister();
    const fenetres = await self.clients.matchAll({ type: 'window' });
    fenetres.forEach(f => f.navigate(f.url));
  })());
});
