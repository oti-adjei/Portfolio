import { useMemo, useState } from 'react';
import { useContent } from '@/public/contexts/PublicContentContext';
import type { StreamEvent } from '@/types/siteContent';

type Platform = 'All' | StreamEvent['platform'];

const PLATFORM_META: Record<StreamEvent['platform'], { icon: string; color: string; bg: string; label: string; href: (u: string) => string }> = {
  twitch:  { icon: 'ri-twitch-fill',  color: 'text-[#9146ff]', bg: 'bg-[#9146ff]', label: 'Twitch',  href: (u) => `https://twitch.tv/${u}` },
  tiktok:  { icon: 'ri-tiktok-fill',  color: 'text-gray-900',  bg: 'bg-gray-900',  label: 'TikTok',  href: (u) => `https://tiktok.com/${u}` },
  youtube: { icon: 'ri-youtube-fill', color: 'text-red-500',   bg: 'bg-red-500',   label: 'YouTube', href: (u) => `https://youtube.com/@${u}` },
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function StreamCalendar() {
  const { content } = useContent();
  const { streamsPage, streamEvents } = content;
  const events = streamEvents ?? [];

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('All');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedEvent, setSelectedEvent] = useState<StreamEvent | null>(null);

  const filtered = useMemo(
    () => selectedPlatform === 'All' ? events : events.filter((e) => e.platform === selectedPlatform),
    [events, selectedPlatform],
  );

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.date.localeCompare(b.date)),
    [filtered],
  );

  const today = toDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const upcoming = useMemo(() => sorted.filter((e) => e.date >= today).slice(0, 5), [sorted, today]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getEventsForDay(day: number) {
    return filtered.filter((e) => e.date === toDateStr(year, month, day));
  }

  function navigateMonth(dir: number) {
    setCurrentMonth(new Date(year, month + dir, 1));
  }

  const platforms: Platform[] = ['All', 'twitch', 'tiktok', 'youtube'];

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] uppercase tracking-wider transition ${
                selectedPlatform === p
                  ? 'bg-gray-900 text-white'
                  : 'bg-white/60 ring-1 ring-gray-200 text-gray-600 hover:bg-white'
              }`}
            >
              {p === 'All' ? 'All' : PLATFORM_META[p].label}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/70 ring-1 ring-gray-200">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] transition ${
              viewMode === 'calendar' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="ri-calendar-line mr-1" />Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3.5 py-1.5 rounded-full text-[12px] transition ${
              viewMode === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <i className="ri-list-check mr-1" />List
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2">
          {viewMode === 'calendar' ? (
            <div className="rounded-2xl ring-1 ring-black/5 bg-white/60 p-5">
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="w-8 h-8 rounded-full ring-1 ring-gray-200 bg-white inline-flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <i className="ri-arrow-left-s-line" />
                </button>
                <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
                  {MONTH_NAMES[month]} {year}
                </h3>
                <button
                  onClick={() => navigateMonth(1)}
                  className="w-8 h-8 rounded-full ring-1 ring-gray-200 bg-white inline-flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >
                  <i className="ri-arrow-right-s-line" />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold tracking-wider uppercase text-gray-400 py-1.5">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getEventsForDay(day);
                  const hasStream = dayEvents.length > 0;
                  const isToday = toDateStr(year, month, day) === today;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => hasStream && setSelectedEvent(dayEvents[0])}
                      className={`aspect-square min-w-[44px] min-h-[44px] rounded-lg p-1 flex flex-col items-center justify-start transition ${
                        hasStream
                          ? 'bg-[#8067f0]/10 ring-1 ring-[#8067f0]/25 hover:bg-[#8067f0]/20 cursor-pointer'
                          : 'bg-white/40 ring-1 ring-transparent'
                      } ${isToday ? '!ring-[#f75124]/50 !ring-2' : ''}`}
                    >
                      <span className={`text-[11px] font-medium ${isToday ? 'text-[#f75124]' : hasStream ? 'text-gray-700' : 'text-gray-400'}`}>
                        {day}
                      </span>
                      {hasStream && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                          {dayEvents.slice(0, 2).map((ev, idx) => (
                            <span key={idx} className={`w-1.5 h-1.5 rounded-full ${PLATFORM_META[ev.platform].bg}`} />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-5 pt-4 border-t border-black/5 flex flex-wrap gap-4">
                {(['twitch', 'tiktok', 'youtube'] as StreamEvent['platform'][]).map((p) => (
                  <div key={p} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${PLATFORM_META[p].bg}`} />
                    <span className="text-[11px] text-gray-500">{PLATFORM_META[p].label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {sorted.length === 0 && (
                <p className="text-gray-400 text-sm py-8 text-center">No streams scheduled yet.</p>
              )}
              {sorted.map((ev) => {
                const meta = PLATFORM_META[ev.platform];
                return (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => setSelectedEvent(ev)}
                    className="w-full text-left rounded-xl ring-1 ring-black/5 bg-white/60 p-3.5 hover:bg-white transition flex items-start gap-3"
                  >
                    <div className={`w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center shrink-0`}>
                      <i className={`${meta.icon} text-white text-lg`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[14px] text-gray-900 truncate">{ev.title}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        {formatDate(ev.date)} · {ev.time}
                        {ev.isRecurring && <span className="ml-2 text-[#8067f0]">· Weekly</span>}
                      </p>
                    </div>
                    <span className={`text-[11px] font-medium ${meta.color} whitespace-nowrap`}>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl ring-1 ring-black/5 bg-white/60 p-5">
            <h4 className="text-[12px] uppercase tracking-[0.18em] text-gray-500 mb-3 flex items-center gap-2">
              <i className="ri-live-line text-[#f75124]" />Upcoming
            </h4>
            {upcoming.length === 0 ? (
              <p className="text-[13px] text-gray-400">No upcoming streams.</p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((ev) => {
                  const meta = PLATFORM_META[ev.platform];
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-white/80 transition"
                    >
                      <div className={`w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center text-white font-semibold text-[12px] shrink-0`}>
                        {new Date(ev.date).getDate()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-gray-900 truncate">{ev.title}</p>
                        <p className="text-[11px] text-gray-400">
                          {MONTH_NAMES[new Date(ev.date).getMonth()].slice(0,3)} · {ev.time}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl ring-1 ring-black/5 bg-white/60 p-5 space-y-2">
            <h4 className="text-[12px] uppercase tracking-[0.18em] text-gray-500 mb-2">Watch live on</h4>
            {streamsPage?.twitchUsername && (
              <a
                href={PLATFORM_META.twitch.href(streamsPage.twitchUsername)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl ring-1 ring-gray-200 bg-white hover:shadow-sm transition"
              >
                <i className="ri-twitch-fill text-[#9146ff] text-lg" />
                <span className="text-[13px] font-medium text-gray-700">Twitch</span>
                <i className="ri-external-link-line text-gray-400 text-xs ml-auto" />
              </a>
            )}
            {streamsPage?.tiktokUsername && (
              <a
                href={PLATFORM_META.tiktok.href(streamsPage.tiktokUsername)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2.5 rounded-xl ring-1 ring-gray-200 bg-white hover:shadow-sm transition"
              >
                <i className="ri-tiktok-fill text-gray-900 text-lg" />
                <span className="text-[13px] font-medium text-gray-700">TikTok</span>
                <i className="ri-external-link-line text-gray-400 text-xs ml-auto" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Event detail modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <i className={`${PLATFORM_META[selectedEvent.platform].icon} ${PLATFORM_META[selectedEvent.platform].color} text-xl`} />
                <span className="text-[12px] font-medium text-gray-500">{PLATFORM_META[selectedEvent.platform].label}</span>
                {selectedEvent.isRecurring && (
                  <span className="text-[11px] text-[#8067f0] bg-[#8067f0]/10 px-2 py-0.5 rounded-full">Weekly</span>
                )}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 inline-flex items-center justify-center"
              >
                <i className="ri-close-line" />
              </button>
            </div>

            <h3 className="text-[20px] font-bold text-gray-900 mb-1">{selectedEvent.title}</h3>
            {selectedEvent.description && (
              <p className="text-[13px] text-gray-600 mb-4">{selectedEvent.description}</p>
            )}

            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-3 text-[13px] text-gray-600">
                <i className="ri-calendar-line text-[#8067f0]" />
                <span>{formatDate(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] text-gray-600">
                <i className="ri-time-line text-[#8067f0]" />
                <span>{selectedEvent.time}</span>
              </div>
            </div>

            {selectedEvent.streamUrl && (
              <a
                href={selectedEvent.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-black text-white rounded-full text-[13px] font-medium transition"
              >
                <i className={PLATFORM_META[selectedEvent.platform].icon} />
                Watch on {PLATFORM_META[selectedEvent.platform].label}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
