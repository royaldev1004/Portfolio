// Dev / no-Supabase fallback — mirrors seed rows in supabase/schema.sql `projects`.
export const FALLBACK_PROJECTS = [
  {
    id: "1",
    title: "Ambience Healthcare",
    category: "Previous role",
    role: "Engineering",
    description:
      "AI-powered clinical documentation and workflow tools that help clinicians spend less time on the keyboard and more time with patients.",
    image:
      "https://framerusercontent.com/images/l2jbzG0Wzk7GJYt31m2QzU82JzQ.png",
    tier: "notable",
    workCategory: null,
    subcategory: "",
    tags: ["Ambient AI", "Clinical Documentation", "EHR"],
    screenshots: [
      "https://framerusercontent.com/images/l2jbzG0Wzk7GJYt31m2QzU82JzQ.png",
      "/ambience-healthcare-screenshot.png",
    ],
    tall: false,
    url: "https://www.ambiencehealthcare.com/",
    feedbackText:
      "Outstanding collaboration and technical depth. Communication was clear at every milestone, and the delivery exceeded what we expected on timeline and quality.",
    feedbackAuthor: "Product & Engineering Lead",
  },
  {
    id: "2",
    title: "Commure",
    category: "Previous role",
    role: "Engineering",
    description:
      "Healthcare operations and developer infrastructure — connecting systems so care teams can move faster with safer, more interoperable data.",
    image:
      "https://cdn.prod.website-files.com/66b319e3933cb4cb9c43ebdc/66cb9c13447baaa8b66e7511_Commure%20-%20Open%20Graph%20Image.jpg",
    tier: "notable",
    workCategory: null,
    subcategory: "",
    tags: ["RCM", "Ambient AI", "Healthcare Ops"],
    screenshots: [
      "https://cdn.prod.website-files.com/66b319e3933cb4cb9c43ebdc/66cb9c13447baaa8b66e7511_Commure%20-%20Open%20Graph%20Image.jpg",
      "/commure-screenshot.png",
    ],
    tall: true,
    url: "https://www.commure.com/",
    feedbackText:
      "A rare mix of systems thinking and pragmatism. They integrated cleanly with our stack and made complex healthcare interoperability feel approachable for the whole team.",
    feedbackAuthor: "Director of Platform Engineering",
  },
  {
    id: "3",
    title: "Incuto",
    category: "Previous role",
    role: "Engineering",
    description:
      "Platform work for community-focused financial services — improving access to fair banking and lending through modern software.",
    image:
      "https://static1.squarespace.com/static/5c8ad859e8ba4434f9bf43f6/t/5db2fabdca41e03baabf6c71/1572010686772/Incutopurple600.png?format=1500w",
    tier: "notable",
    workCategory: null,
    subcategory: "",
    tags: ["Fintech", "Community Lending", "Payments"],
    screenshots: [
      "https://static1.squarespace.com/static/5c8ad859e8ba4434f9bf43f6/t/5db2fabdca41e03baabf6c71/1572010686772/Incutopurple600.png?format=1500w",
      "/incuto-screenshot.png",
    ],
    tall: true,
    url: "https://www.incuto.com/",
    feedbackText:
      "Reliable partner for our community lending roadmap — thoughtful about risk, accessibility, and long-term maintainability. We would work together again without hesitation.",
    feedbackAuthor: "Head of Product",
  },
  {
    id: "4",
    title: "Lead Generation & Appointment Booking System",
    category: "GoHighLevel",
    role: "CRM & Automation Engineer",
    description:
      "Built a full lead generation and automated appointment booking system using GoHighLevel with Calendly integration, enabling seamless scheduling and follow-up automation.",
    image:
      "https://cdn.prod.website-files.com/61e589aa65b0300f0d3e0b70/69adef97057fd6b3d4515fb9_social-opengraph-general.png",
    tier: "noteworthy",
    workCategory: "ghl",
    subcategory: "CRM Automation",
    tags: ["GHL", "Calendly", "Calendly"],
    screenshots: [
      "https://cdn.prod.website-files.com/61e589aa65b0300f0d3e0b70/69adef97057fd6b3d4515fb9_social-opengraph-general.png",
    ],
    tall: false,
    url: "",
    feedbackText:
      "Fast iteration, thoughtful architecture, and excellent communication. The tools they built quickly became core to our daily operations.",
    feedbackAuthor: "Risk Operations Manager",
  },
  {
    id: "5",
    title: "AI Voice Agents & Calendar Automation",
    category: "Voice Agent",
    role: "CRM & AI Engineer",
    description:
      "I designed and implemented an AI-powered communication and scheduling system for a medical spa, leveraging Retell to deploy intelligent voice agents that handled inbound inquiries, answered common questions, and guided patients toward booking.",
    image: "https://babyscripts.com/hubfs/bloodpressure_heroimage.png",
    tier: "noteworthy",
    workCategory: "ai-voice-agent",
    subcategory: "Medical Spa",
    tags: ["Retell", "N8N", "GHL"],
    screenshots: [
      "https://babyscripts.com/hubfs/bloodpressure_heroimage.png",
    ],
    tall: true,
    url: "",
    feedbackText:
      "He delivered exactly what we needed for our AI voice and calendar workflow. The system felt smooth, professional, and practical from day one.",
    feedbackAuthor: "Medical Spa Owner",
  },
  {
    id: "6",
    title: "Plumbing, HVAC & Electrical Services – AI Voice Booking System",
    category: "AI Voice Agent",
    role: "AI & CRM Engineer",
    description:
      "Designed and deployed an AI voice booking system for a home services company, automating inbound call handling and appointment scheduling.",
    image: "https://www.panoramaed.com/hubfs/panorama-education-district-view.png",
    tier: "noteworthy",
    workCategory: "ai-voice-agent",
    subcategory: "Home Services",
    tags: ["Retell", "N8N", "GoHighLevel"],
    screenshots: [
      "https://www.panoramaed.com/hubfs/panorama-education-district-view.png",
    ],
    tall: false,
    url: "",
    feedbackText:
      "Turned ambiguous district requirements into a clear analytics story. Stakeholder communication was excellent across engineering and education teams.",
    feedbackAuthor: "VP of Data & Insights",
  },
  {
    id: "7",
    title: "AI Agent for eCommerce Image Generation",
    category: "n8n",
    role: "Automation Engineer",
    description:
      "Built an AI agent pipeline that automatically generates high-quality product images for eCommerce stores using n8n workflow automation.",
    image: "https://www.panoramaed.com/hubfs/panorama-education-district-view.png",
    tier: "noteworthy",
    workCategory: "automation",
    subcategory: "eCommerce",
    tags: ["N8N", "OpenAI", "eCommerce"],
    screenshots: [],
    tall: false,
    url: "",
    feedbackText: "",
    feedbackAuthor: "",
  },
];
