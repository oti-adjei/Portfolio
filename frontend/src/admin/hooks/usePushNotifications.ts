import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import {
  deletePushDevice,
  fetchPushDevices,
  fetchVapidKey,
  registerPushSubscription,
  removePushSubscription,
  sendTestPush,
  type PushDevice,
} from "../services/pushApi";

/**
 * `needs-install` is the iOS case: Safari only exposes the Push API to web apps that have
 * been added to the home screen, so in a normal tab the feature is genuinely absent rather
 * than merely un-permitted. Worth distinguishing, because the fix is "install the app", not
 * "grant permission".
 */
export type PushState =
  | "loading"
  | "unsupported"
  | "needs-install"
  | "not-configured"
  | "default"
  | "granted"
  | "denied";

const SW_PATH = "/sw.js";
const SW_SCOPE = "/admin";

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function supportsPush(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/** The applicationServerKey must be raw bytes, not the base64url string the API returns. */
function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const normalized = padded.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(normalized);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export function usePushNotifications() {
  const { token } = useAdminAuth();
  const [state, setState] = useState<PushState>("loading");
  const [devices, setDevices] = useState<PushDevice[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refreshDevices = useCallback(async () => {
    try {
      const { devices: list } = await fetchPushDevices(token);
      setDevices(list);
    } catch {
      // The device list is decoration; failing to load it should not break the card.
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!supportsPush()) {
        // On iOS the API is missing in a tab but present once installed, so the absence
        // means "not installed" rather than "browser can't do this".
        if (!cancelled) setState(isIos() && !isStandalone() ? "needs-install" : "unsupported");
        return;
      }

      try {
        const { configured } = await fetchVapidKey(token);
        if (cancelled) return;
        if (!configured) {
          setState("not-configured");
          return;
        }
      } catch {
        if (!cancelled) setState("not-configured");
        return;
      }

      if (cancelled) return;
      setState(Notification.permission as PushState);
      void refreshDevices();
    })();

    return () => {
      cancelled = true;
    };
  }, [token, refreshDevices]);

  /**
   * Requests permission and registers a subscription.
   *
   * MUST be called from a real user gesture — iOS rejects a permission request that isn't,
   * and the prompt is one-shot: a denial cannot be re-prompted, and is only recoverable by
   * deleting and reinstalling the home-screen app.
   */
  const enable = useCallback(async () => {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const { publicKey } = await fetchVapidKey(token);
      if (!publicKey) throw new Error("Server has no VAPID key configured");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission as PushState);
        setError(
          permission === "denied"
            ? "Notifications were blocked. iOS won't ask again — to undo this you'd have to delete the app from your home screen and re-add it."
            : "Permission wasn't granted."
        );
        return;
      }

      const registration = await navigator.serviceWorker.register(SW_PATH, { scope: SW_SCOPE });
      await navigator.serviceWorker.ready;

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
        }));

      await registerPushSubscription(token, subscription.toJSON());

      setState("granted");
      setMessage("This device will now receive notifications.");
      await refreshDevices();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not enable notifications");
    } finally {
      setBusy(false);
    }
  }, [token, refreshDevices]);

  const disable = useCallback(async () => {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const registration = await navigator.serviceWorker.getRegistration(SW_SCOPE);
      const subscription = await registration?.pushManager.getSubscription();

      if (subscription) {
        await removePushSubscription(token, subscription.endpoint);
        await subscription.unsubscribe();
      }

      setMessage("This device will no longer receive notifications.");
      await refreshDevices();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not disable notifications");
    } finally {
      setBusy(false);
    }
  }, [token, refreshDevices]);

  const test = useCallback(async () => {
    setBusy(true);
    setError(null);
    setMessage(null);

    try {
      const result = await sendTestPush(token);
      setMessage(
        result.delivered > 0
          ? `Sent to ${result.delivered} of ${result.total} device${result.total === 1 ? "" : "s"}.`
          : "The server accepted the request but no device took delivery."
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Test failed");
    } finally {
      setBusy(false);
    }
  }, [token]);

  /**
   * Removes a device from the server. Note this does not revoke the browser's own
   * subscription, so removing the device you are currently using will re-register it on the
   * next load — the list is the server's view, not the phone's.
   */
  const removeDevice = useCallback(
    async (id: string) => {
      setBusy(true);
      setError(null);
      setMessage(null);
      try {
        await deletePushDevice(token, id);
        const { devices: list } = await fetchPushDevices(token);
        setDevices(list);
        setMessage("Device removed.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not remove that device");
      } finally {
        setBusy(false);
      }
    },
    [token]
  );

  return { state, devices, busy, error, message, enable, disable, test, removeDevice, isStandalone: isStandalone() };
}
