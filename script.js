/* =============================================
   PROCTOCARE CLINIC — script.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower with RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Scale cursor on interactive elements
  const hoverEls = document.querySelectorAll('a, button, .service-card, .why-card, .cred');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      cursor.style.opacity = '0.6';
      follower.style.transform = 'translate(-50%, -50%) scale(0.5)';
      follower.style.borderColor = 'rgba(201,169,110,0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.opacity = '1';
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = 'rgba(201,169,110,0.35)';
    });
  });


  /* ── NAVBAR SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ── HAMBURGER MENU ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ── SCROLL REVEAL ── */
  const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Apply the animation-delay from inline style
        const el = entry.target;
        const delay = el.style.animationDelay || '0s';
        const delayMs = parseFloat(delay) * 1000;
        setTimeout(() => {
          el.classList.add('revealed');
        }, delayMs);
        revealObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));


  /* ── ANIMATED COUNTERS ── */
  const counters = document.querySelectorAll('.stat-num[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000; // ms
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));


  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop &&
          scrollPos < section.offsetTop + section.offsetHeight) {
        navAnchors.forEach(a => a.classList.remove('active-link'));
        const current = document.querySelector(`.nav-links a[href="#${section.id}"]`);
        if (current) current.classList.add('active-link');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });


  /* ── PARALLAX HERO ORBS ── */
  const orbs = document.querySelectorAll('.hero-orb');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.08 + i * 0.04;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });


  /* ── TILT EFFECT ON SERVICE CARDS ── */
  const tiltCards = document.querySelectorAll('.service-card, .why-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX =  y * 6;
      const rotY = -x * 6;
      card.style.transform = `translateY(-6px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });


  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── HERO GRID PARALLAX ── */
  const heroBgGrid = document.querySelector('.hero-bg-grid');
  if (heroBgGrid) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      heroBgGrid.style.transform = `translate(${x}px, ${y}px)`;
    });
  }


  /* ── FLOATING BADGE HOVER PAUSE ── */
  document.querySelectorAll('.floating-badge').forEach(badge => {
    badge.addEventListener('mouseenter', () => {
      badge.style.animationPlayState = 'paused';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.animationPlayState = 'running';
    });
  });


  /* ── PAGE LOAD ANIMATION ── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });


  /* ── PROCESS STEP HOVER ── */
  const psSteps = document.querySelectorAll('.ps-step');
  psSteps.forEach((step, i) => {
    step.addEventListener('mouseenter', () => {
      psSteps.forEach((s, j) => {
        const dist = Math.abs(j - i);
        s.style.opacity = dist === 0 ? '1' : dist === 1 ? '0.7' : '0.45';
        s.style.transition = 'opacity 0.3s ease';
      });
    });
    step.addEventListener('mouseleave', () => {
      psSteps.forEach(s => {
        s.style.opacity = '1';
      });
    });
  });


  /* ── GOLD PARTICLE EFFECT ON CLICK ── */
  document.addEventListener('click', e => {
    createParticles(e.clientX, e.clientY);
  });

  function createParticles(x, y) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #c9a96e;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(p);

      const angle = (Math.PI * 2 * i) / count;
      const velocity = 40 + Math.random() * 40;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;
      let opacity = 1;
      let px = x, py = y;

      const animate = () => {
        px += vx * 0.06;
        py += vy * 0.06 + 0.5;
        opacity -= 0.04;
        p.style.left = px + 'px';
        p.style.top  = py + 'px';
        p.style.opacity = opacity;
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          p.remove();
        }
      };
      requestAnimationFrame(animate);
    }
  }


  /* ── CONTACT CARD ENTRANCE ── */
  const mapCard = document.querySelector('.map-card');
  if (mapCard) {
    const mapObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.transition = 'all 0.8s cubic-bezier(0.16,1,0.3,1)';
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          mapObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    mapCard.style.opacity = '0';
    mapCard.style.transform = 'translateY(30px)';
    mapObs.observe(mapCard);
  }


  /* ── ACTIVE NAV STYLING ── */
  const style = document.createElement('style');
  style.textContent = `
    .nav-links a.active-link {
      color: var(--gold) !important;
    }
    .nav-links a.active-link::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);


  /* ── INITIAL HERO REVEAL ── */
  // Trigger immediately visible elements
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
      const delay = parseFloat(el.style.animationDelay || 0) * 1000;
      setTimeout(() => el.classList.add('revealed'), delay);
    });
  }, 200);

});