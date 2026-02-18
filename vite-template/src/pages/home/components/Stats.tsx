import { useContent } from '../../../contexts/ContentContext';

export default function Stats() {
  const { content } = useContent();
  const stats = content.homePage.stats;

  const colorMap: Record<string, string> = {
    'stat-projects': 'from-teal-400 to-teal-500',
    'stat-clients': 'from-purple-400 to-purple-500',
    'stat-experience': 'from-orange-400 to-orange-500',
  };

  const iconMap: Record<string, string> = {
    'stat-projects': 'ri-folder-chart-line',
    'stat-clients': 'ri-team-line',
    'stat-experience': 'ri-time-line',
  };

  return (
    <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            {stats.title}
          </h2>
          <p className="text-xl text-gray-600">{stats.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.items.map((stat) => {
            const color = colorMap[stat.id] ?? 'from-gray-400 to-gray-500';
            const icon = iconMap[stat.id] ?? 'ri-bar-chart-line';
            return (
              <div
                key={stat.id}
                className={`bg-gradient-to-br ${color} rounded-3xl p-12 text-center text-white hover:scale-105 transition-transform duration-300 cursor-pointer shadow-lg hover:shadow-2xl`}
              >
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm">
                      <i className={`${icon} text-4xl`}></i>
                    </div>
                  </div>

                  <div className="text-6xl font-bold">{stat.value}</div>
                  <div className="text-xl font-medium">{stat.label}</div>
                  <p className="text-sm opacity-80">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
