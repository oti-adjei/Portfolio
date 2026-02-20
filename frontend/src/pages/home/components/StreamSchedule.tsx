
import { Link } from 'react-router-dom';
import { useContent } from '../../../public/contexts/PublicContentContext';
import type { StreamEvent } from '../../../types/siteContent';

const PLATFORM_META: Record<StreamEvent['platform'], { icon: string; color: string; label: string }> = {
  twitch:  { icon: 'ri-twitch-fill',   color: 'text-[#9146ff]', label: 'Twitch' },
  tiktok:  { icon: 'ri-tiktok-fill',   color: 'text-gray-900',  label: 'TikTok' },
  youtube: { icon: 'ri-youtube-fill',  color: 'text-red-500',   label: 'YouTube' },
};

function getMondayOf(d: Date): Date {
  const day = d.getDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function StreamSchedule() {
  const { content } = useContent();
  const events = content.streamEvents ?? [];

  const monday = getMondayOf(new Date());
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const eventsThisWeek = week.map((day) => {
    const dateStr = toDateStr(day);
    return events.filter((e) => e.date === dateStr);
  });

  const hasAnyStream = eventsThisWeek.some((dayEvents) => dayEvents.length > 0);

  return (
    <section id="stream" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 sm:mb-10">
          <div>
            <p className="text-sm font-medium text-[#f75124] mb-2">Streaming</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Stream Schedule</h2>
          </div>
          <Link
            to="/streams"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mt-1 whitespace-nowrap"
          >
            View full schedule <i className="ri-arrow-right-line"></i>
          </Link>
        </div>

        {/* Week strip */}
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {week.map((day, i) => {
            const dayEvents = eventsThisWeek[i];
            const isToday = toDateStr(day) === toDateStr(new Date());
            const hasStream = dayEvents.length > 0;

            return (
              <div
                key={i}
                className={`rounded-xl p-2 sm:p-3 flex flex-col items-center gap-1 sm:gap-2 transition-all ${
                  hasStream
                    ? 'bg-[#8067f0]/8 border border-[#8067f0]/25'
                    : 'bg-gray-50'
                } ${isToday ? 'ring-2 ring-[#f75124]/40' : ''}`}
              >
                {/* Day name */}
                <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {DAY_NAMES[i]}
                </span>
                {/* Date number */}
                <span
                  className={`text-sm sm:text-base font-bold ${
                    isToday ? 'text-[#f75124]' : hasStream ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {day.getDate()}
                </span>

                {/* Stream info */}
                {hasStream ? (
                  <div className="flex flex-col items-center gap-1 w-full">
                    {dayEvents.slice(0, 1).map((ev) => {
                      const meta = PLATFORM_META[ev.platform];
                      return (
                        <div key={ev.id} className="flex flex-col items-center gap-0.5">
                          <i className={`${meta.icon} text-base sm:text-lg ${meta.color}`}></i>
                          <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
                            {ev.time.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                    {dayEvents.length > 1 && (
                      <span className="text-[9px] text-gray-400">+{dayEvents.length - 1}</span>
                    )}
                  </div>
                ) : (
                  <div className="h-6 sm:h-8" />
                )}
              </div>
            );
          })}
        </div>

        {/* Platform legend + no-stream state */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {!hasAnyStream && (
            <p className="text-sm text-gray-400">No streams scheduled this week — check back soon.</p>
          )}
          <div className="flex items-center gap-4 ml-auto">
            {Object.entries(PLATFORM_META).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-1.5">
                <i className={`${meta.icon} text-sm ${meta.color}`}></i>
                <span className="text-xs text-gray-400">{meta.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
