
import { useState } from 'react';
import { useContent } from '../../../public/contexts/PublicContentContext';

interface SkillItem {
  name: string;
  icon: string;
  proficiency: number;
  color: string;
}

interface SkillClusterProps {
  label: string;
  labelIcon: string;
  skills: SkillItem[];
  scale?: number;
  activeSkill: string | null;
  setActiveSkill: (id: string | null) => void;
  idPrefix: string;
}

/**
 * SkillCluster – renders a circular orbit of skill "orbs".
 * Added defensive checks and small refactor for readability.
 */
function SkillCluster({
  label,
  labelIcon,
  skills,
  scale = 1,
  activeSkill,
  setActiveSkill,
  idPrefix,
}: SkillClusterProps) {
  // Guard against empty skill arrays – render nothing instead of breaking layout.
  if (!Array.isArray(skills) || skills.length === 0) return null;

  const coreSize = 40 * scale;
  const orbSize = 29 * scale;
  const iconSize = Math.round(scale >= 1 ? 48 : 28);
  const orbIconSize = Math.round(scale >= 1 ? 36 : 22);
  const ring1 = 400 * scale;
  const ring2 = 550 * scale;
  const radius1 = 200 * scale;
  const radius2 = 275 * scale;
  const containerSize = 600 * scale;

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: `${containerSize}px`, height: `${containerSize}px` }}
    >
      {/* Center Core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative z-10">
          <div
            className="rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-2xl"
            style={{ width: `${coreSize * 4}px`, height: `${coreSize * 4}px` }}
          >
            <div className="text-center text-white">
              <i className={labelIcon} style={{ fontSize: `${iconSize}px` }}></i>
              <p className="font-semibold mt-1" style={{ fontSize: `${Math.round(14 * scale)}px` }}>
                {label}
              </p>
            </div>
          </div>
        </div>

        {/* Orbit Rings */}
        <div
          className="absolute border-2 border-dashed border-gray-200 rounded-full animate-[spin_30s_linear_infinite]"
          style={{ width: `${ring1}px`, height: `${ring1}px` }}
        ></div>
        <div
          className="absolute border-2 border-dashed border-gray-200 rounded-full animate-[spin_40s_linear_infinite_reverse]"
          style={{ width: `${ring2}px`, height: `${ring2}px` }}
        ></div>
      </div>

      {/* Skill Orbs */}
      {skills.map((skill, index) => {
        const angle = (index * 360) / skills.length;
        const radius = index % 2 === 0 ? radius1 : radius2;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        const skillId = `${idPrefix}-${index}`;
        const isActive = activeSkill === skillId;

        return (
          <div
            key={skillId}
            className="absolute transition-all duration-500 ease-out"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) ${
                isActive ? 'scale(1.2)' : 'scale(1)'
              }`,
            }}
            onMouseEnter={() => setActiveSkill(skillId)}
            onMouseLeave={() => setActiveSkill(null)}
          >
            <div className="relative group cursor-pointer">
              <div
                className={`rounded-full bg-gradient-to-br ${skill.color} flex flex-col items-center justify-center text-white shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                style={{ width: `${orbSize * 4}px`, height: `${orbSize * 4}px` }}
              >
                <i className={`${skill.icon} mb-1`} style={{ fontSize: `${orbIconSize}px` }}></i>
                <span
                  className="font-semibold text-center px-2"
                  style={{ fontSize: `${Math.round(12 * scale)}px` }}
                >
                  {skill.name}
                </span>
              </div>

              {/* Proficiency Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray={`${skill.proficiency * 3.01} 301`}
                  className="transition-all duration-1000"
                  style={{ strokeDashoffset: isActive ? 0 : 301 }}
                />
              </svg>

              {/* Proficiency Tooltip */}
              {isActive && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shadow-xl animate-[fadeIn_0.3s_ease-out]">
                  {skill.proficiency}% Proficiency
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Mobile-friendly skill card component
 */
function MobileSkillCard({ 
  cluster, 
  colorClass 
}: { 
  cluster: { label: string; labelIcon: string; skills: SkillItem[] }; 
  colorClass: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
          <i className={`${cluster.labelIcon} text-white text-lg`}></i>
        </div>
        <h3 className="font-semibold text-gray-900">{cluster.label}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {cluster.skills.map((skill, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
          >
            <i className={`${skill.icon} text-gray-600`}></i>
            <span className="text-sm text-gray-700">{skill.name}</span>
            <span className="text-xs text-gray-400">{skill.proficiency}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main component – builds the clusters from mock data and renders them.
 * Added a few safety checks to avoid runtime crashes when data is missing.
 */
export default function SkillsOrbit() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const { content } = useContent();
  const skills = content.homePage.skills;

  // Guard against missing mock data
  if (!skills) return null;

  const skillIconMap: Record<string, string> = {
    'UI Design': 'ri-palette-line',
    'UX Research': 'ri-user-search-line',
    'Prototyping': 'ri-play-circle-line',
    'Design Systems': 'ri-layout-grid-line',
    React: 'ri-reactjs-line',
    TypeScript: 'ri-code-box-line',
    'Next.js': 'ri-terminal-box-line',
    Tailwind: 'ri-palette-line',
    'Node.js': 'ri-nodejs-line',
    GraphQL: 'ri-share-circle-line',
    PostgreSQL: 'ri-database-2-line',
    'REST APIs': 'ri-api-line',
    'React Native': 'ri-smartphone-line',
    Flutter: 'ri-flutter-fill',
    'iOS Design': 'ri-apple-fill',
    'Android Design': 'ri-android-fill',
    Figma: 'ri-figma-fill',
    Git: 'ri-git-branch-line',
    Docker: 'ri-ship-line',
    AWS: 'ri-cloud-line',
  };

  const colorMap: Record<string, string> = {
    '#14B8A6': 'from-teal-400 to-teal-600',
    '#F59E0B': 'from-amber-400 to-amber-600',
    '#8B5CF6': 'from-violet-400 to-violet-600',
    '#EC4899': 'from-pink-400 to-pink-600',
    '#10B981': 'from-emerald-400 to-emerald-600',
  };

  // Transform siteContent clusters to component format
  const transformedClusters = (skills.clusters ?? []).map((cluster) => ({
    label: cluster.name,
    labelIcon:
      cluster.name === 'Design'
        ? 'ri-star-fill'
        : cluster.name === 'Frontend'
        ? 'ri-code-line'
        : cluster.name === 'Backend'
        ? 'ri-server-line'
        : cluster.name === 'Mobile'
        ? 'ri-smartphone-line'
        : 'ri-tools-line',
    skills: (cluster.skills ?? []).map((skill) => ({
      name: skill.name,
      icon: skillIconMap[skill.name] || 'ri-checkbox-blank-circle-line',
      proficiency: skill.proficiency,
      color: colorMap[cluster.color] || 'from-gray-400 to-gray-600',
    })),
    idPrefix: cluster.id?.toString() ?? Math.random().toString(36).substr(2, 9),
    colorClass: colorMap[cluster.color] || 'from-gray-400 to-gray-600',
  }));

  // Determine clusters – fall back gracefully if any are missing
  const coreCluster = transformedClusters.find((c) => c.label === 'Design') ?? transformedClusters[0];
  const frontendCluster = transformedClusters.find((c) => c.label === 'Frontend');
  const backendCluster = transformedClusters.find((c) => c.label === 'Backend');
  const mobileCluster = transformedClusters.find((c) => c.label === 'Mobile');
  const toolsCluster = transformedClusters.find((c) => c.label === 'Tools');

  return (
    <section className="pt-12 sm:pt-16 lg:pt-20 pb-4 sm:pb-6 lg:pb-8 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className='text-right mb-8 lg:mb-12'>
            <p className="text-sm font-medium text-[#f75124] mb-2">Portfolio</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{skills.title}</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl ml-auto">
            {skills.subtitle}
          </p>
        </div>

        {/* Mobile Layout - Grid of skill cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {transformedClusters.map((cluster, index) => (
            <MobileSkillCard 
              key={index} 
              cluster={cluster} 
              colorClass={cluster.colorClass}
            />
          ))}
        </div>

        {/* Desktop Layout - Orbit visualization */}
        <div className="hidden lg:block relative w-full" style={{ minHeight: '600px' }}>
          <div className="relative flex items-center justify-center w-full h-full">
            {/* Backend Cluster - Upper Left */}
            {backendCluster && (
              <div
                className="absolute"
                style={{ left: '-30px', top: '8%', transform: 'translateY(-50%) rotate(-5deg)' }}
              >
                <SkillCluster
                  label={backendCluster.label}
                  labelIcon={backendCluster.labelIcon}
                  skills={backendCluster.skills}
                  scale={0.49}
                  activeSkill={activeSkill}
                  setActiveSkill={setActiveSkill}
                  idPrefix={backendCluster.idPrefix}
                />
              </div>
            )}

            {/* Mobile Cluster - Lower Left */}
            {mobileCluster && (
              <div className="absolute" style={{ left: '50px', bottom: '8%', transform: 'rotate(3deg)' }}>
                <SkillCluster
                  label={mobileCluster.label}
                  labelIcon={mobileCluster.labelIcon}
                  skills={mobileCluster.skills}
                  scale={0.41}
                  activeSkill={activeSkill}
                  setActiveSkill={setActiveSkill}
                  idPrefix={mobileCluster.idPrefix}
                />
              </div>
            )}

            {/* Tools Cluster - Top Right */}
            {toolsCluster && (
              <div className="absolute" style={{ right: '-20px', top: '5%', transform: 'rotate(4deg)' }}>
                <SkillCluster
                  label={toolsCluster.label}
                  labelIcon={toolsCluster.labelIcon}
                  skills={toolsCluster.skills}
                  scale={0.41}
                  activeSkill={activeSkill}
                  setActiveSkill={setActiveSkill}
                  idPrefix={toolsCluster.idPrefix}
                />
              </div>
            )}

            {/* Frontend Cluster - Bottom Right */}
            {frontendCluster && (
              <div className="absolute" style={{ right: '10px', bottom: '12%', transform: 'rotate(-4deg)' }}>
                <SkillCluster
                  label={frontendCluster.label}
                  labelIcon={frontendCluster.labelIcon}
                  skills={frontendCluster.skills}
                  scale={0.41}
                  activeSkill={activeSkill}
                  setActiveSkill={setActiveSkill}
                  idPrefix={frontendCluster.idPrefix}
                />
              </div>
            )}

            {/* Core Cluster - Center */}
            {coreCluster && (
              <div className="relative z-10">
                <SkillCluster
                  label="Core Skills"
                  labelIcon="ri-star-fill"
                  skills={coreCluster.skills}
                  scale={0.68}
                  activeSkill={activeSkill}
                  setActiveSkill={setActiveSkill}
                  idPrefix="core"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
