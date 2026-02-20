-- ─────────────────────────────────────────────────────
-- Portfolio seed data — mirrors frontend/src/mocks/siteContent.ts
-- Run with: wrangler d1 execute portfolio-db --file=src/worker/db/seed.sql
-- ─────────────────────────────────────────────────────

-- PROJECTS
INSERT OR REPLACE INTO projects (id, title, category, year, thumbnail_url, thumbnail_alt, tags, overview_description, overview_client, overview_duration, overview_role, details_challenge, details_solution, details_results, gallery_images, sort_order, published) VALUES
('1', 'Home Sweet Home', 'SAAS', '2025', '/assets/images/projects/home-sweet-home.png', 'Home Sweet Home',
  '["Golang","Hono","React","PostgreSQL"]',
  'A property management SaaS for landlords and property managers to track tenants, leases, payments, and maintenance requests — all in one place.',
  'Senvon Studio (personal venture)', 'Dec 2025 – Present', 'Founder & Engineer',
  'Landlords in Ghana manage properties through WhatsApp, Excel sheets, and paper records — leading to missed payments, unresolved maintenance issues, and no audit trail.',
  'Building a multi-tenant SaaS with a Golang/Hono backend, React frontend, and PostgreSQL. Features include tenant onboarding, automated rent reminders, maintenance ticket tracking, and financial reporting dashboards.',
  '["MVP in private beta","Sub-50ms API response times with Golang backend","Multi-tenant architecture with isolated landlord accounts","Automated rent reminder system via email/SMS"]',
  '[{"url":"/assets/images/projects/home-sweet-home.png","caption":"Dashboard"},{"url":"/assets/images/projects/home-sweet-home.png","caption":"Tenant Management"},{"url":"/assets/images/projects/home-sweet-home.png","caption":"Financials Overview"}]',
  1, 1),

('2', 'PriPri', 'DESKTOP', '2025', '/assets/images/projects/pripri.png', 'PriPri App Locker',
  '["Wails","Go","React","TailwindCSS"]',
  'A cross-platform desktop app locker built with Wails (Go + React). PriPri monitors running applications and displays a password prompt before allowing locked apps to open — ensuring privacy and focus.',
  'Senvon Studio (personal venture)', 'Aug 2025 – Present', 'Founder & Engineer',
  'macOS and Windows lack a native, lightweight way to password-protect specific applications — useful for shared computers or enforcing focus by locking distracting apps.',
  'Built with Wails, combining a Go backend for OS-level process monitoring with a React + TailwindCSS frontend that feels native on both macOS and Windows. Users manage a lock list from a dashboard and can toggle PriPri globally.',
  '["Cross-platform: macOS and Windows support","Native-feeling UI with retro-theme roadmap","Process monitoring with sub-second response to app launch","Temporary unlock and global on/off toggle"]',
  '[{"url":"/assets/images/projects/pripri.png","caption":"Dashboard & Lock List"},{"url":"/assets/images/projects/pripri.png","caption":"Password Prompt Overlay"},{"url":"/assets/images/projects/pripri.png","caption":"Settings & App Management"}]',
  2, 1),

('3', 'Scribble Notes', 'MOBILE', '2025', '/assets/images/projects/scribble-notes.png', 'Scribble Notes',
  '["Flutter","Provider","SharedPreferences"]',
  'A lightweight mobile notes app with local data persistence and dynamic search — built to be fast and distraction-free.',
  'Personal Project', '2025 – Present', 'Mobile Developer',
  'Most notes apps are bloated with features users never need. The goal was a minimal, snappy note-taking experience with offline-first storage and instant search.',
  'Built with Flutter and Provider for state management. Uses SharedPreferences for local data persistence — no backend required. Notes are searchable by title in real time.',
  '["Fully offline — no account or internet required","Instant note search by title","Lightweight build with minimal dependencies","Ongoing: additional features in development"]',
  '[{"url":"/assets/images/projects/scribble-notes.png","caption":"Notes List"},{"url":"/assets/images/projects/scribble-notes.png","caption":"Note Editor"},{"url":"/assets/images/projects/scribble-notes.png","caption":"Search Results"}]',
  3, 1),

('4', 'Mummy''s Darl', 'WEB', '2025', '/assets/images/projects/mummysdarl.jpg', 'Mummy''s Darl',
  '["React","TailwindCSS","Cloudflare Pages"]',
  'An educational platform for Mummy''s Darl, a childcare and early learning centre — providing curriculum info, gallery, and online enrolment for parents.',
  'Mummy''s Darl', '2024 – 2025', 'Frontend Developer',
  'The childcare centre relied entirely on word-of-mouth referrals with no web presence. Parents had no easy way to learn about the curriculum, pricing, or how to enrol.',
  'Started in 2024 and fully revamped and launched in 2025 — a React website with TailwindCSS deployed on Cloudflare Pages. Includes curriculum overview, photo gallery, testimonials, and an enquiry form.',
  '["Revamped and launched 2025","Enrolment enquiries increased immediately post-launch","Zero hosting cost via Cloudflare Pages","Fully accessible and mobile-optimised"]',
  '[{"url":"/assets/images/projects/mummysdarl.jpg","caption":"Platform Overview"},{"url":"/assets/images/projects/mummysdarl.jpg","caption":"Curriculum Section"},{"url":"/assets/images/projects/mummysdarl.jpg","caption":"Contact & Enrolment"}]',
  4, 1),

('5', 'FlexDown', 'SAAS', '2023', '/assets/images/flexdown/flexdown.png', 'FlexDown',
  '["React Native","Node.js","PostgreSQL"]',
  'A real estate mobile app for browsing, filtering, and enquiring about property listings across Ghana — started in 2023, actively revamped in 2025 as a friend''s startup.',
  'FlexDown', '2023 – Present', 'Mobile Developer',
  'Finding reliable rental and property listings in Ghana was fragmented across unverified social media posts and outdated classifieds, with no standardised filtering or contact flow.',
  'Built a React Native Expo app backed by a Node.js REST API and PostgreSQL. Features include location-based search, advanced filters, image galleries per listing, and in-app enquiry forms.',
  '["Launched with 200+ verified property listings","Integrated Google Maps for neighbourhood exploration","Advanced filter system for price, bedrooms, and area","Actively revamped and extended in 2025"]',
  '[{"url":"/assets/images/flexdown/flexdown_landing.png","caption":"Landing & Search"},{"url":"/assets/images/flexdown/flexdown.png","caption":"Property Feed"},{"url":"/assets/images/flexdown/flexdown_listing.png","caption":"Listing Detail"}]',
  5, 1),

('6', 'Envoyer GH', 'WEB', '2024', '/assets/images/envoyer/envoyerGH.png', 'Envoyer GH',
  '["Node.js","Express","PostgreSQL","TailwindCSS"]',
  'A digital freight network connecting shippers, business owners, and individuals with carriers for road transport across Ghana — including bus hiring and towing services.',
  'Envoyer GH', 'June – Sept 2024', 'Lead Frontend & Backend Engineer',
  'Ghana''s logistics sector lacked a reliable digital platform for connecting freight clients with available drivers. Manual coordination led to delays, poor visibility, and high operational costs.',
  'Built a full-stack platform with Express/PostgreSQL backend and TailwindCSS frontend. Implemented user roles, OTP verification, KYC verification, image upload, booking portal, and real-time notifications via Server-Sent Events.',
  '["Live at envoyergh.com","Supports shipper, driver, and admin user roles","Real-time notification system via SSE","OTP + KYC verification for secure onboarding"]',
  '[{"url":"/assets/images/envoyer/envoyerGH.png","caption":"Platform Overview"},{"url":"/assets/images/envoyer/envoyer_contact.png","caption":"Contact & Booking Flow"},{"url":"/assets/images/envoyer/envoyer_login.png","caption":"Login & Registration"}]',
  6, 1),

('7', 'Purple Pay', 'MOBILE', '2024', '/assets/images/projects/purple-pay.jpg', 'Purple Pay',
  '["Flutter","Express","PostgreSQL","Stripe"]',
  'A fintech mobile application enabling peer-to-peer payments, wallet management, and card top-ups — built during tenure at Enyata Ghana.',
  'Enyata Ghana', 'Feb – Aug 2024', 'Mobile Engineer',
  'Mobile money solutions in Ghana are fragmented across multiple providers with poor UX. Users needed a unified wallet with a clean interface for P2P transfers and card payments.',
  'Built a Flutter app with Riverpod state management and an Express/PostgreSQL backend. Integrated Stripe for card processing and biometric authentication for enhanced security.',
  '["Beta launched with 500+ early adopters","Average transaction time under 3 seconds","PCI-DSS compliant payment flow via Stripe","Biometric auth adopted by 80% of users"]',
  '[{"url":"/assets/images/projects/purple-pay.jpg","caption":"Wallet Dashboard"},{"url":"/assets/images/projects/purple-pay.jpg","caption":"Transfer Flow"},{"url":"/assets/images/projects/purple-pay.jpg","caption":"Transaction History"}]',
  7, 1),

('8', 'Nagyique Boutique', 'WEB', '2024', '/assets/images/projects/nagyique.jpg', 'Nagyique Boutique',
  '["Astro","React","Stripe","Sanity","Cloudflare"]',
  'A fashion e-commerce storefront with a Sanity CMS product catalogue, Stripe checkout, and edge-deployed Astro frontend. Started March 2024, still in active development.',
  'Nagyique Boutique', 'Mar 2024 – Present', 'Full Stack Developer',
  'The boutique was managing orders via Instagram DMs with no product catalogue or checkout flow. They needed a store their team could manage without technical knowledge.',
  'Built an Astro + React storefront on Cloudflare Pages with Sanity as the headless CMS for product management. Stripe handles checkout. The Astro architecture delivers near-instant page loads.',
  '["Owner manages inventory via Sanity Studio — no coding needed","Lighthouse performance score: 98","Stripe integration handling live transactions","Ongoing: final features being completed"]',
  '[{"url":"/assets/images/projects/nagyique.jpg","caption":"Storefront"},{"url":"/assets/images/projects/nagyique.jpg","caption":"Product Detail"},{"url":"/assets/images/projects/nagyique.jpg","caption":"Checkout Flow"}]',
  8, 1),

('9', 'Pokebook', 'MOBILE', '2023', '/assets/images/projects/pokebook.jpg', 'Pokebook',
  '["Flutter","Provider","PokéAPI"]',
  'A Flutter mobile app consuming the PokéAPI to browse Pokémon, view detailed stats, and discover similar species — built as a deep-dive into state management and API integration.',
  'Personal Project', 'Late 2023', 'Mobile Developer',
  'A focused learning project to master Flutter state management with Provider, REST API consumption, and building a polished search-driven UI.',
  'Consumes the PokéAPI for all Pokémon data. Features a live search bar, detailed stat pages with type badges and base stat visualisers, and a similar Pokémon recommendation section.',
  '["Fully functional PokéAPI integration","Dynamic search with instant filter results","Detailed stat view with type badges","Solid foundation for Flutter/Provider patterns"]',
  '[{"url":"/assets/images/projects/pokebook.jpg","caption":"Pokémon Browser"},{"url":"/assets/images/projects/pokebook.jpg","caption":"Search & Filter"},{"url":"/assets/images/projects/pokebook.jpg","caption":"Detail & Stats View"}]',
  9, 1),

('10', 'Gullivers Travel Hotel', 'WEB', '2022', '/assets/images/gullivers/gullivers_rooms.png', 'Gullivers Travel Hotel',
  '["React","Node.js","TailwindCSS"]',
  'A professional hotel website for Gullivers Travel Hotel featuring room showcase, restaurant gallery, lounge section, and booking enquiries.',
  'Gullivers Travel Hotel', '2 months', 'Frontend Developer',
  'The hotel had no digital presence and was losing potential guests to competitors with modern booking websites. They needed a fast, attractive site to showcase rooms and take enquiries.',
  'Designed and built a React website with smooth animations, image galleries for rooms, restaurant, and lounge, and a contact/booking enquiry form backed by a Node.js mailer service.',
  '["60% increase in direct booking enquiries post-launch","Fully responsive across mobile and desktop","Image-rich showcase for rooms, restaurant, and lounge","Positive client feedback on delivery speed"]',
  '[{"url":"/assets/images/gullivers/gullivers_rooms.png","caption":"Rooms & Suites"},{"url":"/assets/images/gullivers/gullivers_restaurant.png","caption":"Restaurant"},{"url":"/assets/images/gullivers/gullivers_lounge.png","caption":"Lounge"}]',
  10, 1),

('11', 'GESA KNUST', 'MOBILE', '2022', '/assets/images/gesa/gesa.png', 'GESA KNUST',
  '["Flutter","Firebase","Node.js"]',
  'Mobile app for the Ghana Engineering Students Association at KNUST, centralising events, course materials, and member communications.',
  'GESA KNUST', '4 months', 'Mobile Developer',
  'The association managed events and resources through scattered WhatsApp groups and emails, making it hard for students to stay informed or access materials quickly.',
  'Developed a Flutter app with Firebase for real-time notifications and content delivery. Features an events calendar, course material repository, announcements, and member directory.',
  '["Adopted by 500+ engineering students","Centralised 3 years of course materials","Real-time event and announcement notifications","Published on Google Play Store"]',
  '[{"url":"/assets/images/gesa/gesa.png","caption":"Home Dashboard"},{"url":"/assets/images/gesa/gesa_course_material.png","caption":"Course Materials"},{"url":"/assets/images/gesa/gesa_events.png","caption":"Events Calendar"}]',
  11, 1),

('12', 'Pro-Vid', 'MOBILE', '2021', '/assets/images/projects/provid.png', 'Pro-Vid COVID Tracker',
  '["Flutter","Dart","REST API"]',
  'A COVID-19 tracking app providing real-time global and local case updates, curated news, and self-assessment health quizzes — designed to combat pandemic misinformation.',
  'Personal Project', 'Aug 2021', 'Mobile Developer',
  'During the pandemic, misinformation spread rapidly. People needed a single trustworthy source for case data, verified news, and simple self-assessment tools accessible on mobile.',
  'Built in Flutter/Dart, consuming a COVID-19 REST API for live case statistics. Features curated news sources, an interactive self-assessment quiz, and community awareness content.',
  '["Real-time global and local case data","Curated, verified news sources only","Interactive self-assessment health quiz","Shareable awareness content for community use"]',
  '[{"url":"/assets/images/projects/provid.png","caption":"Case Statistics Dashboard"},{"url":"/assets/images/projects/provid-2.jpg","caption":"News & Updates Feed"},{"url":"/assets/images/projects/provid.png","caption":"Self-Assessment Quiz"}]',
  12, 1),

('13', 'Dear Akua', 'WEB', '2023', '/assets/images/dear-akua/landing-page.png', 'Dear Akua',
  '["Node.js","Express","MongoDB"]',
  'An anonymous web-based platform where users can write and share confessions, designed to foster a safe and non-judgmental community space.',
  'Personal Project', '2023', 'Full-stack Developer',
  'Ensuring complete user anonymity while preventing abuse, and creating an interface simple enough that anyone could submit without friction.',
  'Built with Node.js, Express, and EJS for server-side rendering, backed by MongoDB. Anonymous submissions require no account. Deployed on Railway with content moderation hooks to flag problematic entries.',
  '["Fully anonymous — no account or email required","Public confession feed with responsive design","Content moderation features to maintain a safe space","Live at dear-akua-production.up.railway.app"]',
  '[{"url":"/assets/images/dear-akua/landing-page.png","caption":"Landing Page"},{"url":"/assets/images/dear-akua/submit-form.png","caption":"Submission Form"},{"url":"/assets/images/dear-akua/confessions-feed.png","caption":"Confessions Feed"}]',
  13, 1);

-- BLOG POSTS
INSERT OR REPLACE INTO blog_posts (id, title, slug, date, excerpt, content, external_url, tags, published) VALUES
('post-1',
  'Why I switched from Flutter to React Native (and back)',
  'flutter-vs-react-native',
  '2026-01-20',
  'After two years of going back and forth, here is what I actually think about both ecosystems.',
  'After two years working professionally in both Flutter and React Native, I have strong opinions.

Flutter wins on UI consistency. Your app looks exactly the same on Android and iOS, every time. The widget tree is verbose but predictable, and once you understand how StatefulWidget and Provider interact, things click fast.

React Native wins on ecosystem. If you already know React, the mental model transfers well. The JS bridge has improved dramatically since the new architecture landed, and libraries like Expo make shipping surprisingly fast.

For client work where polish matters most, I reach for Flutter. For solo projects where I want to move fast and leverage web tooling, React Native.

Neither is better. They are different tools.',
  NULL,
  '["Flutter","React Native","Mobile"]',
  1),

('post-2',
  'Mutex in JavaScript — you probably need one',
  'mutex-in-javascript',
  '2025-11-10',
  'JavaScript is single-threaded, so why would you ever need a mutex? More situations than you think.',
  NULL,
  'https://dev.to/georgie',
  '["JavaScript","Concurrency"]',
  1),

('post-3',
  'Server-Sent Events vs WebSockets — when to use which',
  'sse-vs-websockets',
  '2025-09-04',
  'SSE is underrated for one-way real-time data. Here is a clear breakdown of when each makes sense.',
  NULL,
  'https://dev.to/georgie',
  '["Backend","Real-time"]',
  1),

('post-4',
  'Building Envoyer — lessons from a six-month freelance project',
  'envoyer-lessons',
  '2025-07-18',
  'What I learned leading frontend and backend development for a logistics startup over six months.',
  'Six months is a long time to spend on a single freelance project, especially when you are still learning as you go.

Envoyer is a digital freight network in Ghana. My role covered frontend, backend, user roles, OTP verification, KYC flows, image uploads, and a notification system using Server-Sent Events.

The biggest lesson: scope creep will happen. Budget for it. The second lesson: SSE is genuinely underrated for notification systems where you do not need two-way communication. The third: PostgreSQL with proper indexing is fast enough for almost anything at the scale startups operate at.

The project launched. Real users. Real freight moving. That part felt good.',
  NULL,
  '["Freelance","Backend","Ghana"]',
  1),

('post-5',
  'Golang in 2025 — is it worth learning as your second backend language?',
  'golang-2025',
  '2025-05-02',
  'I picked up Go for the Home Sweet Home project. Here is an honest take on the experience.',
  'I already knew Node.js and Python when I started learning Go for Home Sweet Home.

First impressions: the toolchain is excellent. go fmt, go test, go build — everything just works. The standard library covers most needs without reaching for external packages.

The type system is simple but not simple in a bad way. Interfaces are implicit, which feels strange at first but becomes elegant quickly.

Where Go struggled for me: error handling. Returning (value, error) from every function works, but it is verbose. Rust has a better story here with the ? operator.

Would I recommend it as a second backend language? Yes, especially if you work on APIs or infrastructure tooling. The performance-to-simplicity ratio is hard to beat.',
  NULL,
  '["Golang","Backend"]',
  1);

-- NOTES
INSERT OR REPLACE INTO notes (id, title, slug, date, content, category, published) VALUES
('note-1',
  'PostgreSQL — indexing fundamentals',
  'postgres-indexing',
  '2026-01-15',
  '## What is an index?

An index is a separate data structure that lets PostgreSQL find rows without scanning the entire table.

## B-Tree (default)

Good for equality and range queries. Created automatically for PRIMARY KEY and UNIQUE constraints.

`CREATE INDEX idx_users_email ON users(email);`

## When NOT to index

- Small tables (full scan is faster)
- Columns with very low cardinality (e.g. boolean flags)
- Columns that are written to very frequently (indexes slow writes)

## EXPLAIN ANALYZE

Always check your query plan before and after adding an index:

`EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;`

Look for "Index Scan" vs "Seq Scan" in the output.',
  'Database',
  1),

('note-2',
  'Flutter — Provider vs Riverpod',
  'flutter-provider-vs-riverpod',
  '2025-12-08',
  '## Provider

The OG Flutter state management package. Works well for small-medium apps.

Pros: simple, widely documented, lots of Stack Overflow answers.
Cons: requires context, harder to use outside the widget tree.

## Riverpod

The successor from the same author. Fixes Provider''s core limitations.

Pros: compile-safe, no context required, testable out of the box.
Cons: steeper learning curve, more boilerplate for simple cases.

## My take

For new projects: Riverpod. For existing Provider codebases: only migrate if there is a clear pain point.',
  'Flutter',
  1),

('note-3',
  'HTTP methods — a practical reference',
  'http-methods-reference',
  '2025-10-20',
  '## GET
Read a resource. No body. Idempotent.

## POST
Create a resource (or trigger an action). Has a body. NOT idempotent.

## PUT
Replace a resource entirely. Idempotent.

## PATCH
Partially update a resource. NOT strictly idempotent.

## DELETE
Remove a resource. Idempotent.

## HEAD
Like GET but returns only headers. Useful for checking if a resource exists.

## Idempotency matters
Calling the same PUT or DELETE request ten times should produce the same result as calling it once. Callers can safely retry on network failure.',
  'Backend',
  1),

('note-4',
  'Git — commands I always forget',
  'git-commands',
  '2025-08-12',
  '## Undo last commit but keep changes staged
`git reset --soft HEAD~1`

## Undo last commit and unstage changes
`git reset HEAD~1`

## Stash only untracked files
`git stash -u`

## Show which commit introduced a bug
`git bisect start`
`git bisect bad`
`git bisect good <commit-hash>`

## Squash last N commits
`git rebase -i HEAD~N`
Mark all but the first as "squash".

## Cherry-pick a single commit
`git cherry-pick <commit-hash>`',
  'Tools',
  1);

-- STREAM EVENTS
INSERT OR REPLACE INTO stream_events (id, title, date, time, platform, stream_url, description, is_recurring, recurring_day) VALUES
('stream-1', 'Building a REST API from scratch', '2026-02-24', '20:00 GMT', 'twitch', 'https://twitch.tv/georgie_dev', 'Full Golang + Hono REST API build — auth, DB, deployment.', 1, 'Monday'),
('stream-2', 'Flutter UI Deep Dive', '2026-02-26', '21:00 GMT', 'tiktok', 'https://tiktok.com/@georgie_dev', 'Building a real estate listing screen — animations, state, custom widgets.', 1, 'Wednesday'),
('stream-3', 'Q&A + Code Review', '2026-03-03', '20:00 GMT', 'twitch', 'https://twitch.tv/georgie_dev', 'Open session — bring your code, bring your questions.', 0, NULL),
('stream-4', 'SaaS Dashboard Build', '2026-03-06', '21:00 GMT', 'tiktok', 'https://tiktok.com/@georgie_dev', 'Building a multi-tenant SaaS dashboard with React and Tailwind.', 0, NULL);

-- SITE CONTENT — page-level sections stored as JSON blobs
INSERT OR REPLACE INTO site_content (key, value) VALUES
('navigation', '{"id":"nav-main","logo":{"text":"GH","url":"/","imageUrl":"/GHlog.png"},"menuItems":[{"id":"nav-home","label":"Home","url":"/"},{"id":"nav-works","label":"Works","url":"/works"},{"id":"nav-about","label":"About","url":"/about"}],"ctaButton":{"label":"Get in Touch","url":"/contact"}}'),
('footer', '{"id":"footer-main","logo":{"text":"GH","url":"/","imageUrl":"/GHlog.png"},"copyright":"© 2026 George Oti-Adjei. All rights reserved.","links":[{"id":"footer-link-1","label":"GitHub","url":"https://github.com/oti-adjei"},{"id":"footer-link-2","label":"LinkedIn","url":"https://linkedin.com/in/george-jrr"}]}'),
('worksPage', '{"id":"works-page","title":"My Work","subtitle":"A collection of projects I''ve designed and developed","categories":["ALL","WEB","MOBILE","DESKTOP","SAAS","CLI","BACKEND"]}'),
('streamsPage', '{"id":"streams-page","title":"Stream Schedule","subtitle":"Catch me live on Twitch and TikTok — coding, building, and talking tech.","twitchUsername":"georgie_dev","tiktokUsername":"@georgie_dev"}'),
('homePage', '{"hero":{"id":"home-hero","badge":"Mobile & Software Engineer","heading":"Building Apps People Actually Use","subtitle":"Full-stack and mobile engineer with 3+ years shipping cross-platform applications for web, mobile, and desktop. I also stream for fun. Check my stream schedule below.","ctaButton":{"label":"View My Work","url":"/works"},"secondaryButton":{"label":"Get in Touch","url":"/contact"},"image":{"url":"/Gpic.webp","alt":"Georgie Heavenson Jnr. Oti-Adjei"},"socialIcons":[{"id":"social-linkedin","platform":"linkedin","url":"https://linkedin.com/in/george-jrr","icon":"ri-linkedin-line"},{"id":"social-github","platform":"github","url":"https://github.com/oti-adjei","icon":"ri-github-line"},{"id":"social-twitch","platform":"twitch","url":"#","icon":"ri-twitch-line"},{"id":"social-tiktok","platform":"tiktok","url":"#","icon":"ri-tiktok-line"},{"id":"social-youtube","platform":"youtube","url":"#","icon":"ri-youtube-line"}]},"about":{"id":"home-about","sectionTitle":"About Me","name":"George Oti-Adjei","role":"Mobile & Software Engineer","bio":["Results-driven Mobile and Software Engineer with 3+ years of experience building cross-platform applications and full-stack systems that serve real users.","From fintech apps and property management SaaS to esports platforms and e-commerce storefronts — I build end-to-end products that are fast, scalable, and actually enjoyable to use.","I''m most at home at the intersection of mobile and web, where clean architecture meets an experience people don''t need a manual to understand."],"tools":[{"id":"tool-flutter","name":"Flutter","category":"mobile"},{"id":"tool-react","name":"React","category":"frontend"},{"id":"tool-go","name":"Go","category":"backend"},{"id":"tool-typescript","name":"TypeScript","category":"frontend"},{"id":"tool-nodejs","name":"Node.js","category":"backend"},{"id":"tool-figma","name":"Figma","category":"design"}]},"services":{"id":"home-services","title":"What I Do","subtitle":"End-to-end software engineering across mobile, web, backend, and desktop","items":[{"id":"service-mobile","icon":"ri-smartphone-line","title":"Mobile Development","description":"Cross-platform iOS and Android apps built with Flutter and React Native, from zero to production."},{"id":"service-web","icon":"ri-code-s-slash-line","title":"Web Development","description":"Fast, responsive web applications built with React, Next.js, and Astro — optimised for performance and SEO."},{"id":"service-backend","icon":"ri-server-line","title":"Backend Engineering","description":"Scalable REST APIs built with Node.js/Express and Go, backed by PostgreSQL and MongoDB."},{"id":"service-desktop","icon":"ri-window-line","title":"Desktop Applications","description":"Cross-platform desktop apps built with Wails (Go + React) — native feel on macOS and Windows."},{"id":"service-devops","icon":"ri-git-branch-line","title":"DevOps & CI/CD","description":"Automated pipelines via GitHub Actions and Azure DevOps, Docker containerisation, and cloud hosting on AWS and Cloudflare."},{"id":"service-consulting","icon":"ri-lightbulb-line","title":"Technical Consulting","description":"Architecture reviews, tech-stack guidance, and hands-on support for teams building software products."}]},"stats":{"id":"home-stats","title":"By the Numbers","subtitle":"Impact and achievements over the years","items":[{"id":"stat-projects","value":"20+","label":"Projects Shipped","description":"Successful launches across web, mobile, and desktop"},{"id":"stat-clients","value":"10+","label":"Happy Clients","description":"From startups to established businesses"},{"id":"stat-experience","value":"3+","label":"Years Experience","description":"Continuous learning and growth in the field"}]},"contactCTA":{"id":"home-contact-cta","heading":"Let''s Work Together","description":"Have a project in mind? I''d love to hear about it. Let''s create something amazing together.","ctaButton":{"label":"Get in Touch","url":"/contact"}}}'),
('aboutPage', '{"hero":{"id":"about-hero","avatar":{"url":"/aboutme.JPG","alt":"George Oti-Adjei"},"name":"George Oti-Adjei","role":"Mobile & Software Engineer","tagline":"Building performant, cross-platform applications from Accra, Ghana"},"bio":{"id":"about-bio","paragraphs":["I''m a Mobile and Software Engineer based in Accra, Ghana, with 3+ years of experience building cross-platform applications and full-stack systems that serve real users.","My journey started with a curiosity about how software works — and quickly became a career shipping production apps across mobile, web, and desktop. I''ve worked across fintech, logistics, education, and real estate, building everything from Flutter apps and Node.js APIs to Go-powered SaaS platforms.","I believe the best software is fast, reliable, and gets out of the user''s way. That philosophy drives every architectural decision I make — whether I''m building a multi-tenant SaaS or a lightweight mobile app.","When I''m not building, I''m learning — exploring new tooling, contributing to open source, or mentoring others through problems I''ve already solved."]},"expertise":{"id":"about-expertise","sectionTitle":"Areas of Expertise","items":[{"id":"expertise-mobile","icon":"ri-smartphone-line","title":"Mobile Development","description":"Building cross-platform iOS and Android apps with Flutter and React Native, from zero to production."},{"id":"expertise-frontend","icon":"ri-code-box-line","title":"Web & Frontend","description":"Responsive, performant web applications with React, Next.js, TypeScript, and Astro."},{"id":"expertise-backend","icon":"ri-server-line","title":"Backend Engineering","description":"Scalable REST APIs and services built with Node.js/Express and Go, backed by PostgreSQL and MongoDB."},{"id":"expertise-devops","icon":"ri-settings-3-line","title":"DevOps & Tooling","description":"CI/CD pipelines via GitHub Actions and Azure DevOps, Docker containerisation, and cloud deployments on AWS and Cloudflare."}]},"journey":{"id":"about-journey","sectionTitle":"My Journey","timeline":[{"id":"journey-2024-masharder","year":"2024","title":"Lead Frontend Software Engineer","company":"MashHarder","description":"Leading frontend architecture for a Ghanaian esports platform. Built MashHarder UI — an open-source Web Component library (Lit) used across the platform, with full TypeScript definitions and Starlight-powered docs."},{"id":"journey-2024-senvon","year":"2024","title":"Founder & Software Engineer","company":"Senvon Studio","description":"Founded a boutique digital studio delivering SaaS platforms, component libraries, and client web applications. Studio output includes Home Sweet Home (property management SaaS) and Mummy''s Darl."},{"id":"journey-2024-enyata","year":"2024","title":"Mobile Developer","company":"Enyata Ghana","description":"Developed and maintained production mobile applications using Flutter and React Native. Integrated GraphQL and REST APIs, implemented Riverpod state management and offline-first local storage."},{"id":"journey-2022-alpha","year":"2022","title":"Mobile Engineer","company":"teamAlpha","description":"Built cross-platform mobile apps for iOS and Android serving 8,000+ active users. Implemented CI/CD pipelines and CLI deployment automation tools."},{"id":"journey-2021-adb","year":"2021","title":"Junior Application Developer","company":"Agricultural Development Bank Ghana","description":"Built internal web applications, trained staff on KYC verification systems, and optimised server-side performance — reducing query execution time by 40%."},{"id":"journey-2020-npontu","year":"2020","title":"Started My Journey","company":"Npontu Technologies","description":"First professional role as a DevOps & Data Analyst Intern. Processed large-scale datasets and streamlined data workflows, increasing team productivity by 25%."}]},"philosophy":{"id":"about-philosophy","quote":"Build things that work, then make them work beautifully.","label":"Engineering Philosophy"},"connectCTA":{"id":"about-connect-cta","heading":"Let''s Connect","description":"I''m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.","ctaButton":{"label":"Get in Touch","url":"/contact"}}}'),
('contactPage', '{"hero":{"id":"contact-hero","label":"Get in Touch","headingLines":["Let''s Create","Something Amazing","Together"],"description":"Whether you have a project in mind or just want to chat about design and development, I''d love to hear from you."},"contactInfo":{"cards":[{"id":"info-email","icon":"ri-mail-line","label":"Email","value":"jrgeorge991@gmail.com","link":"mailto:jrgeorge991@gmail.com"},{"id":"info-phone","icon":"ri-phone-line","label":"Phone","value":"+233 50-005-2067","link":"tel:+233500052067"},{"id":"info-location","icon":"ri-map-pin-line","label":"Location","value":"Accra, Ghana","link":null}],"socialLinks":[{"id":"contact-social-linkedin","platform":"LinkedIn","url":"https://linkedin.com/in/george-jrr","icon":"ri-linkedin-line"},{"id":"contact-social-github","platform":"GitHub","url":"https://github.com/oti-adjei","icon":"ri-github-line"}],"availability":{"status":"available","label":"Available for Projects"}}}');
