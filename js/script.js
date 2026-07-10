/* ============================================================
   ANKIT OS — Interactions & Renderers
   All content is pulled live from PROFILE (js/data.js).
============================================================ */

(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFilled = (v) => typeof v === "string" && v.trim() !== "" && !v.includes("FILL_IN");

  /* ---------------- tiny DOM helper ---------------- */
  function h(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---------------- icon set (custom, generic — no brand-logo reproduction) ---------------- */
  const ICONS = {
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H9v-6h6v6h2.5a1 1 0 0 0 1-1v-9"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/><path d="M3 13h18"/></svg>`,
    grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="1.2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.2"/></svg>`,
    bars: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M12 20V4"/><path d="M20 20v-6"/></svg>`,
    award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="5"/><path d="M9 13l-1.6 7.5L12 18l4.6 2.5L15 13"/></svg>`,
    pulse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2-7 4 14 2-7h6"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5 12 13l9-6.5"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h4l1.5 5-2.3 1.5a12 12 0 0 0 6.3 6.3L15 14.5l5 1.5v4a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 4 5.6 1.5 1.5 0 0 1 4 4Z"/></svg>`,
    codeTag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 8-4 4 4 4"/><path d="m15 8 4 4-4 4"/></svg>`,
    network: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="2.6"/><circle cx="18" cy="7" r="2.6"/><circle cx="12" cy="18" r="2.6"/><path d="M8.2 8.4 10 16"/><path d="M15.8 8.4 14 16"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13"/><path d="m7 12 5 5 5-5"/><path d="M5 20h14"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
    external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`,
    terminalPrompt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 8 4 4-4 4"/><path d="M13 16h5"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
    cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.4-9A5.5 5.5 0 0 1 17.4 8 4 4 0 0 1 17 18H7Z"/></svg>`,
    terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3"/><path d="M13 15h4"/></svg>`,
    devops: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/><path d="M9 21h6"/></svg>`,
    speaker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a9 9 0 0 1 0 12"/></svg>`
  };

  /* ============================================================
     RENDER: static UI icons (nav, buttons)
  ============================================================ */
  function renderStaticIcons() {
    document.querySelectorAll("[data-icon]").forEach(el => {
      const svg = ICONS[el.dataset.icon];
      if (svg) el.innerHTML = svg;
    });
  }

  /* ============================================================
     RENDER: Sidebar
  ============================================================ */
  function renderSidebar() {
    const nameEl = document.getElementById("profileName");
    const titleEl = document.getElementById("profileTitle");
    const avatarEl = document.getElementById("profileAvatar");
    const availEl = document.getElementById("availabilityPill");
    const downloadBtn = document.getElementById("downloadResumeBtn");
    const socialsEl = document.getElementById("socialIcons");

    nameEl.textContent = isFilled(PROFILE.name) ? PROFILE.name : "Your Name";
    titleEl.textContent = isFilled(PROFILE.title) ? PROFILE.title : "Your Title";

    avatarEl.innerHTML = "";
    if (isFilled(PROFILE.photoUrl)) {
      const img = document.createElement("img");
      img.alt = PROFILE.name || "Profile photo";
      img.addEventListener("error", () => {
        avatarEl.innerHTML = "";
        avatarEl.textContent = (PROFILE.initials || "AA").slice(0, 2).toUpperCase();
      });
      img.src = PROFILE.photoUrl;
      avatarEl.appendChild(img);
    } else {
      avatarEl.textContent = (PROFILE.initials || "AA").slice(0, 2).toUpperCase();
    }

    if (PROFILE.availability && PROFILE.availability.open) {
      availEl.innerHTML = `<span class="dot"></span> ${escapeHtml(PROFILE.availability.label || "Open to opportunities")}`;
      availEl.style.display = "";
    } else {
      availEl.style.display = "none";
    }

    if (isFilled(PROFILE.resume && PROFILE.resume.path)) {
      downloadBtn.setAttribute("href", PROFILE.resume.path);
      downloadBtn.setAttribute("download", PROFILE.resume.filename || "Resume.pdf");
    } else {
      downloadBtn.setAttribute("href", "#contact");
      downloadBtn.removeAttribute("download");
    }

    const c = PROFILE.contact || {};
    const socials = [
      isFilled(c.github) && { href: c.github, icon: ICONS.codeTag, label: "GitHub profile" },
      isFilled(c.linkedin) && { href: c.linkedin, icon: ICONS.network, label: "LinkedIn profile" },
      isFilled(c.email) && { href: `mailto:${c.email}`, icon: ICONS.mail, label: "Send an email" }
    ].filter(Boolean);

    socialsEl.innerHTML = "";
    socials.forEach(s => {
      socialsEl.appendChild(h("a", { href: s.href, target: s.href.startsWith("http") ? "_blank" : "_self", rel: "noopener", "aria-label": s.label, html: s.icon }));
    });
  }

  /* ============================================================
     RENDER: Hero
  ============================================================ */
  function renderHero() {
    const titleEl = document.getElementById("heroTitle");
    const rolesEl = document.getElementById("heroRoles");
    const subtitleEl = document.getElementById("heroSubtitle");
    const chipsEl = document.getElementById("heroChips");
    const badgeEl = document.getElementById("heroBadge");

    const name = isFilled(PROFILE.name) ? PROFILE.name : "Your Name";
    const parts = name.split(" ");
    const last = parts.pop();
    titleEl.innerHTML = `${parts.length ? escapeHtml(parts.join(" ")) + " " : ""}<span class="accent-text">${escapeHtml(last)}</span>`;

    const roles = (PROFILE.roles || []).filter(isFilled);
    rolesEl.innerHTML = "";
    roles.forEach(r => rolesEl.appendChild(h("span", { class: "hero-role-line" }, r)));

    subtitleEl.textContent = isFilled(PROFILE.tagline)
      ? PROFILE.tagline
      : "Building reliable, well-engineered systems — details coming together right here.";

    if (PROFILE.availability && PROFILE.availability.open && isFilled(PROFILE.availability.label)) {
      badgeEl.innerHTML = `<span class="pulse-dot"></span> ${escapeHtml(PROFILE.availability.label)}`;
      badgeEl.style.display = "";
    } else {
      badgeEl.style.display = "none";
    }

    const tech = (PROFILE.heroTech || []).filter(isFilled);
    chipsEl.innerHTML = "";
    tech.slice(0, 5).forEach(t => {
      chipsEl.appendChild(h("div", { class: "float-card glass" }, [h("span", {}, t)]));
    });
  }

  /* ============================================================
     RENDER: Experience timeline
  ============================================================ */
  function renderExperience() {
    const container = document.getElementById("timelineContainer");
    const section = document.getElementById("experience");
    const exp = (PROFILE.experience || []).filter(e => isFilled(e.role) && isFilled(e.company));

    if (exp.length === 0) { section.style.display = "none"; return; }

    container.innerHTML = "";
    exp.forEach((e) => {
      const details = (e.details || []).filter(isFilled);
      const tech = (e.tech || []).filter(isFilled);

      const item = h("div", { class: `timeline-item reveal${e.current ? " current" : ""}` }, [
        h("div", { class: "timeline-dot" }),
        h("div", { class: "timeline-card" }, [
          h("div", { class: "timeline-meta" }, [
            h("div", {}, [
              h("div", { class: "timeline-role" }, e.role),
              h("div", { class: "timeline-company" }, e.company)
            ]),
            h("div", { class: "timeline-duration" }, e.duration || "")
          ]),
          isFilled(e.summary) ? h("p", { class: "timeline-summary" }, e.summary) : null,
          tech.length ? h("div", { class: "tech-badges" }, tech.map(t => h("span", { class: "tag" }, t))) : null,
          details.length ? h("button", { class: "timeline-toggle", type: "button", "aria-expanded": "false", onclick: (ev) => toggleTimeline(ev, item) }, [
            h("span", {}, "Details"),
            (() => { const s = document.createElement("span"); s.innerHTML = ICONS.chevron; return s.firstChild; })()
          ]) : null,
          details.length ? h("div", { class: "timeline-details" }, [
            h("div", { class: "timeline-details-inner" }, [
              h("ul", {}, details.map(d => h("li", {}, d)))
            ])
          ]) : null
        ])
      ]);
      container.appendChild(item);
    });
  }

  function toggleTimeline(ev, item) {
    const expanded = item.classList.toggle("expanded");
    ev.currentTarget.setAttribute("aria-expanded", String(expanded));
  }

  /* ============================================================
     RENDER: Projects
  ============================================================ */
  function projectVisualSvg(index) {
    const angle = 45 + (index * 35) % 270;
    const id = `pg${index}`;
    return `<svg viewBox="0 0 200 120" width="72%" height="72%" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="${id}" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="#7C3AED"/><stop offset="100%" stop-color="#F97316"/>
      </linearGradient></defs>
      <rect x="4" y="4" width="192" height="112" rx="12" fill="none" stroke="url(#${id})" stroke-width="1.5" opacity="0.55"/>
      <circle cx="26" cy="24" r="4" fill="url(#${id})" opacity="0.8"/>
      <circle cx="40" cy="24" r="4" fill="none" stroke="url(#${id})" stroke-width="1.5" opacity="0.6"/>
      <circle cx="54" cy="24" r="4" fill="none" stroke="url(#${id})" stroke-width="1.5" opacity="0.6"/>
      <rect x="16" y="42" width="168" height="58" rx="6" fill="url(#${id})" opacity="0.08"/>
      <path d="M16 90 L60 62 L96 78 L140 50 L184 66" fill="none" stroke="url(#${id})" stroke-width="2" opacity="0.7"/>
    </svg>`;
  }

  function renderProjects() {
    const grid = document.getElementById("projectsGrid");
    const section = document.getElementById("projects");
    const projects = (PROFILE.projects || []).filter(p => isFilled(p.title));

    if (projects.length === 0) { section.style.display = "none"; return; }

    grid.innerHTML = "";
    projects.forEach((p, i) => {
      const stack = (p.stack || []).filter(isFilled);
      const links = p.links || {};
      // Supports either the caseStudy/architecture pair (your current labels)
      // or github/demo/docs — whichever keys are present and filled render.
      const linkDefs = [
        isFilled(links.caseStudy) && { href: links.caseStudy, label: "Case Study", icon: ICONS.external },
        isFilled(links.architecture) && { href: links.architecture, label: "Architecture", icon: ICONS.grid },
        isFilled(links.github) && { href: links.github, label: "Code", icon: ICONS.codeTag },
        isFilled(links.demo) && { href: links.demo, label: "Live Demo", icon: ICONS.external },
        isFilled(links.docs) && { href: links.docs, label: "Docs", icon: ICONS.grid }
      ].filter(Boolean);

      const visual = isFilled(p.image)
        ? h("img", { src: p.image, alt: p.title, style: "width:100%;height:100%;object-fit:cover;" })
        : (() => { const wrap = document.createElement("div"); wrap.style.display = "contents"; wrap.innerHTML = projectVisualSvg(i); return wrap; })();

      const card = h("div", { class: "project-card reveal" }, [
        h("div", { class: "project-visual" }, [visual]),
        h("div", { class: "project-body" }, [
          isFilled(p.category) ? h("div", { class: "project-category" }, p.category) : null,
          h("div", { class: "project-title" }, p.title),
          isFilled(p.description) ? h("p", { class: "project-desc" }, p.description) : null,
          stack.length ? h("div", { class: "project-stack" }, stack.map(t => h("span", { class: "tag" }, t))) : null,
          linkDefs.length ? h("div", { class: "project-links" }, linkDefs.map(l => h("a", { href: l.href, target: "_blank", rel: "noopener" }, [
            (() => { const s = document.createElement("span"); s.innerHTML = l.icon; return s.firstChild; })(),
            document.createTextNode(l.label)
          ]))) : null
        ])
      ]);
      grid.appendChild(card);
    });
  }

  /* ============================================================
     RENDER: Skills
     Items with a level > 0 render as an animated bar; items
     without one render as a plain tag chip — no fabricated %s.
  ============================================================ */
  function renderSkills() {
    const grid = document.getElementById("skillsGrid");
    const section = document.getElementById("skills");
    const categories = ((PROFILE.skills || {}).categories || [])
      .map(c => ({ ...c, items: (c.items || []).filter(i => isFilled(i.name)) }))
      .filter(c => c.items.length > 0);

    if (categories.length === 0) { section.style.display = "none"; return; }

    grid.innerHTML = "";
    categories.forEach(cat => {
      const iconSvg = ICONS[cat.icon] || ICONS.codeTag;
      const rated = cat.items.filter(i => i.level > 0);
      const unrated = cat.items.filter(i => !(i.level > 0));

      grid.appendChild(h("div", { class: "skill-category reveal" }, [
        h("div", { class: "skill-category-head" }, [
          (() => { const s = document.createElement("span"); s.innerHTML = iconSvg; return s.firstChild; })(),
          h("h3", {}, cat.name)
        ]),
        ...rated.map(item => h("div", { class: "skill-row" }, [
          h("div", { class: "skill-row-top" }, [
            h("span", {}, item.name),
            h("span", {}, `${item.level}%`)
          ]),
          h("div", { class: "skill-bar-track" }, [
            h("div", { class: "skill-bar-fill", "data-level": item.level })
          ])
        ])),
        unrated.length ? h("div", { class: "skill-tag-row" }, unrated.map(item => h("span", { class: "tag" }, item.name))) : null
      ]));
    });
  }

  /* ============================================================
     RENDER: Certifications
  ============================================================ */
  function renderCertifications() {
    const grid = document.getElementById("certsGrid");
    const section = document.getElementById("certifications");
    const certs = (PROFILE.certifications || []).filter(c => isFilled(c.name));

    if (certs.length === 0) { section.style.display = "none"; return; }

    grid.innerHTML = "";
    certs.forEach(c => {
      grid.appendChild(h("div", { class: "cert-card reveal" }, [
        h("div", { class: "cert-icon", html: ICONS.award }),
        h("div", {}, [
          h("div", { class: "cert-name" }, c.name),
          isFilled(c.issuer) ? h("div", { class: "cert-issuer" }, c.issuer) : null
        ])
      ]));
    });
  }

  /* ============================================================
     RENDER: Stats
  ============================================================ */
  function renderStats() {
    const grid = document.getElementById("statsGrid");
    const section = document.getElementById("stats");
    const stats = (PROFILE.stats || []).filter(s => s.value > 0);

    if (stats.length === 0) { section.style.display = "none"; return; }

    grid.innerHTML = "";
    stats.forEach(s => {
      grid.appendChild(h("div", { class: "stat-card reveal" }, [
        h("div", { class: "stat-number", "data-target": s.value, "data-suffix": s.suffix || "" }, "0"),
        h("div", { class: "stat-label" }, s.label)
      ]));
    });
  }

  /* ============================================================
     RENDER: Contact
  ============================================================ */
  function renderContact() {
    const list = document.getElementById("contactList");
    const c = PROFILE.contact || {};
    const rows = [
      isFilled(c.email) && { icon: ICONS.mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
      isFilled(c.phone) && { icon: ICONS.phone, label: "Phone", value: c.phone, href: `tel:${c.phone}` },
      isFilled(c.linkedin) && { icon: ICONS.network, label: "LinkedIn", value: "View profile", href: c.linkedin },
      isFilled(c.github) && { icon: ICONS.codeTag, label: "GitHub", value: "View profile", href: c.github }
    ].filter(Boolean);

    list.innerHTML = "";
    rows.forEach(r => {
      list.appendChild(h("a", { class: "contact-row", href: r.href, target: r.href.startsWith("http") ? "_blank" : "_self", rel: "noopener" }, [
        h("div", { class: "contact-row-icon", html: r.icon }),
        h("div", {}, [
          h("div", { class: "contact-row-label" }, r.label),
          h("div", { class: "contact-row-value" }, r.value)
        ])
      ]));
    });
  }

  /* ============================================================
     BEHAVIOR: mobile sidebar
  ============================================================ */
  function initMobileMenu() {
    const toggle = document.getElementById("mobileMenuToggle");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebarBackdrop");

    function close() { sidebar.classList.remove("open"); backdrop.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    function open() { sidebar.classList.add("open"); backdrop.classList.add("open"); toggle.setAttribute("aria-expanded", "true"); }

    toggle.addEventListener("click", () => sidebar.classList.contains("open") ? close() : open());
    backdrop.addEventListener("click", close);
    sidebar.querySelectorAll(".nav-link").forEach(a => a.addEventListener("click", close));
  }

  /* ============================================================
     BEHAVIOR: scroll spy + reveal + counters + skill bars
  ============================================================ */
  function initScrollObservers() {
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll(".reveal").forEach(el => el.classList.add("in-view"));
      animateCounters();
      document.querySelectorAll(".skill-category").forEach(animateSkillBars);
      return;
    }

    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const sections = navLinks.map(l => document.getElementById(l.dataset.section)).filter(Boolean);

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.toggle("active", l.dataset.section === entry.target.id));
        }
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });
    sections.forEach(s => spyObserver.observe(s));

    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        if (entry.target.id === "stats") animateCounters();
        if (entry.target.classList.contains("skill-category")) animateSkillBars(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
  }

  let countersAnimated = false;
  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    document.querySelectorAll(".stat-number").forEach(el => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || "";
      if (prefersReducedMotion) { el.textContent = target + suffix; return; }
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function animateSkillBars(categoryEl) {
    categoryEl.querySelectorAll(".skill-bar-fill").forEach(bar => {
      const level = bar.dataset.level || 0;
      requestAnimationFrame(() => { bar.style.width = level + "%"; });
    });
  }

  /* ============================================================
     BEHAVIOR: cursor glow (desktop only)
  ============================================================ */
  function initCursorGlow() {
    const glow = document.getElementById("cursorGlow");
    if (!glow || window.matchMedia("(max-width: 900px)").matches) return;
    let active = false;
    window.addEventListener("mousemove", (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (!active) { glow.classList.add("active"); active = true; }
    });
    document.addEventListener("mouseleave", () => glow.classList.remove("active"));
  }

  /* ============================================================
     TERMINAL — embedded interactive resume terminal.
     Supports a small set of shell-like commands over a virtual
     file system built from PROFILE, plus free-text questions
     routed to ResumeAI (js/ai-agent.js) as a fallback.
  ============================================================ */
  function buildVirtualFiles() {
    const exp = (PROFILE.experience || []).filter(e => isFilled(e.role) && isFilled(e.company));
    const projects = (PROFILE.projects || []).filter(p => isFilled(p.title));
    const skillCats = ((PROFILE.skills || {}).categories || [])
      .map(c => ({ name: c.name, items: (c.items || []).filter(i => isFilled(i.name)) }))
      .filter(c => c.items.length > 0);
    const c = PROFILE.contact || {};

    return {
      "about.txt": () => [
        isFilled(PROFILE.tagline) ? PROFILE.tagline : "Profile summary coming soon.",
      ],
      "experience.log": () => exp.length
        ? exp.map(e => `${(e.duration || "").padEnd(20)} ${e.role} @ ${e.company}`)
        : ["No experience entries yet."],
      "projects.log": () => projects.length
        ? projects.map(p => `${p.title}${isFilled(p.category) ? " [" + p.category + "]" : ""}${isFilled(p.description) ? " — " + p.description : ""}`)
        : ["No projects listed yet."],
      "skills.json": () => skillCats.length
        ? skillCats.map(cat => `${cat.name}: ${cat.items.map(i => i.name).join(", ")}`)
        : ["No skills listed yet."],
      "contact.txt": () => {
        const lines = [];
        if (isFilled(c.email)) lines.push(`email:    ${c.email}`);
        if (isFilled(c.phone)) lines.push(`phone:    ${c.phone}`);
        if (isFilled(c.linkedin)) lines.push(`linkedin: ${c.linkedin}`);
        if (isFilled(c.github)) lines.push(`github:   ${c.github}`);
        return lines.length ? lines : ["Contact details coming soon."];
      }
    };
  }

  function initTerminal() {
    const body = document.getElementById("terminalOutput");
    const input = document.getElementById("terminalInput");
    const windowEl = document.getElementById("terminalWindow");
    const jumpTrigger = document.getElementById("terminalTrigger");
    if (!body || !input) return;

    const FILES = buildVirtualFiles();
    const FILE_LIST = Object.keys(FILES).concat(isFilled(PROFILE.resume && PROFILE.resume.path) ? ["resume.pdf"] : []);

    function printLine(text, cls) {
      const line = h("div", { class: `term-line${cls ? " " + cls : ""}` }, text);
      body.appendChild(line);
    }
    function printPrompt(cmd) {
      printLine(`guest@ankit-os:~$ ${cmd}`, "term-cmd");
    }
    function scrollToBottom() { body.scrollTop = body.scrollHeight; }

    function whoamiLine() {
      const roles = (PROFILE.roles || []).filter(isFilled);
      return `${isFilled(PROFILE.name) ? PROFILE.name : "guest"} — ${isFilled(PROFILE.title) ? PROFILE.title : "profile in progress"}${roles.length ? " (" + roles.join(" · ") + ")" : ""}`;
    }

    function helpLines() {
      return [
        "Available commands:",
        "  help              show this help",
        "  whoami            quick summary",
        "  ls                list available files",
        "  cat <file>        print a file's contents",
        "  clear             clear the terminal",
        "",
        "Or just ask a plain-English question —",
        'e.g. "what\'s his AWS experience?" or "is he available for hire?"'
      ];
    }

    function triggerResumeDownload() {
      const path = PROFILE.resume && PROFILE.resume.path;
      if (!isFilled(path)) return ["No resume file linked yet."];
      const a = document.createElement("a");
      a.href = path;
      a.setAttribute("download", (PROFILE.resume && PROFILE.resume.filename) || "resume.pdf");
      document.body.appendChild(a);
      a.click();
      a.remove();
      return ["Downloading résumé…"];
    }

    function runCommand(raw) {
      const cmd = raw.trim();
      if (!cmd) return [];
      const lower = cmd.toLowerCase();

      if (lower === "help") return helpLines();
      if (lower === "whoami") return [whoamiLine()];
      if (lower === "ls" || lower === "ls -la" || lower === "ls -l") return [FILE_LIST.join("  ")];
      if (lower === "clear") { body.innerHTML = ""; return null; }
      if (lower === "resume.pdf" || lower === "cat resume.pdf" || lower === "open resume.pdf" || lower === "download resume") {
        return triggerResumeDownload();
      }
      if (lower.startsWith("cat ")) {
        const key = lower.slice(4).trim();
        if (FILES[key]) return FILES[key]();
        return [`cat: ${key}: No such file. Try 'ls' to see available files.`];
      }

      // Fallback: natural-language question, answered live from PROFILE data.
      if (typeof ResumeAI !== "undefined") return [ResumeAI.ask(cmd)];
      return ["Command not recognized. Type 'help' for options."];
    }

    function handleSubmit(raw) {
      printPrompt(raw);
      const output = runCommand(raw);
      if (output === null) { scrollToBottom(); return; } // clear already handled
      output.forEach(line => printLine(line, "term-output"));
      scrollToBottom();
      speakIfEnabled(output.join(". "));
    }

    /* -------- Voice: speech recognition (mic input) -------- */
    const orb = document.getElementById("voiceOrb");
    const statusEl = document.getElementById("voiceStatus");
    const micBtn = document.getElementById("micBtn");
    const speakBtn = document.getElementById("speakBtn");
    const DEFAULT_STATUS = "Type, or tap the mic, to ask about Ankit";

    function setOrbState(state) {
      orb?.classList.remove("listening", "speaking");
      if (state) orb?.classList.add(state);
    }
    function setStatus(text) { if (statusEl) statusEl.textContent = text; }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognizing = false;
    let recognizer = null;

    if (SpeechRecognitionAPI && micBtn) {
      recognizer = new SpeechRecognitionAPI();
      recognizer.lang = "en-US";
      recognizer.interimResults = false;
      recognizer.maxAlternatives = 1;

      recognizer.addEventListener("start", () => {
        recognizing = true;
        micBtn.classList.add("active");
        setOrbState("listening");
        setStatus("Listening…");
      });
      recognizer.addEventListener("end", () => {
        recognizing = false;
        micBtn.classList.remove("active");
        setOrbState(null);
        setStatus(DEFAULT_STATUS);
      });
      recognizer.addEventListener("error", () => {
        setStatus("Didn't catch that — try again or type your question.");
      });
      recognizer.addEventListener("result", (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript;
        if (transcript) handleSubmit(transcript);
      });

      micBtn.hidden = false;
      micBtn.addEventListener("click", () => {
        if (recognizing) { recognizer.stop(); return; }
        try { recognizer.start(); } catch (err) { /* already started, ignore */ }
      });
    }

    /* -------- Voice: speech synthesis (spoken answers) -------- */
    let voiceOutputEnabled = false;
    function speakIfEnabled(text) {
      if (!voiceOutputEnabled || !window.speechSynthesis || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.onstart = () => { setOrbState("speaking"); setStatus("Speaking…"); };
      utterance.onend = () => { setOrbState(null); setStatus(DEFAULT_STATUS); };
      utterance.onerror = () => { setOrbState(null); setStatus(DEFAULT_STATUS); };
      window.speechSynthesis.speak(utterance);
    }

    if (speakBtn) {
      if (!window.speechSynthesis) {
        speakBtn.hidden = true;
      } else {
        speakBtn.addEventListener("click", () => {
          voiceOutputEnabled = !voiceOutputEnabled;
          speakBtn.classList.toggle("active", voiceOutputEnabled);
          speakBtn.setAttribute("aria-pressed", String(voiceOutputEnabled));
          if (!voiceOutputEnabled) window.speechSynthesis.cancel();
        });
      }
    }

    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const val = input.value;
      input.value = "";
      handleSubmit(val);
    });

    if (windowEl) {
      windowEl.addEventListener("click", () => input.focus());
    }

    function focusTerminal() {
      const section = document.getElementById("terminal");
      if (section && typeof section.scrollIntoView === "function") {
        section.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
      setTimeout(() => input.focus(), prefersReducedMotion ? 0 : 450);
    }

    if (jumpTrigger) jumpTrigger.addEventListener("click", focusTerminal);
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); focusTerminal(); }
    });

    // Boot sequence
    printLine("ankit-os v1.0 — interactive resume terminal", "term-boot");
    printLine("Type 'help' for commands, or ask a question in plain English.", "term-boot");
  }

  /* ============================================================
     INIT
  ============================================================ */
  // Each step runs in isolation — if one section's render/behavior throws
  // (bad data, unsupported API in an old browser, etc.) the rest of the
  // page — most importantly the terminal — still comes up.
  function safeRun(fn, label) {
    try { fn(); } catch (err) { console.error(`[ankit-os] ${label} failed:`, err); }
  }

  document.addEventListener("DOMContentLoaded", () => {
    safeRun(() => { document.getElementById("yearNow").textContent = new Date().getFullYear(); }, "year");

    safeRun(renderStaticIcons, "renderStaticIcons");
    safeRun(renderSidebar, "renderSidebar");
    safeRun(renderHero, "renderHero");
    safeRun(renderExperience, "renderExperience");
    safeRun(renderProjects, "renderProjects");
    safeRun(renderSkills, "renderSkills");
    safeRun(renderCertifications, "renderCertifications");
    safeRun(renderStats, "renderStats");
    safeRun(renderContact, "renderContact");

    safeRun(initMobileMenu, "initMobileMenu");
    safeRun(initScrollObservers, "initScrollObservers");
    safeRun(initCursorGlow, "initCursorGlow");
    safeRun(() => Particles.init("heroCanvas"), "particles");
    safeRun(initTerminal, "initTerminal");
  });
})();
