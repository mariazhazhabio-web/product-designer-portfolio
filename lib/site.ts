// Edit this file to update personal details shown across the portfolio.
// Fields left empty are hidden automatically (nothing is invented).

export const profile = {
  name: "Maria Zha-Zha Cornillez Bio",
  shortName: "Maria Bio",
  title: "Product Designer | UI/UX Designer | AI-Assisted Digital Product Developer",
  positioning:
    "A multidisciplinary professional with a background in digital product development, systems management, process improvement, instructional design, research, data analysis, and AI-assisted solutions.",
  education: [
    "Master in Management, major in Public Administration · Philippine Christian University, 2023",
    "Bachelor of Secondary Education, major in Social Studies · College of the Most Holy Trinity Catholic Foundation, 2022",
    "Bachelor of Science in Criminology · University of La Salette, 2011",
    "Bachelor of Science in Chemical Engineering · Eastern Visayas State University, 2006",
  ],
  licenses: [
    "Licensed Professional Teacher · Professional Regulation Commission (PRC)",
    "Registered Criminologist · Professional Regulation Commission (PRC)",
    "Registered Chemical Technician · Professional Regulation Commission (PRC)",
    "Civil Service Professional Eligibility · Civil Service Commission (CSC)",
  ],
  experience: [
    {
      title: "Administrative, Research, and Policy Management Professional",
      org: "National Government Agency, Philippines",
      years: "2008 – Present",
      points: ["Administrative management, research and policy management work in the Philippine public sector."],
    },
    {
      title: "Online English as a Second Language (ESL) Teacher",
      org: "Bibo Global Opportunity, Inc.",
      years: "2016",
      points: ["Taught English as a second language to learners in online sessions."],
    },
    {
      title: "Customer Service Representative",
      org: "ICT Marketing Services",
      years: "2007 – 2008",
      points: ["Supported customers through phone, email and chat channels."],
    },
  ],
  // Empty values are not displayed.
  contactEmail: "mariazhazhabio@gmail.com",
  phone: "+63 997 700 0232",
  linkedin: "https://www.linkedin.com/in/zha-zha-bio-56824a195/",
  github: "https://github.com/mariazhazhabio-web",
  location: "Philippines",
  timezone: "Philippine Standard Time (UTC+8)",
  availability: "Open to remote Product Designer roles: part-time or flexible hours",
  availabilityDetails: [
    ["Start date", "Subject to agreement"],
    ["Interviews", "By appointment"],
    ["Work arrangement", "Remote, part-time or flexible working hours"],
    ["Time zone", "Philippine Standard Time (UTC+8)"],
    ["International hours", "Subject to an agreed schedule"],
  ] as [string, string][],
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
