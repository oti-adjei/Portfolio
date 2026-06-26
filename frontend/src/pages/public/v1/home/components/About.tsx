export default function About() {
  const skills = [
    'UI/UX Design',
    'Web Development',
    'Mobile Apps',
    'Brand Identity',
    'Prototyping',
    'User Research'
  ];

  return (
    <section id="about" className="py-20 px-6 lg:px-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              About Me
            </h2>
            <div className="space-y-4 text-gray-600 text-base leading-relaxed">
              <p>
                I'm a passionate designer and developer with over 5 years of experience creating 
                digital experiences that combine beautiful design with seamless functionality.
              </p>
              <p>
                My approach focuses on understanding user needs and translating them into 
                intuitive interfaces that solve real problems. I believe great design should 
                be both aesthetically pleasing and purposeful.
              </p>
              <p>
                When I'm not designing or coding, you'll find me exploring new technologies, 
                contributing to open-source projects, or sharing knowledge with the design community.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-full border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="w-full h-96 flex items-center justify-center rounded-lg overflow-hidden bg-gray-100">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20designer%20workspace%20with%20laptop%20and%20design%20tools%2C%20clean%20minimalist%20setup%2C%20natural%20lighting%2C%20modern%20office%20environment%2C%20creative%20workspace%20photography%2C%20white%20and%20neutral%20tones&width=600&height=600&seq=about1&orientation=squarish"
                alt="Workspace"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
              <img
                src="https://readdy.ai/api/search-image?query=creative%20professional%20portrait%20in%20modern%20office%2C%20confident%20designer%2C%20professional%20headshot%2C%20natural%20lighting%2C%20contemporary%20workspace%20background&width=400&height=400&seq=about2&orientation=squarish"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
