import Badge from './Badge';

type Tone = 'cream' | 'signal' | 'outline' | 'muted' | 'success' | 'warning' | 'danger' | 'info';

const statusTones: Record<string, { tone: Tone; icon: string }> = {
  new: { tone: 'signal', icon: 'ri-circle-fill' },
  read: { tone: 'info', icon: 'ri-eye-line' },
  replied: { tone: 'success', icon: 'ri-reply-line' },
  archived: { tone: 'muted', icon: 'ri-archive-line' },
  active: { tone: 'success', icon: 'ri-check-line' },
  subscribed: { tone: 'success', icon: 'ri-check-line' },
  unsubscribed: { tone: 'muted', icon: 'ri-close-line' },
  bounced: { tone: 'danger', icon: 'ri-error-warning-line' },
  published: { tone: 'success', icon: 'ri-check-line' },
  draft: { tone: 'warning', icon: 'ri-draft-line' },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusTones[status] ?? { tone: 'muted' as Tone, icon: 'ri-question-line' };
  return (
    <Badge tone={config.tone} icon={config.icon}>
      {status}
    </Badge>
  );
}
