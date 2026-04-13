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
    tags: ["Ambient AI", "Clinical Documentation", "EHR"],
    tall: false,
    url: "https://www.ambiencehealthcare.com/",
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
    tags: ["RCM", "Ambient AI", "Healthcare Ops"],
    tall: true,
    url: "https://www.commure.com/",
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
    tags: ["Fintech", "Community Lending", "Payments"],
    tall: true,
    url: "https://www.incuto.com/",
  },
  {
    id: "4",
    title: "Unit21",
    category: "Previous role",
    role: "Engineering",
    description:
      "Risk and fraud operations tooling — helping teams detect suspicious activity, investigate cases, and stay ahead of financial crime.",
    image:
      "https://cdn.prod.website-files.com/61e589aa65b0300f0d3e0b70/69adef97057fd6b3d4515fb9_social-opengraph-general.png",
    tier: "noteworthy",
    tags: ["Fraud", "AML", "Risk Infrastructure"],
    tall: false,
    url: "https://www.unit21.ai/",
  },
  {
    id: "5",
    title: "Babyscripts",
    category: "Previous role",
    role: "Engineering",
    description:
      "Remote pregnancy care — connecting patients and providers with monitoring and education to improve maternal health outcomes.",
    image: "https://babyscripts.com/hubfs/bloodpressure_heroimage.png",
    tier: "noteworthy",
    tags: ["Digital Health", "Remote Monitoring", "Maternal Care"],
    tall: true,
    url: "https://www.babyscripts.com/",
  },
  {
    id: "6",
    title: "Panorama Education",
    category: "Previous role",
    role: "Engineering",
    description:
      "K–12 analytics and surveys — giving schools actionable insight into student success, well-being, and engagement.",
    image: "https://www.panoramaed.com/hubfs/panorama-education-district-view.png",
    tier: "noteworthy",
    tags: ["EdTech", "MTSS", "Student Analytics"],
    tall: false,
    url: "https://www.panoramaed.com/",
  },
];
