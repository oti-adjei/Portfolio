import type { SiteContent } from '../types/siteContent';

export const siteContent: SiteContent = {
  navigation: {
    id: 'nav-main',
    logo: {
      text: 'GH',
      url: '/',
      imageUrl: '/GHlog.png'
    },
    menuItems: [
      { id: 'nav-home', label: 'Home', url: '/' },
      { id: 'nav-works', label: 'Works', url: '/works' },
      { id: 'nav-about', label: 'About', url: '/about' }
    ],
    ctaButton: {
      label: 'Get in Touch',
      url: '/contact'
    }
  },

  footer: {
    id: 'footer-main',
    logo: {
      text: 'GH',
      url: '/',
      imageUrl: '/GHlog.png'
    },
    copyright: '© 2026 George Oti-Adjei. All rights reserved.',
    links: [
      { id: 'footer-link-1', label: 'GitHub', url: 'https://github.com/oti-adjei' },
      { id: 'footer-link-2', label: 'LinkedIn', url: 'https://linkedin.com/in/george-jrr' }
    ]
  },

  newsletterSubscribers: [],
  contactSubmissions: [],

  homePage: {
    hero: {
      id: 'home-hero',
      badge: 'Mobile & Software Engineer',
      heading: 'Building Apps People Actually Use',
      subtitle: 'Full-stack and mobile engineer with 3+ years shipping cross-platform applications for web, mobile, and desktop.I also stream for fun. Check my stream schedule below.',
      ctaButton: {
        label: 'View My Work',
        url: '/works'
      },
      secondaryButton: {
        label: 'Get in Touch',
        url: '/contact'
      },
      image: {
        url: '/Gpic.webp',
        alt: 'Georgie Heavenson Jnr. Oti-Adjei'
      },
      socialIcons: [
        { id: 'social-linkedin', platform: 'linkedin', url: 'https://linkedin.com/in/george-jrr', icon: 'ri-linkedin-line' },
        { id: 'social-github', platform: 'github', url: 'https://github.com/oti-adjei', icon: 'ri-github-line' },
        { id: 'social-twitch', platform: 'twitch', url: '#', icon: 'ri-twitch-line' },
        { id: 'social-tiktok', platform: 'tiktok', url: '#', icon: 'ri-tiktok-line' },
        { id: 'social-youtube', platform: 'youtube', url: '#', icon: 'ri-youtube-line' }
      ]
    },

    about: {
      id: 'home-about',
      sectionTitle: 'About Me',
      name: 'George Oti-Adjei',
      role: 'Mobile & Software Engineer',
      bio: [
        'Results-driven Mobile and Software Engineer with 3+ years of experience building cross-platform applications and full-stack systems that serve real users.',
        'From fintech apps and property management SaaS to esports platforms and e-commerce storefronts — I build end-to-end products that are fast, scalable, and actually enjoyable to use.',
        'I\'m most at home at the intersection of mobile and web, where clean architecture meets an experience people don\'t need a manual to understand.'
      ],
      tools: [
        { id: 'tool-flutter', name: 'Flutter', category: 'mobile' },
        { id: 'tool-react', name: 'React', category: 'frontend' },
        { id: 'tool-go', name: 'Go', category: 'backend' },
        { id: 'tool-typescript', name: 'TypeScript', category: 'frontend' },
        { id: 'tool-nodejs', name: 'Node.js', category: 'backend' },
        { id: 'tool-figma', name: 'Figma', category: 'design' }
      ]
    },

    skills: {
      id: 'home-skills',
      title: 'Skills & Expertise',
      subtitle: 'A comprehensive toolkit for modern product development',
      clusters: [
        {
          id: 'cluster-design',
          name: 'Design',
          color: '#14B8A6',
          skills: [
            { id: 'skill-ui', name: 'UI Design', proficiency: 95 },
            { id: 'skill-ux', name: 'UX Research', proficiency: 90 },
            { id: 'skill-proto', name: 'Prototyping', proficiency: 92 },
            { id: 'skill-systems', name: 'Design Systems', proficiency: 88 }
          ]
        },
        {
          id: 'cluster-frontend',
          name: 'Frontend',
          color: '#F59E0B',
          skills: [
            { id: 'skill-react', name: 'React', proficiency: 93 },
            { id: 'skill-ts', name: 'TypeScript', proficiency: 90 },
            { id: 'skill-next', name: 'Next.js', proficiency: 87 },
            { id: 'skill-tailwind', name: 'Tailwind', proficiency: 95 }
          ]
        },
        {
          id: 'cluster-backend',
          name: 'Backend',
          color: '#8B5CF6',
          skills: [
            { id: 'skill-node', name: 'Node.js', proficiency: 85 },
            { id: 'skill-graphql', name: 'GraphQL', proficiency: 82 },
            { id: 'skill-postgres', name: 'PostgreSQL', proficiency: 80 },
            { id: 'skill-api', name: 'REST APIs', proficiency: 88 }
          ]
        },
        {
          id: 'cluster-mobile',
          name: 'Mobile',
          color: '#EC4899',
          skills: [
            { id: 'skill-rn', name: 'React Native', proficiency: 86 },
            { id: 'skill-flutter', name: 'Flutter', proficiency: 78 },
            { id: 'skill-ios', name: 'iOS Design', proficiency: 84 },
            { id: 'skill-android', name: 'Android Design', proficiency: 82 }
          ]
        },
        {
          id: 'cluster-tools',
          name: 'Tools',
          color: '#10B981',
          skills: [
            { id: 'skill-figma', name: 'Figma', proficiency: 96 },
            { id: 'skill-git', name: 'Git', proficiency: 90 },
            { id: 'skill-docker', name: 'Docker', proficiency: 75 },
            { id: 'skill-aws', name: 'AWS', proficiency: 72 }
          ]
        }
      ]
    },

    featuredWorks: {
      id: 'home-featured-works',
      title: 'My Amazing Work',
      subtitle: 'A selection of projects that showcase my design and development capabilities',
      projectIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      displaySettings: {
        maxRows: 2,
        randomize: true
      }
    },

    services: {
      id: 'home-services',
      title: 'What I Do',
      subtitle: 'End-to-end software engineering across mobile, web, backend, and desktop',
      items: [
        {
          id: 'service-mobile',
          icon: 'ri-smartphone-line',
          title: 'Mobile Development',
          description: 'Cross-platform iOS and Android apps built with Flutter and React Native, from zero to production.'
        },
        {
          id: 'service-web',
          icon: 'ri-code-s-slash-line',
          title: 'Web Development',
          description: 'Fast, responsive web applications built with React, Next.js, and Astro — optimised for performance and SEO.'
        },
        {
          id: 'service-backend',
          icon: 'ri-server-line',
          title: 'Backend Engineering',
          description: 'Scalable REST APIs built with Node.js/Express and Go, backed by PostgreSQL and MongoDB.'
        },
        {
          id: 'service-desktop',
          icon: 'ri-window-line',
          title: 'Desktop Applications',
          description: 'Cross-platform desktop apps built with Wails (Go + React) — native feel on macOS and Windows.'
        },
        {
          id: 'service-devops',
          icon: 'ri-git-branch-line',
          title: 'DevOps & CI/CD',
          description: 'Automated pipelines via GitHub Actions and Azure DevOps, Docker containerisation, and cloud hosting on AWS and Cloudflare.'
        },
        {
          id: 'service-consulting',
          icon: 'ri-lightbulb-line',
          title: 'Technical Consulting',
          description: 'Architecture reviews, tech-stack guidance, and hands-on support for teams building software products.'
        }
      ]
    },

    stats: {
      id: 'home-stats',
      title: 'By the Numbers',
      subtitle: 'Impact and achievements over the years',
      items: [
        {
          id: 'stat-projects',
          value: '20+',
          label: 'Projects Shipped',
          description: 'Successful launches across web, mobile, and desktop'
        },
        {
          id: 'stat-clients',
          value: '10+',
          label: 'Happy Clients',
          description: 'From startups to established businesses'
        },
        {
          id: 'stat-experience',
          value: '3+',
          label: 'Years Experience',
          description: 'Continuous learning and growth in the field'
        }
      ]
    },

    contactCTA: {
      id: 'home-contact-cta',
      heading: 'Let\'s Work Together',
      description: 'Have a project in mind? I\'d love to hear about it. Let\'s create something amazing together.',
      ctaButton: {
        label: 'Get in Touch',
        url: '/contact'
      }
    }
  },

  aboutPage: {
    hero: {
      id: 'about-hero',
      avatar: {
        url: '/aboutme.JPG',
        alt: 'George Oti-Adjei'
      },
      name: 'George Oti-Adjei',
      role: 'Mobile & Software Engineer',
      tagline: 'Building performant, cross-platform applications from Accra, Ghana'
    },

    bio: {
      id: 'about-bio',
      paragraphs: [
        'I\'m a Mobile and Software Engineer based in Accra, Ghana, with 3+ years of experience building cross-platform applications and full-stack systems that serve real users.',
        'My journey started with a curiosity about how software works — and quickly became a career shipping production apps across mobile, web, and desktop. I\'ve worked across fintech, logistics, education, and real estate, building everything from Flutter apps and Node.js APIs to Go-powered SaaS platforms.',
        'I believe the best software is fast, reliable, and gets out of the user\'s way. That philosophy drives every architectural decision I make — whether I\'m building a multi-tenant SaaS or a lightweight mobile app.',
        'When I\'m not building, I\'m learning — exploring new tooling, contributing to open source, or mentoring others through problems I\'ve already solved.'
      ]
    },

    expertise: {
      id: 'about-expertise',
      sectionTitle: 'Areas of Expertise',
      items: [
        {
          id: 'expertise-mobile',
          icon: 'ri-smartphone-line',
          title: 'Mobile Development',
          description: 'Building cross-platform iOS and Android apps with Flutter and React Native, from zero to production.'
        },
        {
          id: 'expertise-frontend',
          icon: 'ri-code-box-line',
          title: 'Web & Frontend',
          description: 'Responsive, performant web applications with React, Next.js, TypeScript, and Astro.'
        },
        {
          id: 'expertise-backend',
          icon: 'ri-server-line',
          title: 'Backend Engineering',
          description: 'Scalable REST APIs and services built with Node.js/Express and Go, backed by PostgreSQL and MongoDB.'
        },
        {
          id: 'expertise-devops',
          icon: 'ri-settings-3-line',
          title: 'DevOps & Tooling',
          description: 'CI/CD pipelines via GitHub Actions and Azure DevOps, Docker containerisation, and cloud deployments on AWS and Cloudflare.'
        }
      ]
    },

    journey: {
      id: 'about-journey',
      sectionTitle: 'My Journey',
      timeline: [
        {
          id: 'journey-2024-masharder',
          year: '2024',
          title: 'Lead Frontend Software Engineer',
          company: 'MashHarder',
          description: 'Leading frontend architecture for a Ghanaian esports platform. Built MashHarder UI — an open-source Web Component library (Lit) used across the platform, with full TypeScript definitions and Starlight-powered docs.'
        },
        {
          id: 'journey-2024-senvon',
          year: '2024',
          title: 'Founder & Software Engineer',
          company: 'Senvon Studio',
          description: 'Founded a boutique digital studio delivering SaaS platforms, component libraries, and client web applications. Studio output includes Home Sweet Home (property management SaaS) and Mummy\'s Darl.'
        },
        {
          id: 'journey-2024-enyata',
          year: '2024',
          title: 'Mobile Developer',
          company: 'Enyata Ghana',
          description: 'Developed and maintained production mobile applications using Flutter and React Native. Integrated GraphQL and REST APIs, implemented Riverpod state management and offline-first local storage.'
        },
        {
          id: 'journey-2022-alpha',
          year: '2022',
          title: 'Mobile Engineer',
          company: 'teamAlpha',
          description: 'Built cross-platform mobile apps for iOS and Android serving 8,000+ active users. Implemented CI/CD pipelines and CLI deployment automation tools.'
        },
        {
          id: 'journey-2021-adb',
          year: '2021',
          title: 'Junior Application Developer',
          company: 'Agricultural Development Bank Ghana',
          description: 'Built internal web applications, trained staff on KYC verification systems, and optimised server-side performance — reducing query execution time by 40%.'
        },
        {
          id: 'journey-2020-npontu',
          year: '2020',
          title: 'Started My Journey',
          company: 'Npontu Technologies',
          description: 'First professional role as a DevOps & Data Analyst Intern. Processed large-scale datasets and streamlined data workflows, increasing team productivity by 25%.'
        }
      ]
    },

    philosophy: {
      id: 'about-philosophy',
      quote: 'Build things that work, then make them work beautifully.',
      label: 'Engineering Philosophy'
    },

    connectCTA: {
      id: 'about-connect-cta',
      heading: 'Let\'s Connect',
      description: 'I\'m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.',
      ctaButton: {
        label: 'Get in Touch',
        url: '/contact'
      }
    }
  },

  contactPage: {
    hero: {
      id: 'contact-hero',
      label: 'Get in Touch',
      headingLines: [
        'Let\'s Create',
        'Something Amazing',
        'Together'
      ],
      description: 'Whether you have a project in mind or just want to chat about design and development, I\'d love to hear from you.'
    },

    form: {
      id: 'contact-form',
      title: 'Send Me a Message',
      fields: [
        {
          id: 'field-name',
          name: 'name',
          label: 'Your Name',
          type: 'text',
          placeholder: 'John Doe',
          required: true
        },
        {
          id: 'field-email',
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'john@example.com',
          required: true
        },
        {
          id: 'field-subject',
          name: 'subject',
          label: 'Subject',
          type: 'text',
          placeholder: 'Project Inquiry',
          required: true
        },
        {
          id: 'field-message',
          name: 'message',
          label: 'Message',
          type: 'textarea',
          placeholder: 'Tell me about your project...',
          required: true,
          maxLength: 500
        }
      ],
      submitButton: {
        label: 'Send Message',
        loadingLabel: 'Sending...'
      },
      messages: {
        success: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon.',
        error: 'Oops! Something went wrong. Please try again or email me directly.'
      }
    },

    contactInfo: {
      cards: [
        {
          id: 'info-email',
          icon: 'ri-mail-line',
          label: 'Email',
          value: 'jrgeorge991@gmail.com',
          link: 'mailto:jrgeorge991@gmail.com'
        },
        {
          id: 'info-phone',
          icon: 'ri-phone-line',
          label: 'Phone',
          value: '+233 50-005-2067',
          link: 'tel:+233500052067'
        },
        {
          id: 'info-location',
          icon: 'ri-map-pin-line',
          label: 'Location',
          value: 'Accra, Ghana',
          link: null
        }
      ],
      socialLinks: [
        { id: 'contact-social-linkedin', platform: 'LinkedIn', url: 'https://linkedin.com/in/george-jrr', icon: 'ri-linkedin-line' },
        { id: 'contact-social-github', platform: 'GitHub', url: 'https://github.com/oti-adjei', icon: 'ri-github-line' }
      ],
      availability: {
        status: 'available',
        label: 'Available for Projects'
      }
    },

    map: {
      id: 'contact-map',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127595.75486082!2d-0.2696416!3d5.6036999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sAccra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1234567890',
      title: 'Accra, Ghana'
    }
  },

  worksPage: {
    id: 'works-page',
    title: 'My Work',
    subtitle: 'A collection of projects I\'ve designed and developed',
    categories: ['ALL', 'WEB', 'MOBILE', 'DESKTOP', 'SAAS', 'CLI', 'BACKEND']
  },

  projects: [{
  id: 1,
  title: "Senvon Studio",
  category: 'WEB',
  year: '2026',
  tags: ['React', 'TailwindCSS', 'Cloudflare Pages', 'Portfolio'],
  links: [{ label: 'Live Site', url: 'https://senvon.studio' }],
  thumbnail: { url: '/assets/images/senvon/portfolio-home.png', alt: "Senvon Studio" },
  overview: {
    description: "The official website of Senvon Studio — my own digital agency platform, designed to showcase our design and development services, client projects, and studio ethos.",
    client: "Senvon Studio (self‑initiated)",
    duration: '2025 – 2026',
    role: 'Founder & Frontend Developer',
  },
  details: {
    challenge: 'I needed a website that not only served as a portfolio but also clearly communicated the studio’s services, values, and past projects. It had to be modern, flexible, and scalable for showcasing client work.',
    solution: 'Built from scratch using React and TailwindCSS, deployed on Cloudflare Pages for speed and zero hosting costs. The site includes service breakdowns, a portfolio gallery for past client work, team highlights (myself + collaborators), client testimonials, and an enquiry/contact form. Designed to be fully responsive and accessible on all devices.',
    results: [
      'Launched in early 2026 as the public face of the studio',
      'Serves as the primary platform to attract new clients',
      'Showcases portfolio work in a clear, professional format',
      'Fully responsive, accessible, and low-cost hosting via Cloudflare Pages',
      'Flexible structure allows continuous updates for new projects',
    ],
  },
  gallery: {
    images: [
      { url: '/assets/images/senvon/portfolio-home.png', caption: 'Homepage overview highlighting studio brand and services' },
      { url: '/assets/images/senvon/portfolio-home.png', caption: 'Portfolio section showing past client projects' },
      { url: '/assets/images/senvon/portfolio-home.png', caption: 'Contact and enquiry section for new client leads' },
    ],
  },
},
    {
  id: 2,
  title: "Royal Park Hotel Kumasi",
  category: 'WEB',
  year: '2025',
  tags: ['React', 'TailwindCSS', 'Cloudflare Pages'],
  links: [{ label: 'Live Site', url: 'https://royalpark-web.pages.dev' }],
  thumbnail: { url: '/assets/images/royalpark/rp-about.png', alt: "Royal Park Hotel Kumasi" },
  overview: {
    description: "A modern website for Royal Park Hotel Kumasi, showcasing hotel rooms, dining options, and booking features for guests.",
    client: "Royal Park Hotel",
    duration: '2024 – 2025',
    role: 'Frontend Developer',
  },
  details: {
    challenge: 'The hotel had minimal online presence, limiting bookings and visibility for potential guests.',
    solution: 'Designed and developed a responsive React website using TailwindCSS, deployed on Cloudflare Pages. Includes room listings, restaurant details, reservation forms, and customer testimonials.',
    results: [
      'Website launched in 2025, increasing online bookings',
      'Improved mobile and desktop user experience',
      'Cost-effective hosting via Cloudflare Pages',
      'Professional showcase of rooms, dining, and amenities',
    ],
  },
  gallery: {
    images: [
      { url: '/assets/images/royalpark/rp-about.png', caption: 'Homepage Overview' },
      { url: '/assets/images/royalpark/rp-rooms.png', caption: 'Rooms & Amenities' },
      { url: '/assets/images/royalpark/rp-dining.png', caption: 'Restaurant & Booking Form' },
    ],
  },
},
    {
  id: 3,
  title: "Lobab Kids Academy",
  category: 'WEB',
  year: '2025',
  tags: ['React', 'TailwindCSS', 'Cloudflare Pages'],
  links: [{ label: 'Live Site', url: 'https://lobabkids-web.pages.dev' }],
  thumbnail: { url: '/assets/images/lobab/lobab-home.png', alt: "Lobab Kids Academy" },
  overview: {
    description: "An interactive website for Lobab Kids Academy, highlighting programs, activities, and parent resources for early childhood education.",
    client: "Lobab Kids Academy",
    duration: '2024 – 2025',
    role: 'Frontend Developer',
  },
  details: {
    challenge: 'The academy lacked an online presence, making it difficult for parents to access program details or contact the school.',
    solution: 'Built a responsive React website with TailwindCSS and deployed on Cloudflare Pages. Features include program overviews, photo galleries, enrolment forms, and testimonials.',
    results: [
      'Website fully launched in 2025',
      'Improved parent engagement and enquiries',
      'Accessible on all devices with zero hosting cost',
      'Clear presentation of programs and events',
    ],
  },
  gallery: {
    images: [
      { url: '/assets/images/lobab/lobab-home.png', caption: 'Homepage Overview' },
      { url: '/assets/images/lobab/lobab-programs.png', caption: 'Programs Section' },
      { url: '/assets/images/lobab/lobab-events.png', caption: 'Contact & Enrolment Form' },
    ],
  },
},
  {
    id: 4,
    title: 'Home Sweet Home',
    category: 'SAAS',
    year: '2025',
    tags: ['Golang', 'Hono', 'React', 'PostgreSQL'],
    links: [],
    thumbnail: { url: '/assets/images/projects/home-sweet-home.png', alt: 'Home Sweet Home' },
    overview: {
      description: 'A property management SaaS for landlords and property managers to track tenants, leases, payments, and maintenance requests — all in one place.',
      client: 'Senvon Studio (personal venture)',
      duration: 'Dec 2025 – Present',
      role: 'Founder & Engineer',
    },
    details: {
      challenge: 'Landlords in Ghana manage properties through WhatsApp, Excel sheets, and paper records — leading to missed payments, unresolved maintenance issues, and no audit trail.',
      solution: 'Building a multi-tenant SaaS with a Golang/Hono backend, React frontend, and PostgreSQL. Features include tenant onboarding, automated rent reminders, maintenance ticket tracking, and financial reporting dashboards.',
      results: [
        'MVP in private beta',
        'Sub-50ms API response times with Golang backend',
        'Multi-tenant architecture with isolated landlord accounts',
        'Automated rent reminder system via email/SMS',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/projects/home-sweet-home.png', caption: 'Dashboard' },
        { url: '/assets/images/projects/home-sweet-home.png', caption: 'Tenant Management' },
        { url: '/assets/images/projects/home-sweet-home.png', caption: 'Financials Overview' },
      ],
    },
  },
  {
    id: 9,
    title: 'Nagyique Boutique',
    category: 'WEB',
    year: '2024',
    tags: ['Astro', 'React', 'Stripe', 'Sanity', 'Cloudflare'],
    links: [{ label: 'Live Site', url: 'https://nagyeboutique.ca' }],
    thumbnail: { url: '/assets/images/projects/nagyique.jpg', alt: 'Nagyique Boutique' },
    overview: {
      description: 'A fashion e-commerce storefront with a Sanity CMS product catalogue, Stripe checkout, and edge-deployed Astro frontend. Started March 2024, still in active development.',
      client: 'Nagyique Boutique',
      duration: 'Mar 2024 – Present',
      role: 'Full Stack Developer',
    },
    details: {
      challenge: 'The boutique was managing orders via Instagram DMs with no product catalogue or checkout flow. They needed a store their team could manage without technical knowledge.',
      solution: 'Built an Astro + React storefront on Cloudflare Pages with Sanity as the headless CMS for product management. Stripe handles checkout. The Astro architecture delivers near-instant page loads.',
      results: [
        'Owner manages inventory via Sanity Studio — no coding needed',
        'Lighthouse performance score: 98',
        'Stripe integration handling live transactions',
        'Ongoing: final features being completed',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/projects/nagyique.jpg', caption: 'Storefront' },
        { url: '/assets/images/projects/nagyique.jpg', caption: 'Product Detail' },
        { url: '/assets/images/projects/nagyique.jpg', caption: 'Checkout Flow' },
      ],
    },
  },
  {
    id: 10,
    title: 'Dear Akua',
    category: 'WEB',
    year: '2023',
    tags: ['Node.js', 'Express', 'MongoDB'],
    links: [{ label: 'Live Site', url: 'https://dear-akua-web.pages.dev' }],
    thumbnail: { url: '/assets/images/dear-akua/landing-page.png', alt: 'Dear Akua' },
    overview: {
      description: 'An anonymous web-based platform where users can write and share confessions, designed to foster a safe and non-judgmental community space.',
      client: 'Personal Project',
      duration: '2023',
      role: 'Full-stack Developer',
    },
    details: {
      challenge: 'Ensuring complete user anonymity while preventing abuse, and creating an interface simple enough that anyone could submit without friction.',
      solution: 'Built with Node.js, Express, and EJS for server-side rendering, backed by MongoDB. Anonymous submissions require no account. Deployed on Railway with content moderation hooks to flag problematic entries.',
      results: [
        'Fully anonymous — no account or email required',
        'Public confession feed with responsive design',
        'Content moderation features to maintain a safe space',
        'Live at dear-akua-production.up.railway.app',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/dear-akua/landing-page.png', caption: 'Landing Page' },
        { url: '/assets/images/dear-akua/submit-form.png', caption: 'Submission Form' },
        { url: '/assets/images/dear-akua/confessions-feed.png', caption: 'Confessions Feed' },
      ],
    },
  },
  {
    id: 7,
    title: "Mummy's Darl",
    category: 'WEB',
    year: '2025',
    tags: ['React', 'TailwindCSS', 'Cloudflare Pages'],
    links: [{ label: 'Live Site', url: 'https://mummysdarl-web.pages.dev' }],
    thumbnail: { url: '/assets/images/mummysdarl/md-home.png', alt: "Mummy's Darl" },
    overview: {
      description: "An educational platform for Mummy's Darl, a childcare and early learning centre — providing curriculum info, gallery, and online enrolment for parents.",
      client: "Mummy's Darl",
      duration: '2024 – 2025',
      role: 'Frontend Developer',
    },
    details: {
      challenge: 'The childcare centre relied entirely on word-of-mouth referrals with no web presence. Parents had no easy way to learn about the curriculum, pricing, or how to enrol.',
      solution: 'Started in 2024 and fully revamped and launched in 2025 — a React website with TailwindCSS deployed on Cloudflare Pages. Includes curriculum overview, photo gallery, testimonials, and an enquiry form.',
      results: [
        'Revamped and launched 2025',
        'Enrolment enquiries increased immediately post-launch',
        'Zero hosting cost via Cloudflare Pages',
        'Fully accessible and mobile-optimised',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/mummysdarl/md-home.png', caption: 'Platform Overview' },
        { url: '/assets/images/mummysdarl/md-programs.png', caption: 'Curriculum Section' },
        { url: '/assets/images/mummysdarl/md-admissions.png', caption: 'Contact & Enrolment' },
      ],
    },
  },
  {
    id: 8,
    title: 'FlexDown',
    category: 'SAAS',
    year: '2023',
    tags: ['React Native', 'Node.js', 'PostgreSQL'],
    links: [{ label: 'Live Site', url: 'https://flexdown.com' }],
    thumbnail: { url: '/assets/images/flexdown/flexdown.png', alt: 'FlexDown' },
    overview: {
      description: "A real estate mobile app for browsing, filtering, and enquiring about property listings across Ghana — started in 2023, actively revamped in 2025 as a friend's startup.",
      client: 'FlexDown',
      duration: '2023 – Present',
      role: 'Mobile Developer',
    },
    details: {
      challenge: 'Finding reliable rental and property listings in Ghana was fragmented across unverified social media posts and outdated classifieds, with no standardised filtering or contact flow.',
      solution: 'Built a React Native Expo app backed by a Node.js REST API and PostgreSQL. Features include location-based search, advanced filters, image galleries per listing, and in-app enquiry forms.',
      results: [
        'Launched with 200+ verified property listings',
        'Integrated Google Maps for neighbourhood exploration',
        'Advanced filter system for price, bedrooms, and area',
        'Actively revamped and extended in 2025',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/flexdown/flexdown_landing.png', caption: 'Landing & Search' },
        { url: '/assets/images/flexdown/flexdown.png', caption: 'Property Feed' },
        { url: '/assets/images/flexdown/flexdown_listing.png', caption: 'Listing Detail' },
      ],
    },
  },
  {
    id: 5,
    title: 'PriPri',
    category: 'DESKTOP',
    year: '2025',
    tags: ['Wails', 'Go', 'React', 'TailwindCSS'],
    links: [],
    thumbnail: { url: '/assets/images/projects/pripri.png', alt: 'PriPri App Locker' },
    overview: {
      description: 'A cross-platform desktop app locker built with Wails (Go + React). PriPri monitors running applications and displays a password prompt before allowing locked apps to open — ensuring privacy and focus.',
      client: 'Senvon Studio (personal venture)',
      duration: 'Aug 2025 – Present',
      role: 'Founder & Engineer',
    },
    details: {
      challenge: 'macOS and Windows lack a native, lightweight way to password-protect specific applications — useful for shared computers or enforcing focus by locking distracting apps.',
      solution: 'Built with Wails, combining a Go backend for OS-level process monitoring with a React + TailwindCSS frontend that feels native on both macOS and Windows. Users manage a lock list from a dashboard and can toggle PriPri globally.',
      results: [
        'Cross-platform: macOS and Windows support',
        'Native-feeling UI with retro-theme roadmap',
        'Process monitoring with sub-second response to app launch',
        'Temporary unlock and global on/off toggle',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/projects/pripri.png', caption: 'Dashboard & Lock List' },
        { url: '/assets/images/projects/pripri.png', caption: 'Password Prompt Overlay' },
        { url: '/assets/images/projects/pripri.png', caption: 'Settings & App Management' },
      ],
    },
  },
  {
    id: 6,
    title: 'Scribble Notes',
    category: 'MOBILE',
    year: '2025',
    tags: ['Flutter', 'Provider', 'SharedPreferences'],
    links: [],
    thumbnail: { url: '/assets/images/projects/scribble-notes.png', alt: 'Scribble Notes' },
    overview: {
      description: 'A lightweight mobile notes app with local data persistence and dynamic search — built to be fast and distraction-free.',
      client: 'Personal Project',
      duration: '2025 – Present',
      role: 'Mobile Developer',
    },
    details: {
      challenge: 'Most notes apps are bloated with features users never need. The goal was a minimal, snappy note-taking experience with offline-first storage and instant search.',
      solution: 'Built with Flutter and Provider for state management. Uses SharedPreferences for local data persistence — no backend required. Notes are searchable by title in real time.',
      results: [
        'Fully offline — no account or internet required',
        'Instant note search by title',
        'Lightweight build with minimal dependencies',
        'Ongoing: additional features in development',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/projects/scribble-notes.png', caption: 'Notes List' },
        { url: '/assets/images/projects/scribble-notes.png', caption: 'Note Editor' },
        { url: '/assets/images/projects/scribble-notes.png', caption: 'Search Results' },
      ],
    },
  },
  {
    id: 11,
    title: 'Envoyer GH',
    category: 'WEB',
    year: '2024',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'TailwindCSS'],
    links: [{ label: 'Live Site', url: 'https://envoyergh.com' }],
    thumbnail: { url: '/assets/images/envoyer/envoyerGH.png', alt: 'Envoyer GH' },
    overview: {
      description: 'A digital freight network connecting shippers, business owners, and individuals with carriers for road transport across Ghana — including bus hiring and towing services.',
      client: 'Envoyer GH',
      duration: 'June – Sept 2024',
      role: 'Lead Frontend & Backend Engineer',
    },
    details: {
      challenge: "Ghana's logistics sector lacked a reliable digital platform for connecting freight clients with available drivers. Manual coordination led to delays, poor visibility, and high operational costs.",
      solution: 'Built a full-stack platform with Express/PostgreSQL backend and TailwindCSS frontend. Implemented user roles, OTP verification, KYC verification, image upload, booking portal, and real-time notifications via Server-Sent Events.',
      results: [
        'Live at envoyergh.com',
        'Supports shipper, driver, and admin user roles',
        'Real-time notification system via SSE',
        'OTP + KYC verification for secure onboarding',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/envoyer/envoyerGH.png', caption: 'Platform Overview' },
        { url: '/assets/images/envoyer/envoyer_contact.png', caption: 'Contact & Booking Flow' },
        { url: '/assets/images/envoyer/envoyer_login.png', caption: 'Login & Registration' },
      ],
    },
  },
  {
    id: 12,
    title: 'Purple Pay',
    category: 'MOBILE',
    year: '2024',
    tags: ['Flutter', 'Express', 'PostgreSQL', 'Stripe'],
    links: [{ label: 'Live Site', url: 'https://purplepay.app' }],
    thumbnail: { url: '/assets/images/projects/purple-pay.jpg', alt: 'Purple Pay' },
    overview: {
      description: 'A fintech mobile application enabling peer-to-peer payments, wallet management, and card top-ups — built during tenure at Enyata Ghana.',
      client: 'Enyata Ghana',
      duration: 'Feb – Aug 2024',
      role: 'Mobile Engineer',
    },
    details: {
      challenge: 'Mobile money solutions in Ghana are fragmented across multiple providers with poor UX. Users needed a unified wallet with a clean interface for P2P transfers and card payments.',
      solution: 'Built a Flutter app with Riverpod state management and an Express/PostgreSQL backend. Integrated Stripe for card processing and biometric authentication for enhanced security.',
      results: [
        'Beta launched with 500+ early adopters',
        'Average transaction time under 3 seconds',
        'PCI-DSS compliant payment flow via Stripe',
        'Biometric auth adopted by 80% of users',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/projects/purple-pay.jpg', caption: 'Wallet Dashboard' },
        { url: '/assets/images/projects/purple-pay.jpg', caption: 'Transfer Flow' },
        { url: '/assets/images/projects/purple-pay.jpg', caption: 'Transaction History' },
      ],
    },
  },
  
  {
    id: 13,
    title: 'Pokebook',
    category: 'MOBILE',
    year: '2023',
    tags: ['Flutter', 'Provider', 'PokéAPI'],
    links: [],
    thumbnail: { url: '/assets/images/projects/pokebook.jpg', alt: 'Pokebook' },
    overview: {
      description: 'A Flutter mobile app consuming the PokéAPI to browse Pokémon, view detailed stats, and discover similar species — built as a deep-dive into state management and API integration.',
      client: 'Personal Project',
      duration: 'Late 2023',
      role: 'Mobile Developer',
    },
    details: {
      challenge: 'A focused learning project to master Flutter state management with Provider, REST API consumption, and building a polished search-driven UI.',
      solution: 'Consumes the PokéAPI for all Pokémon data. Features a live search bar, detailed stat pages with type badges and base stat visualisers, and a similar Pokémon recommendation section.',
      results: [
        'Fully functional PokéAPI integration',
        'Dynamic search with instant filter results',
        'Detailed stat view with type badges',
        'Solid foundation for Flutter/Provider patterns',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/projects/pokebook.jpg', caption: 'Pokémon Browser' },
        { url: '/assets/images/projects/pokebook.jpg', caption: 'Search & Filter' },
        { url: '/assets/images/projects/pokebook.jpg', caption: 'Detail & Stats View' },
      ],
    },
  },
  {
    id: 14,
    title: 'Gullivers Travel Hotel',
    category: 'WEB',
    year: '2022',
    tags: ['React', 'Node.js', 'TailwindCSS'],
    links: [{ label: 'Live Site', url: 'https://gulliverstravelhotelgh.com' }],
    thumbnail: { url: '/assets/images/gullivers/gullivers_rooms.png', alt: 'Gullivers Travel Hotel' },
    overview: {
      description: 'A professional hotel website for Gullivers Travel Hotel featuring room showcase, restaurant gallery, lounge section, and booking enquiries.',
      client: 'Gullivers Travel Hotel',
      duration: '2 months',
      role: 'Frontend Developer',
    },
    details: {
      challenge: 'The hotel had no digital presence and was losing potential guests to competitors with modern booking websites. They needed a fast, attractive site to showcase rooms and take enquiries.',
      solution: 'Designed and built a React website with smooth animations, image galleries for rooms, restaurant, and lounge, and a contact/booking enquiry form backed by a Node.js mailer service.',
      results: [
        '60% increase in direct booking enquiries post-launch',
        'Fully responsive across mobile and desktop',
        'Image-rich showcase for rooms, restaurant, and lounge',
        'Positive client feedback on delivery speed',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/gullivers/gullivers_rooms.png', caption: 'Rooms & Suites' },
        { url: '/assets/images/gullivers/gullivers_restaurant.png', caption: 'Restaurant' },
        { url: '/assets/images/gullivers/gullivers_lounge.png', caption: 'Lounge' },
      ],
    },
  },
  {
    id: 15,
    title: 'GESA KNUST',
    category: 'MOBILE',
    year: '2022',
    tags: ['Flutter', 'Firebase', 'Node.js'],
    links: [],
    thumbnail: { url: '/assets/images/gesa/gesa.png', alt: 'GESA KNUST' },
    overview: {
      description: 'Mobile app for the Ghana Engineering Students Association at KNUST, centralising events, course materials, and member communications.',
      client: 'GESA KNUST',
      duration: '4 months',
      role: 'Mobile Developer',
    },
    details: {
      challenge: 'The association managed events and resources through scattered WhatsApp groups and emails, making it hard for students to stay informed or access materials quickly.',
      solution: 'Developed a Flutter app with Firebase for real-time notifications and content delivery. Features an events calendar, course material repository, announcements, and member directory.',
      results: [
        'Adopted by 500+ engineering students',
        'Centralised 3 years of course materials',
        'Real-time event and announcement notifications',
        'Published on Google Play Store',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/gesa/gesa.png', caption: 'Home Dashboard' },
        { url: '/assets/images/gesa/gesa_course_material.png', caption: 'Course Materials' },
        { url: '/assets/images/gesa/gesa_events.png', caption: 'Events Calendar' },
      ],
    },
  },
  {
    id: 16,
    title: 'Pro-Vid',
    category: 'MOBILE',
    year: '2021',
    tags: ['Flutter', 'Dart', 'REST API'],
    links: [],
    thumbnail: { url: '/assets/images/projects/provid.png', alt: 'Pro-Vid COVID Tracker' },
    overview: {
      description: 'A COVID-19 tracking app providing real-time global and local case updates, curated news, and self-assessment health quizzes — designed to combat pandemic misinformation.',
      client: 'Personal Project',
      duration: 'Aug 2021',
      role: 'Mobile Developer',
    },
    details: {
      challenge: 'During the pandemic, misinformation spread rapidly. People needed a single trustworthy source for case data, verified news, and simple self-assessment tools accessible on mobile.',
      solution: 'Built in Flutter/Dart, consuming a COVID-19 REST API for live case statistics. Features curated news sources, an interactive self-assessment quiz, and community awareness content.',
      results: [
        'Real-time global and local case data',
        'Curated, verified news sources only',
        'Interactive self-assessment health quiz',
        'Shareable awareness content for community use',
      ],
    },
    gallery: {
      images: [
        { url: '/assets/images/projects/provid.png', caption: 'Case Statistics Dashboard' },
        { url: '/assets/images/projects/provid-2.jpg', caption: 'News & Updates Feed' },
        { url: '/assets/images/projects/provid.png', caption: 'Self-Assessment Quiz' },
      ],
    },
  },
  
],

  streamsPage: {
    id: 'streams-page',
    title: 'Stream Schedule',
    subtitle: 'Catch me live on Twitch and TikTok — coding, building, and talking tech.',
    twitchUsername: 'georgie_dev',
    tiktokUsername: '@georgie_dev',
  },

  streamEvents: [
    {
      id: 'stream-1',
      title: 'Building a REST API from scratch',
      date: '2026-02-24',
      time: '20:00 GMT',
      platform: 'twitch' as const,
      streamUrl: 'https://twitch.tv/georgie_dev',
      description: 'Full Golang + Hono REST API build — auth, DB, deployment.',
      isRecurring: true,
      recurringDay: 2,
    },
    {
      id: 'stream-2',
      title: 'Flutter UI Deep Dive',
      date: '2026-02-26',
      time: '21:00 GMT',
      platform: 'tiktok' as const,
      streamUrl: 'https://tiktok.com/@georgie_dev',
      description: 'Building a real estate listing screen — animations, state, custom widgets.',
      isRecurring: true,
      recurringDay: 4,
    },
    {
      id: 'stream-3',
      title: 'Q&A + Code Review',
      date: '2026-03-03',
      time: '20:00 GMT',
      platform: 'twitch' as const,
      streamUrl: 'https://twitch.tv/georgie_dev',
      description: 'Open session — bring your code, bring your questions.',
      isRecurring: false,
    },
    {
      id: 'stream-4',
      title: 'SaaS Dashboard Build',
      date: '2026-03-06',
      time: '21:00 GMT',
      platform: 'tiktok' as const,
      streamUrl: 'https://tiktok.com/@georgie_dev',
      description: 'Building a multi-tenant SaaS dashboard with React and Tailwind.',
      isRecurring: false,
    },
  ],

  blogPosts: [
    {
      id: 'post-1',
      title: 'Why I switched from Flutter to React Native (and back)',
      slug: 'flutter-vs-react-native',
      date: '2026-01-20',
      excerpt: 'After two years of going back and forth, here is what I actually think about both ecosystems.',
      content: `After two years working professionally in both Flutter and React Native, I have strong opinions.\n\nFlutter wins on UI consistency. Your app looks exactly the same on Android and iOS, every time. The widget tree is verbose but predictable, and once you understand how StatefulWidget and Provider interact, things click fast.\n\nReact Native wins on ecosystem. If you already know React, the mental model transfers well. The JS bridge has improved dramatically since the new architecture landed, and libraries like Expo make shipping surprisingly fast.\n\nFor client work where polish matters most, I reach for Flutter. For solo projects where I want to move fast and leverage web tooling, React Native.\n\nNeither is better. They are different tools.`,
      tags: ['Flutter', 'React Native', 'Mobile'],
      published: true,
    },
    {
      id: 'post-2',
      title: 'Mutex in JavaScript — you probably need one',
      slug: 'mutex-in-javascript',
      date: '2025-11-10',
      excerpt: 'JavaScript is single-threaded, so why would you ever need a mutex? More situations than you think.',
      externalUrl: 'https://dev.to/georgie',
      tags: ['JavaScript', 'Concurrency'],
      published: true,
    },
    {
      id: 'post-3',
      title: 'Server-Sent Events vs WebSockets — when to use which',
      slug: 'sse-vs-websockets',
      date: '2025-09-04',
      excerpt: 'SSE is underrated for one-way real-time data. Here is a clear breakdown of when each makes sense.',
      externalUrl: 'https://dev.to/georgie',
      tags: ['Backend', 'Real-time'],
      published: true,
    },
    {
      id: 'post-4',
      title: 'Building Envoyer — lessons from a six-month freelance project',
      slug: 'envoyer-lessons',
      date: '2025-07-18',
      excerpt: 'What I learned leading frontend and backend development for a logistics startup over six months.',
      content: `Six months is a long time to spend on a single freelance project, especially when you are still learning as you go.\n\nEnvoyer is a digital freight network in Ghana. My role covered frontend, backend, user roles, OTP verification, KYC flows, image uploads, and a notification system using Server-Sent Events.\n\nThe biggest lesson: scope creep will happen. Budget for it. The second lesson: SSE is genuinely underrated for notification systems where you do not need two-way communication. The third: PostgreSQL with proper indexing is fast enough for almost anything at the scale startups operate at.\n\nThe project launched. Real users. Real freight moving. That part felt good.`,
      tags: ['Freelance', 'Backend', 'Ghana'],
      published: true,
    },
    {
      id: 'post-5',
      title: 'Golang in 2025 — is it worth learning as your second backend language?',
      slug: 'golang-2025',
      date: '2025-05-02',
      excerpt: 'I picked up Go for the Home Sweet Home project. Here is an honest take on the experience.',
      content: `I already knew Node.js and Python when I started learning Go for Home Sweet Home.\n\nFirst impressions: the toolchain is excellent. go fmt, go test, go build — everything just works. The standard library covers most needs without reaching for external packages.\n\nThe type system is simple but not simple in a bad way. Interfaces are implicit, which feels strange at first but becomes elegant quickly.\n\nWhere Go struggled for me: error handling. Returning (value, error) from every function works, but it is verbose. Rust has a better story here with the ? operator.\n\nWould I recommend it as a second backend language? Yes, especially if you work on APIs or infrastructure tooling. The performance-to-simplicity ratio is hard to beat.`,
      tags: ['Golang', 'Backend'],
      published: true,
    },
  ],

  notes: [
    {
      id: 'note-1',
      title: 'PostgreSQL — indexing fundamentals',
      slug: 'postgres-indexing',
      date: '2026-01-15',
      content: `## What is an index?\n\nAn index is a separate data structure that lets PostgreSQL find rows without scanning the entire table.\n\n## B-Tree (default)\n\nGood for equality and range queries. Created automatically for PRIMARY KEY and UNIQUE constraints.\n\n\`CREATE INDEX idx_users_email ON users(email);\`\n\n## When NOT to index\n\n- Small tables (full scan is faster)\n- Columns with very low cardinality (e.g. boolean flags)\n- Columns that are written to very frequently (indexes slow writes)\n\n## EXPLAIN ANALYZE\n\nAlways check your query plan before and after adding an index:\n\n\`EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;\`\n\nLook for "Index Scan" vs "Seq Scan" in the output.`,
      category: 'Database',
      published: true,
    },
    {
      id: 'note-2',
      title: 'Flutter — Provider vs Riverpod',
      slug: 'flutter-provider-vs-riverpod',
      date: '2025-12-08',
      content: `## Provider\n\nThe OG Flutter state management package. Works well for small-medium apps.\n\nPros: simple, widely documented, lots of Stack Overflow answers.\nCons: requires context, harder to use outside the widget tree.\n\n## Riverpod\n\nThe successor from the same author. Fixes Provider's core limitations.\n\nPros: compile-safe, no context required, testable out of the box.\nCons: steeper learning curve, more boilerplate for simple cases.\n\n## My take\n\nFor new projects: Riverpod. For existing Provider codebases: only migrate if there is a clear pain point.`,
      category: 'Flutter',
      published: true,
    },
    {
      id: 'note-3',
      title: 'HTTP methods — a practical reference',
      slug: 'http-methods-reference',
      date: '2025-10-20',
      content: `## GET\nRead a resource. No body. Idempotent.\n\n## POST\nCreate a resource (or trigger an action). Has a body. NOT idempotent.\n\n## PUT\nReplace a resource entirely. Idempotent.\n\n## PATCH\nPartially update a resource. NOT strictly idempotent.\n\n## DELETE\nRemove a resource. Idempotent.\n\n## HEAD\nLike GET but returns only headers. Useful for checking if a resource exists.\n\n## Idempotency matters\nCalling the same PUT or DELETE request ten times should produce the same result as calling it once. Callers can safely retry on network failure.`,
      category: 'Backend',
      published: true,
    },
    {
      id: 'note-4',
      title: 'Git — commands I always forget',
      slug: 'git-commands',
      date: '2025-08-12',
      content: `## Undo last commit but keep changes staged\n\`git reset --soft HEAD~1\`\n\n## Undo last commit and unstage changes\n\`git reset HEAD~1\`\n\n## Stash only untracked files\n\`git stash -u\`\n\n## Show which commit introduced a bug\n\`git bisect start\`\n\`git bisect bad\`\n\`git bisect good <commit-hash>\`\n\n## Squash last N commits\n\`git rebase -i HEAD~N\`\nMark all but the first as "squash".\n\n## Cherry-pick a single commit\n\`git cherry-pick <commit-hash>\``,
      category: 'Tools',
      published: true,
    },
  ],
};
