/**
 * Single source of truth for site-wide data: brand, NAP (name/address/phone),
 * navigation, international positioning, case studies, and the services taxonomy.
 * Imported by components, pages, SEO helpers and JSON-LD builders.
 */

export const site = {
  name: "Sharper Labs Marketing",
  legalName: "Sharper Labs Marketing Consultancy",
  tagline: "Digital Marketing That Moves Your Business Forward",
  shortDescription:
    "Sharper Labs Marketing is a UK-based digital marketing consultancy serving UK and international clients. We build stronger brands, reach the right audiences, and achieve sustainable growth through brand strategy, web development, paid advertising, social media, data analysis, and SEO.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dev.sharper-labs.com/marketing",
  email: "marketing@sharper-labs.com",
  phone: "0203 8193999",
  phoneIntl: "+44 (0)203 8193999",
  phoneHref: "tel:+442038193999",
  whatsappHref: "https://wa.me/442038193999",
  hours: "Mon–Fri 9:00–17:00 (GMT). Weekends & Bank Holidays closed.",
  timeZone: "Europe/London",
  founded: "2019",
  areaServed: "United Kingdom and Internationally",
  /** Default service pre-selected in the enquiry form. */
  featured: { label: "Brand Marketing", slug: "brand-marketing" },
} as const;

export const offices = {
  registered: {
    label: "Registered Address",
    name: "Arquen House",
    street: "4–6 Spicer Street",
    city: "St Albans",
    postcode: "AL3 4PQ",
    country: "United Kingdom",
  },
  head: {
    label: "Head Office",
    name: "Confero House",
    street: "333 Edgware Road",
    city: "London",
    postcode: "NW9 6TD",
    country: "United Kingdom",
  },
} as const;

export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/share/18jbEi6M2e/?mibextid=wwXIfr", icon: "facebook" },
  { label: "Instagram", href: "https://www.instagram.com/sharper.labs?igh=NmVnN2liMG1pMGVw", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com/@sharperlabs?si=RqhdQEFYp2yBcMbi", icon: "youtube" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/sharperlabshranlegal/", icon: "linkedin" },
] as const;

export const otherDivisions = [
  { label: "Group Home", href: "/" },
  { label: "HR", href: "/hr/" },
  { label: "Legal", href: "/legal/" },
  { label: "Academy", href: "/academy/" },
  { label: "IT", href: "/it/" },
  { label: "Recruitment", href: "/recruitment/" },
] as const;

export type NavItem = {
  label: string;
  href: string;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

/* ----------------------------------------------------------------------- */
/* Services Taxonomy (Standardized 4-Part Structure)                       */
/* ----------------------------------------------------------------------- */

export type ServiceCapability = {
  title: string;
  description: string;
  icon?: string;
  highlighted?: boolean;
  badge?: string;
  platforms?: string[];
  subServiceId?: string;
};

export type PlatformGrowthDetail = {
  name: string;
  slug: "facebook" | "instagram" | "tiktok" | "linkedin";
  shortName: string; // "FB", "IG", "TikTok", "LI"
  badge: string;
  focus: string;
  strategy: string;
  deliverables: string[];
  metricLabel: string;
  metricValue: string;
};

export type SubService = {
  id: string;
  title: string;
  shortTitle: string;
  badge: string;
  lead: string;
  description: string;
  platforms: PlatformGrowthDetail[];
  growthPillars: { title: string; description: string; icon: string }[];
  deliverables: string[];
};

export type Service = {
  slug: string;
  /** page H1 */
  title: string;
  /** short label for nav/menus/cards */
  short: string;
  icon: string; // lucide-react icon name
  /** one-line teaser for cards & meta description seed */
  excerpt: string;
  /** hero image on the service page + card image */
  image: string;
  imageAlt: string;
  contain?: boolean;
  kicker: string;
  lead: string;
  hook?: string;
  /** Structured "What We Do" capabilities */
  whatWeDo: ServiceCapability[];
  /** Optional highlighted sub-services */
  subServices?: SubService[];
  /** Structured "Our Approach" narrative */
  approach: string;
  /** Structured "What You Can Expect" deliverables */
  whatYouCanExpect: string[];
  /** intro body paragraphs */
  body: string[];
  /** benefit bullets shown as a checklist */
  benefits: string[];
  /** secondary detail blocks */
  detailHeading?: string;
  details?: { title: string; description: string; icon?: string }[];
  /** numbered process steps (optional) */
  process?: { title: string; description: string }[];
  /** page-level FAQs */
  faqs: { question: string; answer: string }[];
};

export const services: Service[] = [
  {
    slug: "brand-marketing",
    title: "Brand Marketing",
    short: "Brand Marketing",
    icon: "Crown",
    excerpt:
      "Build a distinctive brand identity, messaging, and visual presence your customers recognize and remember across digital and offline channels.",
    image: "/images/brand-marketing-02.jpg",
    imageAlt: "Designer creating a brand logo and visual identity",
    contain: true,
    kicker: "Brand Identity & Strategy",
    lead: "Build a Brand Your Customers Recognise and Remember",
    hook: "Your brand is more than a logo. It is the identity, message, and experience that shape how customers perceive your business across UK and international markets.",
    body: [
      "Your brand is more than a logo. It is the identity, message, and experience that shape how customers perceive your business.",
      "Sharper Labs Marketing helps you create or refine a distinctive brand that communicates your value, connects with your target audience, and remains consistent across digital and offline touchpoints.",
      "Whether you are launching a new enterprise or repositioning an established company for global expansion, we align creative direction with commercial objectives.",
    ],
    whatWeDo: [
      {
        title: "Brand Strategy and Positioning",
        description:
          "Research your market, audience, and competitors to clarify what your business stands for and how it should be positioned.",
        icon: "Compass",
      },
      {
        title: "Visual Identity Development",
        description:
          "Develop or refine your logo, colour palette, typography, and visual style to create a consistent, memorable brand identity.",
        icon: "Palette",
      },
      {
        title: "Brand Messaging and Tone of Voice",
        description:
          "Create clear messaging that communicates your value proposition and gives your brand a distinctive, trusted personality.",
        icon: "Megaphone",
      },
      {
        title: "Marketing Materials & Collateral",
        description:
          "Develop branded digital assets and marketing collateral that support campaigns and maintain absolute consistency across channels.",
        icon: "Briefcase",
      },
    ],
    approach:
      "We begin by understanding your business, audience, and market position. We then define the brand direction, develop the agreed creative assets, and provide clear guidance on applying the identity consistently across every client touchpoint.",
    whatYouCanExpect: [
      "A clearer brand identity and distinctive market positioning",
      "Consistent messaging and tone of voice across customer touchpoints",
      "Professional visual assets aligned with your business goals",
      "A robust brand foundation for future marketing campaigns",
    ],
    benefits: [
      "A distinctive visual identity and logo",
      "Consistent brand messaging and tone of voice",
      "Brand storytelling that builds trust",
      "Stronger brand recognition and recall",
      "Brand guidelines your whole team can follow",
      "A brand strategy aligned to your commercial ambitions",
    ],
    detailHeading: "What our brand marketing covers",
    details: [
      {
        title: "Brand Strategy and Positioning",
        description: "Research your market and competitors to define where your business wins.",
        icon: "Compass",
      },
      {
        title: "Visual Identity Design",
        description: "Logos, colour palettes, and typography built for modern screens and print.",
        icon: "Palette",
      },
      {
        title: "Tone of Voice & Messaging",
        description: "Words and narratives that resonate across UK and international markets.",
        icon: "Megaphone",
      },
      {
        title: "Brand Guidelines & Collateral",
        description: "Complete asset libraries and guidelines your teams and partners can execute with ease.",
        icon: "Briefcase",
      },
    ],
    faqs: [
      {
        question: "What is brand marketing?",
        answer:
          "Brand marketing promotes your business as a whole rather than a single offer. It builds a consistent identity, story, and reputation, so customers recognise, remember, and trust your brand over time.",
      },
      {
        question: "What is the difference between branding and marketing?",
        answer:
          "Marketing is how you generate demand and revenue in the short term; branding is the long-term foundation that shapes how your business is perceived. Strong branding makes every marketing campaign perform significantly better.",
      },
      {
        question: "Do you design logos and brand guidelines?",
        answer:
          "Yes. We design logos and full visual identities, and produce practical brand guidelines covering colours, typography, imagery, and tone of voice for digital and print application.",
      },
      {
        question: "Can you refresh our existing brand for international markets?",
        answer:
          "Absolutely. We assess your current brand, target demographics, and expansion goals, then evolve your identity to appeal to wider audiences while preserving your established brand equity.",
      },
      {
        question: "How do I get started with brand marketing?",
        answer:
          "Book a free consultation with our team or call +44 (0)203 8193999 to discuss your brand goals and review our strategic recommendations.",
      },
    ],
  },
  {
    slug: "website-design-and-development",
    title: "Website Design & Development",
    short: "Website Design & Development",
    icon: "Code2",
    excerpt:
      "Turn your website into a better customer experience with responsive design, intuitive UI/UX, and conversion journeys built to turn visitors into enquiries.",
    image: "/images/brand-marketing-03.png",
    imageAlt: "Illustration of website design and development interface",
    contain: true,
    kicker: "UI/UX & Engineering",
    lead: "Turn Your Website into a Better Customer Experience",
    hook: "Your website is often the first place potential customers go to understand your business. It should communicate your value clearly, work smoothly across devices, and make the next step easy.",
    body: [
      "Your website is often the first place potential customers go to understand your business. It should communicate your value clearly, work smoothly across devices, and make the next step easy.",
      "We design and develop websites that reflect your brand, support your business objectives, and provide a clear, user-friendly journey from first visit to enquiry.",
      "From technical performance and accessibility to search engine optimization and analytics integration, our websites are engineered for real business growth.",
    ],
    whatWeDo: [
      {
        title: "Website Planning and Structure",
        description:
          "Understand your requirements, audience, and goals before planning the site architecture and key user conversion journeys.",
        icon: "Workflow",
      },
      {
        title: "UI/UX Design",
        description:
          "Create clear layouts, intuitive navigation, and consistent visual experiences that help users find relevant information effortlessly.",
        icon: "Layout",
      },
      {
        title: "Responsive Website Development",
        description:
          "Build fast, secure websites designed to deliver flawless experiences across desktop, tablet, and mobile devices.",
        icon: "Code2",
      },
      {
        title: "Conversion-Focused Content and Design",
        description:
          "Structure pages around clear messages, compelling proof points, and strategic calls to action that encourage visitors to enquire.",
        icon: "MousePointerClick",
      },
      {
        title: "Testing, Launch and Ongoing Maintenance",
        description:
          "Test agreed functionality and cross-browser compatibility before launch, with ongoing maintenance and support.",
        icon: "ShieldCheck",
      },
    ],
    approach:
      "We move methodically from discovery and planning to design, development, testing, and launch. We also identify opportunities to improve existing websites through performance, usability, and conversion reviews.",
    whatYouCanExpect: [
      "A high-performing website aligned with your brand and commercial objectives",
      "Seamless responsive design across all supported devices",
      "Clear navigation and conversion-focused user journeys",
      "An SEO-friendly technical foundation built on modern best practices",
      "Better opportunities to convert visitors into qualified enquiries",
    ],
    benefits: [
      "Responsive design that works on every device",
      "Fast, reliable, and secure web architecture",
      "User-focused UI/UX that drives enquiries",
      "Search-engine-friendly build from day one",
      "Ongoing website maintenance and security updates",
      "Smooth project delivery without disruption to your operations",
    ],
    detailHeading: "How we build your website",
    process: [
      {
        title: "Discovery and Planning",
        description: "We understand your objectives, audience, and competitor landscape to architect an effective site map.",
      },
      {
        title: "UI/UX Design",
        description: "We create modern, branded wireframes and interactive prototypes focused on intuitive user journeys.",
      },
      {
        title: "Development & Integration",
        description: "We build clean, accessible code with integrated analytics, CMS capabilities, and fast load speeds.",
      },
      {
        title: "Testing and Launch",
        description: "Rigorous quality assurance across browsers and screen sizes before zero-downtime deployment.",
      },
      {
        title: "Maintenance and Optimisation",
        description: "Ongoing security, speed enhancements, and conversion reviews as your business expands.",
      },
    ],
    faqs: [
      {
        question: "Do you design and build websites from scratch?",
        answer:
          "Yes. We handle the full lifecycle from discovery and UI/UX design to development, testing, and deployment, tailoring every element to your commercial objectives.",
      },
      {
        question: "Will my website work across international markets?",
        answer:
          "Yes. We build responsive, multi-region capable websites optimized for global CDNs, fast international page speeds, and multi-timezone lead capture.",
      },
      {
        question: "Do you offer ongoing website maintenance?",
        answer:
          "We do. We provide continuous support, security patching, and technical upkeep so your website stays secure and high-performing.",
      },
      {
        question: "Is the website built to be search-engine friendly?",
        answer:
          "Every website is built with clean semantic HTML, structured JSON-LD data, optimized meta tags, and high Core Web Vitals scores.",
      },
    ],
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    short: "Social Media Marketing",
    icon: "Share2",
    excerpt:
      "Turn social media activity into meaningful customer connections with purposeful content, consistent communication, and data-led management.",
    image: "/images/brand-marketing-01.png",
    imageAlt: "Illustration of social media marketing campaign and audience engagement",
    contain: true,
    kicker: "Audience Growth & Engagement",
    lead: "Turn Social Media Activity into Meaningful Customer Connections",
    hook: "Social media provides an opportunity to communicate your brand's value, build relationships, and stay connected with potential customers across platforms.",
    body: [
      "Social media provides an opportunity to communicate your brand's value, build relationships, and stay connected with potential customers.",
      "We help businesses plan and manage social media activity around their audience, objectives, and brand identity. Our focus is on purposeful content, consistent communication, and performance insights that guide improvement.",
      "Whether your focus is B2B lead generation on LinkedIn or consumer engagement on Instagram and TikTok, we coordinate social media with your overall commercial strategy.",
    ],
    whatWeDo: [
      {
        title: "Social Media Followers Increasing",
        description:
          "Targeted organic and paid follower growth campaigns across LinkedIn, Facebook, Instagram, and TikTok to build real, engaged audiences that convert.",
        icon: "Users",
        highlighted: true,
        badge: "New Service",
       // platforms: ["LinkedIn", "Facebook", "Instagram", "TikTok"],
        subServiceId: "followers-increasing",
      },
      {
        title: "Social Media Strategy",
        description: "Identify suitable platforms, audience priorities, content themes, and commercial objectives.",
        icon: "Target",
      },
      {
        title: "Content Planning and Creation",
        description: "Develop content calendars, compelling captions, creative briefs, and platform-appropriate graphics and copy.",
        icon: "PenTool",
      },
      {
        title: "Social Media Management",
        description: "Support publishing, scheduling, profile consistency, and agreed community management activities.",
        icon: "MessageCircle",
      },
      {
        title: "Campaigns and Promotions",
        description: "Plan social content around product launches, services, seasonal campaigns, and key business announcements.",
        icon: "Rocket",
      },
      {
        title: "Performance Analysis",
        description: "Review available metrics such as reach, engagement, clicks, and conversions to identify what resonates.",
        icon: "Activity",
      },
    ],
    subServices: [
      {
        id: "followers-increasing",
        title: "Social Media Followers Increasing",
        shortTitle: "Followers Increasing",
        badge: "Highlighted Sub-Service",
        lead: "Strategic Audience Growth Across LinkedIn, Facebook, Instagram & TikTok",
        description:
          "Accelerate your brand presence with authentic, algorithm-aligned follower growth. We combine hyper-targeted paid acceleration, high-impact viral content formats, and community engagement loops across LinkedIn, Facebook, Instagram, and TikTok to turn casual scrollers into loyal followers and paying customers.",
        platforms: [
          {
            name: "LinkedIn",
            slug: "linkedin",
            shortName: "LI",
            badge: "B2B & Executive Authority",
            focus: "Decision-Maker Reach & Professional Follower Scale",
            strategy:
              "Deploy executive thought leadership, data-driven industry insights, and targeted B2B growth frameworks to attract founders, C-suite executives, and enterprise decision-makers who follow and do business with your brand.",
            deliverables: [
              "Company page and executive profile follower growth architecture",
              "Thought-leadership carousel and long-form post frameworks",
              "High-intent B2B audience targeting and industry hashtag strategy",
              "InMail and executive network connection amplification loops",
            ],
            metricLabel: "B2B Intent",
            metricValue: "Decision-Maker Scale",
          },
          {
            name: "Facebook",
            slug: "facebook",
            shortName: "FB",
            badge: "Community & Trust",
            focus: "Page Follower Scale & Community Building",
            strategy:
              "Leverage Facebook's granular demographic graph and group ecosystems to attract high-intent followers who actively engage with your posts and business announcements.",
            deliverables: [
              "Targeted Meta Ads follower campaigns with cost-per-follower optimization",
              "Local and international audience interest mapping",
              "Community group leadership and cross-post amplification",
              "Zero bot policy: 100% genuine user profiles",
            ],
            metricLabel: "Follower Quality",
            metricValue: "High-Intent & Real",
          },
          {
            name: "Instagram",
            slug: "instagram",
            shortName: "IG",
            badge: "Visual Reach & Reels",
            focus: "Reels Viral Velocity & High-Aesthetic Grid Authority",
            strategy:
              "Harness Instagram's recommendation algorithm with trending Reels audio, aesthetic grid curation, and strategic hashtag clusters to attract daily profile visitors and convert them into followers.",
            deliverables: [
              "Trending Reels content pacing and hook optimization",
              "Curated bio and highlight funnels engineered for follow conversion",
              "Strategic influencer co-collaborations and audio trend riding",
              "Consistent follower retention through engaging Stories and Carousels",
            ],
            metricLabel: "Engagement Rate",
            metricValue: "3.2x Average",
          },
          {
            name: "TikTok",
            slug: "tiktok",
            shortName: "TikTok",
            badge: "Viral Discovery",
            focus: "FYP Algorithm Acceleration & Trend Capitalization",
            strategy:
              "Engineer short-form video hooks designed to trigger TikTok's For You Page (FYP) algorithm, driving rapid organic discoverability and explosive follower increases among Gen Z and Millennial demographics.",
            deliverables: [
              "Hook-first 7-to-15 second video storytelling frameworks",
              "Real-time trending sound, meme, and challenge adaptation",
              "Comment section engagement loops that boost algorithmic distribution",
              "Audience transition funnels from viral viewers to active followers",
            ],
            metricLabel: "Discovery Velocity",
            metricValue: "Rapid FYP Scale",
          },
        ],
        growthPillars: [
          {
            title: "100% Real & Policy-Safe",
            description:
              "Strictly compliant with Meta and TikTok guidelines. No fake bots, pods, or shortcuts that risk shadowbans.",
            icon: "ShieldAlert",
          },
          {
            title: "Audience That Actually Converts",
            description:
              "We don't chase vanity numbers. We target users matching your ideal customer profile who engage and buy.",
            icon: "Target",
          },
          {
            title: "Cross-Platform Synergies",
            description:
              "Synchronize your LinkedIn, Facebook, Instagram, and TikTok presence so momentum on one channel compounds the others.",
            icon: "Layers",
          },
          {
            title: "Transparent Growth Analytics",
            description:
              "Track weekly follower velocity, audience demographics, retention rate, and cost efficiency with clear reporting.",
            icon: "BarChart3",
          },
        ],
        deliverables: [
          "Platform-specific follower growth roadmap for LinkedIn, Facebook, Instagram, and TikTok",
          "Comprehensive profile optimization (bio, call-to-action, highlights, link-in-bio)",
          "Viral content hooks, trending templates, and posting schedule calendar",
          "Audience retention tactics to ensure followers stay engaged over time",
          "Monthly follower quality audit and demographic breakdown reporting",
        ],
      },
    ],
    approach:
      "We assess your current presence, define content priorities, plan and publish agreed content, and review results regularly. Future content is refined based on audience response and performance data.",
    whatYouCanExpect: [
      "A more consistent, professional social media presence",
      "Accelerated follower growth across Facebook, Instagram, and TikTok",
      "Content aligned with your brand voice and target audience",
      "Better understanding of audience engagement and content resonance",
      "Increased relevant website traffic and qualified enquiries",
      "Clearer insight into content performance and ROI",
    ],
    benefits: [
      "Active presence on the platforms that matter to your buyers",
      "Accelerated follower increase on Facebook, Instagram, and TikTok",
      "Increased brand awareness and authority in your sector",
      "Expert content planning, creation, and distribution",
      "Audience growth on LinkedIn, Instagram, Facebook, and beyond",
      "Regular insight reporting to continuously refine campaigns",
    ],
    faqs: [
      {
        question: "How does your Social Media Followers Increasing sub-service work?",
        answer:
          "Our follower increasing service focuses on 100% authentic, algorithm-safe audience growth across Facebook, Instagram, and TikTok. We never use fake bots or engagement pods. Instead, we combine high-converting content formats (such as trending Reels and TikToks), targeted Meta growth campaigns, profile optimization, and community engagement to attract real followers who are genuinely interested in your brand.",
      },
      {
        question: "Can I choose specific platforms like only Instagram, Facebook, or TikTok?",
        answer:
          "Yes. While cross-platform synergy between Facebook, Instagram, and TikTok produces the fastest compounding growth, we can tailor your follower growth strategy to individual platforms based on where your target buyers are most active.",
      },
      {
        question: "Which social media platforms do you manage?",
        answer:
          "We manage all major platforms, including LinkedIn, Instagram, Facebook, TikTok, X (Twitter), and YouTube. We focus on the channels where your buyers actually spend time.",
      },
      {
        question: "Do you handle B2B social media as well as B2C?",
        answer:
          "Yes. We specialize in B2B thought-leadership and executive positioning on LinkedIn, as well as visually rich B2C campaigns on lifestyle platforms.",
      },
      {
        question: "How do you measure social media return on investment?",
        answer:
          "We look past vanity metrics to measure meaningful indicators: qualified click-throughs, engagement quality, website conversions, and direct lead enquiries.",
      },
    ],
  },
  {
    slug: "pay-per-click",
    title: "Pay-Per-Click (PPC)",
    short: "Pay-Per-Click (PPC)",
    icon: "MousePointerClick",
    excerpt:
      "Winning PPC campaigns that drive highly qualified traffic, increase enquiries and sales, and deliver a measurable, transparent return on ad spend.",
    image: "/images/brand-marketing-04.png",
    imageAlt: "Illustration of pay-per-click advertising and paid search management",
    contain: true,
    kicker: "Paid Search & Performance Media",
    lead: "Winning PPC Campaigns That Drive Qualified Traffic and Measurable ROI",
    hook: "Pay-Per-Click advertising places your business directly in front of buyers actively searching for your solutions. We build campaigns engineered for efficiency, lower CPA, and maximum return.",
    body: [
      "Pay-Per-Click advertising is an essential component of any effective marketing plan. We have years of experience running innovative campaigns that increase website traffic, brand exposure, sales, and return on investment.",
      "We build winning PPC campaigns by researching and selecting the right keywords, producing tightly structured campaigns, and setting up dedicated landing pages designed to convert.",
      "We manage every campaign from start to finish, continuously analysing and refining bids, ad copy, and targeting to surpass your agreed KPIs.",
    ],
    whatWeDo: [
      {
        title: "Keyword & Search Intent Research",
        description: "Identify high-commercial-intent search queries to reach buyers who are ready to take action.",
        icon: "KeyRound",
      },
      {
        title: "Campaign Architecture & Build",
        description: "Structure tightly organized search, display, and social ad campaigns for optimal Quality Score and cost control.",
        icon: "Layers",
      },
      {
        title: "Conversion-Focused Landing Pages",
        description: "Design and implement targeted landing pages built specifically to convert paid clicks into enquiries.",
        icon: "LayoutTemplate",
      },
      {
        title: "Bid & Budget Management",
        description: "Actively manage keyword bids, negative keyword lists, and daily allocations to eliminate wasted spend.",
        icon: "Coins",
      },
      {
        title: "Performance Analysis & Optimisation",
        description: "Continuously test ad creative, landing page elements, and audience segments to maximize ROI.",
        icon: "BarChart3",
      },
    ],
    approach:
      "We begin with thorough competitor and keyword research, structure campaigns for relevance and efficiency, pair ads with conversion-focused landing pages, and continuously optimize against your cost-per-acquisition goals.",
    whatYouCanExpect: [
      "Immediate visibility at the top of search engine results",
      "Highly targeted, qualified traffic from high-intent buyers",
      "Lower cost-per-acquisition through continuous negative keyword and bid refinement",
      "Dedicated, high-converting landing page experiences",
      "Clear, transparent reporting on spend, conversions, and return on ad spend (ROAS)",
    ],
    benefits: [
      "Fast lead generation and immediate search prominence",
      "Complete control over advertising budget and targeting",
      "Transparent reporting with zero hidden margins",
      "Integration with Google Analytics and conversion tracking",
    ],
    faqs: [
      {
        question: "How quickly does PPC deliver results?",
        answer:
          "Unlike organic strategies that take months to compound, PPC campaigns can drive qualified visitors and enquiries within 24 to 48 hours of going live.",
      },
      {
        question: "How do you prevent wasted ad spend?",
        answer:
          "We use strict match types, rigorous negative keyword lists, audience exclusions, and landing page conversion rate optimization to ensure every pound spent delivers value.",
      },
      {
        question: "Do you handle Google Ads and paid social?",
        answer:
          "Yes. We manage Google Search, Google Display, Google Performance Max, LinkedIn Ads, and Meta Ads, coordinating them across your buyer journey.",
      },
    ],
  },
  {
    slug: "data-analysis",
    title: "Data Analysis",
    short: "Data Analysis",
    icon: "BarChart3",
    excerpt:
      "Turn marketing data into better business decisions with consolidated performance views, audience insights, and actionable recommendations.",
    image: "/images/brand-marketing-05.png",
    imageAlt: "Illustration of marketing data analysis and dashboards",
    contain: true,
    kicker: "Business Intelligence & Analytics",
    lead: "Turn Marketing Data into Better Business Decisions",
    hook: "Marketing data is valuable when it helps you understand your audience, evaluate performance, and decide what to do next with confidence.",
    body: [
      "Marketing data is valuable when it helps you understand your audience, evaluate performance, and decide what to do next.",
      "Sharper Labs Marketing helps businesses interpret relevant data from their digital channels and turn findings into practical, commercial recommendations.",
      "By consolidating numbers from web analytics, CRM systems, ad accounts, and social channels, we give you a single, unified view of what drives revenue.",
    ],
    whatWeDo: [
      {
        title: "Marketing Performance Analysis",
        description: "Review available data to understand traffic, engagement, leads, conversions, and campaign outcomes.",
        icon: "BarChart2",
      },
      {
        title: "Audience and Market Insights",
        description: "Examine audience behaviour, market trends, and competitor activity to identify growth opportunities.",
        icon: "Eye",
      },
      {
        title: "Channel and Campaign Comparison",
        description: "Compare performance across channels and campaigns to identify which activities contribute to agreed objectives.",
        icon: "SlidersHorizontal",
      },
      {
        title: "Reporting and Dashboards",
        description: "Organise key performance indicators into clear, easy-to-understand executive dashboards.",
        icon: "Presentation",
      },
      {
        title: "Actionable Recommendations",
        description: "Translate findings into prioritised actions, such as refining content, improving landing pages, or adjusting budgets.",
        icon: "Lightbulb",
      },
    ],
    approach:
      "We establish the business questions first, review the available data, assess its quality, and identify meaningful patterns. We then present the findings and recommend practical next steps to accelerate growth.",
    whatYouCanExpect: [
      "A clearer, single-source view of marketing performance across channels",
      "Better visibility into conversion bottlenecks and revenue opportunities",
      "More informed campaign and budget allocation decisions",
      "Executive reporting linked directly to commercial KPIs",
      "Actionable recommendations based on verified evidence rather than guesswork",
    ],
    benefits: [
      "Evidence-based decision making for senior leadership",
      "Elimination of wasteful marketing expenditure",
      "Clear attribution across multi-touch buyer journeys",
      "Custom dashboards tailored to your reporting cycles",
    ],
    faqs: [
      {
        question: "What is marketing data analysis?",
        answer:
          "Marketing data analysis gathers and interprets data across digital touchpoints to evaluate strategy performance and determine where to invest for maximum return.",
      },
      {
        question: "What platforms do you work with?",
        answer:
          "We work with Google Analytics 4, Google Search Console, Looker Studio, CRM databases (HubSpot, Salesforce), and all major advertising platforms.",
      },
      {
        question: "How often will we receive reports?",
        answer:
          "We provide automated real-time dashboards alongside scheduled monthly executive briefings with strategic recommendations.",
      },
    ],
  },
  {
    slug: "organic-seo",
    title: "Organic SEO",
    short: "Organic SEO",
    icon: "Search",
    excerpt:
      "Help the right customers find your business through search with technical audits, search intent research, on-page optimisation, and sustainable authority building.",
    image: "/images/brand-marketing-06.png",
    imageAlt: "Illustration of search engine optimisation and website ranking",
    contain: true,
    kicker: "Search Engine Optimisation",
    lead: "Help the Right Customers Find Your Business Through Search",
    hook: "When potential customers search for products or services you provide, your website needs to be discoverable, useful, and relevant to their commercial needs.",
    body: [
      "When potential customers search for products or services you provide, your website needs to be discoverable, useful, and relevant to their needs.",
      "Our organic SEO service helps businesses improve search visibility through technical improvements, keyword research, content optimization, and ongoing performance analysis.",
      "We focus on sustainable, white-hat techniques that build lasting authority for commercial queries across the UK and international markets.",
    ],
    whatWeDo: [
      {
        title: "SEO Audits and Technical Reviews",
        description: "Review technical issues that may affect crawling, indexing, Core Web Vitals, and search visibility.",
        icon: "Search",
      },
      {
        title: "Keyword and Search Intent Research",
        description: "Identify relevant search terms and understand what users are looking for at each stage of their decision journey.",
        icon: "Target",
      },
      {
        title: "On-Page SEO & Content Optimisation",
        description: "Improve page titles, meta descriptions, headings, internal links, content structure, and keyword relevance.",
        icon: "FileEdit",
      },
      {
        title: "Content Strategy & Topic Clusters",
        description: "Identify high-value topics and content opportunities that answer customer questions and earn organic traffic.",
        icon: "Network",
      },
      {
        title: "Authority and Backlink Development",
        description: "Identify opportunities to earn genuine backlinks through useful content, industry directories, and reputable publications.",
        icon: "Link2",
      },
      {
        title: "Performance Monitoring & Analytics",
        description: "Use Google Search Console and analytics platforms to monitor impressions, clicks, rankings, and conversions.",
        icon: "LineChart",
      },
    ],
    approach:
      "We begin with a comprehensive technical and competitor audit and a prioritised action plan. We then implement agreed technical and content improvements, monitor performance, and refine the strategy as search algorithms evolve.",
    whatYouCanExpect: [
      "A stronger technical SEO foundation with clean crawlability and fast page speed",
      "Better alignment between website content and user search intent",
      "Improved opportunities to earn relevant, high-converting organic traffic",
      "Greater visibility and transparent tracking across target keywords",
      "A sustainable, long-term approach to compounding search growth",
    ],
    benefits: [
      "Higher search rankings on Google and Bing for commercial queries",
      "Continuous technical SEO fixes and on-page optimization",
      "Competitor gap analysis to capture market share",
      "High-intent traffic that reduces reliance on paid media",
      "Long-term compounding return on investment",
    ],
    faqs: [
      {
        question: "How long does SEO take to see meaningful results?",
        answer:
          "SEO is a compounding long-term investment. Most clients begin seeing improvements in crawl health and initial rankings within 3 to 6 months, with major traffic and lead growth accelerating thereafter.",
      },
      {
        question: "Can you guarantee first-page rankings?",
        answer:
          "No ethical agency can guarantee specific #1 rankings, as search algorithms and competitors change constantly. What we guarantee is proven, white-hat methodology, technical excellence, and transparent monthly progress.",
      },
      {
        question: "Do you optimize for UK local search or international search?",
        answer:
          "Both. We implement local schema and geo-targeting for UK regional visibility, as well as hreflang, international architecture, and search intent targeting for cross-border reach.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/* ----------------------------------------------------------------------- */
/* Case Studies (Strictly Adhering to Management 5-Point Specification)    */
/* ----------------------------------------------------------------------- */

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  services: string[];
  featured: boolean;
  clientOverview: {
    industry: string;
    businessModel: string;
    targetMarket: string;
    timeframe: string;
  };
  challenge: string;
  strategyAndWork: string[];
  results: {
    metric: string;
    label: string;
    period: string;
    source: string;
  }[];
  keyTakeaway: string;
  video?: string;
  clientDomain?: string;
  websiteUrl?: string;
  client?: string;
  industry?: string;
  hasFullScreenshotPan?: boolean;
  demoUrl?: string;
  legacySlugs?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "modern-restaurant",
    legacySlugs: ["healthcare-clinical-advisory-growth"],
    title: "AURA Mayfair: Immersive 3D Gastronomy & High-Conversion Table Reservations",
    summary:
      "How a premier Mayfair fine dining establishment transformed guest reservations with an interactive Three.js 3D culinary sculpture, cellar showcases, and instant VIP bookings.",
    image: "/images/brand-marketing-01.png",
    video: "/videos/video1.mp4",
    clientDomain: "auramayfair.co.uk",
    websiteUrl: "https://auramayfair.co.uk",
    demoUrl: "/demos/modern-restaurant",
    client: "AURA Mayfair London",
    industry: "Luxury Fine Dining & Hospitality",
    category: "Hospitality & Dining",
    services: ["Website Design & Development", "Brand Marketing", "Organic SEO"],
    featured: true,
    clientOverview: {
      industry: "Luxury Fine Dining & Hospitality",
      businessModel: "Michelin-Selected Culinary Experience",
      targetMarket: "London Mayfair, Overseas VIPs & Epicureans",
      timeframe: "4 Months",
    },
    challenge:
      "AURA Mayfair possessed world-class Michelin-calibre culinary mastery, but their static booking site suffered from a 78% bounce rate and failed to convey the sensory drama of their multi-course tasting experience. High-net-worth guests and international travelers were abandoning the reservation journey before selecting a date.",
    strategyAndWork: [
      "Architected an immersive digital experience featuring an interactive Three.js 3D golden culinary sculpture that reacts dynamically to guest cursor movements.",
      "Designed intuitive interactive menu curation with real-time pairing notes across Tasting, Mains, and Cellar collections.",
      "Engineered a frictionless 2-step VIP table reservation flow with party-size selector and calendar slot locking, reducing booking time from 3.2 minutes to 38 seconds.",
      "Implemented local SEO and structured schema markup targeting high-intent London fine dining queries.",
    ],
    results: [
      {
        metric: "+184%",
        label: "Increase in Direct Online Table Bookings",
        period: "First 90 Days",
        source: "OpenTable & GA4 Verified",
      },
      {
        metric: "4.2 min",
        label: "Average Interactive Session Duration",
        period: "Post-Launch",
        source: "Google Analytics 4",
      },
      {
        metric: "£185k",
        label: "First-Quarter Tasting Menu Revenue",
        period: "Q1 Run Rate",
        source: "Stripe & POS Telemetry",
      },
    ],
    keyTakeaway:
      "Sensory 3D web design combined with a zero-friction reservation flow transforms a luxury restaurant website from a static menu into a high-converting guest acquisition engine.",
    testimonial: {
      quote:
        "The 3D interactive experience Sharper Labs built for AURA Mayfair brought the artistry of our kitchen to the screen. Our weekend tasting tables are now fully booked 6 weeks in advance.",
      author: "Chef Julian V.",
      role: "Executive Culinary Director",
    },
  },
  {
    slug: "furniture-house",
    legacySlugs: ["sustainable-lifestyle-ecommerce-scale"],
    title: "Nordic & Form Atelier: Real-Time 3D 360° E-Commerce Furniture Customizer",
    summary:
      "Scaling high-ticket architectural Danish furniture sales with real-time 360° WebGL customisation, textile swatches, and a frictionless checkout flow.",
    image: "/images/brand-marketing-04.png",
    video: "/videos/video1.mp4",
    clientDomain: "nordicform-atelier.com",
    websiteUrl: "https://nordicform-atelier.com",
    demoUrl: "/demos/furniture-house",
    client: "Nordic & Form Atelier",
    industry: "Designer Furniture & Sustainable Living",
    category: "E-commerce & Retail",
    services: ["Website Design & Development", "Pay-Per-Click (PPC)", "Data Analysis"],
    featured: true,
    clientOverview: {
      industry: "Designer Furniture & Sustainable Living",
      businessModel: "Direct-to-Consumer (D2C) & Architectural Contracts",
      targetMarket: "UK, Scandinavia, Germany & North America",
      timeframe: "6 Months",
    },
    challenge:
      "Selling bespoke £1,400+ designer lounge chairs online was hampered by customer hesitation around fabric textures and spatial proportions. Static flat photography resulted in high cart abandonment and costly return rates from customers surprised by color finishes.",
    strategyAndWork: [
      "Engineered a real-time Three.js 360-degree interactive 3D product customizer allowing visitors to inspect craftsmanship from every angle.",
      "Integrated live WebGL material and textile swatch switching (Smoked Oak, Bouclé Cream, Matte Slate, Terracotta) with instant lighting reflection updates.",
      "Added interactive dimension schematics and ergonomic breakdown overlays directly inside the buying experience.",
      "Optimised checkout performance with Google Pay/Apple Pay integration, reducing purchase hesitation on high-ticket SKUs.",
    ],
    results: [
      {
        metric: "3.8x",
        label: "Return on Ad Spend (ROAS) — Up from 1.6x",
        period: "6-Month Run Rate",
        source: "Google Ads & Shopify Verified",
      },
      {
        metric: "+142%",
        label: "Customizer-to-Cart Conversion Rate",
        period: "Post-Launch",
        source: "Shopify Analytics",
      },
      {
        metric: "-36%",
        label: "Reduction in High-Ticket Product Return Rates",
        period: "Year-over-Year",
        source: "Operations Dashboard",
      },
    ],
    keyTakeaway:
      "Interactive 3D configurators bridge the physical-digital divide for luxury furniture, giving buyers tactile confidence and dramatically reducing returns.",
    testimonial: {
      quote:
        "Allowing our clients to rotate our chairs in 3D and switch bouclé textures live on screen revolutionized our online conversions. Sharper Labs delivered beyond expectations.",
      author: "Astrid Lindholm",
      role: "Head of Digital Brand & Design",
    },
  },
  {
    slug: "smart-agriculture",
    legacySlugs: ["international-b2b-supply-chain"],
    title: "TerraSynapse Agritech: Precision Crop Intelligence & 3D Soil Digital-Twin",
    summary:
      "How an autonomous agritech platform scaled commercial enterprise sales with real-time satellite telemetry, an interactive 3D soil digital-twin, and agronomic ROI forecasting.",
    image: "/images/marketing-landing-1.jpeg",
    video: "/videos/video1.mp4",
    clientDomain: "terrasynapse-agri.com",
    websiteUrl: "https://terrasynapse-agri.com",
    demoUrl: "/demos/smart-agriculture",
    client: "TerraSynapse AI",
    industry: "Agritech & Environmental Intelligence",
    category: "B2B & Tech",
    services: ["Website Design & Development", "Brand Marketing", "Social Media Marketing", "Organic SEO"],
    featured: true,
    clientOverview: {
      industry: "Agritech & Environmental Intelligence",
      businessModel: "Enterprise SaaS & Hardware-Enabled Telemetry",
      targetMarket: "UK, France, Spain, Australia & North America",
      timeframe: "8 Months",
    },
    challenge:
      "TerraSynapse developed groundbreaking AI soil sensors and drone telemetry, but their B2B marketing lacked visual clarity. Commercial farm operators and agronomists couldn't grasp the complex data pipeline or calculate prospective financial yield gains from static whitepapers.",
    strategyAndWork: [
      "Constructed an interactive Three.js 3D digital-twin topographic soil elevation mesh complete with real-time radar wave propagation and bio-matter particle simulation.",
      "Built an interactive agronomic ROI engine allowing commercial growers to slide through acreage and immediately visualize irrigation savings and harvest yield upside.",
      "Integrated interactive autonomous drone scan demonstrations showcasing multispectral NDVI vegetation health mapping.",
      "Executed a targeted global B2B SEO campaign around precision agriculture, E-E-A-T soil data, and water conservation technologies.",
    ],
    results: [
      {
        metric: "+214%",
        label: "Surge in Qualified Inbound Enterprise RFPs",
        period: "8-Month Campaign",
        source: "HubSpot CRM & GA4",
      },
      {
        metric: "-38%",
        label: "Average Client Irrigation Overhead Saved",
        period: "Verified Field Data",
        source: "TerraSynapse Engine",
      },
      {
        metric: "Top 3",
        label: "Rankings for 48 High-Intent Commercial Terms",
        period: "UK, EU & US",
        source: "Google Search Console",
      },
    ],
    keyTakeaway:
      "Demystifying complex deep-tech products through real-time 3D simulation and dynamic ROI calculators converts technical skepticism into enterprise contract wins.",
    testimonial: {
      quote:
        "Sharper Labs turned our complex algorithmic telemetry into an awe-inspiring, intuitive 3D web experience. Enterprise agricultural buyers get the value proposition within 10 seconds of landing.",
      author: "Dr. Marcus Thorne",
      role: "Chief Technology Officer",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug || c.legacySlugs?.includes(slug));
}

/* ----------------------------------------------------------------------- */
/* Keywords Architecture (From Management Improvement Guide Pages 11–13)   */
/* ----------------------------------------------------------------------- */

export const targetKeywords = {
  primary: [
    "Digital marketing agency UK",
    "Digital marketing consultancy UK",
    "Digital marketing services UK",
    "Full-service digital marketing agency",
    "Digital marketing for small businesses",
    "B2B digital marketing agency UK",
    "Digital marketing strategy services",
    "Business growth marketing agency",
    "Online marketing services for businesses",
  ],
  brandMarketing: [
    "Brand marketing agency UK",
    "Branding agency for businesses",
    "Brand strategy consultancy",
    "Brand identity design services",
    "Brand positioning strategy",
    "Brand awareness campaigns",
    "Business rebranding services",
  ],
  websiteDesign: [
    "Website design agency UK",
    "Website development company UK",
    "Business website design",
    "Professional website design services",
    "Responsive web design services",
    "Website redesign services",
    "Website maintenance services",
    "Conversion-focused web design",
  ],
  socialMedia: [
    "Social media marketing agency UK",
    "Social media management services",
    "Social media marketing for businesses",
    "B2B social media marketing",
    "LinkedIn marketing agency",
    "Social media content strategy",
    "Social media brand awareness",
  ],
  dataAnalysis: [
    "Marketing data analysis services",
    "Digital marketing analytics",
    "Marketing performance reporting",
    "Marketing ROI analysis",
    "Campaign performance analysis",
    "Customer behaviour analysis",
    "Data-driven marketing strategy",
    "Marketing analytics consultancy",
  ],
  organicSeo: [
    "SEO agency UK",
    "SEO services for businesses",
    "Organic SEO services",
    "SEO consultancy UK",
    "Technical SEO services",
    "On-page SEO services",
    "B2B SEO agency",
    "Small business SEO services",
    "SEO strategy and consulting",
  ],
  longTail: [
    "Digital marketing services for UK SMEs",
    "Digital marketing agency for B2B companies",
    "How to increase website traffic and leads",
    "How to choose a digital marketing agency",
    "Cost of digital marketing services in the UK",
    "How to improve website conversion rates",
    "SEO and PPC services for business growth",
    "How to measure digital marketing ROI",
    "Brand positioning strategies for growing businesses",
    "Digital marketing strategy for international businesses",
  ],
};

/* ----------------------------------------------------------------------- */
/* URL helpers (subdirectory-aware)                                        */
/* ----------------------------------------------------------------------- */

const ORIGIN = (() => {
  try {
    return new URL(site.url).origin;
  } catch {
    return site.url.replace(/\/+$/, "");
  }
})();

export const basePath = (() => {
  try {
    const p = new URL(site.url).pathname.replace(/\/+$/, "");
    return p === "" ? "" : p;
  } catch {
    return "";
  }
})();

export function routeUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
  const base = `${ORIGIN}${basePath}`;
  return clean ? `${base}/${clean}/` : `${base}/`;
}

export function assetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  return `${ORIGIN}${basePath}/${clean}`;
}
