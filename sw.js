// Signal Desk service worker: оболонка додатку працює офлайн, ціни Binance завжди з мережі.
const C='sd-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request,u=new URL(req.url);
  if(req.method!=='GET'||u.hostname.includes('binance'))return;
  const put=r=>{if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp))}return r};
  if(u.origin===location.origin){ // спершу мережа, щоб оновлення приходили одразу
    e.respondWith(fetch(req).then(put).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));return}
  e.respondWith(caches.match(req).then(r=>r||fetch(req).then(put))); // шрифти й бібліотека графіків
});
