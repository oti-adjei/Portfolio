import { Link, useLocation } from "react-router-dom";
import FloatingShapes from "@/components/FloatingShapes";
import Reveal from "@/components/Reveal";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <FloatingShapes />

      {/* Giant 404 watermark */}
      <span
        className="absolute select-none pointer-events-none text-[28vw] font-black leading-none text-gray-100/60 tracking-tight"
        aria-hidden="true"
      >
        404
      </span>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-xl">
        <Reveal>
          <span className="inline-block px-4 py-2 mb-6 text-xs font-medium uppercase tracking-[0.2em] text-[#f75124] bg-orange-50 rounded-full">
            Page not found
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            This page hasn't been
            <br />
            <span className="text-[#f75124]">created yet</span>
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-base sm:text-lg text-gray-500 leading-relaxed">
            The page at{" "}
            <code className="px-2 py-1 text-sm bg-gray-100 rounded-lg font-mono text-gray-600">
              {location.pathname}
            </code>{" "}
            doesn't exist. It might have been moved or never existed in the first place.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/"
              className="px-8 py-3 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              Back to Home
            </Link>
            <Link
              to="/works"
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 text-sm font-medium rounded-full hover:bg-gray-900 hover:text-white transition-colors duration-300"
            >
              View My Work
            </Link>
          </div>
        </Reveal>

        {/* Decorative dots */}
        <Reveal delay={400}>
          <div className="mt-12 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#d9d1fa]" />
            <span className="w-2 h-2 rounded-full bg-[#f75124]" />
            <span className="w-2 h-2 rounded-full bg-[#baebcd]" />
            <span className="w-2 h-2 rounded-full bg-[#faedce]" />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
