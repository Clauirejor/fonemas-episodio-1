const CACHE_NAME = 'fonemas-ep1-v1';
const ASSETS = [
  '/fonemas-episodio-1/',
  '/fonemas-episodio-1/index.html',
  '/fonemas-episodio-1/manifest.json',
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800;900&family=Quicksand:wght@500;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if(res && res.status === 200 && e.request.method === 'GET'){
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => caches.match('/fonemas-episodio-1/index.html')))
  );
});
