/**
 * ============================================================================
 * MAIN APPLICATION ORCHESTRATOR
 * ============================================================================
 * Initializes templates, handles typewriter effect, theme switching,
 * music player visualizer, and scroll animations.
 */

document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.BIRTHDAY_CONFIG;
  const audio = window.birthdayAudio;
  const particles = window.particleEngine;

  // ==========================================
  // 1. POPULATE DYNAMIC CONFIG CONTENT
  // ==========================================
  function renderContent() {
    // Recipient & Headings
    document.title = `Happy Birthday, ${cfg.recipient.name} ✨`;
    
    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setTxt("intro-for-name", `For ${cfg.recipient.name}`);
    setTxt("nav-brand-name", cfg.recipient.name);
    setTxt("hero-date-badge", cfg.recipient.birthdayDisplay);
    setTxt("hero-name-highlight", cfg.recipient.name);
    setTxt("footer-name", `Happy Birthday, ${cfg.recipient.name}`);
    setTxt("footer-from", cfg.sender.name);

    // Letter Content
    const letterContainer = document.getElementById("letter-body");
    if (letterContainer && cfg.letter) {
      let html = `<h3 class="letter-heading">${cfg.letter.heading}</h3>`;
      cfg.letter.paragraphs.forEach(p => {
        html += `<p class="letter-para">${p}</p>`;
      });
      html += `
        <div class="letter-signature-block">
          <p class="letter-closing">${cfg.letter.closing}</p>
          <p class="letter-signoff">${cfg.letter.signoff}</p>
        </div>
      `;
      letterContainer.innerHTML = html;
    }

    // Reasons Bento Grid
    const reasonsContainer = document.getElementById("reasons-bento-grid");
    if (reasonsContainer && cfg.reasons) {
      reasonsContainer.innerHTML = cfg.reasons.map((r, i) => `
        <div class="bento-card ${i === 0 || i === 3 ? 'bento-wide' : ''}">
          <div class="bento-card-top">
            <span class="bento-num">${r.number}</span>
            <span class="bento-icon">${r.icon}</span>
          </div>
          <span class="bento-tag">${r.tag}</span>
          <h3 class="bento-title">${r.title}</h3>
          <p class="bento-desc">${r.description}</p>
        </div>
      `).join("");
    }

    // Journey Timeline
    const journeyContainer = document.getElementById("journey-timeline");
    if (journeyContainer && cfg.journey) {
      journeyContainer.innerHTML = cfg.journey.map(item => `
        <div class="timeline-step">
          <div class="timeline-marker">
            <span class="timeline-icon">${item.icon}</span>
          </div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="timeline-year">${item.year}</span>
              <span class="timeline-badge">${item.badge}</span>
            </div>
            <h3 class="timeline-title">${item.title}</h3>
            <p class="timeline-desc">${item.description}</p>
          </div>
        </div>
      `).join("");
    }

    // Memory Polaroids
    const polaroidContainer = document.getElementById("polaroid-strip");
    if (polaroidContainer && cfg.memories) {
      polaroidContainer.innerHTML = cfg.memories.map((m, idx) => `
        <div class="polaroid-wrapper" style="--rotation: ${(idx % 2 === 0 ? -2 : 2.5)}deg;">
          <div class="polaroid-card">
            <div class="polaroid-front">
              <div class="washi-tape"></div>
              <div class="polaroid-photo-frame">
                <span class="polaroid-art-icon">${m.icon}</span>
                <span class="polaroid-date-tag">${m.date}</span>
              </div>
              <div class="polaroid-caption">
                <h4>${m.title}</h4>
                <p class="tap-hint">Tap to flip ↺</p>
              </div>
            </div>
            <div class="polaroid-back" style="background: ${m.accent || '#fff7ed'};">
              <div class="polaroid-back-inner">
                <span class="quote-mark">“</span>
                <p>${m.note}</p>
                <span class="polaroid-heart">🤍</span>
              </div>
            </div>
          </div>
        </div>
      `).join("");
    }

    // Surprise Voucher
    const voucherContainer = document.getElementById("voucher-details");
    if (voucherContainer && cfg.surprise) {
      voucherContainer.innerHTML = `
        <div class="vip-voucher-header">
          <div class="vip-crown">👑</div>
          <span class="vip-badge">${cfg.surprise.badge}</span>
          <h2>${cfg.surprise.title}</h2>
          <p class="vip-subtitle">${cfg.surprise.subtitle}</p>
        </div>
        <div class="vip-perks-list">
          ${cfg.surprise.perks.map(p => `
            <div class="vip-perk-item">
              <span class="perk-icon">${p.icon}</span>
              <span class="perk-text">${p.text}</span>
            </div>
          `).join("")}
        </div>
        <div class="vip-voucher-footer">
          <span class="vip-code-label">PROMO CODE:</span>
          <code class="vip-code">${cfg.surprise.code}</code>
          <span class="vip-redeem-note">Valid unconditionally for lifetime with infinite renewals ✨</span>
        </div>
      `;
    }
  }

  // ==========================================
  // 2. TYPEWRITER EFFECT
  // ==========================================
  function initTypewriter() {
    const typewriterEl = document.getElementById("hero-typewriter");
    if (!typewriterEl || !cfg.typewriterLines || !cfg.typewriterLines.length) return;

    let lineIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function tick() {
      const currentLine = cfg.typewriterLines[lineIdx];
      charIdx += isDeleting ? -1 : 1;
      typewriterEl.textContent = currentLine.substring(0, charIdx);

      let delay = isDeleting ? 28 : 55;

      if (!isDeleting && charIdx === currentLine.length) {
        isDeleting = true;
        delay = 2400; // Pause at end of sentence
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        lineIdx = (lineIdx + 1) % cfg.typewriterLines.length;
        delay = 400; // Pause before typing next
      }

      setTimeout(tick, delay);
    }

    tick();
  }

  // ==========================================
  // 3. INTRO OVERLAY & MUSIC ACTIVATION
  // ==========================================
  function initIntro() {
    const introOverlay = document.getElementById("intro-overlay");
    const openBtn = document.getElementById("open-experience-btn");

    if (openBtn && introOverlay) {
      openBtn.addEventListener("click", () => {
        introOverlay.classList.add("fade-out");
        setTimeout(() => {
          introOverlay.style.display = "none";
        }, 900);

        // Start festive celebration
        if (particles) particles.burstConfetti();
        if (audio) {
          audio.startBGM();
          updateMusicUI(true);
        }
      });
    }
  }

  // ==========================================
  // 4. MUSIC CONTROLLER & VISUALIZER
  // ==========================================
  function updateMusicUI(isPlaying) {
    const musicToggles = document.querySelectorAll(".music-toggle-btn");
    const playerWidget = document.getElementById("floating-music-widget");
    const playIcon = document.getElementById("music-icon-play");
    const pauseIcon = document.getElementById("music-icon-pause");

    musicToggles.forEach(btn => {
      btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
    });

    if (isPlaying) {
      if (playerWidget) playerWidget.classList.add("playing");
      if (playIcon) playIcon.style.display = "none";
      if (pauseIcon) pauseIcon.style.display = "inline-block";
    } else {
      if (playerWidget) playerWidget.classList.remove("playing");
      if (playIcon) playIcon.style.display = "inline-block";
      if (pauseIcon) pauseIcon.style.display = "none";
    }
  }

  function initMusicPlayer() {
    const toggleBtns = document.querySelectorAll(".music-toggle-btn");
    const volumeSlider = document.getElementById("music-volume-slider");

    toggleBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (!audio) return;
        const nowPlaying = audio.toggleBGM();
        updateMusicUI(nowPlaying);
      });
    });

    if (volumeSlider && audio) {
      volumeSlider.addEventListener("input", (e) => {
        audio.setVolume(parseFloat(e.target.value));
      });
    }

    // Audio Visualizer bar animation
    const bars = document.querySelectorAll(".visualizer-bar");
    function renderVisualizer() {
      if (audio && audio.isPlaying && audio.analyser) {
        const dataArray = new Uint8Array(audio.analyser.frequencyBinCount);
        audio.analyser.getByteFrequencyData(dataArray);

        bars.forEach((bar, idx) => {
          const val = dataArray[idx * 2] || 0;
          const height = Math.max(4, (val / 255) * 22);
          bar.style.height = `${height}px`;
        });
      } else {
        bars.forEach(bar => bar.style.height = "4px");
      }
      requestAnimationFrame(renderVisualizer);
    }
    renderVisualizer();
  }

  // ==========================================
  // 5. THEME SWITCHER (Dark / Light)
  // ==========================================
  function initTheme() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    const root = document.documentElement;

    const savedTheme = localStorage.getItem("sowji_birthday_theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    root.setAttribute("data-theme", savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener("click", () => {
        const currentTheme = root.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", nextTheme);
        localStorage.setItem("sowji_birthday_theme", nextTheme);
      });
    }
  }

  // ==========================================
  // 6. SCROLL PROGRESS & REVEAL ANIMATIONS
  // ==========================================
  function initScroll() {
    const progressBar = document.getElementById("scroll-progress-bar");

    window.addEventListener("scroll", () => {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0 && progressBar) {
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
      }
    }, { passive: true });

    // Intersection Observer for silky fade/slide reveal
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal-on-scroll").forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  // 7. PRINT / KEEPSAKE BUTTON
  // ==========================================
  function initKeepsake() {
    const printBtn = document.getElementById("save-keepsake-btn");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.print();
      });
    }
  }

  // Execute initialization
  renderContent();
  initTypewriter();
  initIntro();
  initMusicPlayer();
  initTheme();
  initScroll();
  initKeepsake();
});
