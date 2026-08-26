import { useEffect } from "react";

/**
 * Injects the install metadata that makes /admin addable to an iOS home screen as a
 * standalone app.
 *
 * These tags live here rather than in index.html because index.html is shared with the
 * public site: linking the manifest globally would make the public site installable under
 * the admin's name, icon and start_url. Injecting on mount scopes the app identity to
 * /admin. iOS reads the manifest when the user taps Share -> Add to Home Screen, long
 * after React has mounted, so runtime injection is read in time.
 *
 * Status bar style is `default`, not `black-translucent`: the admin topbar is white, and
 * a translucent bar would paint white status text over it.
 */
const TAGS: Array<Record<string, string> & { tag: "link" | "meta" }> = [
  { tag: "link", rel: "manifest", href: "/admin-manifest.webmanifest" },
  { tag: "link", rel: "apple-touch-icon", sizes: "180x180", href: "/icons/admin-180.png" },
  { tag: "meta", name: "apple-mobile-web-app-capable", content: "yes" },
  { tag: "meta", name: "mobile-web-app-capable", content: "yes" },
  { tag: "meta", name: "apple-mobile-web-app-status-bar-style", content: "default" },
  { tag: "meta", name: "apple-mobile-web-app-title", content: "Admin" },
  { tag: "meta", name: "theme-color", content: "#ffffff" },
];

const MARKER = "data-admin-install-meta";
const TITLE = "Hearvie Admin";

export function useAdminInstallMeta() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = TITLE;

    const injected = TAGS.map(({ tag, ...attrs }) => {
      const el = document.createElement(tag);
      for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, value);
      }
      el.setAttribute(MARKER, "");
      document.head.appendChild(el);
      return el;
    });

    return () => {
      for (const el of injected) el.remove();
      document.title = previousTitle;
    };
  }, []);
}
