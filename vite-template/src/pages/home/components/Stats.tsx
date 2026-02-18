import { useContent } from '../../../contexts/ContentContext';

export default function Stats() {
  const { content } = useContent();
  const stats = content.homePage.stats;

  const colorMap: Record<string, string> = {
    'stat-projects': 'bg-[#baebcd]',
    'stat-clients': 'bg-[#D9D1FA]',
    'stat-experience': 'bg-[#faedce]',
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
            const color = colorMap[stat.id] ?? 'bg-gray-100';
            return (
              <div
                key={stat.id}
                className={`${color} rounded-xl p-12 text-center hover:scale-105 transition-transform duration-300 cursor-pointer shadow-[18px_0px_87px_0px_rgb(10_15_70/7%)]`}
              >
                <div className="space-y-3">
                  <div className="text-5xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-lg font-medium text-gray-800">{stat.label}</div>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
