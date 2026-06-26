
import { useState, useMemo } from 'react';
import { useContent } from '@/public/contexts/PublicContentContext';
import type { StreamEvent } from '@/types/siteContent';
import Header from '../home/components/Header';
import Footer from '../home/components/Footer';
import FloatingShapes from '@/components/FloatingShapes';

type Platform = 'All' | StreamEvent['platform'];

const PLATFORM_META: Record<StreamEvent['platform'], { icon: string; color: string; bg: string; label: string; href: (u: string) => string }> = {
  twitch:  { icon: 'ri-twitch-fill',  color: 'text-[#9146ff]', bg: 'bg-[#9146ff]', label: 'Twitch',  href: (u) => `https://twitch.tv/${u}` },
  tiktok:  { icon: 'ri-tiktok-fill',  color: 'text-gray-900',  bg: 'bg-gray-900',  label: 'TikTok',  href: (u) => `https://tiktok.com/${u}` },
  youtube: { icon: 'ri-youtube-fill', color: 'text-red-500',   bg: 'bg-red-500',   label: 'YouTube', href: (u) => `https://youtube.com/@${u}` },
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function StreamsPage() {
  const { content } = useContent();
  const { streamsPage, streamEvents } = content;
  const events = streamEvents ?? [];

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('All');
  const [viewMode, setViewMode]   = useState<'calendar' | 'list'>('calendar');
  const [currentMonth, setCurrentMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });
  const [selectedEvent, setSelectedEvent] = useState<StreamEvent | null>(null);

  const filtered = useMemo(() =>
    selectedPlatform === 'All' ? events : events.filter(e => e.platform === selectedPlatform),
    [events, selectedPlatform],
  );

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => a.date.localeCompare(b.date)),
    [filtered],
  );

  const today = toDateStr(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const upcoming = useMemo(() =>
    sorted.filter(e => e.date >= today).slice(0, 5),
    [sorted, today],
  );

  const year  = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function getEventsForDay(day: number) {
    return filtered.filter(e => e.date === toDateStr(year, month, day));
  }

  function navigateMonth(dir: number) {
    setCurrentMonth(new Date(year, month + dir, 1));
  }

  const platforms: Platform[] = ['All', 'twitch', 'tiktok', 'youtube'];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FloatingShapes />
      <Header />

      <main className="relative z-10 pt-20">
        {/* Page hero */}
        <section className="py-14 px-4 sm:px-6 lg:px-12 text-center">
          <p className="text-sm font-medium text-[#f75124] mb-2">Streaming</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            {streamsPage?.title ?? 'Stream Schedule'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
            {streamsPage?.subtitle ?? 'Catch me live coding, building, and talking tech.'}
          </p>
        </section>

        <section className="px-4 sm:px-6 lg:px-12 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              {/* Platform filter */}
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                      selectedPlatform === p
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {p === 'All' ? 'All platforms' : PLATFORM_META[p].label}
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="ri-calendar-line mr-1.5"></i>Calendar
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <i className="ri-list-check mr-1.5"></i>List
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main area */}
              <div className="lg:col-span-2">
                {viewMode === 'calendar' ? (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    {/* Month header */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <i className="ri-arrow-left-s-line text-lg text-gray-600"></i>
                      </button>
                      <h2 className="text-xl font-bold text-gray-900">
                        {MONTH_NAMES[month]} {year}
                      </h2>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <i className="ri-arrow-right-s-line text-lg text-gray-600"></i>
                      </button>
                    </div>

                    {/* Day names */}
                    <div className="grid grid-cols-7 mb-2">
                      {DAY_NAMES.map(d => (
                        <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
                      ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayEvents = getEventsForDay(day);
                        const hasStream = dayEvents.length > 0;
                        const isToday   = toDateStr(year, month, day) === today;

                        return (
                          <div
                            key={day}
                            onClick={() => hasStream && setSelectedEvent(dayEvents[0])}
                            className={`aspect-square rounded-lg p-1 flex flex-col items-center justify-start transition-all ${
                              hasStream
                                ? 'bg-[#8067f0]/8 border border-[#8067f0]/25 hover:bg-[#8067f0]/15 cursor-pointer'
                                : 'bg-gray-50'
                            } ${isToday ? 'ring-2 ring-[#f75124]/40' : ''}`}
                          >
                            <span className={`text-xs font-medium ${isToday ? 'text-[#f75124]' : hasStream ? 'text-gray-700' : 'text-gray-400'}`}>
                              {day}
                            </span>
                            {hasStream && (
                              <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                                {dayEvents.slice(0, 2).map((ev, idx) => (
                                  <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${PLATFORM_META[ev.platform].bg}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="mt-5 pt-5 border-t border-gray-100 flex flex-wrap gap-4">
                      {(['twitch', 'tiktok', 'youtube'] as StreamEvent['platform'][]).map(p => (
                        <div key={p} className="flex items-center gap-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${PLATFORM_META[p].bg}`} />
                          <span className="text-xs text-gray-500">{PLATFORM_META[p].label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* List view */
                  <div className="space-y-3">
                    {sorted.length === 0 && (
                      <p className="text-gray-400 text-sm py-8 text-center">No streams scheduled yet.</p>
                    )}
                    {sorted.map(ev => {
                      const meta = PLATFORM_META[ev.platform];
                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-start gap-4"
                        >
                          <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                            <i className={`${meta.icon} text-white text-lg`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{ev.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formatDate(ev.date)} · {ev.time}
                              {ev.isRecurring && <span className="ml-2 text-[#8067f0]">· Weekly</span>}
                            </p>
                          </div>
                          <span className={`text-xs font-medium ${meta.color} whitespace-nowrap`}>{meta.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Upcoming streams */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="ri-live-line text-[#f75124]"></i>Upcoming streams
                  </h3>
                  {upcoming.length === 0 ? (
                    <p className="text-sm text-gray-400">No upcoming streams.</p>
                  ) : (
                    <div className="space-y-3">
                      {upcoming.map(ev => {
                        const meta = PLATFORM_META[ev.platform];
                        return (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                          >
                            <div className={`w-10 h-10 rounded-lg ${meta.bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                              {new Date(ev.date).getDate()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{ev.title}</p>
                              <p className="text-xs text-gray-400">{MONTH_NAMES[new Date(ev.date).getMonth()].slice(0,3)} · {ev.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Platform links */}
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Watch live on</h3>
                  {streamsPage?.twitchUsername && (
                    <a
                      href={PLATFORM_META.twitch.href(streamsPage.twitchUsername)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-sm transition-all"
                    >
                      <i className="ri-twitch-fill text-[#9146ff] text-xl"></i>
                      <span className="text-sm font-medium text-gray-700">Twitch</span>
                      <i className="ri-external-link-line text-gray-400 text-xs ml-auto"></i>
                    </a>
                  )}
                  {streamsPage?.tiktokUsername && (
                    <a
                      href={PLATFORM_META.tiktok.href(streamsPage.tiktokUsername)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-sm transition-all"
                    >
                      <i className="ri-tiktok-fill text-gray-900 text-xl"></i>
                      <span className="text-sm font-medium text-gray-700">TikTok</span>
                      <i className="ri-external-link-line text-gray-400 text-xs ml-auto"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
                <i className={`${PLATFORM_META[selectedEvent.platform].icon} ${PLATFORM_META[selectedEvent.platform].color} text-xl`}></i>
                <span className="text-sm font-medium text-gray-500">{PLATFORM_META[selectedEvent.platform].label}</span>
                {selectedEvent.isRecurring && (
                  <span className="text-xs text-[#8067f0] bg-[#8067f0]/10 px-2 py-0.5 rounded-full">Weekly</span>
                )}
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all cursor-pointer"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedEvent.title}</h2>
            {selectedEvent.description && (
              <p className="text-sm text-gray-600 mb-4">{selectedEvent.description}</p>
            )}

            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <i className="ri-calendar-line text-[#8067f0]"></i>
                <span>{formatDate(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <i className="ri-time-line text-[#8067f0]"></i>
                <span>{selectedEvent.time}</span>
              </div>
            </div>

            {selectedEvent.streamUrl && (
              <a
                href={selectedEvent.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-gray-700 text-white rounded-full text-sm font-medium transition-colors"
              >
                <i className={PLATFORM_META[selectedEvent.platform].icon}></i>
                Watch on {PLATFORM_META[selectedEvent.platform].label}
              </a>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
