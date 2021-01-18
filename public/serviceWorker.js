const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this; //this represents the service worker

// Install a service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache opened");
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.log("Failure:", err))
  );
});

// Listen for the request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    //   matches all the request the browser tries to fetch
    caches.match(event.request).then(() => {
      // if it cannot fetch data,
      // then it sends the offline.html
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

// Activaye the service worker
self.addEventListener("activate", (event) => {
  const cacheWhiteList = [];
  //   saves our desired cash to the whitelist
  cacheWhiteList.push(CACHE_NAME);
  //   waits until it get caches
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        Promise.all(
          cacheNames.map((cacheName) => {
            //   delets all non-white listed caches
            if (!cacheWhiteList.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .catch((err) => console.log("Failure:", err))
  );
});
