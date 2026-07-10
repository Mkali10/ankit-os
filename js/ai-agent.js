/* ============================================================
   ANKIT OS — Resume AI Agent
   ------------------------------------------------------------
   A fully client-side question-answering engine. It reads
   PROFILE (from data.js) at query time and generates answers —
   there is no external API call, no key to leak, and no server
   required, so this works the moment the site is hosted
   anywhere (GitHub Pages, Vercel static, etc).

   Why not a real LLM call from the browser? Calling Claude/GPT
   directly from client-side JS would require embedding an API
   key in public HTML — anyone viewing source could copy it and
   run up charges on your account. If you later want true LLM
   answers, keep this file's interface (ResumeAI.ask) and swap
   the internals for a fetch() to a small backend proxy you
   control (e.g. a FastAPI route on your own server) that holds
   the key server-side.
============================================================ */

const ResumeAI = (() => {

  const isFilled = (v) => typeof v === "string" && v.trim() !== "" && !v.includes("FILL_IN");

  const pick = (...vals) => vals.find(isFilled) || "";

  /* ---------------- Intent definitions ---------------- */
  const GREETING_WORDS = ["hi", "hello", "hey", "namaste", "yo"];

  const intents = [
    {
      name: "identity",
      keywords: ["who", "about him", "tell me about", "introduce", "background", "summary"],
      handler: () => identityAnswer()
    },
    {
      name: "experience",
      keywords: ["experience", "work", "job", "role", "company", "years", "career", "employer", "currently working"],
      handler: (q) => experienceAnswer(q)
    },
    {
      name: "projects",
      keywords: ["project", "built", "build", "portfolio", "work sample", "github repo", "shipped"],
      handler: () => projectsAnswer()
    },
    {
      name: "skills",
      keywords: ["skill", "tech stack", "technology", "know", "proficient", "language", "framework", "tool", "stack"],
      handler: (q) => skillsAnswer(q)
    },
    {
      name: "certifications",
      keywords: ["certificate", "certification", "cert", "credential"],
      handler: () => certsAnswer()
    },
    {
      name: "stats",
      keywords: ["how many", "number of", "stat", "servers", "clients"],
      handler: () => statsAnswer()
    },
    {
      name: "availability",
      keywords: ["available", "availability", "hire", "notice period", "open to"],
      handler: () => availabilityAnswer()
    },
    {
      name: "contact",
      keywords: ["contact", "email", "reach", "linkedin", "phone", "connect", "get in touch"],
      handler: () => contactAnswer()
    },
    {
      name: "pitch",
      keywords: ["why should", "why hire", "strength", "best fit", "suitable"],
      handler: () => pitchAnswer()
    },
    {
      name: "resume",
      keywords: ["resume", "cv", "download"],
      handler: () => resumeAnswer()
    }
  ];

  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  // Strict whole-word match — used for greeting detection, where a short
  // word like "hi" must NOT match inside unrelated words ("his", "him").
  function hasWordExact(query, word) {
    return new RegExp(`\\b${escapeRegex(word)}\\b`, "i").test(query);
  }

  // Flexible match for intent keywords — allows common suffixes so
  // "skill" also matches "skills", "project" matches "projects", etc.
  // Multi-word phrases stay strict (low collision risk either way).
  function hasPhrase(query, phrase) {
    if (phrase.includes(" ")) {
      return new RegExp(`\\b${escapeRegex(phrase)}\\b`, "i").test(query);
    }
    return new RegExp(`\\b${escapeRegex(phrase)}(s|es|ed|ing|er)?\\b`, "i").test(query);
  }

  function score(query, keywords) {
    let s = 0;
    keywords.forEach(k => { if (hasPhrase(query, k)) s += k.split(" ").length; });
    return s;
  }

  // Recognizes real names pulled straight from data.js (company, role,
  // project title, skill name) so a question like "tell me about Acme
  // Corp" routes correctly even without a generic keyword like "work".
  function detectNamedEntity(q) {
    for (const e of (PROFILE.experience || [])) {
      if ((isFilled(e.company) && q.includes(e.company.toLowerCase())) ||
          (isFilled(e.role) && q.includes(e.role.toLowerCase()))) {
        return { name: "experience", handler: (query) => experienceAnswer(query) };
      }
    }
    for (const p of (PROFILE.projects || [])) {
      if (isFilled(p.title) && q.includes(p.title.toLowerCase())) {
        return { name: "projects", handler: () => projectsAnswer() };
      }
    }
    for (const cat of ((PROFILE.skills || {}).categories || [])) {
      for (const item of (cat.items || [])) {
        if (isFilled(item.name) && q.includes(item.name.toLowerCase())) {
          return { name: "skills", handler: (query) => skillsAnswer(query) };
        }
      }
    }
    return null;
  }

  function detectIntent(rawQuery) {
    const q = rawQuery.toLowerCase().trim();
    const wordCount = q.split(/\s+/).filter(Boolean).length;

    // Short greetings are handled as a special case so a word like "hi"
    // doesn't get outscored/confused by longer intent phrases.
    if (wordCount <= 3 && GREETING_WORDS.some(g => hasWordExact(q, g))) {
      return { name: "greeting", handler: () => greetingAnswer() };
    }

    const namedEntity = detectNamedEntity(q);
    if (namedEntity) return namedEntity;

    let best = null, bestScore = 0;
    intents.forEach(intent => {
      const s = score(q, intent.keywords);
      if (s > bestScore) { bestScore = s; best = intent; }
    });
    return best;
  }

  /* ---------------- Answer builders ---------------- */

  function greetingAnswer() {
    const name = pick(PROFILE.name);
    return `Hey! I can answer questions about ${name ? name + "'s" : "this candidate's"} experience, projects, skills, or how to get in touch. What would you like to know?`;
  }

  function identityAnswer() {
    const name = pick(PROFILE.name);
    const title = pick(PROFILE.title);
    const tagline = pick(PROFILE.tagline);
    const location = pick(PROFILE.location);
    const roles = (PROFILE.roles || []).filter(isFilled);
    if (!name && !title) {
      return "Profile summary is being finalized right now — try asking about experience, projects, or skills, or reach out directly via the Contact section.";
    }
    let parts = [];
    parts.push(`${name || "This candidate"} ${title ? "works as a " + title : ""}${location ? " based in " + location : ""}.`.replace(/\s+/g, " ").trim());
    if (roles.length) parts.push(`Focus areas: ${roles.join(", ")}.`);
    if (tagline) parts.push(tagline);
    return parts.join(" ");
  }

  function experienceAnswer(query) {
    const exp = (PROFILE.experience || []).filter(e => isFilled(e.role) && isFilled(e.company));
    if (exp.length === 0) {
      return "Experience details are being added right now — check back shortly, or ask me about projects and skills in the meantime.";
    }
    // if query mentions a specific company/role keyword, try to match it
    const q = (query || "").toLowerCase();
    const match = exp.find(e => q.includes(e.company.toLowerCase()) || q.includes(e.role.toLowerCase()));
    const e = match || exp[0];
    let out = `${e.current ? "Currently" : "Previously"} ${e.role} at ${e.company}${isFilled(e.duration) ? " (" + e.duration + ")" : ""}.`;
    if (isFilled(e.summary)) out += ` ${e.summary}`;
    const details = (e.details || []).filter(isFilled);
    if (details.length) out += ` Highlights: ${details.slice(0, 2).join("; ")}.`;
    if (exp.length > 1) out += ` There's ${exp.length - 1} more role on the timeline — scroll to Experience for the full picture.`;
    return out;
  }

  function projectsAnswer() {
    const projects = (PROFILE.projects || []).filter(p => isFilled(p.title));
    if (projects.length === 0) {
      return "Project details are being added right now — the Projects section will list shipped work with tech stacks and links once it's ready.";
    }
    const lines = projects.slice(0, 3).map(p => {
      const stack = (p.stack || []).filter(isFilled).slice(0, 3).join(", ");
      return `${p.title}${isFilled(p.description) ? " — " + p.description : ""}${stack ? " (" + stack + ")" : ""}`;
    });
    return `Here are a few: ${lines.join(" | ")}. Scroll to the Projects section for links and full write-ups.`;
  }

  function skillsAnswer(query) {
    const categories = (PROFILE.skills && PROFILE.skills.categories) || [];
    const q = (query || "").toLowerCase();

    // direct keyword match against a specific named skill
    for (const cat of categories) {
      for (const item of (cat.items || [])) {
        if (isFilled(item.name) && q.includes(item.name.toLowerCase())) {
          return `Yes — ${item.name} is part of the ${cat.name} skill set${item.level ? " (self-rated " + item.level + "/100)" : ""}.`;
        }
      }
    }

    const filledCats = categories
      .map(c => ({ name: c.name, items: (c.items || []).filter(i => isFilled(i.name)) }))
      .filter(c => c.items.length > 0);

    if (filledCats.length === 0) {
      return "Skill details are being added right now — check the Skills section shortly for the full breakdown.";
    }
    const summary = filledCats.map(c => `${c.name}: ${c.items.slice(0, 3).map(i => i.name).join(", ")}`).join(" · ");
    return `Core areas — ${summary}. Full breakdown with proficiency levels is in the Skills section.`;
  }

  function certsAnswer() {
    const certs = (PROFILE.certifications || []).filter(c => isFilled(c.name));
    if (certs.length === 0) return "No certifications are listed yet — ask about experience or projects instead.";
    return `Certifications: ${certs.map(c => `${c.name}${isFilled(c.issuer) ? " (" + c.issuer + ")" : ""}`).join(", ")}.`;
  }

  function statsAnswer() {
    const stats = (PROFILE.stats || []).filter(s => s.value > 0);
    if (stats.length === 0) return "Stats are still being finalized — check back shortly.";
    return stats.map(s => `${s.value}${s.suffix || ""} ${s.label.toLowerCase()}`).join(", ") + ".";
  }

  function availabilityAnswer() {
    const av = PROFILE.availability || {};
    if (av.open) return `${pick(PROFILE.name) || "The candidate"} is currently ${av.label ? av.label.toLowerCase() : "open to new opportunities"}. Best next step is the Contact section to start a conversation.`;
    return "Availability status isn't listed yet — the Contact section is the best way to ask directly.";
  }

  function contactAnswer() {
    const c = PROFILE.contact || {};
    const bits = [];
    if (isFilled(c.email)) bits.push(`email at ${c.email}`);
    if (isFilled(c.linkedin)) bits.push(`LinkedIn`);
    if (isFilled(c.github)) bits.push(`GitHub`);
    if (bits.length === 0) return "Contact details are in the Contact section at the bottom of the page.";
    return `Best ways to reach out: ${bits.join(", ")}. Full links are in the Contact section, or use the Download Resume button in the sidebar.`;
  }

  function resumeAnswer() {
    return "You can grab the full resume anytime using the Download Resume button in the sidebar — it's a formatted PDF with the same details.";
  }

  function pitchAnswer() {
    const expBit = experienceAnswer("");
    const skillBit = skillsAnswer("");
    return `${expBit} On the skills side: ${skillBit}`;
  }

  function fallbackAnswer() {
    return "I can help with questions about experience, projects, skills, certifications, or contact info — try one of the suggestions below, or rephrase your question.";
  }

  /* ---------------- Suggested quick questions ---------------- */
  function getSuggestions() {
    const s = [];
    if ((PROFILE.experience || []).some(e => isFilled(e.company))) s.push("What's his current role?");
    if ((PROFILE.projects || []).some(p => isFilled(p.title))) s.push("What has he built?");
    s.push("What are his key skills?");
    s.push("Is he available for hire?");
    s.push("How do I contact him?");
    return s.slice(0, 4);
  }

  /* ---------------- Context summary for the optional backend LLM ---------------- */
  // Plain-text dump of the résumé, sent as context when aiBackendUrl is
  // configured — keeps data.js as the single source of truth either way.
  function buildContextSummary() {
    const lines = [];
    if (isFilled(PROFILE.name)) lines.push(`Name: ${PROFILE.name}`);
    if (isFilled(PROFILE.title)) lines.push(`Title: ${PROFILE.title}`);
    const roles = (PROFILE.roles || []).filter(isFilled);
    if (roles.length) lines.push(`Focus areas: ${roles.join(", ")}`);
    if (isFilled(PROFILE.tagline)) lines.push(`Summary: ${PROFILE.tagline}`);
    if (isFilled(PROFILE.location)) lines.push(`Location: ${PROFILE.location}`);
    if (PROFILE.availability && PROFILE.availability.open) lines.push(`Availability: ${PROFILE.availability.label || "Open to opportunities"}`);

    const exp = (PROFILE.experience || []).filter(e => isFilled(e.role) && isFilled(e.company));
    if (exp.length) {
      lines.push("Experience:");
      exp.forEach(e => {
        const details = (e.details || []).filter(isFilled);
        lines.push(`- ${e.role} at ${e.company} (${e.duration || "n/a"})${details.length ? ": " + details.join("; ") : ""}`);
      });
    }

    const projects = (PROFILE.projects || []).filter(p => isFilled(p.title));
    if (projects.length) {
      lines.push("Projects:");
      projects.forEach(p => lines.push(`- ${p.title}: ${p.description || ""} [${(p.stack || []).filter(isFilled).join(", ")}]`));
    }

    const skillCats = ((PROFILE.skills || {}).categories || [])
      .map(c => ({ name: c.name, items: (c.items || []).filter(i => isFilled(i.name)) }))
      .filter(c => c.items.length > 0);
    if (skillCats.length) {
      lines.push("Skills:");
      skillCats.forEach(c => lines.push(`- ${c.name}: ${c.items.map(i => i.name).join(", ")}`));
    }

    const certs = (PROFILE.certifications || []).filter(c => isFilled(c.name));
    if (certs.length) lines.push(`Certifications: ${certs.map(c => c.name).join(", ")}`);

    const stats = (PROFILE.stats || []).filter(s => s.value > 0);
    if (stats.length) lines.push(`Stats: ${stats.map(s => `${s.value}${s.suffix || ""} ${s.label}`).join(", ")}`);

    const c = PROFILE.contact || {};
    const contactBits = [];
    if (isFilled(c.email)) contactBits.push(`email ${c.email}`);
    if (isFilled(c.linkedin)) contactBits.push("LinkedIn on file");
    if (isFilled(c.github)) contactBits.push(`GitHub ${c.github}`);
    if (contactBits.length) lines.push(`Contact: ${contactBits.join(", ")}`);

    return lines.join("\n");
  }

  /* ---------------- Public API ---------------- */
  function ask(query) {
    if (!query || !query.trim()) return fallbackAnswer();
    const intent = detectIntent(query);
    if (!intent) return fallbackAnswer();
    try {
      return intent.handler(query.toLowerCase());
    } catch (err) {
      return fallbackAnswer();
    }
  }

  return { ask, getSuggestions, buildContextSummary };
})();

if (typeof module !== "undefined" && module.exports) module.exports = ResumeAI;
