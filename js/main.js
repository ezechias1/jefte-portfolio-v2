/**
 * Main JavaScript — Jefte Portfolio (Editorial Brutalist)
 * Vanilla JS, no dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================
     1. Nav scroll effect
     Add "nav-scrolled" to .nav when user scrolls past 60px.
     Passive listener for scroll performance.
     ============================ */
  const nav = document.querySelector('.nav');

  if (nav) {
    const handleNavScroll = () => {
      if (window.scrollY > 60) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Run on load in case page is already scrolled
  }


  /* ============================
     2. Mobile menu toggle
     .nav-hamburger toggles .active on itself and .nav-mobile.
     Links inside the mobile menu close it on click.
     ============================ */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      if (mobileMenu) mobileMenu.classList.toggle('active');
    });

    // Close menu when any mobile nav link is clicked
    if (mobileMenu) {
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
        });
      });
    }
  }


  /* ============================
     3. Scroll reveal with stagger
     IntersectionObserver on .reveal elements at 0.12 threshold.
     Once visible, add "revealed" and unobserve.
     Children inside .reveal get staggered transition-delay.
     ============================ */
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Apply staggered delay to direct children before revealing
            const children = entry.target.children;
            for (let i = 0; i < children.length; i++) {
              children[i].style.transitionDelay = `${i * 0.08}s`;
            }

            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }


  /* ============================
     4. Smooth scroll for anchor links
     Intercept clicks on a[href^="#"] and scroll smoothly.
     ============================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return; // Skip bare hashes

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  /* ============================
     5. Portfolio filter
     [data-filter] buttons toggle visibility of [data-category] cards.
     Active class swaps between buttons. Opacity fade on show/hide.
     ============================ */
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('[data-category]');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Swap active class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const matches = filter === 'all' || card.getAttribute('data-category') === filter;

          if (matches) {
            card.style.opacity = '0';
            card.style.display = '';
            // Double rAF to force reflow before fade-in
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease';
                card.style.opacity = '1';
              });
            });
          } else {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '0';
            // Hide after fade-out animation completes
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }


  /* ============================
     6. Counter animation
     .counter[data-target] elements animate from 0 to target value.
     Cubic ease-out over 2 seconds. Triggered by IntersectionObserver.
     ============================ */
  const counters = document.querySelectorAll('.counter[data-target]');

  if (counters.length > 0) {
    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 2000; // 2 seconds
      const start = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Cubic ease-out: 1 - (1 - t)^3
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    counters.forEach(el => counterObserver.observe(el));
  }


  /* ============================
     7. Form handling
     Prevent default submit, replace form with a styled
     thank-you message built via safe DOM methods (no innerHTML).
     ============================ */
  const contactForm = document.querySelector('form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const wrapper = contactForm.parentElement;

      // Build thank-you message safely with createElement
      const thankYou = document.createElement('div');
      thankYou.className = 'thank-you-message';

      const icon = document.createElement('span');
      icon.className = 'thank-you-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '\u2713'; // checkmark

      const heading = document.createElement('h3');
      heading.textContent = 'Message sent.';

      const paragraph = document.createElement('p');
      paragraph.textContent = 'Thanks for reaching out \u2014 I\'ll get back to you soon.';

      thankYou.appendChild(icon);
      thankYou.appendChild(heading);
      thankYou.appendChild(paragraph);

      wrapper.replaceChild(thankYou, contactForm);
    });
  }


  /* ============================
     8. Active nav link highlight
     Compare current pathname against nav link hrefs.
     Add .active to the matching link.
     ============================ */
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  document.querySelectorAll('.nav a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (!linkPath) return;

    // Normalise: strip trailing slash for comparison
    const normalisedLink = linkPath.replace(/\/$/, '') || '/';

    if (normalisedLink === currentPath) {
      link.classList.add('active');
    }
  });


  /* ============================
     9. Horizontal scroll hint
     .projects-scroll: on desktop, add a scroll-padding nudge.
     On mobile/touch, enable grab-cursor momentum scrolling.
     ============================ */
  const scrollContainers = document.querySelectorAll('.projects-scroll');

  scrollContainers.forEach(container => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      // Mobile: grab cursor + momentum drag scrolling
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      container.style.cursor = 'grab';
      container.style.webkitOverflowScrolling = 'touch';

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5; // Momentum multiplier
        container.scrollLeft = scrollLeft - walk;
      });
    } else {
      // Desktop: subtle scroll hint animation
      // Briefly nudge the scroll position to show content extends
      let hintPlayed = false;

      const hintObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !hintPlayed) {
              hintPlayed = true;
              const originalScroll = container.scrollLeft;
              container.style.scrollBehavior = 'smooth';

              // Nudge right then back to hint at scrollable content
              container.scrollLeft = 80;
              setTimeout(() => {
                container.scrollLeft = originalScroll;
                container.style.scrollBehavior = '';
              }, 600);

              hintObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      hintObserver.observe(container);

      // Also enable grab-to-scroll on desktop for better UX
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      container.style.cursor = 'grab';

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('mouseleave', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mouseup', () => {
        isDown = false;
        container.style.cursor = 'grab';
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
      });
    }
  });


  /* ============================
     10. Parallax section numbers
     .section-number elements translate on Y-axis at 0.3x
     scroll speed for a subtle parallax effect.
     Uses requestAnimationFrame for smooth 60fps performance.
     ============================ */
  const sectionNumbers = document.querySelectorAll('.section-number');

  if (sectionNumbers.length > 0) {
    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;

      sectionNumbers.forEach(el => {
        // Calculate offset relative to the element's position
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const offset = (scrollY - elementTop) * 0.3;

        el.style.transform = `translateY(${offset}px)`;
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    // Initial position on load
    updateParallax();
  }


  /* ============================
     11a. YouTube thumbnail fallback
     YouTube's CDN does NOT 404 when a size doesn't exist — it
     returns a 120x90 grey placeholder image instead. So detecting
     the fallback requires checking naturalWidth after load, not
     just listening for an error event.
     ============================ */
  const swapToHqDefault = (img) => {
    const src = img.getAttribute('src') || '';
    if (src.includes('maxresdefault')) {
      img.setAttribute('src', src.replace('maxresdefault', 'hqdefault'));
    }
  };

  document.querySelectorAll('img[src*="img.youtube.com"]').forEach((img) => {
    // Case 1: image genuinely 404s
    img.addEventListener('error', () => swapToHqDefault(img), { once: true });
    // Case 2: YouTube returns its 120x90 placeholder for missing sizes
    const check = () => {
      if (img.naturalWidth > 0 && img.naturalWidth <= 120) {
        swapToHqDefault(img);
      }
    };
    if (img.complete) check();
    else img.addEventListener('load', check, { once: true });
  });

  // Also handle showreel background-image (inline style on index.html).
  // If we're on the home page, probe the showreel thumbnail via a hidden
  // Image() and swap the background-image if YouTube returned the placeholder.
  const showreel = document.querySelector('.showreel-trigger .video-placeholder');
  if (showreel) {
    const style = showreel.getAttribute('style') || '';
    const match = style.match(/url\(['"]?(https:\/\/img\.youtube\.com\/vi\/([^/]+)\/maxresdefault\.jpg)['"]?\)/);
    if (match) {
      const probe = new Image();
      probe.onload = () => {
        if (probe.naturalWidth > 0 && probe.naturalWidth <= 120) {
          const fallback = match[1].replace('maxresdefault', 'hqdefault');
          showreel.style.backgroundImage = `url('${fallback}')`;
        }
      };
      probe.src = match[1];
    }
  }


  /* ============================
     11. In-page YouTube lightbox
     Click any element with data-video="VIDEO_ID" to open the YouTube
     player inside an overlay instead of navigating away. ESC or click
     the backdrop to close. Iframe is removed on close so audio stops.
     ============================ */
  const videoTriggers = document.querySelectorAll('[data-video]');

  if (videoTriggers.length > 0) {
    // Build the overlay once, lazily.
    let lightbox;
    let inner;
    const ensureLightbox = () => {
      if (lightbox) return;
      lightbox = document.createElement('div');
      lightbox.className = 'video-lightbox';
      inner = document.createElement('div');
      inner.className = 'video-lightbox-inner';
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'video-lightbox-close';
      close.setAttribute('aria-label', 'Close video');
      close.textContent = '\u2715'; // ×
      close.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
      inner.appendChild(close);
      lightbox.appendChild(inner);
      document.body.appendChild(lightbox);
    };

    const openLightbox = (videoId) => {
      ensureLightbox();
      // Remove any previous iframe, then add a fresh one
      const oldFrame = inner.querySelector('iframe');
      if (oldFrame) oldFrame.remove();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('title', 'Video player');
      inner.appendChild(iframe);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      // Strip the iframe so audio stops and the next open starts fresh
      const frame = inner?.querySelector('iframe');
      if (frame) frame.remove();
    };

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    videoTriggers.forEach((el) => {
      el.addEventListener('click', (e) => {
        const id = el.getAttribute('data-video');
        if (!id) return;
        e.preventDefault();
        openLightbox(id);
      });
    });
  }

});
