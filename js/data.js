/* ============================================================
   ANKIT OS — Content Data Schema
   ------------------------------------------------------------
   This is the ONLY file you need to edit to personalize the
   entire site. Every section (hero, timeline, projects, skills,
   stats, terminal, contact) renders dynamically from this
   object. The terminal's free-text answers (ai-agent.js) also
   read directly from here, so they always stay in sync.

   Fields still marked FILL_IN are real gaps — fill them in
   before going live. Everything else below is your real content,
   carried over from your existing repo.
============================================================ */

const PROFILE = {

  // ---------------- Identity ----------------
  name: "Ankit Vishwa",
  initials: "AV",
  photoUrl: "assets/profile.png",  // falls back to initials automatically if this fails to load
  title: "Infrastructure Engineer",
  roles: ["DevOps Engineer", "Cloud Infrastructure", "Linux Administrator"],
  tagline: "I design, deploy and secure enterprise infrastructure, Linux environments, cloud platforms and VoIP systems — focused on performance, automation and reliability.",
  location: "FILL_IN City, India", // e.g. "Vadodara, India" — confirm before publishing
  availability: {
    open: true,
    label: "Available for Freelance Projects"
  },

  // ---------------- Contact ----------------
  contact: {
    email: "FILL_IN@example.com",
    phone: "",
    linkedin: "FILL_IN https://linkedin.com/in/yourhandle",
    github: "https://github.com/Mkali10"
  },

  // ---------------- Resume file ----------------
  resume: {
    path: "resume/resume.pdf",
    filename: "Ankit_Vishwa_Resume.pdf"
  },

  // ---------------- Optional: real-LLM backend for the voice agent ----------------
  // Leave blank to use the built-in local engine (js/ai-agent.js) — free,
  // instant, no server needed, works the moment this is hosted anywhere.
  // Fill in a URL (e.g. "https://your-domain.com/resume-agent/ask") to
  // route free-form questions through a real LLM instead. See
  // server/resume_agent_server.py for the matching backend — NEVER put
  // an API key directly in this file or anywhere in the frontend.
  aiBackendUrl: "",

  // ---------------- Hero "Worked With" chips ----------------
  heroTech: ["Linux", "AWS", "Fortinet", "OpenStack", "Asterisk"],

  // ---------------- Experience timeline (most recent first) ----------------
  experience: [
    {
      role: "Freelance DevOps & Cloud Infrastructure Engineer",
      company: "Self Employed",
      duration: "Mar 2026 — Present",
      current: true,
      summary: "",
      details: [
        "Deploy Linux production servers",
        "AWS infrastructure design and management",
        "Asterisk & FreePBX deployment",
        "Server hardening",
        "Automation using Bash & Python"
      ],
      tech: ["Linux Administration", "AWS", "VoIP", "Automation", "Networking", "Security"]
    },
    {
      role: "IT Lead",
      company: "PolicyX.com",
      duration: "2024 — 2026",
      current: false,
      summary: "",
      details: [],
      tech: ["Infrastructure", "Cloud", "Firewall", "Linux"]
    },
    {
      role: "Senior System Engineer",
      company: "Deepija Telecom",
      duration: "2022 — 2024",
      current: false,
      summary: "",
      details: [],
      tech: ["VoIP", "Linux", "Networking"]
    },
    {
      role: "Network Engineer",
      company: "Bharti Hexacom",
      duration: "2021 — 2022",
      current: false,
      summary: "",
      details: [],
      tech: ["GPON", "MPLS", "OLT", "Routing"]
    }
  ],

  // ---------------- Projects ----------------
  // links left empty on purpose — your current site has "#" placeholders,
  // not real URLs. Add real links (or a written case-study page path) here
  // and the buttons will appear automatically.
  projects: [
    {
      title: "Port Intent Detector",
      category: "Networking",
      description: "Network traffic monitoring and intelligent port analysis solution for infrastructure environments.",
      image: "",
      stack: ["Linux", "Python", "TCP/IP", "Automation"],
      links: { caseStudy: "", architecture: "" }
    },
    {
      title: "Enterprise Infrastructure",
      category: "Cloud",
      description: "Deployment and management of Linux servers, cloud infrastructure and enterprise networking.",
      image: "",
      stack: ["AWS", "Ubuntu", "Rocky Linux", "Nginx"],
      links: { caseStudy: "", architecture: "" }
    },
    {
      title: "VoIP Infrastructure",
      category: "VoIP",
      description: "Enterprise Asterisk, SIP trunk, IVR and PBX deployment solutions.",
      image: "",
      stack: ["Asterisk", "FreePBX", "SIP", "WebRTC"],
      links: { caseStudy: "", architecture: "" }
    }
  ],

  // ---------------- Skills ----------------
  // Derived from your real experience/project tech above. Names only —
  // no proficiency numbers yet. Give each item a level (0-100) later and
  // it automatically upgrades from a plain tag to an animated bar.
  skills: {
    categories: [
      {
        name: "Cloud",
        icon: "cloud",
        items: [
          { name: "AWS", level: 0 },
          { name: "OpenStack", level: 0 }
        ]
      },
      {
        name: "Linux",
        icon: "terminal",
        items: [
          { name: "Ubuntu", level: 0 },
          { name: "Rocky Linux", level: 0 },
          { name: "Server Hardening", level: 0 }
        ]
      },
      {
        name: "Networking",
        icon: "network",
        items: [
          { name: "GPON", level: 0 },
          { name: "MPLS", level: 0 },
          { name: "OLT", level: 0 },
          { name: "Routing", level: 0 },
          { name: "Fortinet", level: 0 }
        ]
      },
      {
        name: "VoIP",
        icon: "phone",
        items: [
          { name: "Asterisk", level: 0 },
          { name: "FreePBX", level: 0 },
          { name: "SIP", level: 0 },
          { name: "WebRTC", level: 0 }
        ]
      },
      {
        name: "Programming",
        icon: "code",
        items: [
          { name: "Python", level: 0 },
          { name: "Bash", level: 0 }
        ]
      },
      {
        name: "DevOps",
        icon: "devops",
        items: [
          { name: "Automation", level: 0 },
          { name: "Nginx", level: 0 }
        ]
      }
    ]
  },

  // ---------------- Certifications ----------------
  // None listed yet — add real ones here (e.g. AWS/RHCE/Cisco) and the
  // section appears automatically; it stays hidden while this is empty.
  certifications: [],

  // ---------------- Stats ----------------
  stats: [
    { label: "Years Experience", value: 9, suffix: "+" },
    { label: "Projects Completed", value: 50, suffix: "+" },
    { label: "Servers Managed", value: 100, suffix: "+" },
    { label: "Hours Support", value: 24, suffix: "/7" }
  ]
};

if (typeof module !== "undefined" && module.exports) module.exports = PROFILE;
