// Grove service worker - enables offline shell + push/local notifications

var CACHE = "grove-v1";
var SHELL = ["/app", "/manifest.json"];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL).catch(function(){}); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

// Network-first for navigation, cache fallback (so the app opens offline)
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy).catch(function(){}); });
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (m) { return m || caches.match("/app"); });
    })
  );
});

// Show a notification when the page (or a future push server) asks
self.addEventListener("message", function (e) {
  if (e.data && e.data.type === "notify") {
    self.registration.showNotification(e.data.title || "Grove", {
      body: e.data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: e.data.tag || "grove",
      data: { url: "/app" }
    });
  }
});

// Web Push (works once a push server + VAPID keys are added)
self.addEventListener("push", function (e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch (err) { data = { title: "Grove", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(
    self.registration.showNotification(data.title || "Grove", {
      body: data.body || "Time to check your garden.",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: data.tag || "grove",
      data: { url: data.url || "/app" }
    })
  );
});

// Tapping a notification focuses/opens the app
self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/app";
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(url) >= 0 && "focus" in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
