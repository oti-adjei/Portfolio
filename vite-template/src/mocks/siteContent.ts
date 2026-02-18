import type { SiteContent } from '../types/siteContent';

export const siteContent: SiteContent = {
  navigation: {
    id: 'nav-main',
    logo: {
      text: 'Ava Chen',
      url: '/'
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
      text: 'Ava Chen',
      url: '/'
    },
    copyright: '© 2024 Ava Chen. All rights reserved.',
    links: [
      { id: 'footer-link-1', label: 'Privacy Policy', url: '/privacy' },
      { id: 'footer-link-2', label: 'Terms of Service', url: '/terms' },
      { id: 'footer-link-3', label: 'Powered by Readdy', url: 'https://readdy.ai/?ref=logo' }
    ]
  },

  homePage: {
    hero: {
      id: 'home-hero',
      badge: 'Product Designer & Developer',
      heading: 'Crafting Digital Experiences That Matter',
      subtitle: 'I transform complex problems into elegant, user-centered solutions through thoughtful design and clean code.',
      ctaButton: {
        label: 'View My Work',
        url: '/works'
      },
      secondaryButton: {
        label: 'Get in Touch',
        url: '/contact'
      },
      image: {
        url: 'https://readdy.ai/api/search-image?query=professional%20female%20designer%20working%20on%20modern%20laptop%20in%20minimalist%20bright%20workspace%20with%20plants%20and%20natural%20light%2C%20clean%20aesthetic%2C%20creative%20professional%20environment%2C%20contemporary%20office%20setup%2C%20focused%20and%20productive%20atmosphere&width=800&height=1000&seq=hero-main&orientation=portrait',
        alt: 'Ava Chen - Product Designer & Developer'
      },
      socialIcons: [
        { id: 'social-twitter', platform: 'twitter', url: 'https://twitter.com', icon: 'ri-twitter-x-line' },
        { id: 'social-linkedin', platform: 'linkedin', url: 'https://linkedin.com', icon: 'ri-linkedin-line' },
        { id: 'social-github', platform: 'github', url: 'https://github.com', icon: 'ri-github-line' },
        { id: 'social-dribbble', platform: 'dribbble', url: 'https://dribbble.com', icon: 'ri-dribbble-line' }
      ]
    },

    about: {
      id: 'home-about',
      sectionTitle: 'About Me',
      name: 'Ava Chen',
      role: 'Product Designer & Full-Stack Developer',
      bio: [
        'With over 8 years of experience in digital product design and development, I specialize in creating seamless user experiences that bridge the gap between aesthetics and functionality.',
        'My approach combines user research, interaction design, and modern development practices to deliver products that users love and businesses value.',
        'I believe great design is invisible—it just works. My mission is to create digital experiences that feel natural, intuitive, and delightful.'
      ],
      tools: [
        { id: 'tool-figma', name: 'Figma', category: 'design' },
        { id: 'tool-sketch', name: 'Sketch', category: 'design' },
        { id: 'tool-react', name: 'React', category: 'development' },
        { id: 'tool-typescript', name: 'TypeScript', category: 'development' },
        { id: 'tool-nodejs', name: 'Node.js', category: 'development' },
        { id: 'tool-tailwind', name: 'Tailwind CSS', category: 'development' }
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
      projectIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
      displaySettings: {
        maxRows: 2,
        randomize: true
      }
    },

    services: {
      id: 'home-services',
      title: 'What I Do',
      subtitle: 'Comprehensive design and development services',
      items: [
        {
          id: 'service-ui-ux',
          icon: 'ri-pencil-ruler-2-line',
          title: 'UI/UX Design',
          description: 'Creating intuitive and beautiful user interfaces backed by thorough user research and testing.'
        },
        {
          id: 'service-web-dev',
          icon: 'ri-code-s-slash-line',
          title: 'Web Development',
          description: 'Building responsive, performant web applications using modern frameworks and best practices.'
        },
        {
          id: 'service-mobile',
          icon: 'ri-smartphone-line',
          title: 'Mobile Apps',
          description: 'Developing native and cross-platform mobile applications for iOS and Android.'
        },
        {
          id: 'service-design-systems',
          icon: 'ri-layout-grid-line',
          title: 'Design Systems',
          description: 'Establishing scalable design systems that ensure consistency across all touchpoints.'
        },
        {
          id: 'service-prototyping',
          icon: 'ri-magic-line',
          title: 'Prototyping',
          description: 'Creating interactive prototypes to validate ideas and gather feedback early in the process.'
        },
        {
          id: 'service-consulting',
          icon: 'ri-lightbulb-line',
          title: 'Consulting',
          description: 'Providing strategic guidance on product design, development, and user experience optimization.'
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
          value: '50+',
          label: 'Projects Completed',
          description: 'Successful launches across web, mobile, and desktop'
        },
        {
          id: 'stat-clients',
          value: '30+',
          label: 'Happy Clients',
          description: 'From startups to Fortune 500 companies'
        },
        {
          id: 'stat-experience',
          value: '8+',
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
        url: 'https://readdy.ai/api/search-image?query=professional%20portrait%20of%20confident%20female%20designer%20in%20modern%20minimalist%20setting%2C%20natural%20lighting%2C%20clean%20aesthetic%2C%20creative%20professional%20headshot%2C%20warm%20and%20approachable%20expression&width=400&height=400&seq=about-avatar&orientation=squarish',
        alt: 'Ava Chen'
      },
      name: 'Ava Chen',
      role: 'Product Designer & Developer',
      tagline: 'Bridging design and code to create meaningful digital experiences'
    },

    bio: {
      id: 'about-bio',
      paragraphs: [
        'I\'m a product designer and full-stack developer based in San Francisco, passionate about creating digital experiences that make a difference in people\'s lives.',
        'My journey began with a fascination for how things work and a desire to make them better. Over the past 8 years, I\'ve had the privilege of working with startups, agencies, and established companies to bring their visions to life.',
        'I believe the best products come from a deep understanding of user needs combined with technical excellence. That\'s why I wear both hats—designer and developer—allowing me to bridge the gap between vision and execution.',
        'When I\'m not designing or coding, you\'ll find me exploring new coffee shops, practicing yoga, or contributing to open-source projects. I\'m always learning, always growing, and always excited about the next challenge.'
      ]
    },

    expertise: {
      id: 'about-expertise',
      sectionTitle: 'Areas of Expertise',
      items: [
        {
          id: 'expertise-product',
          icon: 'ri-product-hunt-line',
          title: 'Product Design',
          description: 'End-to-end product design from research and ideation to high-fidelity prototypes and design systems.'
        },
        {
          id: 'expertise-frontend',
          icon: 'ri-code-box-line',
          title: 'Frontend Development',
          description: 'Building responsive, accessible web applications with React, TypeScript, and modern CSS frameworks.'
        },
        {
          id: 'expertise-mobile',
          icon: 'ri-smartphone-line',
          title: 'Mobile Development',
          description: 'Creating native and cross-platform mobile experiences with React Native and Flutter.'
        },
        {
          id: 'expertise-ux',
          icon: 'ri-user-heart-line',
          title: 'UX Research',
          description: 'Conducting user research, usability testing, and data analysis to inform design decisions.'
        }
      ]
    },

    journey: {
      id: 'about-journey',
      sectionTitle: 'My Journey',
      timeline: [
        {
          id: 'journey-2024',
          year: '2024',
          title: 'Senior Product Designer',
          company: 'TechCorp',
          description: 'Leading design initiatives for enterprise SaaS products, managing a team of 4 designers.'
        },
        {
          id: 'journey-2021',
          year: '2021',
          title: 'Product Designer & Developer',
          company: 'Freelance',
          description: 'Worked with various clients on web and mobile projects, from concept to launch.'
        },
        {
          id: 'journey-2019',
          year: '2019',
          title: 'UI/UX Designer',
          company: 'StartupXYZ',
          description: 'Designed and developed the company\'s flagship mobile app, growing to 100K+ users.'
        },
        {
          id: 'journey-2017',
          year: '2017',
          title: 'Junior Designer',
          company: 'Design Agency',
          description: 'Learned the fundamentals of user-centered design and agile development practices.'
        },
        {
          id: 'journey-2016',
          year: '2016',
          title: 'Started My Journey',
          company: 'Self-taught',
          description: 'Began learning design and development through online courses and personal projects.'
        }
      ]
    },

    philosophy: {
      id: 'about-philosophy',
      quote: 'Great design is invisible. It just works.',
      label: 'Design Philosophy'
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
          value: 'hello@avachen.com',
          link: 'mailto:hello@avachen.com'
        },
        {
          id: 'info-phone',
          icon: 'ri-phone-line',
          label: 'Phone',
          value: '+1 (555) 123-4567',
          link: 'tel:+15551234567'
        },
        {
          id: 'info-location',
          icon: 'ri-map-pin-line',
          label: 'Location',
          value: 'San Francisco, CA',
          link: null
        }
      ],
      socialLinks: [
        { id: 'contact-social-twitter', platform: 'Twitter', url: 'https://twitter.com', icon: 'ri-twitter-x-line' },
        { id: 'contact-social-linkedin', platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'ri-linkedin-line' },
        { id: 'contact-social-github', platform: 'GitHub', url: 'https://github.com', icon: 'ri-github-line' },
        { id: 'contact-social-dribbble', platform: 'Dribbble', url: 'https://dribbble.com', icon: 'ri-dribbble-line' }
      ],
      availability: {
        status: 'available',
        label: 'Available for Projects'
      }
    },

    map: {
      id: 'contact-map',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555098464!2d-122.507640345!3d37.757815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1234567890',
      title: 'San Francisco, CA'
    }
  },

  worksPage: {
    id: 'works-page',
    title: 'My Work',
    subtitle: 'A collection of projects I\'ve designed and developed',
    categories: ['ALL', 'WEB', 'MOBILE', 'DESKTOP']
  },

  projects: [
    {
      id: 1,
      title: 'Oyak Engineering Platform',
      category: 'WEB',
      year: '2024',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=modern%20engineering%20dashboard%20interface%20with%20clean%20white%20background%2C%20professional%20software%20application%20showing%20project%20management%20tools%2C%20data%20visualization%20charts%2C%20minimalist%20design%2C%20teal%20and%20dark%20accents%2C%20high%20quality%20UI%20screenshot&width=800&height=600&seq=work1&orientation=landscape',
        alt: 'Oyak Engineering Platform'
      },
      overview: {
        description: 'A comprehensive engineering management platform featuring advanced project tracking, resource allocation, and real-time collaboration tools for engineering teams.',
        client: 'Oyak Engineering',
        duration: '6 months',
        role: 'Lead UI/UX Designer & Frontend Developer'
      },
      details: {
        challenge: 'Oyak Engineering needed a comprehensive platform to manage complex engineering projects across multiple teams. The existing system was fragmented, leading to communication gaps and project delays. We needed to create a unified solution that could handle project tracking, resource allocation, and real-time collaboration while maintaining enterprise-level security.',
        solution: 'We developed a modular dashboard system with customizable widgets, real-time data synchronization, and role-based access controls. The platform features an intuitive drag-and-drop interface for project management, integrated communication tools, and advanced analytics for performance tracking. We implemented a microservices architecture to ensure scalability and reliability.',
        results: [
          '50% reduction in project delays',
          '35% improvement in team collaboration',
          '99.9% system uptime achieved',
          'Adopted by 500+ engineers'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=engineering%20project%20management%20dashboard%20with%20data%20visualization%20charts%2C%20clean%20modern%20interface%2C%20professional%20software%20application%2C%20white%20background%2C%20teal%20accents%2C%20showing%20project%20timeline%20and%20team%20allocation&width=1200&height=800&seq=oyak1&orientation=landscape',
            caption: 'Main Dashboard with Project Overview'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=team%20collaboration%20interface%20showing%20user%20avatars%20and%20chat%2C%20modern%20software%20design%2C%20clean%20white%20background%2C%20professional%20engineering%20platform%2C%20real-time%20communication%20features&width=800&height=600&seq=oyak2&orientation=landscape',
            caption: 'Team Collaboration Hub'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=analytics%20dashboard%20with%20performance%20metrics%20and%20graphs%2C%20engineering%20KPIs%2C%20clean%20modern%20design%2C%20professional%20data%20visualization%2C%20white%20background%20with%20teal%20accents&width=800&height=600&seq=oyak3&orientation=landscape',
            caption: 'Analytics & Reporting Module'
          }
        ]
      }
    },
    {
      id: 2,
      title: 'Orderio Travel Web Mobile',
      category: 'MOBILE',
      year: '2024',
      tags: ['React Native', 'Firebase', 'Stripe'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=mobile%20travel%20app%20interface%20mockup%20on%20smartphone%20screen%20with%20clean%20white%20background%2C%20showing%20booking%20features%20and%20destination%20cards%2C%20modern%20UI%20design%2C%20vibrant%20colors%2C%20professional%20product%20photography&width=600&height=800&seq=work2&orientation=portrait',
        alt: 'Orderio Travel Web Mobile'
      },
      overview: {
        description: 'Mobile-first travel booking application with seamless user experience, featuring destination discovery, itinerary planning, and integrated payment solutions.',
        client: 'Orderio Travel',
        duration: '4 months',
        role: 'Mobile App Designer & Developer'
      },
      details: {
        challenge: 'The travel industry demanded a mobile-first solution that could compete with established players. Users needed a seamless booking experience with personalized recommendations, real-time availability, and secure payment processing. The app had to work flawlessly across different network conditions and device types.',
        solution: 'We created a native mobile application with offline capabilities, smart caching, and progressive loading. The app features AI-powered destination recommendations, interactive itinerary planning, and a streamlined checkout process. We integrated multiple payment gateways and implemented biometric authentication for enhanced security.',
        results: [
          '4.8 star rating on app stores',
          '200K+ downloads in first quarter',
          '65% booking conversion rate',
          '30% repeat user engagement'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=travel%20booking%20mobile%20app%20interface%20showing%20destination%20cards%20and%20search%2C%20beautiful%20UI%20design%2C%20smartphone%20mockup%2C%20clean%20white%20background%2C%20vibrant%20travel%20photography&width=1200&height=800&seq=orderio1&orientation=landscape',
            caption: 'Destination Discovery Screen'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=mobile%20app%20itinerary%20planner%20interface%20with%20timeline%20and%20activities%2C%20travel%20app%20design%2C%20clean%20modern%20UI%2C%20smartphone%20screen%20mockup&width=800&height=600&seq=orderio2&orientation=landscape',
            caption: 'Itinerary Planning Feature'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=mobile%20payment%20checkout%20screen%20for%20travel%20booking%2C%20secure%20payment%20interface%2C%20clean%20app%20design%2C%20credit%20card%20input%20form%2C%20professional%20UI&width=800&height=600&seq=orderio3&orientation=landscape',
            caption: 'Seamless Checkout Experience'
          }
        ]
      }
    },
    {
      id: 3,
      title: 'Bloomgari Disaster App',
      category: 'MOBILE',
      year: '2023',
      tags: ['Flutter', 'Google Maps API', 'Push Notifications'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=disaster%20alert%20mobile%20app%20interface%20on%20phone%20with%20clean%20background%2C%20emergency%20notification%20system%2C%20map%20integration%2C%20safety%20features%2C%20professional%20app%20design%2C%20red%20and%20blue%20accent%20colors&width=600&height=800&seq=work3&orientation=portrait',
        alt: 'Bloomgari Disaster App'
      },
      overview: {
        description: 'Emergency response mobile application providing real-time disaster alerts, evacuation routes, and community safety features with offline capabilities.',
        client: 'Bloomgari Foundation',
        duration: '5 months',
        role: 'Full Stack Developer & UX Designer'
      },
      details: {
        challenge: 'During natural disasters, communication infrastructure often fails when it is needed most. The foundation required an app that could function offline, provide accurate evacuation routes, and connect community members even without internet connectivity. Battery efficiency and accessibility were critical concerns.',
        solution: 'We built a Flutter-based application with offline-first architecture, utilizing local databases and peer-to-peer communication protocols. The app includes pre-downloaded maps, emergency contact systems, and community check-in features. We optimized for minimal battery consumption and ensured WCAG 2.1 accessibility compliance.',
        results: [
          'Used in 3 major disaster responses',
          '15,000+ lives potentially saved',
          'Works 72+ hours offline',
          'Government partnership secured'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=emergency%20alert%20mobile%20app%20with%20map%20showing%20evacuation%20routes%2C%20disaster%20response%20interface%2C%20red%20and%20blue%20colors%2C%20professional%20safety%20app%20design%2C%20smartphone%20mockup&width=1200&height=800&seq=bloom1&orientation=landscape',
            caption: 'Emergency Alert Dashboard'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=community%20safety%20check-in%20mobile%20interface%2C%20family%20status%20tracking%20app%2C%20clean%20modern%20design%2C%20emergency%20contacts%20list%2C%20smartphone%20screen&width=800&height=600&seq=bloom2&orientation=landscape',
            caption: 'Community Check-in System'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=offline%20map%20navigation%20interface%20for%20emergency%20evacuation%2C%20mobile%20app%20showing%20routes%20and%20shelters%2C%20disaster%20preparedness%20app%20design&width=800&height=600&seq=bloom3&orientation=landscape',
            caption: 'Offline Navigation Maps'
          }
        ]
      }
    },
    {
      id: 4,
      title: 'Strongerkeeper Glass',
      category: 'WEB',
      year: '2023',
      tags: ['Next.js', 'Three.js', 'Shopify'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=elegant%20e-commerce%20website%20for%20glass%20products%20with%20white%20background%2C%20premium%20product%20photography%2C%20modern%20minimalist%20design%2C%20sophisticated%20layout%2C%20professional%20web%20interface&width=800&height=600&seq=work4&orientation=landscape',
        alt: 'Strongerkeeper Glass'
      },
      overview: {
        description: 'E-commerce platform for premium glass products featuring 3D product visualization, custom configuration tools, and streamlined checkout experience.',
        client: 'Strongerkeeper Glass Co.',
        duration: '4 months',
        role: 'E-commerce Specialist & 3D Developer'
      },
      details: {
        challenge: 'Selling premium glass products online presented unique challenges. Customers needed to visualize products in their spaces before purchasing, and the checkout process had to accommodate custom configurations. The existing website had high cart abandonment rates and poor mobile performance.',
        solution: 'We implemented WebGL-based 3D product visualization allowing customers to rotate, zoom, and customize products in real-time. The configurator supports custom dimensions, glass types, and finishes. We rebuilt the checkout flow with progress indicators, saved carts, and multiple payment options including financing.',
        results: [
          '70% reduction in cart abandonment',
          '45% increase in average order value',
          '3x improvement in mobile conversions',
          'Featured in Shopify showcase'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=3D%20product%20configurator%20for%20glass%20products%2C%20interactive%20web%20interface%2C%20premium%20e-commerce%20design%2C%20white%20background%2C%20elegant%20product%20visualization&width=1200&height=800&seq=strong1&orientation=landscape',
            caption: '3D Product Configurator'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=e-commerce%20product%20gallery%20for%20premium%20glass%20items%2C%20elegant%20grid%20layout%2C%20professional%20photography%2C%20clean%20white%20background%2C%20luxury%20shopping%20experience&width=800&height=600&seq=strong2&orientation=landscape',
            caption: 'Product Gallery View'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=shopping%20cart%20and%20checkout%20interface%20for%20premium%20products%2C%20elegant%20e-commerce%20design%2C%20order%20summary%2C%20clean%20modern%20UI&width=800&height=600&seq=strong3&orientation=landscape',
            caption: 'Streamlined Checkout Flow'
          }
        ]
      }
    },
    {
      id: 5,
      title: 'CreativeFlow Studio',
      category: 'DESKTOP',
      year: '2024',
      tags: ['Electron', 'Canvas API', 'WebGL'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=professional%20desktop%20application%20interface%20for%20graphic%20design%20software%2C%20dark%20theme%20with%20colorful%20tools%20panel%2C%20canvas%20workspace%2C%20layer%20management%20sidebar%2C%20modern%20creative%20software%20UI%2C%20clean%20professional%20design&width=800&height=600&seq=work-desktop1&orientation=landscape',
        alt: 'CreativeFlow Studio'
      },
      overview: {
        description: 'Professional desktop application for graphic designers featuring advanced vector editing, layer management, and real-time collaboration with cloud sync.',
        client: 'CreativeFlow Inc.',
        duration: '8 months',
        role: 'Lead Desktop Developer & UI Designer'
      },
      details: {
        challenge: 'Graphic designers needed a powerful desktop tool that could compete with industry standards while offering modern collaboration features. The application had to handle complex vector operations, support large files, and provide seamless cloud synchronization.',
        solution: 'We built an Electron-based desktop application with custom Canvas and WebGL rendering for optimal performance. Features include non-destructive editing, smart guides, plugin architecture, and real-time collaboration. We implemented efficient file handling and incremental cloud sync.',
        results: [
          '10K+ active designers',
          'Processing 500K+ designs monthly',
          '4.9 star rating',
          'Featured in design tool roundups'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=graphic%20design%20desktop%20software%20main%20workspace%20with%20vector%20tools%2C%20dark%20theme%20interface%2C%20professional%20creative%20application%2C%20layer%20panel%20and%20properties&width=1200&height=800&seq=creative1&orientation=landscape',
            caption: 'Main Workspace Interface'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=desktop%20app%20collaboration%20features%20showing%20real-time%20cursors%20and%20comments%2C%20design%20software%20interface%2C%20modern%20UI&width=800&height=600&seq=creative2&orientation=landscape',
            caption: 'Real-time Collaboration'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=plugin%20marketplace%20interface%20for%20design%20software%2C%20desktop%20application%2C%20modern%20UI%20with%20plugin%20cards%20and%20ratings&width=800&height=600&seq=creative3&orientation=landscape',
            caption: 'Plugin Ecosystem'
          }
        ]
      }
    },
    {
      id: 6,
      title: 'DataVault Manager',
      category: 'DESKTOP',
      year: '2024',
      tags: ['Electron', 'SQLite', 'Node.js'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=enterprise%20desktop%20software%20interface%20showing%20data%20management%20dashboard%2C%20file%20explorer%20with%20encryption%20icons%2C%20backup%20status%20panel%2C%20modern%20dark%20theme%20with%20teal%20accents%2C%20professional%20business%20application%20UI&width=800&height=600&seq=work-desktop2&orientation=landscape',
        alt: 'DataVault Manager'
      },
      overview: {
        description: 'Enterprise desktop application for secure data management with encryption, backup automation, and cross-platform synchronization capabilities.',
        client: 'DataVault Corp.',
        duration: '6 months',
        role: 'Security Engineer & Desktop Developer'
      },
      details: {
        challenge: 'Enterprises needed a secure, reliable solution for managing sensitive data across multiple platforms. The application required military-grade encryption, automated backups, and compliance with various data protection regulations.',
        solution: 'We developed a cross-platform desktop application with AES-256 encryption, automated backup scheduling, and secure cloud sync. Features include file versioning, audit logs, role-based access control, and compliance reporting. We implemented zero-knowledge architecture for maximum security.',
        results: [
          '50+ enterprise clients',
          'Managing 10PB+ of data',
          'Zero security breaches',
          'SOC 2 Type II certified'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=secure%20file%20management%20desktop%20interface%20with%20encryption%20status%2C%20enterprise%20software%2C%20dark%20theme%20with%20security%20indicators&width=1200&height=800&seq=vault1&orientation=landscape',
            caption: 'Secure File Management'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=backup%20automation%20dashboard%20showing%20schedule%20and%20status%2C%20enterprise%20desktop%20application%2C%20professional%20UI&width=800&height=600&seq=vault2&orientation=landscape',
            caption: 'Automated Backup System'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=compliance%20reporting%20interface%20with%20audit%20logs%2C%20enterprise%20security%20software%2C%20professional%20dashboard%20design&width=800&height=600&seq=vault3&orientation=landscape',
            caption: 'Compliance & Audit Logs'
          }
        ]
      }
    },
    {
      id: 7,
      title: 'Soothe Creek',
      category: 'WEB',
      year: '2023',
      tags: ['Vue.js', 'WebRTC', 'MongoDB'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=meditation%20wellness%20website%20interface%20with%20serene%20design%2C%20calming%20colors%2C%20nature-inspired%20elements%2C%20clean%20white%20background%2C%20peaceful%20user%20interface%2C%20modern%20web%20design&width=800&height=600&seq=work5&orientation=landscape',
        alt: 'Soothe Creek'
      },
      overview: {
        description: 'Wellness and meditation web platform offering guided sessions, progress tracking, and personalized mindfulness programs with calming user interface.',
        client: 'Soothe Creek Wellness',
        duration: '3 months',
        role: 'Product Designer & Frontend Developer'
      },
      details: {
        challenge: 'The wellness market is saturated with meditation apps, but most lack personalization and feel clinical. Soothe Creek wanted to create an immersive, calming experience that adapts to individual user needs while building a supportive community around mindfulness practices.',
        solution: 'We designed a serene interface with nature-inspired animations and ambient soundscapes. The platform features AI-driven session recommendations based on mood tracking, progress visualization, and social features for group meditation. We implemented WebRTC for live guided sessions and built a content management system for instructors.',
        results: [
          '85% user retention after 30 days',
          'Average session length of 18 minutes',
          'Community grew to 50K members',
          'Partnership with 20+ wellness instructors'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=meditation%20app%20interface%20with%20calming%20nature%20background%2C%20wellness%20platform%20design%2C%20serene%20colors%2C%20guided%20session%20player%2C%20peaceful%20UI&width=1200&height=800&seq=soothe1&orientation=landscape',
            caption: 'Guided Meditation Player'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=wellness%20progress%20tracking%20dashboard%2C%20meditation%20streak%20calendar%2C%20mindfulness%20statistics%2C%20clean%20modern%20design%2C%20soft%20calming%20colors&width=800&height=600&seq=soothe2&orientation=landscape',
            caption: 'Progress & Insights Dashboard'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=community%20meditation%20group%20interface%2C%20wellness%20social%20features%2C%20user%20profiles%20and%20sessions%2C%20peaceful%20app%20design&width=800&height=600&seq=soothe3&orientation=landscape',
            caption: 'Community Features'
          }
        ]
      }
    },
    {
      id: 8,
      title: 'Intensive Deli School Website',
      category: 'WEB',
      year: '2023',
      tags: ['React', 'Video Streaming', 'LMS'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=culinary%20school%20website%20interface%20with%20clean%20design%2C%20educational%20platform%20showing%20courses%20and%20cooking%20content%2C%20professional%20web%20layout%2C%20warm%20colors%2C%20white%20background&width=800&height=600&seq=work6&orientation=landscape',
        alt: 'Intensive Deli School Website'
      },
      overview: {
        description: 'Educational platform for culinary arts featuring course management, video tutorials, student portfolios, and interactive learning modules.',
        client: 'Intensive Deli Culinary School',
        duration: '5 months',
        role: 'LMS Developer & UI Designer'
      },
      details: {
        challenge: 'Traditional culinary education requires hands-on experience, making online learning challenging. The school needed a platform that could effectively teach cooking techniques through video, provide interactive assessments, and allow students to showcase their culinary creations.',
        solution: 'We built a custom learning management system with multi-angle video playback, step-by-step recipe guides, and timed cooking challenges. Students can upload photos and videos of their dishes for peer and instructor feedback. The platform includes live streaming capabilities for real-time cooking classes.',
        results: [
          '500+ students enrolled in first year',
          '92% course completion rate',
          'Expanded to 12 cuisine categories',
          'Alumni opened 30+ restaurants'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=culinary%20education%20platform%20with%20video%20player%20and%20recipe%20steps%2C%20cooking%20course%20interface%2C%20clean%20modern%20design&width=1200&height=800&seq=deli1&orientation=landscape',
            caption: 'Interactive Video Lessons'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=student%20portfolio%20showcase%20for%20culinary%20school%2C%20dish%20photos%20gallery%2C%20professional%20web%20design&width=800&height=600&seq=deli2&orientation=landscape',
            caption: 'Student Portfolio Gallery'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=live%20cooking%20class%20interface%20with%20chat%20and%20video%20stream%2C%20online%20culinary%20education%20platform&width=800&height=600&seq=deli3&orientation=landscape',
            caption: 'Live Streaming Classes'
          }
        ]
      }
    },
    {
      id: 9,
      title: 'CodeForge IDE',
      category: 'DESKTOP',
      year: '2023',
      tags: ['Electron', 'Monaco Editor', 'TypeScript'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=modern%20code%20editor%20desktop%20application%20interface%20with%20syntax%20highlighting%2C%20dark%20theme%2C%20file%20tree%20sidebar%2C%20integrated%20terminal%20panel%2C%20professional%20IDE%20software%20design%2C%20clean%20developer%20tools%20UI&width=800&height=600&seq=work-desktop3&orientation=landscape',
        alt: 'CodeForge IDE'
      },
      overview: {
        description: 'Lightweight desktop code editor with intelligent autocomplete, integrated terminal, Git support, and customizable themes for developers.',
        client: 'CodeForge Labs',
        duration: '7 months',
        role: 'Desktop Developer & UX Designer'
      },
      details: {
        challenge: 'Developers wanted a lightweight alternative to heavy IDEs that still provided essential features. The editor needed to be fast, extensible, and support multiple programming languages while maintaining a clean, distraction-free interface.',
        solution: 'We built a performant code editor using Monaco Editor with custom language servers for intelligent autocomplete. Features include split panes, integrated terminal, Git integration, and a plugin system. We optimized startup time and memory usage while supporting 50+ programming languages.',
        results: [
          '100K+ developers using daily',
          'Startup time under 1 second',
          '500+ community plugins',
          'Featured on GitHub trending'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=code%20editor%20main%20interface%20with%20syntax%20highlighting%20and%20file%20explorer%2C%20dark%20theme%20IDE%2C%20professional%20developer%20tool&width=1200&height=800&seq=forge1&orientation=landscape',
            caption: 'Main Editor Interface'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=integrated%20terminal%20and%20git%20interface%20in%20code%20editor%2C%20desktop%20IDE%20with%20version%20control%2C%20dark%20theme&width=800&height=600&seq=forge2&orientation=landscape',
            caption: 'Integrated Terminal & Git'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=plugin%20marketplace%20for%20code%20editor%2C%20extension%20gallery%20interface%2C%20modern%20desktop%20application%20UI&width=800&height=600&seq=forge3&orientation=landscape',
            caption: 'Extension Marketplace'
          }
        ]
      }
    },
    {
      id: 10,
      title: 'FlexDeals',
      category: 'WEB',
      year: '2022',
      tags: ['React', 'GraphQL', 'Redis'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=deals%20and%20shopping%20website%20interface%20with%20modern%20design%2C%20product%20cards%2C%20price%20tags%2C%20clean%20white%20background%2C%20vibrant%20accent%20colors%2C%20professional%20e-commerce%20layout&width=800&height=600&seq=work7&orientation=landscape',
        alt: 'FlexDeals'
      },
      overview: {
        description: 'Dynamic deals aggregator platform with smart filtering, price tracking, personalized recommendations, and real-time deal notifications.',
        client: 'FlexDeals Inc.',
        duration: '4 months',
        role: 'Full Stack Developer'
      },
      details: {
        challenge: 'Deal aggregation requires processing millions of offers in real-time while providing personalized recommendations. The platform needed to handle traffic spikes during major sales events and maintain sub-second response times for search queries.',
        solution: 'We architected a high-performance system using GraphQL for efficient data fetching and Redis for caching. The recommendation engine uses collaborative filtering to surface relevant deals. We implemented price tracking with historical charts and alert systems for price drops.',
        results: [
          '2M+ monthly active users',
          'Processing 10M+ deals daily',
          'Average response time under 200ms',
          '$50M+ in user savings tracked'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=deals%20aggregator%20homepage%20with%20featured%20offers%20and%20categories%2C%20modern%20e-commerce%20design%2C%20clean%20layout&width=1200&height=800&seq=flex1&orientation=landscape',
            caption: 'Featured Deals Homepage'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=price%20tracking%20chart%20interface%20showing%20historical%20prices%2C%20deal%20comparison%20tool%2C%20modern%20web%20design&width=800&height=600&seq=flex2&orientation=landscape',
            caption: 'Price Tracking & History'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=personalized%20deal%20recommendations%20interface%2C%20smart%20filtering%20system%2C%20clean%20modern%20UI&width=800&height=600&seq=flex3&orientation=landscape',
            caption: 'Personalized Recommendations'
          }
        ]
      }
    },
    {
      id: 11,
      title: 'Pakshook',
      category: 'MOBILE',
      year: '2022',
      tags: ['React Native', 'AWS', 'Social Features'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=food%20social%20media%20mobile%20app%20interface%20on%20smartphone%20with%20clean%20background%2C%20recipe%20cards%2C%20restaurant%20reviews%2C%20modern%20app%20design%2C%20appetizing%20colors&width=600&height=800&seq=work8&orientation=portrait',
        alt: 'Pakshook'
      },
      overview: {
        description: 'Social networking mobile app for food enthusiasts featuring recipe sharing, restaurant reviews, and community-driven culinary experiences.',
        client: 'Pakshook Social',
        duration: '6 months',
        role: 'Mobile Developer & Backend Architect'
      },
      details: {
        challenge: 'Food social networks need to balance visual appeal with functionality. Users wanted to share recipes, discover restaurants, and connect with fellow food enthusiasts. The app needed robust content moderation and location-based features.',
        solution: 'We created a visually-rich mobile app with advanced photo editing tools optimized for food photography. The platform includes recipe parsing from photos, restaurant check-ins with reviews, and social features like following, commenting, and recipe collections. We built a scalable backend on AWS with content moderation AI.',
        results: [
          '1M+ recipes shared',
          'Active in 50+ countries',
          'Featured by Apple App Store',
          'Partnership with 500+ restaurants'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=food%20social%20media%20app%20feed%20with%20recipe%20photos%2C%20mobile%20interface%2C%20beautiful%20food%20photography%2C%20modern%20app%20design&width=1200&height=800&seq=pak1&orientation=landscape',
            caption: 'Recipe Feed & Discovery'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=restaurant%20review%20and%20check-in%20mobile%20interface%2C%20location-based%20features%2C%20food%20app%20design&width=800&height=600&seq=pak2&orientation=landscape',
            caption: 'Restaurant Check-ins'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=recipe%20detail%20page%20with%20ingredients%20and%20steps%2C%20mobile%20cooking%20app%20interface%2C%20clean%20modern%20design&width=800&height=600&seq=pak3&orientation=landscape',
            caption: 'Recipe Details & Instructions'
          }
        ]
      }
    },
    {
      id: 12,
      title: 'ProVid',
      category: 'WEB',
      year: '2022',
      tags: ['React', 'WebAssembly', 'Cloud Storage'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=video%20editing%20software%20interface%20with%20timeline%2C%20professional%20tools%2C%20modern%20dark%20theme%20with%20white%20accents%2C%20clean%20UI%20design%2C%20media%20management%20dashboard&width=800&height=600&seq=work9&orientation=landscape',
        alt: 'ProVid'
      },
      overview: {
        description: 'Professional video editing and collaboration platform with cloud storage, real-time editing, and team workflow management capabilities.',
        client: 'ProVid Studios',
        duration: '8 months',
        role: 'Technical Lead & UI Designer'
      },
      details: {
        challenge: 'Professional video editing traditionally requires powerful desktop software. ProVid wanted to bring these capabilities to the browser while enabling real-time collaboration between team members working remotely.',
        solution: 'We leveraged WebAssembly to run video processing in the browser with near-native performance. The platform features a familiar timeline interface, real-time collaboration with cursor presence, cloud storage integration, and export to multiple formats. We implemented efficient video streaming for preview playback.',
        results: [
          'Used by 10K+ content creators',
          'Processes 1PB+ of video monthly',
          '50% faster than desktop alternatives',
          'Enterprise clients include Fortune 500'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=video%20editing%20timeline%20interface%20with%20clips%20and%20transitions%2C%20professional%20web-based%20editor%2C%20dark%20theme&width=1200&height=800&seq=vid1&orientation=landscape',
            caption: 'Timeline Editor Interface'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=real-time%20collaboration%20in%20video%20editor%20showing%20multiple%20cursors%2C%20team%20editing%20interface%2C%20modern%20design&width=800&height=600&seq=vid2&orientation=landscape',
            caption: 'Real-time Collaboration'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=video%20export%20settings%20interface%20with%20format%20options%2C%20professional%20editing%20software%2C%20clean%20UI&width=800&height=600&seq=vid3&orientation=landscape',
            caption: 'Export & Rendering Options'
          }
        ]
      }
    },
    {
      id: 13,
      title: 'MusicMaster Pro',
      category: 'DESKTOP',
      year: '2022',
      tags: ['Electron', 'Web Audio API', 'MIDI'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=professional%20music%20production%20desktop%20software%20interface%20with%20audio%20waveforms%2C%20mixer%20panel%2C%20virtual%20instruments%2C%20dark%20theme%20with%20colorful%20meters%2C%20modern%20DAW%20application%20design&width=800&height=600&seq=work-desktop4&orientation=landscape',
        alt: 'MusicMaster Pro'
      },
      overview: {
        description: 'Professional digital audio workstation for music production with multi-track recording, virtual instruments, and advanced mixing capabilities.',
        client: 'MusicMaster Inc.',
        duration: '10 months',
        role: 'Audio Engineer & Desktop Developer'
      },
      details: {
        challenge: 'Music producers needed a professional DAW that could handle complex projects with low latency while remaining accessible to beginners. The application required support for VST plugins, MIDI controllers, and high-quality audio processing.',
        solution: 'We developed a full-featured DAW using Web Audio API with custom audio processing nodes. Features include unlimited tracks, built-in virtual instruments, effects chain, automation, and VST plugin support. We optimized for sub-10ms latency and implemented efficient audio buffer management.',
        results: [
          '50K+ music producers',
          'Processing 100K+ tracks daily',
          'Latency under 10ms achieved',
          'Grammy-nominated albums produced'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=digital%20audio%20workstation%20main%20interface%20with%20tracks%20and%20mixer%2C%20professional%20music%20production%20software%2C%20dark%20theme&width=1200&height=800&seq=music1&orientation=landscape',
            caption: 'Main DAW Interface'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=virtual%20instrument%20interface%20with%20piano%20roll%20and%20synthesizer%20controls%2C%20music%20production%20software&width=800&height=600&seq=music2&orientation=landscape',
            caption: 'Virtual Instruments'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=audio%20mixing%20console%20with%20faders%20and%20effects%2C%20professional%20DAW%20mixer%20interface%2C%20colorful%20meters&width=800&height=600&seq=music3&orientation=landscape',
            caption: 'Mixing Console'
          }
        ]
      }
    },
    {
      id: 14,
      title: 'Mindfulness & Meditation Mobile Application',
      category: 'MOBILE',
      year: '2021',
      tags: ['Flutter', 'Audio Streaming', 'Analytics'],
      thumbnail: {
        url: 'https://readdy.ai/api/search-image?query=meditation%20mobile%20app%20on%20smartphone%20with%20peaceful%20interface%2C%20calming%20gradients%2C%20nature%20elements%2C%20clean%20design%2C%20wellness%20app%20mockup&width=600&height=800&seq=work13&orientation=portrait',
        alt: 'Mindfulness & Meditation Mobile Application'
      },
      overview: {
        description: 'Comprehensive meditation app offering guided sessions, breathing exercises, sleep stories, and mindfulness tracking with beautiful animations.',
        client: 'Mindfulness App Co.',
        duration: '5 months',
        role: 'Mobile Developer & Animation Designer'
      },
      details: {
        challenge: 'Meditation apps need to create a sense of calm from the first interaction. The app required beautiful animations that wouldn\'t drain battery, offline access to content, and personalized session recommendations based on user goals and history.',
        solution: 'We crafted a Flutter app with custom animations using Rive for smooth, battery-efficient visuals. The app features downloadable content packs, sleep stories with background audio, breathing exercises with haptic feedback, and streak tracking for habit formation. We integrated with health platforms for holistic wellness tracking.',
        results: [
          '2M+ meditation minutes logged',
          'Average user meditates 4x per week',
          'Sleep quality improved for 78% of users',
          'Apple Health and Google Fit integration'
        ]
      },
      gallery: {
        images: [
          {
            url: 'https://readdy.ai/api/search-image?query=meditation%20app%20home%20screen%20with%20session%20categories%2C%20peaceful%20mobile%20interface%2C%20calming%20colors%20and%20animations&width=1200&height=800&seq=mind1&orientation=landscape',
            caption: 'Home Screen & Sessions'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=breathing%20exercise%20interface%20with%20animated%20circle%2C%20mindfulness%20app%2C%20calming%20visual%20design&width=800&height=600&seq=mind2&orientation=landscape',
            caption: 'Breathing Exercises'
          },
          {
            url: 'https://readdy.ai/api/search-image?query=meditation%20progress%20tracking%20with%20streak%20calendar%2C%20wellness%20app%20statistics%2C%20peaceful%20design&width=800&height=600&seq=mind3&orientation=landscape',
            caption: 'Progress Tracking'
          }
        ]
      }
    }
  ]
};
