/* ============================================================
   ANKIT OS — Hero Particle Network
   A lightweight, dependency-free Canvas2D ambient background for
   the hero section. Split into its own file so it can be swapped
   or disabled independently of the main interaction script.
============================================================ */

const Particles = (() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return; // some restricted/privacy browser modes disable canvas — fail quietly

    let w, h, particles = [];
    const COUNT = 42;
    const COLORS = ["124,58,237", "249,115,22"]; // primary, accent — matches CSS tokens

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
    }

    function seed() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        c: COLORS[Math.floor(Math.random() * COLORS.length)]
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},0.55)`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - d / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      if (!prefersReducedMotion) requestAnimationFrame(frame);
    }

    resize(); seed(); frame();
    window.addEventListener("resize", () => { resize(); seed(); });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !prefersReducedMotion) requestAnimationFrame(frame);
    });
  }

  return { init };
})();

if (typeof module !== "undefined" && module.exports) module.exports = Particles;
