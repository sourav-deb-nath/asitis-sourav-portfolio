# SOURAV (asitis.sourav) — Dark Cinematic Portfolio

> **"Crafting cinematic digital systems as it is."**  
> A premium, dark cinematic personal portfolio website engineered with pure HTML5, modern CSS3, and vanilla JavaScript. Zero frameworks, zero dependencies, zero paid services.

---

## ✦ Aesthetic & Design Pillars

- **Visual Tone**: Deep obsidian void (`#050608`), cybernetic cyan (`#00f0ff`), neon violet (`#8b5cf6`), and emerald accents.
- **Cinematic Atmosphere**:
  - 60 FPS interactive HTML5 cosmic starfield with constellation physics and mouse repulsion.
  - SVG fractal film grain texture for an analog cinema look.
  - Smooth custom magnetic trailing cursor with fluid physics.
  - 3D perspective card tilt tracking cursor coordinates.
  - Built-in Web Audio API synthesizer for futuristic micro-clicks and toggleable ambient drone (pure code, no external MP3s).
- **Typography**:
  - `Syne`: High-fashion avant-garde display headings.
  - `Space Grotesk`: Ultra-clean editorial body copy.
  - `JetBrains Mono`: Futuristic HUD telemetry stamps, badges, and timestamps.
- **Mobile First**: Fluid `clamp()` typography, responsive CSS Grid, and custom full-screen mobile cyber navigation.

---

## ✦ Sections Breakdown

1. **Header & HUD**:
   - Monogram logo (`asitis.sourav`)
   - Telemetry clock (live time display)
   - Web Audio FX ambient synthesizer toggle
   - Command Palette quick launcher (`Ctrl + K` / `Cmd + K`)
   - Smooth navigation & mobile drawer
2. **Hero**:
   - Status badge indicator (`SYS.STATUS: ONLINE`)
   - High-impact editorial headline & subhead
   - Kinetic 3D HUD hologram card with rotating orbital rings and scanline beam
   - Telemetry metrics strip (`07+ Years`, `50+ Artifacts`, `100K Community`, `99.9% Precision`)
   - Dual CTAs with smooth scroll
3. **About Me**:
   - Holographic ID card with cyber avatar and quick telemetry facts
   - The "As It Is" manifesto & philosophy quote
   - Core disciplines matrix (Creative Engineering, Dark Cinematic UI/UX, Motion Direction, Brand Strategy)
   - Capabilities & weaponry tag matrix
4. **Featured Work**:
   - Multi-category filter tab system (`ALL`, `CREATIVE TECH`, `ARCHITECTURE`, `CINEMATICS`)
   - 6 detailed sample showcase projects with high-tech SVG generative thumbnails
   - Interactive Project Inspector Modal / Lightbox with full narrative, role, year, tech chips, and live links
5. **Content Links (The Ecosystem)**:
   - High-density hub for your personal brand (`asitis.sourav`)
   - Cards for YouTube, Instagram, GitHub, X (Twitter), Substack, Spotify, LinkedIn, and Discord
   - Live stat badges, descriptions, and direct external action triggers
6. **Contact ("Initiate Transmission")**:
   - Cyberpunk command console interface
   - Form with input validation and simulated encrypted packet transmission
   - One-click copy email button with interactive toast notifications
   - Direct encrypted channels (Email, Telegram, Call sync)
7. **Footer**:
   - Brand manifesto, section index, channel directory, copyright stamp, and back-to-top ascend button.

---

## ✦ Project Structure

```text
asitis-sourav-portfolio/
│
├── index.html          # Semantic HTML5 structure & all sections
├── css/
│   └── style.css       # Complete CSS3 design system, responsive rules, animations
├── js/
│   └── app.js          # Starfield canvas, audio synth, cursor, tilt, modals, HUD
├── assets/             # Place your custom project screenshots, avatars, or logos here
└── README.md           # Documentation & customization guide
```

---

## ✦ How to Run & Preview

Because this project is built entirely on pure web standards, **no build step, bundler, or npm install is required**.

### Option 1: Direct Browser Launch
Simply double-click `index.html` in your file explorer, or right-click and choose **Open with > Chrome / Edge / Firefox / Safari**.

### Option 2: Local HTTP Server (Recommended)
Running through a local server ensures full access to audio APIs and smooth local navigation:

**Using Python:**
```bash
python -m http.server 8080
```
Open [http://localhost:8080](http://localhost:8080) in your browser.

**Using VS Code Live Server:**
Right-click `index.html` inside VS Code and select **"Open with Live Server"**.

---

## ✦ Customization Guide

### 1. Updating Projects & Case Studies
All project modal details are managed inside [`js/app.js`](file:///C:/Users/Sourav%20Debnath/.gemini/antigravity/scratch/asitis-sourav-portfolio/js/app.js) in the `PROJECT_DATABASE` object:
```javascript
const PROJECT_DATABASE = {
  'nebula-os': {
    title: 'YOUR PROJECT NAME',
    category: 'Creative Tech / Architecture',
    year: '2026',
    role: 'Lead Architect',
    description: 'Detailed description of what you designed and built...',
    deliverables: ['Custom Engine', 'Design System'],
    tags: ['WebGL', 'TypeScript'],
    previewUrl: 'https://yourlink.com',
    githubUrl: 'https://github.com/yourhandle/repo'
  },
  // Add or edit projects here
};
```

To use custom screenshots instead of the generative SVG thumbnails, replace the `<svg class="project-thumbnail-art">` in [`index.html`](file:///C:/Users/Sourav%20Debnath/.gemini/antigravity/scratch/asitis-sourav-portfolio/index.html) with:
```html
<img src="assets/your-screenshot.jpg" alt="Project Screenshot" class="project-thumbnail-art">
```

### 2. Updating Contact Information & Social Handles
In [`index.html`](file:///C:/Users/Sourav%20Debnath/.gemini/antigravity/scratch/asitis-sourav-portfolio/index.html):
- Search for `contact@asitissourav.com` and replace with your active email address.
- Search for `https://youtube.com/@asitis.sourav`, `https://instagram.com/asitis.sourav`, `https://github.com/asitis-sourav`, etc., and insert your exact channel URLs.

### 3. Modifying Color Accents & Glows
Open [`css/style.css`](file:///C:/Users/Sourav%20Debnath/.gemini/antigravity/scratch/asitis-sourav-portfolio/css/style.css) and customize the variables inside `:root`:
```css
:root {
  --bg-void: #050608;          /* Background Void */
  --accent-cyan: #00f0ff;      /* Primary Neon Glow */
  --accent-violet: #8b5cf6;    /* Secondary Nebula Accent */
  --accent-emerald: #10b981;   /* Online Status Indicator */
}
```

---

## ✦ 100% Free Deployment Options

You can host this website online completely free of charge with zero monthly costs:

1. **GitHub Pages (Free)**:
   - Create a repository on GitHub (e.g. `asitis-sourav` or `username.github.io`).
   - Push these files to the repository.
   - Go to **Settings > Pages** and select `main` branch. Your site is live!
2. **Vercel / Netlify / Cloudflare Pages (Free)**:
   - Drag and drop the `asitis-sourav-portfolio` folder directly into Vercel or Netlify.
   - Deployment finishes in under 15 seconds with free automatic SSL.
