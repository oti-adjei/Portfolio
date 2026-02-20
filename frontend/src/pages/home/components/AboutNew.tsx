
import { useContent } from '../../../public/contexts/PublicContentContext';

export default function AboutNew() {
  const { content } = useContent();
  const about = content.homePage.about;

  const toolIcons: Record<string, { icon: string }> = {
    Flutter: { icon: 'ri-smartphone-line' },
    React: { icon: 'ri-reactjs-line' },
    Go: { icon: 'ri-code-s-slash-line' },
    TypeScript: { icon: 'ri-code-box-line' },
    'Node.js': { icon: 'ri-nodejs-line' },
    Figma: { icon: 'ri-figma-fill' },
  };

  const circleColors = ['#f75124', '#baebcd', '#d9d1fa', '#faedce'];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left – Creative Image */}
          <div className="relative flex justify-center">
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
              {/* Circular artistic frame */}
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 sm:border-8 border-gray-100">
                <img
                  src="/car4-min.webp"
                  alt={about.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-16 h-16 sm:w-24 sm:h-24 bg-teal-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-20 h-20 sm:w-32 sm:h-32 bg-orange-400 rounded-full opacity-20"></div>
            </div>
          </div>

          {/* Right – Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                {about.sectionTitle}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                The Guy Behind The Wheel
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
                <p className="text-base sm:text-lg">
                  <span className="font-semibold text-gray-900">
                    I&apos;m {about.name}
                  </span>
                  , {about.role?.toLowerCase()}. {about.bio?.[0]}
                </p>

                {about.bio?.slice(1).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Tools I Use
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 flex-wrap">
                {about.tools?.map((tool, index) => {
                  const iconData = toolIcons[tool.name] ?? { icon: 'ri-tools-line' };
                  const bg = circleColors[index % circleColors.length];
                  return (
                    <div
                      key={tool.id ?? tool.name}
                      className="flex flex-col items-center gap-2 group cursor-pointer transition-transform duration-300 hover:-translate-y-1.5"
                    >
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: bg }}
                      >
                        <i className={`${iconData.icon} text-2xl sm:text-3xl text-gray-800`}></i>
                      </div>
                      <span className="text-xs text-gray-600">{tool.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
