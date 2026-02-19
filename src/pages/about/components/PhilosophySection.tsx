
import { siteContent } from '../../../mocks/siteContent';

export default function PhilosophySection() {
  const { philosophy } = siteContent.aboutPage;

  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center relative">
        {/* Decorative quotes */}
        <span className="absolute -top-8 left-0 text-8xl text-gray-100 font-serif select-none">
          "
        </span>
        <span className="absolute -bottom-16 right-0 text-8xl text-gray-100 font-serif select-none">
          "
        </span>

        <p className="font-serif text-2xl md:text-3xl text-gray-500 leading-[2] font-light relative z-10">
          {philosophy.quote}
        </p>

        <div className="mt-12">
          <span className="text-sm text-gray-400 tracking-widest uppercase">
            {philosophy.label}
          </span>
        </div>
      </div>
    </section>
  );
}
