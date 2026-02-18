
interface ProjectDetail {
  client: string;
  duration: string;
  role: string;
  challenge: string;
  solution: string;
  results: string[];
}

interface GalleryImage {
  url: string;
  caption: string;
}

interface ProjectGallery {
  images: GalleryImage[];
}

export const projectDetails: Record<number, ProjectDetail> = {
  1: {
    client: "Oyak Engineering",
    duration: "6 months",
    role: "Lead UI/UX Designer & Frontend Developer",
    challenge: "Oyak Engineering needed a comprehensive platform to manage complex engineering projects across multiple teams. The existing system was fragmented, leading to communication gaps and project delays. We needed to create a unified solution that could handle project tracking, resource allocation, and real-time collaboration while maintaining enterprise-level security.",
    solution: "We developed a modular dashboard system with customizable widgets, real-time data synchronization, and role-based access controls. The platform features an intuitive drag-and-drop interface for project management, integrated communication tools, and advanced analytics for performance tracking. We implemented a microservices architecture to ensure scalability and reliability.",
    results: [
      "50% reduction in project delays",
      "35% improvement in team collaboration",
      "99.9% system uptime achieved",
      "Adopted by 500+ engineers"
    ]
  },
  2: {
    client: "Orderio Travel",
    duration: "4 months",
    role: "Mobile App Designer & Developer",
    challenge: "The travel industry demanded a mobile-first solution that could compete with established players. Users needed a seamless booking experience with personalized recommendations, real-time availability, and secure payment processing. The app had to work flawlessly across different network conditions and device types.",
    solution: "We created a native mobile application with offline capabilities, smart caching, and progressive loading. The app features AI-powered destination recommendations, interactive itinerary planning, and a streamlined checkout process. We integrated multiple payment gateways and implemented biometric authentication for enhanced security.",
    results: [
      "4.8 star rating on app stores",
      "200K+ downloads in first quarter",
      "65% booking conversion rate",
      "30% repeat user engagement"
    ]
  },
  3: {
    client: "Bloomgari Foundation",
    duration: "5 months",
    role: "Full Stack Developer & UX Designer",
    challenge: "During natural disasters, communication infrastructure often fails when it is needed most. The foundation required an app that could function offline, provide accurate evacuation routes, and connect community members even without internet connectivity. Battery efficiency and accessibility were critical concerns.",
    solution: "We built a Flutter-based application with offline-first architecture, utilizing local databases and peer-to-peer communication protocols. The app includes pre-downloaded maps, emergency contact systems, and community check-in features. We optimized for minimal battery consumption and ensured WCAG 2.1 accessibility compliance.",
    results: [
      "Used in 3 major disaster responses",
      "15,000+ lives potentially saved",
      "Works 72+ hours offline",
      "Government partnership secured"
    ]
  },
  4: {
    client: "Strongerkeeper Glass Co.",
    duration: "4 months",
    role: "E-commerce Specialist & 3D Developer",
    challenge: "Selling premium glass products online presented unique challenges. Customers needed to visualize products in their spaces before purchasing, and the checkout process had to accommodate custom configurations. The existing website had high cart abandonment rates and poor mobile performance.",
    solution: "We implemented WebGL-based 3D product visualization allowing customers to rotate, zoom, and customize products in real-time. The configurator supports custom dimensions, glass types, and finishes. We rebuilt the checkout flow with progress indicators, saved carts, and multiple payment options including financing.",
    results: [
      "70% reduction in cart abandonment",
      "45% increase in average order value",
      "3x improvement in mobile conversions",
      "Featured in Shopify showcase"
    ]
  },
  5: {
    client: "Soothe Creek Wellness",
    duration: "3 months",
    role: "Product Designer & Frontend Developer",
    challenge: "The wellness market is saturated with meditation apps, but most lack personalization and feel clinical. Soothe Creek wanted to create an immersive, calming experience that adapts to individual user needs while building a supportive community around mindfulness practices.",
    solution: "We designed a serene interface with nature-inspired animations and ambient soundscapes. The platform features AI-driven session recommendations based on mood tracking, progress visualization, and social features for group meditation. We implemented WebRTC for live guided sessions and built a content management system for instructors.",
    results: [
      "85% user retention after 30 days",
      "Average session length of 18 minutes",
      "Community grew to 50K members",
      "Partnership with 20+ wellness instructors"
    ]
  },
  6: {
    client: "Intensive Deli Culinary School",
    duration: "5 months",
    role: "LMS Developer & UI Designer",
    challenge: "Traditional culinary education requires hands-on experience, making online learning challenging. The school needed a platform that could effectively teach cooking techniques through video, provide interactive assessments, and allow students to showcase their culinary creations.",
    solution: "We built a custom learning management system with multi-angle video playback, step-by-step recipe guides, and timed cooking challenges. Students can upload photos and videos of their dishes for peer and instructor feedback. The platform includes live streaming capabilities for real-time cooking classes.",
    results: [
      "500+ students enrolled in first year",
      "92% course completion rate",
      "Expanded to 12 cuisine categories",
      "Alumni opened 30+ restaurants"
    ]
  },
  7: {
    client: "FlexDeals Inc.",
    duration: "4 months",
    role: "Full Stack Developer",
    challenge: "Deal aggregation requires processing millions of offers in real-time while providing personalized recommendations. The platform needed to handle traffic spikes during major sales events and maintain sub-second response times for search queries.",
    solution: "We architected a high-performance system using GraphQL for efficient data fetching and Redis for caching. The recommendation engine uses collaborative filtering to surface relevant deals. We implemented price tracking with historical charts and alert systems for price drops.",
    results: [
      "2M+ monthly active users",
      "Processing 10M+ deals daily",
      "Average response time under 200ms",
      "$50M+ in user savings tracked"
    ]
  },
  8: {
    client: "Pakshook Social",
    duration: "6 months",
    role: "Mobile Developer & Backend Architect",
    challenge: "Food social networks need to balance visual appeal with functionality. Users wanted to share recipes, discover restaurants, and connect with fellow food enthusiasts. The app needed robust content moderation and location-based features.",
    solution: "We created a visually-rich mobile app with advanced photo editing tools optimized for food photography. The platform includes recipe parsing from photos, restaurant check-ins with reviews, and social features like following, commenting, and recipe collections. We built a scalable backend on AWS with content moderation AI.",
    results: [
      "1M+ recipes shared",
      "Active in 50+ countries",
      "Featured by Apple App Store",
      "Partnership with 500+ restaurants"
    ]
  },
  9: {
    client: "ProVid Studios",
    duration: "8 months",
    role: "Technical Lead & UI Designer",
    challenge: "Professional video editing traditionally requires powerful desktop software. ProVid wanted to bring these capabilities to the browser while enabling real-time collaboration between team members working remotely.",
    solution: "We leveraged WebAssembly to run video processing in the browser with near-native performance. The platform features a familiar timeline interface, real-time collaboration with cursor presence, cloud storage integration, and export to multiple formats. We implemented efficient video streaming for preview playback.",
    results: [
      "Used by 10K+ content creators",
      "Processes 1PB+ of video monthly",
      "50% faster than desktop alternatives",
      "Enterprise clients include Fortune 500"
    ]
  },
  10: {
    client: "Empowering Seventy Foundation",
    duration: "4 months",
    role: "Accessibility Specialist & Developer",
    challenge: "E-commerce platforms often fail to accommodate senior users who may have visual, motor, or cognitive challenges. The foundation needed a shopping experience that was genuinely accessible while not feeling patronizing or overly simplified.",
    solution: "We designed with accessibility as the foundation, not an afterthought. Features include adjustable text sizes, high contrast modes, voice navigation, simplified checkout with phone support integration, and clear error messaging. We conducted extensive user testing with seniors throughout development.",
    results: [
      "WCAG 2.1 AAA compliance achieved",
      "40% increase in senior user purchases",
      "Average order completion time reduced 50%",
      "Featured in accessibility case studies"
    ]
  },
  11: {
    client: "Scribble Notes",
    duration: "3 months",
    role: "Product Designer & Developer",
    challenge: "Note-taking apps struggle to balance simplicity with power features. Users wanted markdown support, real-time sync, and organization tools without a cluttered interface. Cross-platform consistency was essential.",
    solution: "We built a minimalist editor with progressive disclosure of advanced features. The app supports markdown with live preview, nested folders and tags, full-text search, and real-time sync via WebSocket. We created a consistent design system that works across web, desktop, and mobile.",
    results: [
      "100K+ active users",
      "Syncing 5M+ notes daily",
      "4.7 star average rating",
      "Featured in ProductHunt top 10"
    ]
  },
  12: {
    client: "Dear Alicia Platform",
    duration: "4 months",
    role: "Privacy Engineer & Frontend Developer",
    challenge: "Creating a safe space for anonymous sharing requires balancing openness with protection from abuse. The platform needed robust moderation without compromising user privacy, and the interface had to feel warm and supportive.",
    solution: "We implemented end-to-end encryption for messages with anonymous identity verification. The moderation system uses AI to flag potentially harmful content while preserving privacy. We designed a gentle, empathetic interface with supportive micro-interactions and community guidelines prominently featured.",
    results: [
      "Zero privacy breaches since launch",
      "500K+ stories shared safely",
      "Community support response under 2 hours",
      "Mental health organization partnerships"
    ]
  },
  13: {
    client: "Mindfulness App Co.",
    duration: "5 months",
    role: "Mobile Developer & Animation Designer",
    challenge: "Meditation apps need to create a sense of calm from the first interaction. The app required beautiful animations that wouldn't drain battery, offline access to content, and personalized session recommendations based on user goals and history.",
    solution: "We crafted a Flutter app with custom animations using Rive for smooth, battery-efficient visuals. The app features downloadable content packs, sleep stories with background audio, breathing exercises with haptic feedback, and streak tracking for habit formation. We integrated with health platforms for holistic wellness tracking.",
    results: [
      "2M+ meditation minutes logged",
      "Average user meditates 4x per week",
      "Sleep quality improved for 78% of users",
      "Apple Health and Google Fit integration"
    ]
  }
};

export const projectGalleries: Record<number, ProjectGallery> = {
  1: {
    images: [
      {
        url: "https://readdy.ai/api/search-image?query=engineering%20project%20management%20dashboard%20with%20data%20visualization%20charts%2C%20clean%20modern%20interface%2C%20professional%20software%20application%2C%20white%20background%2C%20teal%20accents%2C%20showing%20project%20timeline%20and%20team%20allocation&width=1200&height=800&seq=oyak1&orientation=landscape",
        caption: "Main Dashboard with Project Overview"
      },
      {
        url: "https://readdy.ai/api/search-image?query=team%20collaboration%20interface%20showing%20user%20avatars%20and%20chat%2C%20modern%20software%20design%2C%20clean%20white%20background%2C%20professional%20engineering%20platform%2C%20real-time%20communication%20features&width=800&height=600&seq=oyak2&orientation=landscape",
        caption: "Team Collaboration Hub"
      },
      {
        url: "https://readdy.ai/api/search-image?query=analytics%20dashboard%20with%20performance%20metrics%20and%20graphs%2C%20engineering%20KPIs%2C%20clean%20modern%20design%2C%20professional%20data%20visualization%2C%20white%20background%20with%20teal%20accents&width=800&height=600&seq=oyak3&orientation=landscape",
        caption: "Analytics & Reporting Module"
      }
    ]
  },
  2: {
    images: [
      {
        url: "https://readdy.ai/api/search-image?query=travel%20booking%20mobile%20app%20interface%20showing%20destination%20cards%20and%20search%2C%20beautiful%20UI%20design%2C%20smartphone%20mockup%2C%20clean%20white%20background%2C%20vibrant%20travel%20photography&width=1200&height=800&seq=orderio1&orientation=landscape",
        caption: "Destination Discovery Screen"
      },
      {
        url: "https://readdy.ai/api/search-image?query=mobile%20app%20itinerary%20planner%20interface%20with%20timeline%20and%20activities%2C%20travel%20app%20design%2C%20clean%20modern%20UI%2C%20smartphone%20screen%20mockup&width=800&height=600&seq=orderio2&orientation=landscape",
        caption: "Itinerary Planning Feature"
      },
      {
        url: "https://readdy.ai/api/search-image?query=mobile%20payment%20checkout%20screen%20for%20travel%20booking%2C%20secure%20payment%20interface%2C%20clean%20app%20design%2C%20credit%20card%20input%20form%2C%20professional%20UI&width=800&height=600&seq=orderio3&orientation=landscape",
        caption: "Seamless Checkout Experience"
      }
    ]
  },
  3: {
    images: [
      {
        url: "https://readdy.ai/api/search-image?query=emergency%20alert%20mobile%20app%20with%20map%20showing%20evacuation%20routes%2C%20disaster%20response%20interface%2C%20red%20and%20blue%20colors%2C%20professional%20safety%20app%20design%2C%20smartphone%20mockup&width=1200&height=800&seq=bloom1&orientation=landscape",
        caption: "Emergency Alert Dashboard"
      },
      {
        url: "https://readdy.ai/api/search-image?query=community%20safety%20check-in%20mobile%20interface%2C%20family%20status%20tracking%20app%2C%20clean%20modern%20design%2C%20emergency%20contacts%20list%2C%20smartphone%20screen&width=800&height=600&seq=bloom2&orientation=landscape",
        caption: "Community Check-in System"
      },
      {
        url: "https://readdy.ai/api/search-image?query=offline%20map%20navigation%20interface%20for%20emergency%20evacuation%2C%20mobile%20app%20showing%20routes%20and%20shelters%2C%20disaster%20preparedness%20app%20design&width=800&height=600&seq=bloom3&orientation=landscape",
        caption: "Offline Navigation Maps"
      }
    ]
  },
  4: {
    images: [
      {
        url: "https://readdy.ai/api/search-image?query=3D%20product%20configurator%20for%20glass%20products%2C%20interactive%20web%20interface%2C%20premium%20e-commerce%20design%2C%20white%20background%2C%20elegant%20product%20visualization&width=1200&height=800&seq=strong1&orientation=landscape",
        caption: "3D Product Configurator"
      },
      {
        url: "https://readdy.ai/api/search-image?query=e-commerce%20product%20gallery%20for%20premium%20glass%20items%2C%20elegant%20grid%20layout%2C%20professional%20photography%2C%20clean%20white%20background%2C%20luxury%20shopping%20experience&width=800&height=600&seq=strong2&orientation=landscape",
        caption: "Product Gallery View"
      },
      {
        url: "https://readdy.ai/api/search-image?query=shopping%20cart%20and%20checkout%20interface%20for%20premium%20products%2C%20elegant%20e-commerce%20design%2C%20order%20summary%2C%20clean%20modern%20UI&width=800&height=600&seq=strong3&orientation=landscape",
        caption: "Streamlined Checkout Flow"
      }
    ]
  },
  5: {
    images: [
      {
        url: "https://readdy.ai/api/search-image?query=meditation%20app%20interface%20with%20calming%20nature%20background%2C%20wellness%20platform%20design%2C%20serene%20colors%2C%20guided%20session%20player%2C%20peaceful%20UI&width=1200&height=800&seq=soothe1&orientation=landscape",
        caption: "Guided Meditation Player"
      },
      {
        url: "https://readdy.ai/api/search-image?query=wellness%20progress%20tracking%20dashboard%2C%20meditation%20streak%20calendar%2C%20mindfulness%20statistics%2C%20clean%20modern%20design%2C%20soft%20calming%20colors&width=800&height=600&seq=soothe2&orientation=landscape",
        caption: "Progress & Insights Dashboard"
      },
      {
        url: "https://readdy.ai/api/search-image?query=community%20meditation%20group%20interface%2C%20wellness%20social%20features%2C%20user%20profiles%20and%20sessions%2C%20peaceful%20app%20design&width=800&height=600&seq=soothe3&orientation=landscape",
        caption: "Community Features"
      }
    ]
  }
};
