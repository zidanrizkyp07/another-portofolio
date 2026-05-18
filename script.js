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
     9. PROJECT CARD TILT EFFECT
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