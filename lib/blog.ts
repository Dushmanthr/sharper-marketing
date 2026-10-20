import { prisma } from "@/lib/prisma";

export interface BlogSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bulletPoints?: string[];
  keyTakeaways?: string[];
  quote?: {
    text: string;
    author?: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category:
    | "Data & ROI"
    | "SME Growth"
    | "Web & Conversion"
    | "International Strategy"
    | "Consultancy"
    | "Brand Strategy"
    | (string & {});
  publishedAt: string;
  dateIso: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  image: string;
  imageAlt: string;
  featured?: boolean;
  tags: string[];
  metaDescription: string;
  tableOfContents: { id: string; title: string }[];
  sections: BlogSection[];
  relatedServices: { name: string; slug: string }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-measure-digital-marketing-roi",
    title: "How to Measure Digital Marketing ROI: A Practical Framework for UK & International Businesses",
    excerpt:
      "Move beyond surface vanity metrics. Learn how to accurately calculate customer acquisition cost (CAC), track multi-channel attribution, and demonstrate commercial return across digital marketing investments.",
    category: "Data & ROI",
    publishedAt: "12 March 2026",
    dateIso: "2026-03-12T09:00:00Z",
    readTime: "7 min read",
    author: {
      name: "Sharper Labs Advisory",
      role: "Digital Strategy & Analytics Practice",
      avatar: "/images/hero-marketing-team.jpg",
    },
    image: "/images/hero-data-analytics.jpg",
    imageAlt: "Digital marketing analytics dashboard displaying ROI and conversion metrics",
    featured: true,
    tags: [
      "How to measure digital marketing ROI",
      "Marketing ROI analysis",
      "Digital marketing analytics",
      "Marketing performance reporting",
      "Customer behaviour analysis",
    ],
    metaDescription:
      "Discover how to calculate and measure digital marketing ROI with verified formulas, attribution modeling, and data reporting techniques for UK and global companies.",
    tableOfContents: [
      { id: "why-vanity-metrics-fail", title: "Why Vanity Metrics Mislead Commercial Decision-Making" },
      { id: "core-formula", title: "The Core Marketing ROI Formula Demystified" },
      { id: "tracking-attribution", title: "Navigating Multi-Touch Attribution in Complex Buyer Journeys" },
      { id: "data-consolidation", title: "Consolidating Analytics and CRM Data Under One Roof" },
      { id: "actionable-takeaways", title: "Key Steps to Prove Marketing Value to the Board" },
    ],
    sections: [
      {
        id: "why-vanity-metrics-fail",
        heading: "Why Vanity Metrics Mislead Commercial Decision-Making",
        paragraphs: [
          "In digital marketing, it is dangerously easy to confuse activity with commercial progress. Impressions, raw page views, social likes, and click-through rates provide immediate gratification, but they tell leadership almost nothing about sustainable revenue or profitability.",
          "For UK businesses and international enterprises alike, marketing leadership is increasingly required to speak the language of commercial finance. When marketing spend is viewed merely as a speculative expense rather than a measurable growth engine, budgets face constant scrutiny and knee-jerk cuts.",
          "A robust approach begins by drawing a strict distinction between diagnostic indicators (such as bounce rates or ad quality scores) and commercial business outcomes (such as verified sales-qualified leads, client acquisition cost, customer lifetime value, and net contribution margin).",
        ],
        quote: {
          text: "Marketing data is only truly valuable when it helps you understand your audience, evaluate performance, and decide what to do next with commercial confidence.",
          author: "Sharper Labs Marketing Strategy Practice",
        },
      },
      {
        id: "core-formula",
        heading: "The Core Marketing ROI Formula Demystified",
        paragraphs: [
          "At its fundamental level, Return on Marketing Investment (ROMI) measures the profit generated per unit of marketing expenditure. The standard formula can be expressed as:",
          "ROMI = [(Gross Revenue Attributable to Marketing - Cost of Goods Sold - Total Marketing Expenditure) / Total Marketing Expenditure] × 100",
          "However, applying this formula in practice requires accounting for all hidden costs. Too many organisations only tally direct third-party ad spend, ignoring agency advisory fees, creative production, software subscriptions, and internal team hours.",
        ],
        bulletPoints: [
          "Direct media spend across Google Ads, LinkedIn, Meta, and programmatic display.",
          "Production overheads including content creation, design assets, and video production.",
          "Technology stack licensing fees (CRM, analytics tools, marketing automation platforms).",
          "External consultancy and agency retainers.",
        ],
      },
      {
        id: "tracking-attribution",
        heading: "Navigating Multi-Touch Attribution in Complex Buyer Journeys",
        paragraphs: [
          "Modern B2B and high-value consumer buying journeys are rarely linear. A prospective client might first discover your company via an organic SEO article, return a week later via a retargeted LinkedIn campaign, download a case study, and finally convert three months later through direct search.",
          "Relying solely on 'last-click' attribution severely undervalues top-of-funnel brand awareness and organic SEO, while over-attributing credit to bottom-of-funnel branded search or remarketing ads.",
          "We recommend adopting position-based or data-driven attribution models in Google Analytics 4 that reward both the introductory discovery touchpoint and the decisive conversion event.",
        ],
      },
      {
        id: "data-consolidation",
        heading: "Consolidating Analytics and CRM Data Under One Roof",
        paragraphs: [
          "A major roadblock to accurate ROI reporting is fragmented data silos. Your digital ad platforms report clicks and platform-estimated conversions, your website records sessions, and your CRM (such as HubSpot or Salesforce) records deal stages and closed revenue.",
          "By bridging the gap between web interactions and closed-won CRM opportunities, marketing leadership can evaluate which channels produce high-intent prospects that actually turn into paying clients, rather than high volumes of low-quality enquiries.",
        ],
        keyTakeaways: [
          "Unify your CRM pipeline with GA4 custom conversion events for closed revenue tracking.",
          "Audit customer acquisition cost (CAC) by channel, factoring in both media spend and creative production.",
          "Establish quarterly benchmark reviews to identify underperforming campaigns before spend is wasted.",
        ],
      },
      {
        id: "actionable-takeaways",
        heading: "Key Steps to Prove Marketing Value to the Board",
        paragraphs: [
          "Transparent reporting builds organizational trust. Provide your executive leadership with concise, monthly executive briefings that link marketing activity directly to strategic commercial objectives.",
          "By implementing a disciplined measurement framework, marketing shifts from being an unpredictable cost centre into your most reliable, scalable driver of business growth.",
        ],
      },
    ],
    relatedServices: [
      { name: "Data Analysis", slug: "data-analysis" },
      { name: "Pay-Per-Click (PPC)", slug: "pay-per-click" },
      { name: "Organic SEO", slug: "organic-seo" },
    ],
  },
  {
    slug: "digital-marketing-services-for-uk-smes",
    title: "Digital Marketing Services for UK SMEs: Accelerating Sustainable Growth",
    excerpt:
      "A strategic roadmap for UK small and medium enterprises. Learn how to allocate budget across brand marketing, SEO, paid media, and web development for maximum competitive impact.",
    category: "SME Growth",
    publishedAt: "08 March 2026",
    dateIso: "2026-03-08T09:00:00Z",
    readTime: "6 min read",
    author: {
      name: "Sharper Labs Advisory",
      role: "UK Business Growth Consultancy",
      avatar: "/images/hero-marketing-team.jpg",
    },
    image: "/images/hero-marketing-team.jpg",
    imageAlt: "Marketing consultancy team planning strategy for UK business growth",
    tags: [
      "Digital marketing services for UK SMEs",
      "Digital marketing for small businesses",
      "B2B digital marketing agency UK",
      "Business growth marketing agency",
      "Online marketing services for businesses",
    ],
    metaDescription:
      "Explore how UK SMEs can structure digital marketing services for sustainable growth. Practical advice on budget allocation, SEO, web design, and paid advertising.",
    tableOfContents: [
      { id: "sme-landscape", title: "The Shifting Landscape for UK Small and Medium Enterprises" },
      { id: "core-disciplines", title: "Prioritizing the Core Marketing Disciplines" },
      { id: "budget-allocation", title: "Realistic Budget Allocation Strategies" },
      { id: "avoiding-pitfalls", title: "Common Pitfalls UK SMEs Must Avoid" },
      { id: "next-steps", title: "Building a Coordinated Growth Roadmap" },
    ],
    sections: [
      {
        id: "sme-landscape",
        heading: "The Shifting Landscape for UK Small and Medium Enterprises",
        paragraphs: [
          "Small and medium enterprises form the backbone of the UK economy, representing over 99% of private sector businesses. Yet, competing in digital channels has never been more demanding, with rising ad costs, fierce market saturation, and evolving consumer behaviours.",
          "Unlike multinational corporations with virtually unlimited testing budgets, UK SMEs need every marketing pound to pull its weight. Survival and scale require a clear, disciplined strategy rather than scattered, ad-hoc promotional activities.",
        ],
      },
      {
        id: "core-disciplines",
        heading: "Prioritizing the Core Marketing Disciplines",
        paragraphs: [
          "Rather than attempting to be active on every emerging platform simultaneously, growing businesses see the strongest return by mastering six interdependent disciplines under one coordinated strategy:",
        ],
        bulletPoints: [
          "Brand Positioning: Defining a crisp, memorable identity that sets your company apart from legacy competitors.",
          "High-Conversion Website: Ensuring your site is lightning fast, mobile-optimized, and engineered to guide visitors to take action.",
          "Organic SEO: Capturing high-intent commercial searches from buyers who are actively seeking your services.",
          "Targeted PPC: Running tightly controlled Google and LinkedIn ads to generate immediate qualified enquiries.",
          "Purposeful Social Media: Nurturing professional credibility and engagement where your target decision-makers spend time.",
          "Actionable Data Analysis: Monitoring real conversion metrics to continuously improve campaigns over time.",
        ],
      },
      {
        id: "budget-allocation",
        heading: "Realistic Budget Allocation Strategies",
        paragraphs: [
          "A balanced allocation model for growing UK firms typically divides resources into a 60/40 ratio: 60% dedicated to long-term brand equity and organic search authority (SEO and content), and 40% allocated toward immediate demand generation (paid search and targeted performance campaigns).",
          "This dual approach ensures you capture immediate revenue opportunities today while insulating your business against rising ad costs tomorrow.",
        ],
        keyTakeaways: [
          "Focus on high-intent commercial keywords over high-volume generic phrases.",
          "Ensure your website loading speed is under 2 seconds to minimise visitor bounce rates.",
          "Coordinate messaging across organic channels and paid campaigns for maximum brand recall.",
        ],
      },
      {
        id: "avoiding-pitfalls",
        heading: "Common Pitfalls UK SMEs Must Avoid",
        paragraphs: [
          "The most frequent error is treating digital marketing as a series of isolated tasks handed to separate freelancers who never communicate with one another. When your SEO specialist, web developer, and PPC manager pull in different directions, budgets are diluted and brand messaging becomes fragmented.",
          "Coordinating strategy and execution under one unified consultancy ensures every marketing activity directly supports shared commercial goals.",
        ],
      },
      {
        id: "next-steps",
        heading: "Building a Coordinated Growth Roadmap",
        paragraphs: [
          "Start with an objective audit of your current digital presence. Identify conversion bottlenecks, evaluate search footprint, and benchmark your messaging against top competitors to establish clear, measurable milestones for the year ahead.",
        ],
      },
    ],
    relatedServices: [
      { name: "Brand Marketing", slug: "brand-marketing" },
      { name: "Website Design & Development", slug: "website-design-and-development" },
      { name: "Organic SEO", slug: "organic-seo" },
    ],
  },
  {
    slug: "how-to-improve-website-conversion-rates",
    title: "How to Improve Website Conversion Rates: Converting Visitors into Inbound Enquiries",
    excerpt:
      "Driving website traffic is only half the battle. Discover actionable UX strategies, psychological proof points, and friction-reducing designs that convert website visitors into qualified business enquiries.",
    category: "Web & Conversion",
    publishedAt: "28 February 2026",
    dateIso: "2026-02-28T09:00:00Z",
    readTime: "5 min read",
    author: {
      name: "Sharper Labs Advisory",
      role: "UI/UX & Web Performance Practice",
      avatar: "/images/hero-marketing-team.jpg",
    },
    image: "/images/brand-marketing-03.png",
    imageAlt: "User experience wireframes and conversion rate optimization layout",
    tags: [
      "How to improve website conversion rates",
      "Conversion-focused web design",
      "Website design agency UK",
      "Responsive web design services",
      "Website redesign services",
    ],
    metaDescription:
      "Master website conversion rate optimisation (CRO). Proven UX layouts, page speed enhancements, and persuasive calls-to-action that turn clicks into high-value clients.",
    tableOfContents: [
      { id: "conversion-disconnect", title: "The Traffic vs Conversion Disconnect" },
      { id: "clarity-above-fold", title: "Mastering Clarity Above the Fold" },
      { id: "reducing-friction", title: "Eliminating Friction in Enquiry Forms" },
      { id: "social-proof", title: "Integrating Credible Social Proof and Case Evidence" },
      { id: "mobile-ux", title: "Mobile Experience: The True Conversion Battleground" },
    ],
    sections: [
      {
        id: "conversion-disconnect",
        heading: "The Traffic vs Conversion Disconnect",
        paragraphs: [
          "Many businesses invest substantial budgets into search engine optimization and paid media, only to see disappointing enquiry numbers. Doubling your traffic can cost thousands, but doubling your conversion rate delivers twice the leads from your existing visitors at virtually no extra ad cost.",
          "Conversion Rate Optimisation (CRO) is the systematic process of identifying why visitors hesitate, and structuring your website journey to make taking the next step effortless.",
        ],
      },
      {
        id: "clarity-above-fold",
        heading: "Mastering Clarity Above the Fold",
        paragraphs: [
          "A visitor forms an impression of your business in less than three seconds. If they cannot immediately determine who you are, what specific problem you solve, and why you are qualified, they will return to Google and click on your competitor.",
          "Ensure your primary headline communicates your exact value proposition, accompanied by clear secondary supporting text, verified trust signals, and a prominent primary call to action.",
        ],
        quote: {
          text: "Your website is often the first place potential customers go to understand your business. It should communicate your value clearly, work smoothly across devices, and make the next step easy.",
          author: "Sharper Labs Web Practice",
        },
      },
      {
        id: "reducing-friction",
        heading: "Eliminating Friction in Enquiry Forms",
        paragraphs: [
          "Every unnecessary form field reduces submission rates. If you only need a name, email, and brief enquiry to begin a dialogue, do not mandate twelve fields asking for turnover, postal address, and company registration numbers.",
          "For international buyers, incorporate automatic country code detection and flexible time-zone selection so overseas prospects can easily arrange consultations without communication hurdles.",
        ],
      },
      {
        id: "social-proof",
        heading: "Integrating Credible Social Proof and Case Evidence",
        paragraphs: [
          "Generic claims like 'We are industry leaders' carry little weight. Replace vague slogans with verified case study results, before-and-after metrics, and authentic testimonials that demonstrate concrete business outcomes.",
        ],
        keyTakeaways: [
          "Keep contact and consultation CTAs persistently accessible via sticky headers and dedicated page blocks.",
          "Showcase measurable results with verifiable timeframes and data sources.",
          "Test multi-step enquiry workflows that break long questions into bite-sized steps.",
        ],
      },
      {
        id: "mobile-ux",
        heading: "Mobile Experience: The True Conversion Battleground",
        paragraphs: [
          "Over 60% of modern web traffic originates on mobile devices. A website that looks stunning on a 27-inch desktop monitor but suffers from tiny tap targets, slow-loading images, or clunky dropdown menus on mobile will hemorrhage leads.",
          "Engineered responsive design ensures responsive layouts, readable type scaling, and instant page loads across every device.",
        ],
      },
    ],
    relatedServices: [
      { name: "Website Design & Development", slug: "website-design-and-development" },
      { name: "Data Analysis", slug: "data-analysis" },
      { name: "Organic SEO", slug: "organic-seo" },
    ],
  },
  {
    slug: "digital-marketing-strategy-for-international-businesses",
    title: "Digital Marketing Strategy for International Businesses: Expanding Beyond Local Markets",
    excerpt:
      "A strategic guide for UK companies looking to expand overseas, and international brands seeking to establish a commanding presence in the UK and European commercial landscape.",
    category: "International Strategy",
    publishedAt: "20 February 2026",
    dateIso: "2026-02-20T09:00:00Z",
    readTime: "8 min read",
    author: {
      name: "Sharper Labs Advisory",
      role: "Cross-Border & Global Marketing Practice",
      avatar: "/images/hero-marketing-team.jpg",
    },
    image: "/images/marketing-landing-1.jpeg",
    imageAlt: "World map and international digital marketing strategy visualization",
    tags: [
      "Digital marketing strategy for international businesses",
      "Digital marketing consultancy UK",
      "B2B digital marketing agency UK",
      "Brand positioning strategy",
      "SEO consultancy UK",
    ],
    metaDescription:
      "How UK and multinational businesses can build international digital marketing strategies: cross-border positioning, multi-region SEO, and global client conversion.",
    tableOfContents: [
      { id: "local-expertise-global", title: "Local Expertise, Global Perspective" },
      { id: "avoiding-localization-traps", title: "Avoiding Common International Localization Traps" },
      { id: "international-seo", title: "Structuring Multi-Regional SEO Architecture" },
      { id: "cross-border-trust", title: "Building Cross-Border Trust and Credibility" },
      { id: "enquiry-readiness", title: "Making Your Sales Funnel Overseas-Ready" },
    ],
    sections: [
      {
        id: "local-expertise-global",
        heading: "Local Expertise, Global Perspective",
        paragraphs: [
          "Expanding into new geographic territories requires a delicate balance. Businesses must project established, credible roots in their primary operating market (such as the UK) while signalling clear competence and seamless delivery capability to international clients.",
          "Language that unnecessarily limits your positioning—such as 'We only serve London businesses' or 'Exclusively for UK enterprises'—creates artificial friction for lucrative cross-border prospects who value British strategic standards and commercial expertise.",
        ],
      },
      {
        id: "avoiding-localization-traps",
        heading: "Avoiding Common International Localization Traps",
        paragraphs: [
          "International marketing is far more than simply translating copy or spinning up automated subdomains. Different markets exhibit distinct purchasing motivations, regulatory expectations, and search habits.",
          "For instance, commercial decision-makers in North America often expect direct pricing transparency and rapid self-serve booking, whereas European enterprise buyers frequently place greater emphasis on governance, compliance, and bespoke consultation.",
        ],
      },
      {
        id: "international-seo",
        heading: "Structuring Multi-Regional SEO Architecture",
        paragraphs: [
          "To capture search intent across multiple countries without incurring keyword cannibalization, companies must implement structured international SEO best practices.",
          "This includes proper hreflang tag configuration, clear regional sitemap submissions, geo-targeted search console properties, and content tailored to search variations across different English-speaking markets.",
        ],
      },
      {
        id: "cross-border-trust",
        heading: "Building Cross-Border Trust and Credibility",
        paragraphs: [
          "When buying high-value services across borders, prospects seek visible indicators of operational stability. Maintain verifiable UK office addresses and registered legal details, while showcasing case studies and testimonials that demonstrate successful cross-market execution.",
        ],
        keyTakeaways: [
          "Highlight UK headquarters alongside international delivery capability for maximum credibility.",
          "Implement international telephone formatting (+44) and dynamic time-zone consultation scheduling.",
          "Target market-specific long-tail keywords that address local commercial pain points.",
        ],
      },
      {
        id: "enquiry-readiness",
        heading: "Making Your Sales Funnel Overseas-Ready",
        paragraphs: [
          "Ensure your response workflows reflect international time differences. Automated booking calendars that sync to the prospect's local timezone ensure smooth, frictionless introductions that build instant rapport.",
        ],
      },
    ],
    relatedServices: [
      { name: "Brand Marketing", slug: "brand-marketing" },
      { name: "Organic SEO", slug: "organic-seo" },
      { name: "Website Design & Development", slug: "website-design-and-development" },
    ],
  },
  {
    slug: "how-to-choose-a-digital-marketing-agency",
    title: "How to Choose a Digital Marketing Agency: Key Criteria, Costs, and Red Flags",
    excerpt:
      "A no-nonsense evaluation guide for business owners and marketing directors. How to evaluate agency capabilities, detect empty promises, and find a true strategic partner.",
    category: "Consultancy",
    publishedAt: "15 February 2026",
    dateIso: "2026-02-15T09:00:00Z",
    readTime: "6 min read",
    author: {
      name: "Sharper Labs Advisory",
      role: "Strategic Client Advisory Practice",
      avatar: "/images/hero-marketing-team.jpg",
    },
    image: "/images/hero-brand-design.jpg",
    imageAlt: "Marketing consultancy partnership discussion in modern boardroom",
    tags: [
      "How to choose a digital marketing agency",
      "Cost of digital marketing services in the UK",
      "Digital marketing consultancy UK",
      "Full-service digital marketing agency",
      "Digital marketing strategy services",
    ],
    metaDescription:
      "Learn how to select the right digital marketing agency in the UK. Discover essential questions to ask, pricing structures, and warning signs of low-quality providers.",
    tableOfContents: [
      { id: "agency-dilemma", title: "The Modern Agency Dilemma: Promises vs Execution" },
      { id: "essential-questions", title: "Five Questions Every Business Must Ask Before Signing" },
      { id: "pricing-models", title: "Understanding Pricing Models: Retainers vs Performance" },
      { id: "red-flags", title: "Three Major Red Flags to Watch Out For" },
      { id: "ideal-partnership", title: "What a Genuinely Collaborative Agency Looks Like" },
    ],
    sections: [
      {
        id: "agency-dilemma",
        heading: "The Modern Agency Dilemma: Promises vs Execution",
        paragraphs: [
          "Selecting a digital marketing partner is one of the most consequential decisions a business makes. The right partner acts as a force multiplier for revenue and brand stature; the wrong one burns capital on vanity metrics and leaves you with wasted months.",
          "With thousands of agencies pitching similar buzzwords, how can decision-makers distinguish genuine strategic capability from polished sales presentations?",
        ],
      },
      {
        id: "essential-questions",
        heading: "Five Questions Every Business Must Ask Before Signing",
        paragraphs: [
          "Before committing to a retainer or project agreement, put these specific questions to the agency team:",
        ],
        bulletPoints: [
          "Who will actually execute the work on a day-to-day basis? (Senior strategists or unvetted junior staff?)",
          "How will performance be measured, and do we maintain direct ownership of all ad accounts and data?",
          "Can you demonstrate verified case studies with before-and-after commercial figures in our sector?",
          "How do your six core services integrate under one roof to support our business objectives?",
          "What is your clear process for continuous improvement when campaigns face market headwinds?",
        ],
      },
      {
        id: "pricing-models",
        heading: "Understanding Pricing Models: Retainers vs Performance",
        paragraphs: [
          "Transparent agencies explain their cost models openly. Whether operating on strategic monthly retainers, project deliverables, or blended consultancy fees, costs should correlate directly with senior talent access and measurable business value.",
          "Beware of rock-bottom monthly packages that offer 'guaranteed #1 Google rankings' for trivial keywords—sustainable SEO and strategic paid media require real intellectual rigor and technical execution.",
        ],
      },
      {
        id: "red-flags",
        heading: "Three Major Red Flags to Watch Out For",
        paragraphs: [
          "Watch out for agencies that withhold account ownership, refuse to provide transparent data access, or lock clients into rigid multi-year contracts with no clear exit clauses for non-performance.",
        ],
        keyTakeaways: [
          "Insist on 100% client ownership of all ad accounts, analytics properties, and creative assets.",
          "Value strategic thinking over generic 'one-size-fits-all' deliverables packages.",
          "Choose partners who are willing to say 'no' to ineffective tactics and propose evidence-backed alternatives.",
        ],
      },
      {
        id: "ideal-partnership",
        heading: "What a Genuinely Collaborative Agency Looks Like",
        paragraphs: [
          "The ideal agency operates as an extension of your leadership team. They take time to understand your commercial margins, challenge your assumptions with data, and deliver clear, transparent reporting that demonstrates measurable progress, not empty promises.",
        ],
      },
    ],
    relatedServices: [
      { name: "Brand Marketing", slug: "brand-marketing" },
      { name: "Pay-Per-Click (PPC)", slug: "pay-per-click" },
      { name: "Data Analysis", slug: "data-analysis" },
    ],
  },
  {
    slug: "brand-positioning-strategies-for-growing-businesses",
    title: "Brand Positioning Strategies for Growing Businesses: Differentiation That Drives Sales",
    excerpt:
      "Your brand is much more than a logo. Discover how strategic positioning, crisp messaging, and distinct identity development empower growing companies to dominate crowded markets.",
    category: "Brand Strategy",
    publishedAt: "10 February 2026",
    dateIso: "2026-02-10T09:00:00Z",
    readTime: "7 min read",
    author: {
      name: "Sharper Labs Advisory",
      role: "Brand Identity & Positioning Practice",
      avatar: "/images/hero-marketing-team.jpg",
    },
    image: "/images/brand-marketing-01.png",
    imageAlt: "Creative visual brand positioning and distinctive logo architecture",
    tags: [
      "Brand positioning strategies for growing businesses",
      "Brand positioning strategy",
      "Brand marketing agency UK",
      "Brand strategy consultancy",
      "Brand identity design services",
    ],
    metaDescription:
      "Master brand positioning for growing businesses. Learn how to clarify your value proposition, define your tone of voice, and outmaneuver competitors in UK and global markets.",
    tableOfContents: [
      { id: "more-than-a-logo", title: "Why Your Brand Is More Than a Logo" },
      { id: "defining-positioning", title: "Defining Where Your Business Wins" },
      { id: "tone-and-messaging", title: "Tone of Voice and Distinctive Personality" },
      { id: "cross-channel-consistency", title: "Executing Consistency Across All Touchpoints" },
      { id: "commercial-impact", title: "The Measurable Commercial Impact of Strong Branding" },
    ],
    sections: [
      {
        id: "more-than-a-logo",
        heading: "Why Your Brand Is More Than a Logo",
        paragraphs: [
          "A logo is merely an identifier; a brand is the sum total of emotional perceptions, expectations, and memories that shape how customers decide whether to trust and buy from your company.",
          "When businesses compete purely on price or feature checklists, they enter an exhausting race to the bottom. Strategic brand positioning creates emotional and commercial distinction, enabling premium pricing and higher customer lifetime value.",
        ],
        quote: {
          text: "Your brand is the identity, message, and experience that shape how customers perceive your business across digital and offline touchpoints.",
          author: "Sharper Labs Brand Practice",
        },
      },
      {
        id: "defining-positioning",
        heading: "Defining Where Your Business Wins",
        paragraphs: [
          "Effective positioning requires deep research into three overlapping dimensions: what your target customers genuinely care about, where your competitors are vulnerable, and what your organisation uniquely delivers better than anyone else.",
          "When you pinpoint that intersection, your core value proposition becomes unmistakable to your ideal buyers.",
        ],
      },
      {
        id: "tone-and-messaging",
        heading: "Tone of Voice and Distinctive Personality",
        paragraphs: [
          "B2B and corporate communications are frequently plagued by hollow corporate jargon—terms like 'synergy', 'innovative solutions', and 'paradigm shifts' that say nothing.",
          "Developing a distinctive, confident tone of voice humanizes your brand and commands attention. Whether communicating through your website, LinkedIn content, or executive proposals, clarity always outperforms complexity.",
        ],
      },
      {
        id: "cross-channel-consistency",
        heading: "Executing Consistency Across All Touchpoints",
        paragraphs: [
          "Brand equity is built through repetition and coherence. Every interaction—from your digital ad creative and website navigation to your pitch presentations and customer onboarding—must reinforce the exact same standard of quality.",
        ],
        keyTakeaways: [
          "Clarify your core differentiator in a single, compelling sentence before designing creative assets.",
          "Establish robust brand guidelines that govern typography, colour palette, imagery, and copywriting.",
          "Regularly audit customer touchpoints to eliminate inconsistent or outdated messaging.",
        ],
      },
      {
        id: "commercial-impact",
        heading: "The Measurable Commercial Impact of Strong Branding",
        paragraphs: [
          "Strong branding is not vanity; it is the ultimate marketing catalyst. Companies with clear, cohesive brand positioning enjoy lower customer acquisition costs, significantly higher organic inbound conversion rates, and vastly superior customer retention.",
        ],
      },
    ],
    relatedServices: [
      { name: "Brand Marketing", slug: "brand-marketing" },
      { name: "Website Design & Development", slug: "website-design-and-development" },
      { name: "Social Media Marketing", slug: "social-media-marketing" },
    ],
  },
];

function formatPublishedDate(date: Date | string | null | undefined): string {
  if (!date) return "Recently published";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Recently published";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function mapPrismaPostToBlogPost(post: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  coverImageAlt: string | null;
  content: unknown;
  readTime: string;
  tags: unknown;
  metaDescription: string | null;
  status: string;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  author?: {
    name: string;
    role?: string;
  } | null;
}): BlogPost {
  let rawSections: Array<{
    id?: string;
    heading?: string;
    paragraphs?: string[] | string;
    bulletPoints?: string[];
    keyTakeaways?: string[];
    quote?: { text: string; author?: string };
  }> = [];

  if (Array.isArray(post.content)) {
    rawSections = post.content as typeof rawSections;
  } else if (typeof post.content === "string") {
    try {
      const parsed = JSON.parse(post.content);
      if (Array.isArray(parsed)) rawSections = parsed;
    } catch {
      rawSections = [{ id: "section-1", heading: post.title, paragraphs: [post.content] }];
    }
  }

  const sections: BlogSection[] = rawSections.map((sec, idx) => ({
    id: sec.id || `section-${idx + 1}`,
    heading: sec.heading || `Strategic Insight ${idx + 1}`,
    paragraphs: Array.isArray(sec.paragraphs)
      ? sec.paragraphs
      : typeof sec.paragraphs === "string"
      ? sec.paragraphs.split("\n\n").filter(Boolean)
      : [String(sec.paragraphs || "")],
    bulletPoints: Array.isArray(sec.bulletPoints) ? sec.bulletPoints : undefined,
    keyTakeaways: Array.isArray(sec.keyTakeaways) ? sec.keyTakeaways : undefined,
    quote: sec.quote?.text ? sec.quote : undefined,
  }));

  const tableOfContents = sections.map((s, idx) => ({
    id: s.id || `section-${idx + 1}`,
    title: s.heading,
  }));

  let tags: string[] = [];
  if (Array.isArray(post.tags)) {
    tags = post.tags as string[];
  } else if (typeof post.tags === "string") {
    try {
      const parsed = JSON.parse(post.tags);
      if (Array.isArray(parsed)) tags = parsed;
      else tags = [post.tags];
    } catch {
      tags = [post.tags];
    }
  }

  const publishedDate = post.publishedAt || post.createdAt;
  const dateIso = publishedDate ? new Date(publishedDate).toISOString() : new Date().toISOString();
  const publishedAt = formatPublishedDate(publishedDate);

  const relatedServices = [
    { name: "Brand Marketing", slug: "brand-marketing" },
    { name: "Organic SEO", slug: "organic-seo" },
    { name: "Website Design & Development", slug: "website-design-and-development" },
  ];

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    category: post.category || "Consultancy",
    publishedAt,
    dateIso,
    readTime: post.readTime || "5 min read",
    author: {
      name: post.author?.name || "Sharper Labs Advisory",
      role: post.author?.role === "SUPER_ADMIN" ? "Senior Strategic Practice" : "Digital Strategy Practice",
      avatar: "/images/hero-marketing-team.jpg",
    },
    image: post.coverImage || "/images/marketing-landing-1.jpeg",
    imageAlt: post.coverImageAlt || post.title,
    featured: Boolean(post.featured),
    tags,
    metaDescription: post.metaDescription || post.excerpt || post.title,
    tableOfContents,
    sections,
    relatedServices,
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        author: {
          select: { name: true, role: true },
        },
      },
    });

    if (dbPosts && dbPosts.length > 0) {
      const mappedDbPosts = dbPosts.map(mapPrismaPostToBlogPost);
      const dbSlugs = new Set(mappedDbPosts.map((p) => p.slug));

      // Append any static fallback posts not present in the database
      const remainingStatic = blogPosts.filter((p) => !dbSlugs.has(p.slug));
      return [...mappedDbPosts, ...remainingStatic];
    }
  } catch (err) {
    console.warn("[Blog] Database query skipped or failed, using static fallback:", err);
  }

  return blogPosts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const dbPost = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: { name: true, role: true },
        },
      },
    });

    if (dbPost) {
      return mapPrismaPostToBlogPost(dbPost);
    }
  } catch (err) {
    console.warn(`[Blog] Failed to fetch post "${slug}" from database:`, err);
  }

  return blogPosts.find((p) => p.slug === slug);
}

export async function getRelatedBlogPosts(slug: string, limit: number = 2): Promise<BlogPost[]> {
  const all = await getAllBlogPosts();
  return all.filter((p) => p.slug !== slug).slice(0, limit);
}

export async function getFeaturedBlogPost(): Promise<BlogPost | undefined> {
  const all = await getAllBlogPosts();
  return all.find((p) => p.featured) || all[0];
}

export async function getAllBlogCategories(): Promise<string[]> {
  const all = await getAllBlogPosts();
  const categories = new Set(all.map((p) => p.category));
  return ["All", ...Array.from(categories)];
}

export function getAllBlogPostsSync(): BlogPost[] {
  return blogPosts;
}

export function getBlogPostSync(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
