/**
 * ============================================================================
 * PARTICLES & CELEBRATION ENGINE
 * ============================================================================
 * Features dual-cannon physics confetti, floating golden sparkles,
 * and ambient heart bokeh particles.
 */

class ParticleEngine {
  constructor(canvasId = "fx") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvas.id = canvasId;
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.ambientParticles = [];
    this.isRunning = false;
    this.palette = ["#f59e0b", "#ec4899", "#f43f5e", "#8b5cf6", "#10b981", "#3b82f6", "#fde047", "#ffffff"];

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    window.addEventListener("resize", this.resize);
    this.resize();
    this.initAmbient();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initAmbient() {
    this.ambientParticles = [];
    const count = Math.min(35, Math.floor(window.innerWidth / 35));
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2.5 + 1,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.2,
        pulsing: Math.random() * Math.PI,
        type: Math.random() > 0.4 ? "sparkle" : "heart"
      });
    }
    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(this.loop);
    }
  }

  // Dual cannon confetti blast
  burstConfetti(originX, originY, count = 140) {
    if (window.birthdayAudio && window.birthdayAudio.playConfettiPopSound) {
      window.birthdayAudio.playConfettiPopSound();
    }

    const defaultOrigins = originX !== undefined && originY !== undefined 
      ? [{ x: originX, y: originY, angleSpread: Math.PI * 2, baseAngle: 0, speed: 12 }]
      : [
          // Left cannon
          { x: window.innerWidth * 0.1, y: window.innerHeight * 0.9, angleSpread: 0.7, baseAngle: -Math.PI / 4, speed: 18 },
          // Right cannon
          { x: window.innerWidth * 0.9, y: window.innerHeight * 0.9, angleSpread: 0.7, baseAngle: -3 * Math.PI / 4, speed: 18 }
        ];

    defaultOrigins.forEach(orig => {
      const perCannon = Math.floor(count / defaultOrigins.length);
      for (let i = 0; i < perCannon; i++) {
        const angle = orig.baseAngle + (Math.random() - 0.5) * orig.angleSpread;
        const velocity = (Math.random() * 0.6 + 0.7) * orig.speed;
        this.particles.push({
          x: orig.x,
          y: orig.y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          size: Math.random() * 8 + 5,
          color: this.palette[Math.floor(Math.random() * this.palette.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          life: Math.random() * 70 + 130,
          maxLife: 200,
          shape: Math.random() > 0.3 ? "rect" : (Math.random() > 0.5 ? "circle" : "star")
        });
      }
    });

    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(this.loop);
    }
  }

  // Draw star helper
  drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  // Draw heart helper
  drawHeart(x, y, size, color, alpha) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.scale(size / 10, size / 10);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(-5, -5, -10, 2, 0, 10);
    this.ctx.bezierCurveTo(10, 2, 5, -5, 0, 0);
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.fill();
    this.ctx.restore();
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Render Ambient Background Bokeh & Floating Hearts
    for (let i = 0; i < this.ambientParticles.length; i++) {
      const p = this.ambientParticles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      p.pulsing += 0.03;
      const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulsing));

      if (p.type === "heart") {
        this.drawHeart(p.x, p.y, p.size * 3, "#f43f5e", currentAlpha * 0.4);
      } else {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = "#f59e0b";
        this.ctx.globalAlpha = currentAlpha * 0.5;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = "#f59e0b";
        this.ctx.fill();
        this.ctx.restore();
      }

      // Wrap around
      if (p.y < -10) {
        p.y = this.canvas.height + 10;
        p.x = Math.random() * this.canvas.width;
      }
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
    }

    // 2. Render Physics Confetti
    if (this.particles.length > 0) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // Gravity
        p.vx *= 0.985; // Air resistance
        p.rotation += p.rotationSpeed;
        p.life -= 1;

        const alpha = Math.min(1, p.life / 30);
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = alpha;

        if (p.shape === "rect") {
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else if (p.shape === "circle") {
          this.ctx.fillStyle = p.color;
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        } else {
          this.drawStar(0, 0, 5, p.size * 0.8, p.size * 0.4, p.color);
        }

        this.ctx.restore();

        if (p.life <= 0 || p.y > this.canvas.height + 50) {
          this.particles.splice(i, 1);
        }
      }
    }

    requestAnimationFrame(this.loop);
  }
}

window.particleEngine = new ParticleEngine("fx");
