// Type definitions for the site content structure

export interface SiteContent {
  navigation: Navigation;
  footer: Footer;
  homePage: HomePage;
  aboutPage: AboutPage;
  contactPage: ContactPage;
  worksPage: WorksPage;
  projects: Project[];
}

export interface Navigation {
  id: string;
  logo: {
    text: string;
    url: string;
    imageUrl?: string;
  };
  menuItems: MenuItem[];
  ctaButton: {
    label: string;
    url: string;
  };
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface Footer {
  id: string;
  logo: {
    text: string;
    url: string;
    imageUrl?: string;
  };
  copyright: string;
  links: FooterLink[];
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface HomePage {
  hero: HeroSection;
  about: AboutSection;
  skills: SkillsSection;
  featuredWorks: FeaturedWorksSection;
  services: ServicesSection;
  stats: StatsSection;
  contactCTA: ContactCTASection;
}

export interface HeroSection {
  id: string;
  badge: string;
  heading: string;
  subtitle: string;
  ctaButton: {
    label: string;
    url: string;
  };
  secondaryButton: {
    label: string;
    url: string;
  };
  image: {
    url: string;
    alt: string;
  };
  socialIcons: SocialIcon[];
}

export interface SocialIcon {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface AboutSection {
  id: string;
  sectionTitle: string;
  name: string;
  role: string;
  bio: string[];
  tools: Tool[];
}

export interface Tool {
  id: string;
  name: string;
  icon?: string;
  category?: string;
}

export interface SkillsSection {
  id: string;
  title: string;
  subtitle: string;
  clusters: SkillCluster[];
}

export interface SkillCluster {
  id: string;
  name: string;
  color: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number;
}

export interface FeaturedWorksSection {
  id: string;
  title: string;
  subtitle: string;
  projectIds: (string | number)[];
  displaySettings: {
    maxRows: number;
    randomize: boolean;
  };
}

export interface ServicesSection {
  id: string;
  title: string;
  subtitle: string;
  items: Service[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface StatsSection {
  id: string;
  title: string;
  subtitle: string;
  items: Stat[];
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  description: string;
}

export interface ContactCTASection {
  id: string;
  heading: string;
  description: string;
  ctaButton: {
    label: string;
    url: string;
  };
}

export interface AboutPage {
  hero: AboutHeroSection;
  bio: BioSection;
  expertise: ExpertiseSection;
  journey: JourneySection;
  philosophy: PhilosophySection;
  connectCTA: ConnectCTASection;
}

export interface AboutHeroSection {
  id: string;
  avatar: {
    url: string;
    alt: string;
  };
  name: string;
  role: string;
  tagline: string;
}

export interface BioSection {
  id: string;
  paragraphs: string[];
}

export interface ExpertiseSection {
  id: string;
  sectionTitle: string;
  items: ExpertiseCard[];
}

export interface ExpertiseCard {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface JourneySection {
  id: string;
  sectionTitle: string;
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  id: string;
  year: string;
  title: string;
  company?: string;
  description: string;
}

export interface PhilosophySection {
  id: string;
  quote: string;
  label: string;
}

export interface ConnectCTASection {
  id: string;
  heading: string;
  description: string;
  ctaButton: {
    label: string;
    url: string;
  };
}

export interface ContactPage {
  hero: ContactHeroSection;
  form: ContactFormSection;
  contactInfo: ContactInfoSection;
  map: MapSection;
}

export interface ContactHeroSection {
  id: string;
  label: string;
  headingLines: string[];
  description: string;
}

export interface ContactFormSection {
  id: string;
  title: string;
  fields: FormField[];
  submitButton: {
    label: string;
    loadingLabel: string;
  };
  messages: {
    success: string;
    error: string;
  };
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  placeholder: string;
  required: boolean;
  maxLength?: number;
}

export interface ContactInfoSection {
  cards: ContactCard[];
  socialLinks: SocialLink[];
  availability: AvailabilityStatus;
}

export interface ContactCard {
  id: string;
  icon: string;
  label: string;
  value: string;
  link: string | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
}

export interface AvailabilityStatus {
  status: string;
  label: string;
}

export interface MapSection {
  id: string;
  embedUrl: string;
  title: string;
}

export interface WorksPage {
  id: string;
  title: string;
  subtitle: string;
  categories: string[];
}

export interface Project {
  id: string | number;
  title: string;
  category: string;
  year: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  tags: string[];
  overview: {
    description: string;
    client: string;
    duration: string;
    role: string;
  };
  details: {
    challenge: string;
    solution: string;
    results: string[];
  };
  gallery: {
    images: GalleryImage[];
  };
}

export interface GalleryImage {
  url: string;
  caption: string;
  type?: 'web' | 'mobile';
}
