/**
 * Service worker for the admin PWA.
 *
 * Deliberately minimal: it handles push delivery and notification clicks, and NOTHING else.
 * There is no `fetch` handler and no caching, on purpose — a cached admin shell served to a
 * live API is a genuinely nasty failure mode, and worse in standalone mode where there is no
 * address bar to hard-refresh from. Web Push requires a service worker; it does not require
 * an offline strategy, so this one has none.
 *
 * Registered against scope /admin only, so the public site never has a service worker.
 */

// Take over as soon as a new version is installed rather than waiting for every client to
// close. Safe here precisely because nothing is cached — there is no stale content to serve.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    // A push with an unparseable body still deserves a notification — on iOS, a push that
    // arrives without one being shown counts against the app and can cost push permission.
    payload = {};
  }

  const title = payload.title || "Portfolio";
  const options = {
    body: payload.body || "",
    icon: "/icons/admin-192.png",
    badge: "/icons/admin-192.png",
    tag: payload.tag || "default",
    // Without this, a notification that replaces an earlier one with the same tag arrives
    // completely silently — no sound, no vibration. Since each event type reuses one tag,
    // only the first of a run would ever be noticed. renotify re-alerts on replace, while
    // the tag still keeps the lock screen to one entry per event type.
    renotify: true,
    // Explicit rather than implied: a silent notification is exactly the failure being fixed.
    silent: false,
    // Android only; iOS ignores it and uses the system haptic.
    vibrate: [200, 100, 200],
    data: { url: payload.url || "/admin" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = (event.notification.data && event.notification.data.url) || "/admin";

  event.waitUntil(
    (async () => {
      const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });

      // Prefer focusing an already-open admin window over spawning another one.
      for (const client of clientList) {
        if (client.url.includes("/admin") && "focus" in client) {
          await client.focus();
          if ("navigate" in client) {
            try {
              await client.navigate(target);
            } catch {
              // Navigation can reject if the client is mid-unload; focusing was the point.
            }
          }
          return;
        }
      }

      if (self.clients.openWindow) await self.clients.openWindow(target);
    })()
  );
});
