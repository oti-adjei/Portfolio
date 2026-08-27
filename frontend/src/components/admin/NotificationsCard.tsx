import { usePushNotifications } from '../../admin/hooks/usePushNotifications';
import Badge from './ui/Badge';
import Button from './ui/Button';
import Card from './ui/Card';
import Notice from './ui/Notice';

/** "Last seen" beats an added-date for spotting a ghost: a device deleted from a home screen
 *  simply stops checking in, while its created_at stays as fresh-looking as any other. */
function lastSeenLabel(lastSeenAt: string): string {
  const seen = new Date(lastSeenAt);
  if (Number.isNaN(seen.getTime())) return "unknown";

  const days = Math.floor((Date.now() - seen.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return seen.toLocaleDateString();
}

function deviceLabel(userAgent: string | null): string {
  if (!userAgent) return 'Unknown device';
  if (/iphone/i.test(userAgent)) return 'iPhone';
  if (/ipad/i.test(userAgent)) return 'iPad';
  if (/android/i.test(userAgent)) return 'Android';
  if (/macintosh|mac os/i.test(userAgent)) return 'Mac';
  if (/windows/i.test(userAgent)) return 'Windows';
  return 'Other device';
}

export default function NotificationsCard() {
  const { state, devices, busy, error, message, enable, disable, test, removeDevice } =
    usePushNotifications();

  const body = () => {
    switch (state) {
      case 'loading':
        return <p className="text-[13px] text-gray-500">Checking…</p>;

      case 'needs-install':
        return (
          <Notice tone="info">
            Notifications only work once this is added to your home screen. Open Share → Add to
            Home Screen, then enable them from the installed app.
          </Notice>
        );

      case 'unsupported':
        return (
          <Notice tone="info">This browser doesn't support push notifications.</Notice>
        );

      case 'not-configured':
        return (
          <Notice tone="error">
            The server has no VAPID keys set. Add <code>VAPID_PUBLIC_KEY</code>,{' '}
            <code>VAPID_PRIVATE_KEY</code> and <code>VAPID_SUBJECT</code> as Worker secrets.
          </Notice>
        );

      case 'denied':
        return (
          <Notice tone="error">
            Notifications are blocked for this app. iOS won't prompt again — the only way back
            is to delete it from your home screen and re-add it.
          </Notice>
        );

      case 'granted':
        return (
          <div className="space-y-4">
            <p className="text-[13px] text-gray-600">
              You'll be notified for contact submissions, new subscribers, and when a newsletter
              send finishes.
            </p>
            {devices.length > 0 && (
              <ul className="space-y-1.5">
                {devices.map((device) => (
                  <li
                    key={device.id}
                    className="flex items-center justify-between gap-3 text-[13px] text-gray-700"
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <i className="ri-smartphone-line text-gray-400" aria-hidden="true" />
                      <span className="truncate">{deviceLabel(device.user_agent)}</span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      {/* Last seen, not added: a device that stopped checking in is the one
                          you are probably here to remove. */}
                      <span className="text-[12px] text-gray-400" title={`Added ${new Date(device.created_at).toLocaleString()}`}>
                        {lastSeenLabel(device.last_seen_at)}
                      </span>
                      <Button
                        size="sm"
                        variant="danger"
                        icon="ri-close-line"
                        aria-label={`Remove ${deviceLabel(device.user_agent)}`}
                        disabled={busy}
                        onClick={() => void removeDevice(device.id)}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <Button icon="ri-send-plane-line" onClick={test} loading={busy}>
                Send test
              </Button>
              <Button variant="danger" icon="ri-notification-off-line" onClick={disable} disabled={busy}>
                Disable on this device
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-[13px] text-gray-600">
              Get a notification when someone sends a contact message, subscribes to the
              newsletter, or when a newsletter send finishes.
            </p>
            <Notice tone="info">
              iOS only asks once. If you decline, the only way to be asked again is to delete the
              app from your home screen and re-add it.
            </Notice>
            <Button variant="primary" icon="ri-notification-3-line" onClick={enable} loading={busy}>
              Enable notifications
            </Button>
          </div>
        );
    }
  };

  return (
    <Card
      title="Notifications"
      description="Push alerts on this device"
      actions={
        state === 'granted' ? (
          <Badge tone="success">Enabled</Badge>
        ) : state === 'denied' ? (
          <Badge tone="danger">Blocked</Badge>
        ) : undefined
      }
    >
      <div className="space-y-3">
        {body()}
        {error && <Notice tone="error">{error}</Notice>}
        {message && <Notice tone="success">{message}</Notice>}
      </div>
    </Card>
  );
}
