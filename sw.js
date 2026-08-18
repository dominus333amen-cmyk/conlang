var CACHE='tansica-v2';
var ASSETS=['./','index.html','manifest.webmanifest'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}));
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(function(hit){
      if(hit)return hit;
      return fetch(e.request).then(function(resp){
        if(resp.ok&&e.request.url.startsWith(self.location.origin)){
          var copy=resp.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,copy);});
        }
        return resp;
      }).catch(function(){
        if(e.request.mode==='navigate')return caches.match('index.html');
      });
    })
  );
});
