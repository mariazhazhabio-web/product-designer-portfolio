// Edit this file to update personal details shown across the portfolio.
// Fields left empty are hidden automatically (nothing is invented).

export const profile = {
  name: "Maria Zha-Zha Cornillez Bio",
  shortName: "Maria Bio",
  title: "Product Designer | UI/UX Designer | AI-Assisted Digital Product Developer",
  positioning:
    "A multidisciplinary professional with a background in digital product development, systems management, process improvement, instructional design, research, data analysis, and AI-assisted solutions.",
  education: [
    "Bachelor of Science in Chemical Engineering",
    "Bachelor of Science in Criminology",
    "Master in Management, major in Public Administration",
    "Professional teaching qualifications",
  ],
  // Fill these in before publishing. Empty values are not displayed.
  contactEmail: "",
  linkedin: "",
  github: "",
  location: "",
  availability: "Open to Product Designer roles (remote / international)",
};

export const primaryNav = [
  { href: "/projects/", label: "Work" },
  { href: "/projects/sportsync/", label: "SportSync" },
  { href: "/process/", label: "Process" },
  { href: "/research/", label: "Research" },
  { href: "/design-system/", label: "Design System" },
  { href: "/demo/", label: "Prototype" },
  { href: "/about/", label: "About" },
];

export const allPages = [
  { group: "Portfolio", items: [
    { href: "/", label: "Home" },
    { href: "/about/", label: "About me" },
    { href: "/projects/", label: "Selected projects" },
    { href: "/skills/", label: "Technical skills" },
    { href: "/resume/", label: "Resume" },
    { href: "/contact/", label: "Contact" },
    { href: "/role-alignment/", label: "Role alignment" },
  ]},
  { group: "SportSync case study", items: [
    { href: "/projects/sportsync/", label: "Case study (22 sections)" },
    { href: "/process/", label: "Product design process" },
    { href: "/research/", label: "UX research" },
    { href: "/architecture/", label: "Information architecture & flows" },
    { href: "/wireframes/", label: "Wireframes (lo / mid / hi-fi)" },
    { href: "/design-system/", label: "Design system" },
    { href: "/prototypes/", label: "Interactive prototypes" },
    { href: "/usability/", label: "Usability testing plan" },
    { href: "/metrics/", label: "Product metrics" },
    { href: "/engineering/", label: "Engineering handoff & QA" },
  ]},
  { group: "Other case studies", items: [
    { href: "/projects/widekonek/", label: "WideKonek" },
    { href: "/projects/frendora/", label: "Frendora" },
    { href: "/projects/zc-smart-digital/", label: "ZC Smart Digital" },
  ]},
  { group: "Live demo & documents", items: [
    { href: "/demo/", label: "SportSync live demo" },
    { href: "/docs/", label: "Documents library" },
  ]},
];
