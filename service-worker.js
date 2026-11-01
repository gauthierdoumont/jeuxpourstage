/* Service worker — Garde de nuit. Créé par Gauthier Doumont
 * Incrémenter CACHE à chaque mise à jour des fichiers pour forcer le rafraîchissement. */
const CACHE = 'garde-de-nuit-v1.1.0';
const FICHIERS = [
  './', './index.html', './app.js', './manifest.json',
  './data/soins-intensifs.js', './data/bloc-operatoire.js', './data/neurochirurgie.js', './data/jugement-clinique.js',
  './data/scenarios-rea.js', './data/scenarios-bloc.js', './data/scenarios-neuro.js', './data/scenarios-jugement.js',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// Réseau d'abord (pour recevoir les mises à jour), cache si hors ligne
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
