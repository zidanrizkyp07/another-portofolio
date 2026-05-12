/* ═══════════════════════════════════════════════════════════
   script.js — Portfolio Interactions
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────
     1. REVEAL ON SCROLL (Intersection Observer)
  ───────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────────────────────
     2. DOT NAVIGATION — Highlight Active Section
  ───────────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('.section');
  const dots     = document.querySelectorAll('.dot-nav .dot');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach(dot => {
          dot.classList.toggle(
            'active',
            dot.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, {
    threshold: 0.4
  });

  sections.forEach(sec => sectionObserver.observe(sec));


  /* ─────────────────────────────────────────────────────────
     3. SMOOTH SCROLL for dot nav clicks
  ───────────────────────────────────────────────────────── */
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ─────────────────────────────────────────────────────────
     4. COUNTER ANIMATION (stat numbers in hero)
  ───────────────────────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1800; // ms
      const start  = performance.now();

      const easeOut = t => 1 - Math.pow(1 - t, 3);

      const tick = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        el.textContent = Math.round(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));


  /* ─────────────────────────────────────────────────────────
     5. SKILLS — Filter & Tooltip
  ───────────────────────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const skillTags   = document.querySelectorAll('.skill-tag');
  const tooltip     = document.getElementById('skillTooltip');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      skillTags.forEach(tag => {
        if (filter === 'all' || tag.dataset.cat === filter) {
          tag.classList.remove('hidden');
        } else {
          tag.classList.add('hidden');
        }
      });
    });
  });

  // Tooltip on hover
  if (tooltip) {
    skillTags.forEach(tag => {
      tag.addEventListener('mouseenter', (e) => {
        tooltip.textContent = tag.dataset.desc;
        tooltip.classList.add('visible');
      });

      tag.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.clientX + 14}px`;
        tooltip.style.top  = `${e.clientY - 36}px`;
      });

      tag.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }


  /* ─────────────────────────────────────────────────────────
     6. HERO BG TEXT PARALLAX
  ───────────────────────────────────────────────────────── */
  const bgText = document.querySelector('.hero-bg-text');

  if (bgText) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      bgText.style.transform = `translateY(calc(-60% + ${scrollY * 0.18}px))`;
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────────────────
     7. TIMELINE DOT HIGHLIGHT on hover
  ───────────────────────────────────────────────────────── */
  const timelineItems = document.querySelectorAll('.timeline-item');

  timelineItems.forEach(item => {
    const dot = item.querySelector('.tl-dot');
    item.addEventListener('mouseenter', () => {
      if (!dot.classList.contains('current')) {
        dot.style.borderColor = 'var(--clr-accent)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!dot.classList.contains('current')) {
        dot.style.borderColor = '';
      }
    });
  });


  /* ─────────────────────────────────────────────────────────
     8. CUSTOM CURSOR RING
  ───────────────────────────────────────────────────────── */
  const cursorRing = document.getElementById('cursorRing');

  if (cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    // Inner dot follows mouse exactly
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: 5px;
      height: 5px;
      background: var(--clr-accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      transform: translate(-50%, -50%);
      transition: background 0.3s ease;
    `;
    document.body.appendChild(dot);

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // dot follows instantly
      dot.style.left = `${mouseX}px`;
      dot.style.top  = `${mouseY}px`;
    }, { passive: true });

    // Ring follows with slight lag
    function animateCursor() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top  = `${ringY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Shrink ring on interactive elements
    const interactiveEls = 'a, button, .skill-tag, .dot, .project-card, .filter-btn, .link-pill, .dot-theme-toggle';
    document.querySelectorAll(interactiveEls).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }


  /* ─────────────────────────────────────────────────────────
     9. DARK MODE TOGGLE
  ───────────────────────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon   = themeToggle?.querySelector('.theme-icon');

  // Restore saved preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    if (themeIcon) themeIcon.textContent = '☾';
    if (themeToggle) themeToggle.dataset.label = 'Light Mode';
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    if (themeIcon) themeIcon.textContent = isDark ? '☾' : '☀';
    themeToggle.dataset.label = isDark ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
  });


  /* ─────────────────────────────────────────────────────────
     10. PROJECT CARD TILT EFFECT
  ───────────────────────────────────────────────────────── */
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -4;
      const tiltY  = dx *  4;

      card.style.transform    = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition   = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.4s ease, border-color 0.3s ease, box-shadow 0.4s ease';
    });
  });

});