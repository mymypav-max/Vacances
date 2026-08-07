/* Ancien service worker de la racine : il se desinstalle et vide ses caches.
   Chaque jeu possede desormais le sien dans son propre dossier. */
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
