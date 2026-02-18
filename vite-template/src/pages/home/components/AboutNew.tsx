
import { useContent } from '../../../contexts/ContentContext';

export default function AboutNew() {
  const { content } = useContent();
  const about = content.homePage.about;

  const toolIcons: Record<
    string,
    { icon: string; color: string }
  > = {
    Figma: { icon: 'ri-figma-fill', color: 'text-purple-600' },
    Sketch: { icon: 'ri-sketch-fill', color: 'text-orange-500' },
    React: { icon: 'ri-reactjs-line', color: 'text-cyan-500' },
    TypeScript: { icon: 'ri-code-box-line', color: 'text-blue-600' },
    'Node.js': { icon: 'ri-nodejs-line', color: 'text-green-600' },
    'Tailwind CSS': {
      icon: 'ri-palette-line',
      color: 'text-teal-500',
    },
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left – Creative Image */}
          <div className="relative flex justify-center">
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]">
              {/* Circular artistic frame */}
              <div className="absolute inset-0 rounded-full overflow-hidden border-4 sm:border-8 border-gray-100">
                <img
                  src="https://readdy.ai/api/search-image?query=creative%20african%20american%20male%20designer%20portrait%20with%20artistic%20circular%20frame%2C%20professional%20headshot%20with%20creative%20lighting%2C%20modern%20artistic%20photography%2C%20confident%20expression%2C%20studio%20portrait%20with%20artistic%20elements%20and%20textures&width=500&height=500&seq=about-portrait-1&orientation=squarish"
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
                {about.tools?.map((tool) => {
                  const iconData =
                    toolIcons[tool.name] ?? {
                      icon: 'ri-tools-line',
                      color: 'text-gray-600',
                    };
                  return (
                    <div
                      key={tool.id ?? tool.name}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                        <i
                          className={`${iconData.icon} text-xl sm:text-2xl ${iconData.color}`}
                        ></i>
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
