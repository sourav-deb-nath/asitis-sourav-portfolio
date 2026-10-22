/**
 * asitis.sourav - Portfolio Architecture
 * Engine: Pure Vanilla JavaScript (ES6+)
 * Modules: Cosmic Canvas, Web Audio Synthesizer, Dynamic Cursor, 
 *          3D Card Tilt, Project Modal, Command Palette, Form Engine
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. Sound Synthesizer Engine (Web Audio API - Zero External Assets)
     ========================================================================== */
  class CyberAudio {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.ambientOsc = null;
      this.ambientGain = null;
      this.initStorage();
    }

    initStorage() {
      const saved = localStorage.getItem('asitis_sound_enabled');
      this.enabled = saved === 'true';
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.ensureContext();
      this.enabled = !this.enabled;
      localStorage.setItem('asitis_sound_enabled', this.enabled);

      if (this.enabled) {
        this.playBeep(880, 'sine', 0.08, 0.05);
        this.startAmbientDrone();
      } else {
        this.stopAmbientDrone();
      }
      return this.enabled;
    }

    playBeep(freq = 440, type = 'sine', duration = 0.08, volume = 0.04) {
      if (!this.enabled) return;
      try {
        this.ensureContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        console.warn('Audio play error:', e);
      }
    }

    playChirp() {
      if (!this.enabled) return;
      try {
        this.ensureContext();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    startAmbientDrone() {
      if (!this.enabled || this.ambientOsc) return;
      try {
        this.ensureContext();
        this.ambientOsc = this.ctx.createOscillator();
        this.ambientGain = this.ctx.createGain();

        this.ambientOsc.type = 'sine';
        this.ambientOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Deep A1 note

        this.ambientGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 2.5);

        this.ambientOsc.connect(this.ambientGain);
        this.ambientGain.connect(this.ctx.destination);

        this.ambientOsc.start();
      } catch (e) {}
    }

    stopAmbientDrone() {
      if (this.ambientOsc && this.ambientGain) {
        try {
          this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
          setTimeout(() => {
            if (this.ambientOsc) {
              this.ambientOsc.stop();
              this.ambientOsc.disconnect();
              this.ambientOsc = null;
            }
          }, 850);
        } catch (e) {
          this.ambientOsc = null;
        }
      }
    }
  }

  const audio = new CyberAudio();

  /* ==========================================================================
     2. Cosmic Starfield & Particle Nebula (HTML5 Canvas 60FPS)
     ========================================================================== */
  class CosmicCanvas {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.particleCount = 90;
      this.mouse = { x: null, y: null, radius: 150 };
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.init();
      this.bindEvents();
      this.animate();
    }

    init() {
      this.resize();
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          radius: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(139, 92, 246,',
          alpha: Math.random() * 0.6 + 0.2,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          pulsing: Math.random() * 0.02 + 0.005
        });
      }
    }

    resize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * window.devicePixelRatio;
      this.canvas.height = this.height * window.devicePixelRatio;
      this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
      });

      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });

      window.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    animate() {
      this.ctx.clearRect(0, 0, this.width, this.height);

      // Draw & Update Particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
        if (p.y < 0) p.y = this.height;
        if (p.y > this.height) p.y = 0;

        // Mouse avoidance/attraction physics
        if (this.mouse.x !== null) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.mouse.radius) {
            const force = (1 - dist / this.mouse.radius) * 0.8;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        // Draw particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color} ${p.alpha})`;
        this.ctx.fill();

        // Connect nearby particles with subtle constellation lines
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const lineAlpha = (1 - dist / 110) * 0.12;
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
            this.ctx.lineWidth = 0.6;
            this.ctx.stroke();
          }
        }
      }

      requestAnimationFrame(() => this.animate());
    }
  }

  /* ==========================================================================
     3. Custom Futuristic Smooth Cursor
     ========================================================================== */
  class CyberCursor {
    constructor() {
      this.cursor = document.querySelector('.custom-cursor');
      this.follower = document.querySelector('.custom-cursor-follower');
      if (!this.cursor || !this.follower) return;

      this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      this.mouse = { x: this.pos.x, y: this.pos.y };
      this.ease = 0.18;

      this.bindEvents();
      this.render();
    }

    bindEvents() {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        this.cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      });

      // Hover triggers on interactive elements
      const interactives = document.querySelectorAll('a, button, input, textarea, .project-card, .channel-card, .hud-pill, .filter-btn');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
          this.cursor.classList.add('active');
          this.follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
          this.cursor.classList.remove('active');
          this.follower.classList.remove('active');
        });
      });
    }

    render() {
      this.pos.x += (this.mouse.x - this.pos.x) * this.ease;
      this.pos.y += (this.mouse.y - this.pos.y) * this.ease;

      this.follower.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
      requestAnimationFrame(() => this.render());
    }
  }

  /* ==========================================================================
     4. 3D Perspective Card Tilt
     ========================================================================== */
  function initCardTilt() {
    const tiltCards = document.querySelectorAll('.project-card, .hud-card-container, .profile-cinematic-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  /* ==========================================================================
     5. Real-Time Telemetry Clock & Header Scroller
     ========================================================================== */
  function initHeaderAndClock() {
    const clockEl = document.getElementById('liveClock');
    const headerEl = document.querySelector('.site-header');

    function updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      if (clockEl) {
        clockEl.textContent = `${hours}:${minutes}:${seconds} IST`;
      }
    }

    setInterval(updateTime, 1000);
    updateTime();

    // Scroll listener for glassmorphism
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  /* ==========================================================================
     6. Mobile Navigation Drawer
     ========================================================================== */
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const links = document.querySelectorAll('.mobile-nav-link');

    if (!toggleBtn || !overlay) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = overlay.classList.toggle('open');
      toggleBtn.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      audio.playBeep(isOpen ? 600 : 400, 'sine', 0.05);
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        overlay.classList.remove('open');
        toggleBtn.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================================================
     7. Featured Work: Filter Engine & Modal Inspector
     ========================================================================== */
  const PROJECT_DATABASE = {
    'nebula-os': {
      title: 'NEBULA OS // Spatial Desktop Interface',
      category: 'Creative Tech / Architecture',
      year: '2026',
      role: 'Lead System Architect & Creative Developer',
      description: 'A revolutionary spatial browser-based workstation combining 3D WebGL scene graphs, zero-latency window management, and generative ambient soundscapes. Built to push the boundaries of future human-computer interfaces.',
      deliverables: ['Custom WebGL Engine', 'Spatial Shader Graph', 'Dynamic Window Compositor', 'Design System'],
      tags: ['TypeScript', 'WebGL', 'Three.js', 'WebAudio', 'GLSL'],
      previewUrl: '#',
      githubUrl: '#'
    },
    'chronovoid': {
      title: 'CHRONOVOID // Audio-Reactive Odyssey',
      category: 'Cinematics / Creative Tech',
      year: '2025',
      role: 'Creative Director & Technical Artist',
      description: 'An interactive virtual exhibition for an electronic music collective. Uses live FFT frequency analysis to morph real-time volumetric smoke and crystalline geometries synchronized to user audio input.',
      deliverables: ['FFT Audio Visualizer', 'Particle Physics Simulation', 'Custom Post-Processing', 'Interactive Art Piece'],
      tags: ['Vanilla JS', 'Web Audio API', 'Canvas API', 'GLSL Shaders'],
      previewUrl: '#',
      githubUrl: '#'
    },
    'aura-archive': {
      title: 'AURA ARCHIVE // High-Fashion Editorial Hub',
      category: 'Digital Architecture / Visual Design',
      year: '2025',
      role: 'Digital Designer & Frontend Developer',
      description: 'Monolithic digital publication for avant-garde fashion curation. Features fluid typography, magnetic cursor gestures, smooth page transitions, and progressive image decoding.',
      deliverables: ['Editorial System', 'Fluid Typography Engine', 'Micro-Interactions', 'CMS Architecture'],
      tags: ['Modern CSS', 'Vanilla JavaScript', 'Accessibility', 'Responsive Design'],
      previewUrl: '#',
      githubUrl: '#'
    },
    'synapse-ai': {
      title: 'SYNAPSE AI // Neural Telemetry Dashboard',
      category: 'Creative Tech / System Design',
      year: '2025',
      role: 'UI/UX Architect & Developer',
      description: 'High-density cybernetic monitoring cockpit for real-time autonomous model inference, token latency analysis, and hierarchical multi-agent node coordination.',
      deliverables: ['Telemetry Visualization', 'Real-Time WebSockets', 'Dark HUD Theme', 'Component Library'],
      tags: ['Design System', 'JavaScript', 'SVG Data Viz', 'Performance'],
      previewUrl: '#',
      githubUrl: '#'
    },
    'obsidian-labs': {
      title: 'OBSIDIAN LABS // Hardware Experience Microsite',
      category: 'Cinematics / Visual Design',
      year: '2024',
      role: '3D Designer & Interaction Engineer',
      description: 'Futuristic microsite showcasing an acoustic noise-cancelling audio headset. Incorporates interactive 360-degree exploded product renders, smooth scroll scrollytelling, and magnetic sound previews.',
      deliverables: ['Scrollytelling Journey', 'Interactive Product Exploded View', 'Sound Micro-Engine'],
      tags: ['Creative Direction', 'Scrollytelling', 'CSS Transforms', 'Sound Design'],
      previewUrl: '#',
      githubUrl: '#'
    },
    'echoes-film': {
      title: 'ECHOES OF TOMORROW // Sci-Fi Interactive Teaser',
      category: 'Cinematics / Creative Tech',
      year: '2024',
      role: 'Director & Digital Experience Producer',
      description: 'An interactive trailer and ARG narrative platform for an indie dystopian cinematic short. Visitors decrypt simulated transmission logs and uncover hidden storyline fragments.',
      deliverables: ['Interactive Terminal ARG', 'Cinematic Video Player', 'Glitch Audio Effects'],
      tags: ['Vanilla JS', 'Web Audio', 'Video API', 'Storytelling'],
      previewUrl: '#',
      githubUrl: '#'
    }
  };

  function initProjectsAndModal() {
    // Filter logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        audio.playBeep(700, 'triangle', 0.04);

        projectCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });

    // Modal logic
    const backdrop = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.modal-close-btn');

    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalRole = document.getElementById('modalRole');
    const modalYear = document.getElementById('modalYear');
    const modalDesc = document.getElementById('modalDescription');
    const modalDeliverables = document.getElementById('modalDeliverables');
    const modalTech = document.getElementById('modalTech');
    const modalLiveLink = document.getElementById('modalLiveLink');
    const modalCodeLink = document.getElementById('modalCodeLink');

    function openModal(projectId) {
      const data = PROJECT_DATABASE[projectId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalRole.textContent = data.role;
      modalYear.textContent = data.year;
      modalDesc.textContent = data.description;

      modalDeliverables.innerHTML = '';
      data.deliverables.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        modalDeliverables.appendChild(li);
      });

      modalTech.innerHTML = '';
      data.tags.forEach(t => {
        const chip = document.createElement('span');
        chip.className = 'tech-chip';
        chip.textContent = t;
        modalTech.appendChild(chip);
      });

      modalLiveLink.href = data.previewUrl;
      modalCodeLink.href = data.githubUrl;

      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      audio.playChirp();
    }

    function closeModal() {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      audio.playBeep(450, 'sine', 0.05);
    }

    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        openModal(id);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop && backdrop.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ==========================================================================
     8. Transmission Console (Contact Form Engine)
     ========================================================================== */
  function initContactConsole() {
    const form = document.getElementById('transmissionForm');
    const statusMsg = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitTransmissionBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        statusMsg.className = 'form-status-msg error';
        statusMsg.textContent = 'SYS.ERR: ALL TRANSMISSION FIELDS ARE MANDATORY.';
        audio.playBeep(220, 'sawtooth', 0.15);
        return;
      }

      // Simulate cinematic transmission uplink
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>TRANSMITTING PACKETS...</span>`;
      audio.playChirp();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>TRANSMISSION ENCRYPTED & SENT</span>`;
        statusMsg.className = 'form-status-msg success';
        statusMsg.textContent = `SYS.OK: TRANSMISSION DISPATCHED TO SOURAV. ACKNOWLEDGED.`;
        audio.playBeep(880, 'sine', 0.12);
        showToast('Transmission successfully dispatched.');
        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = `<span>INITIATE TRANSMISSION</span> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
          statusMsg.style.display = 'none';
        }, 5000);
      }, 1200);
    });

    // Copy Email to Clipboard Action
    const copyBtns = document.querySelectorAll('.copy-trigger');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const textToCopy = btn.getAttribute('data-copy') || 'contact@asitissourav.com';
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
          audio.playBeep(1000, 'sine', 0.05);
        }).catch(() => {
          showToast(`Direct email: ${textToCopy}`);
        });
      });
    });
  }

  /* ==========================================================================
     9. Command Palette (HUD / Ctrl+K Modal)
     ========================================================================== */
  function initCommandPalette() {
    const palette = document.getElementById('commandPalette');
    const triggerBtns = document.querySelectorAll('.cmd-trigger');
    const input = document.getElementById('commandInput');
    const items = document.querySelectorAll('.command-item');

    if (!palette) return;

    function openPalette() {
      palette.classList.add('open');
      if (input) {
        input.value = '';
        input.focus();
      }
      filterItems('');
      audio.playChirp();
    }

    function closePalette() {
      palette.classList.remove('open');
      audio.playBeep(400, 'sine', 0.05);
    }

    function filterItems(query) {
      const q = query.toLowerCase().trim();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    }

    triggerBtns.forEach(b => b.addEventListener('click', openPalette));

    if (input) {
      input.addEventListener('input', (e) => {
        filterItems(e.target.value);
      });
    }

    palette.addEventListener('click', (e) => {
      if (e.target === palette) closePalette();
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (palette.classList.contains('open')) closePalette();
        else openPalette();
      }
      if (e.key === 'Escape' && palette.classList.contains('open')) {
        closePalette();
      }
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        closePalette();

        if (action === 'navigate') {
          const target = item.getAttribute('data-target');
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'copy-email') {
          navigator.clipboard.writeText('contact@asitissourav.com');
          showToast('Email copied to clipboard!');
        } else if (action === 'toggle-audio') {
          const toggleBtn = document.getElementById('audioToggle');
          if (toggleBtn) toggleBtn.click();
        }
      });
    });
  }

  /* ==========================================================================
     10. Toast Notification System
     ========================================================================== */
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span style="color:var(--accent-cyan)">●</span> ${message}`;
    toast.classList.add('show');

    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ==========================================================================
     11. Audio Switch Toggle Button Listener
     ========================================================================== */
  function initAudioToggle() {
    const toggleBtn = document.getElementById('audioToggle');
    if (!toggleBtn) return;

    if (audio.enabled) {
      toggleBtn.classList.add('active');
    }

    toggleBtn.addEventListener('click', () => {
      const isNowActive = audio.toggle();
      toggleBtn.classList.toggle('active', isNowActive);
      showToast(isNowActive ? 'Audio Synthesizer: ONLINE' : 'Audio Synthesizer: MUTED');
    });
  }

  /* ==========================================================================
     12. Intersection Observer for Scroll Reveals
     ========================================================================== */
  function initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    const animatedElements = document.querySelectorAll('.project-card, .channel-card, .discipline-card, .hud-card-container');
    animatedElements.forEach(el => observer.observe(el));
  }

  /* ==========================================================================
     13. Back to Top Smooth Scroll
     ========================================================================== */
  function initBackToTop() {
    const backBtn = document.getElementById('backToTopBtn');
    if (!backBtn) return;
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      audio.playChirp();
    });
  }

  /* ==========================================================================
     Application Bootstrapper
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    new CosmicCanvas('cosmicCanvas');
    new CyberCursor();
    initCardTilt();
    initHeaderAndClock();
    initMobileMenu();
    initProjectsAndModal();
    initContactConsole();
    initCommandPalette();
    initAudioToggle();
    initScrollReveals();
    initBackToTop();

    console.log('%c [ AS IT IS // SOURAV ] Systems initialized.', 'color: #00f0ff; font-weight: bold; font-family: monospace;');
  });

})();
