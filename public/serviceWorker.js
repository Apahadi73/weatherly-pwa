const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

//this represents the service worker
const self = this;

// Installs A service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");

      return cache.addAll(urlsToCache);
    })
  );
});

// Listen for requests
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

// Activates the service worker

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return "";
        })
      )
    )
  );
});
