/**
 * ============================================================================
 * INTERACTIVE EXPERIENCES & COMPONENTS
 * ============================================================================
 * Controls the 3D Cake candle blowing, Wax-Sealed Letter,
 * Wish Jar drawing, Polaroid flipping, and VIP Gift Unboxing.
 */

document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.BIRTHDAY_CONFIG;
  const audio = window.birthdayAudio;
  const particles = window.particleEngine;

  // ==========================================
  // 1. FRIENDSHIP LIVE COUNTER
  // ==========================================
  function initFriendshipCounter() {
    const counterEl = document.getElementById("friendship-counter");
    if (!counterEl || !cfg.friendshipStartDate) return;

    const startDate = new Date(cfg.friendshipStartDate).getTime();

    function updateCounter() {
      const now = new Date().getTime();
      const diff = Math.max(0, now - startDate);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = document.getElementById("count-days");
      const hoursEl = document.getElementById("count-hours");
      const minsEl = document.getElementById("count-mins");
      const secsEl = document.getElementById("count-secs");

      if (daysEl) daysEl.textContent = days.toLocaleString();
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }

  // ==========================================
  // 2. INTERACTIVE BIRTHDAY CAKE & CANDLES
  // ==========================================
  function initCake() {
    const cakeContainer = document.getElementById("cake-container");
    const blowBtn = document.getElementById("blow-candle-btn");
    const relightBtn = document.getElementById("relight-candle-btn");
    const wishStatus = document.getElementById("wish-status");
    let isBlownOut = false;

    function blowOutCandles() {
      if (isBlownOut) return;
      isBlownOut = true;

      cakeContainer.classList.add("candles-out");
      if (audio) audio.playBlowSound();
      if (particles) particles.burstConfetti();

      if (wishStatus) {
        wishStatus.innerHTML = `
          <div class="wish-success-badge">
            <span class="sparkle-icon">✨</span>
            <strong>Your wish has been cast into the stars, Sowji!</strong>
            <p>May every single dream of yours come true this year.</p>
          </div>
        `;
        wishStatus.classList.add("active");
      }

      if (blowBtn) blowBtn.style.display = "none";
      if (relightBtn) relightBtn.style.display = "inline-flex";
    }

    function relightCandles() {
      isBlownOut = false;
      cakeContainer.classList.remove("candles-out");
      if (wishStatus) {
        wishStatus.classList.remove("active");
        wishStatus.innerHTML = "";
      }
      if (blowBtn) blowBtn.style.display = "inline-flex";
      if (relightBtn) relightBtn.style.display = "none";
    }

    if (cakeContainer) cakeContainer.addEventListener("click", blowOutCandles);
    if (blowBtn) blowBtn.addEventListener("click", blowOutCandles);
    if (relightBtn) relightBtn.addEventListener("click", relightCandles);
  }

  // ==========================================
  // 3. WAX-SEALED LETTER UNVEILING
  // ==========================================
  function initLetter() {
    const envelope = document.getElementById("sealed-envelope");
    const letterContent = document.getElementById("unfolded-letter");
    const sealBtn = document.getElementById("break-seal-btn");
    const foldBtn = document.getElementById("fold-letter-btn");

    function openEnvelope() {
      if (audio) audio.playNotePullSound();
      if (envelope) envelope.classList.add("opened");
      setTimeout(() => {
        if (letterContent) letterContent.classList.add("visible");
      }, 350);
    }

    function foldEnvelope() {
      if (letterContent) letterContent.classList.remove("visible");
      setTimeout(() => {
        if (envelope) envelope.classList.remove("opened");
      }, 250);
    }

    if (sealBtn) sealBtn.addEventListener("click", openEnvelope);
    if (envelope) envelope.addEventListener("click", (e) => {
      if (!envelope.classList.contains("opened")) openEnvelope();
    });
    if (foldBtn) foldBtn.addEventListener("click", foldEnvelope);
  }

  // ==========================================
  // 4. WISH JAR & HANDWRITTEN AFFIRMATIONS
  // ==========================================
  function initWishJar() {
    const jar = document.getElementById("wish-jar");
    const pullBtn = document.getElementById("pull-note-btn");
    const noteCard = document.getElementById("active-note-card");
    const noteText = document.getElementById("note-text");
    const noteCounter = document.getElementById("note-counter");

    const notes = cfg.wishJarNotes || [];
    let pulledIndices = [];

    function pullNewNote() {
      if (notes.length === 0) return;
      if (audio) audio.playNotePullSound();

      // Pick non-repeating index until all have been seen
      if (pulledIndices.length >= notes.length) {
        pulledIndices = [];
      }

      let available = [];
      for (let i = 0; i < notes.length; i++) {
        if (!pulledIndices.includes(i)) available.push(i);
      }

      const chosenIdx = available[Math.floor(Math.random() * available.length)];
      pulledIndices.push(chosenIdx);

      // Animation
      if (jar) {
        jar.classList.add("shake-jar");
        setTimeout(() => jar.classList.remove("shake-jar"), 400);
      }

      if (noteCard) {
        noteCard.classList.remove("show-note");
        setTimeout(() => {
          if (noteText) noteText.textContent = notes[chosenIdx];
          if (noteCounter) noteCounter.textContent = `Note ${pulledIndices.length} of ${notes.length}`;
          noteCard.classList.add("show-note");
        }, 150);
      }
    }

    if (jar) jar.addEventListener("click", pullNewNote);
    if (pullBtn) pullBtn.addEventListener("click", pullNewNote);
  }

  // ==========================================
  // 5. 3D GIFT BOX & VIP VOUCHER UNBOXING
  // ==========================================
  function initGiftBox() {
    const giftBox = document.getElementById("gift-box-3d");
    const unwrapBtn = document.getElementById("unwrap-gift-btn");
    const voucherModal = document.getElementById("voucher-reveal-card");
    let isUnwrapped = false;

    function unbox() {
      if (isUnwrapped) return;
      isUnwrapped = true;

      if (giftBox) giftBox.classList.add("unwrapped");
      if (audio) audio.playGiftUnwrapSound();
      if (particles) particles.burstConfetti();

      setTimeout(() => {
        if (voucherModal) {
          voucherModal.classList.add("revealed");
          voucherModal.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);

      if (unwrapBtn) {
        unwrapBtn.textContent = "✨ Claimed With Love! ✨";
        unwrapBtn.classList.add("claimed");
      }
    }

    if (giftBox) giftBox.addEventListener("click", unbox);
    if (unwrapBtn) unwrapBtn.addEventListener("click", unbox);
  }

  // ==========================================
  // 6. POLAROID CARD FLIP & LIGHTBOX
  // ==========================================
  function initPolaroids() {
    const cards = document.querySelectorAll(".polaroid-card");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        card.classList.toggle("flipped");
        if (audio) audio.playTone(392, audio.ctx ? audio.ctx.currentTime : 0, 0.4, 0.03, "sine");
      });
    });
  }

  // Initialize all interactive modules
  initFriendshipCounter();
  initCake();
  initLetter();
  initWishJar();
  initGiftBox();
  initPolaroids();
});
