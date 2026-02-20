
import { siteContent } from '@/mocks/siteContent';

export default function ExpertiseCards() {
  const { expertise } = siteContent.aboutPage;

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-light text-gray-800 mb-10 sm:mb-12 lg:mb-16 tracking-tight text-center sm:text-left">
          {expertise.sectionTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {expertise.items.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 cursor-pointer animate-card-pulse"
              style={{ animationDelay: `${index * 0.5}s` }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-4 sm:mb-6">
                <i
                  className={`${item.icon} text-2xl sm:text-3xl text-teal-500 group-hover:scale-110 transition-transform duration-300`}
                ></i>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-2 sm:mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
