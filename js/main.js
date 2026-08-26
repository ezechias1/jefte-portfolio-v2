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
  // Build the overlay once, lazily. Hoisted so showreel hover can use openLightbox too.
  let lightbox;
  let inner;

  const videoTriggers = document.querySelectorAll('[data-video]');

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
    // Skip the showreel hover element — it has its own click handler
    if (el.id === 'showreel-hover' || el.closest('#showreel-hover')) return;
    el.addEventListener('click', (e) => {
      const id = el.getAttribute('data-video');
      if (!id) return;
      e.preventDefault();
      openLightbox(id);
    });
  });


  // Showreel hover-to-play is handled by inline script in index.html

});


/* ============================================================
   Reel hero + hover-to-play work bands

   The footage runs muted and looping behind the headline, and each
   work band starts playing when you point at it. Both are injected
   after load rather than sitting in the markup, so the first paint
   is the poster frame and nothing blocks it.
   ============================================================ */
(function () {
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return; // the posters stand on their own

  // Most of this audience is on a phone on mobile data. If the browser
  // says the connection is poor or the visitor has data saver on, do not
  // pull a video stream at them — the poster frame is already good.
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && (conn.saveData === true || /^(slow-)?2g$/.test(conn.effectiveType || ''))) return;

  function embed(id, extra) {
    var p = [
      'autoplay=1', 'mute=1', 'loop=1', 'playlist=' + id,
      'controls=0', 'modestbranding=1', 'rel=0', 'playsinline=1',
      'iv_load_policy=3', 'disablekb=1', 'fs=0', 'enablejsapi=1'
    ].concat(extra || []).join('&');
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?' + p;
    f.allow = 'autoplay; encrypted-media';
    f.setAttribute('tabindex', '-1');
    f.setAttribute('title', '');
    f.setAttribute('aria-hidden', 'true');
    return f;
  }

  function command(frame, func) {
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: func, args: [] }), '*'
    );
  }

  /* ---- hero ---- */
  var hero = document.getElementById('reel-hero');
  var slot = document.getElementById('reel-hero-frame');
  if (hero && slot) {
    var heroId = hero.getAttribute('data-reel');
    var heroFrame = null;

    // Crossfade off the poster only once the player says it is actually
    // playing. A fixed timeout showed a black frame and a spinner whenever
    // the connection was slower than the guess.
    var reveal = function () { slot.classList.add('is-playing'); };

    window.addEventListener('message', function (e) {
      if (!/youtube(-nocookie)?\.com$/.test(e.origin.replace(/^https?:\/\/(www\.)?/, 'https://').replace('https://', ''))) {
        if (e.origin.indexOf('youtube') === -1) return;
      }
      var data;
      try { data = JSON.parse(e.data); } catch (err) { return; }
      var info = data && data.info;
      var state = (data && data.event === 'onStateChange') ? data.info
                : (info && typeof info.playerState !== 'undefined') ? info.playerState
                : null;
      if (state === 1) reveal();   // 1 = playing
    });

    var startHero = function () {
      if (heroFrame) return;
      heroFrame = embed(heroId);
      heroFrame.addEventListener('load', function () {
        // Handshake so the player starts reporting its state back to us.
        command(heroFrame, 'addEventListener');
        try {
          heroFrame.contentWindow.postMessage(
            JSON.stringify({ event: 'listening', id: 'reel-hero' }), '*'
          );
        } catch (err) { /* cross-origin timing — the fallback covers it */ }
      });
      slot.appendChild(heroFrame);
      // No timeout fallback here on purpose. The poster sits underneath
      // permanently, so if playback never starts — slow connection, a
      // network that blocks YouTube, a browser without the codecs — the
      // visitor keeps a good still frame instead of a black rectangle.
      // The player only ever fades in over the top of it.
    };

    if (document.readyState === 'complete') startHero();
    else window.addEventListener('load', startHero, { once: true });

    // Stop paying for the video once the hero is off screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          command(heroFrame, e.isIntersecting ? 'playVideo' : 'pauseVideo');
        });
      }, { threshold: 0.15 }).observe(hero);
    }

    var soundBtn = document.getElementById('reel-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', function () {
        var on = soundBtn.getAttribute('aria-pressed') === 'true';
        command(heroFrame, on ? 'mute' : 'unMute');
        soundBtn.setAttribute('aria-pressed', on ? 'false' : 'true');
        var label = soundBtn.querySelector('.reel-sound-label');
        if (label) label.textContent = on ? 'Sound off' : 'Sound on';
      });
    }
  }

  /* ---- work bands ---- */
  // Pointer devices only: on a phone this would autoplay four videos
  // over someone's mobile data for no benefit, since there is no hover.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.work-media[data-yt]').forEach(function (media) {
    var id = media.getAttribute('data-yt');
    var frame = null;
    var timer = null;

    media.closest('.work-link').addEventListener('mouseenter', function () {
      clearTimeout(timer);
      // Brief delay so sweeping the cursor down the page does not fire
      // every video at once.
      timer = setTimeout(function () {
        if (!frame) {
          frame = embed(id);
          media.appendChild(frame);
        } else {
          command(frame, 'playVideo');
        }
        media.classList.add('is-playing');
      }, 220);
    });

    media.closest('.work-link').addEventListener('mouseleave', function () {
      clearTimeout(timer);
      media.classList.remove('is-playing');
      command(frame, 'pauseVideo');
    });
  });
})();
