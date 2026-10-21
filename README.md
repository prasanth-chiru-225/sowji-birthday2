# 🎂 Happy Birthday, Sowji ✨
> A production-grade, deeply heartfelt birthday experience crafted with modern web technologies, ambient procedural audio synthesis, physics-based confetti cannons, and interactive 3D components.

---

## 🌟 What's Inside

1. **💌 Wax-Sealed Heartfelt Letter**
   - Clickable 3D wax seal ("S") with an unfolding parchment letter and personalized signoff.
2. **✨ Bento Grid: "Why You're One of a Kind"**
   - 6 personalized superlatives with modern glassmorphism, hover elevation, and luminous borders.
3. **⏳ Live Friendship Milestone Counter**
   - Real-time ticker counting days, hours, minutes, and seconds of friendship.
4. **🚀 "Our Story So Far" Timeline**
   - Vertical milestone journey through chapters of friendship.
5. **🎂 Interactive 3D Birthday Cake**
   - 3-tier frosted cake with realistic flickering candle flames.
   - Tap or click to blow out the candles: triggers smoke puffs, celebratory confetti cannons, and reveals a custom wish blessing!
   - Includes a "Re-light Candles" button to make multiple wishes!
6. **📸 Polaroid Memory Capsule**
   - Washi-taped polaroid cards with 3D flip animation. Tap to flip and read the secret memory on the back!
7. **🏺 Magic Affirmation Wish Jar**
   - Interactive glass jar with 12+ heartwarming affirmations. Tap to draw a note with smooth card reveal and sound.
8. **🎁 3D Gift Box & VIP Golden Pass**
   - Gift box with silky ribbon and bow. Tap to untie and pop the lid, revealing a **Lifetime Best Friend VIP Pass** loaded with redeemable perks (free birthday dinner, road trips, emergency vent line).
9. **🎵 High-Fidelity Procedural Web Audio Engine**
   - Zero external audio files or MP3 downloads needed!
   - Synthesizes warm lo-fi ambient piano chords, acoustic chimes, candle blowout breath sounds, paper rustles, harp glissandos, and confetti pops completely offline via the Web Audio API.
   - Floating luxury glass music player with live frequency visualizer bars and volume control.
10. **🌓 Luxury Light & Dark Modes**
    - Warm Ivory & Rose Gold (Light) / Midnight Velvet & Starlight Gold (Dark).
11. **📄 Save as Keepsake (Print / PDF)**
    - Clean print stylesheet so Sowji can save the letter and memories forever as a PDF keepsake.

---

## 📂 Project Architecture

```
sowji-birthday/
├── index.html            # Semantic, accessible HTML5 structure & SEO tags
├── README.md             # Documentation & customization guide
├── css/
│   └── style.css         # Design tokens, themes, 3D transforms, animations, print rules
└── js/
    ├── config.js         # 🛠️ EDIT HERE: Recipient name, dates, memories, reasons, letter
    ├── audio.js          # Web Audio API procedural piano, chimes, and sound FX
    ├── particles.js      # Physics confetti cannons & floating ambient hearts/stars
    ├── interactions.js   # Cake candle blowing, envelope unfolding, polaroids, gift unboxing
    └── app.js            # App orchestrator, typewriter, theme toggle, music visualizer
```

---

## ✏️ How to Customize

All custom content is cleanly decoupled in **`js/config.js`**! You can open it in any text editor to modify:
- **`recipient`**: Name (`Sowji`), birthday date, hero headings.
- **`sender`**: Your name (`Prasanth`), signoff.
- **`friendshipStartDate`**: The date your friendship started (e.g. `"2021-09-15"`), which dynamically drives the live milestone counter.
- **`typewriterLines`**: Subtitle phrases rotating on the hero screen.
- **`letter`**: Paragraphs of your personal letter.
- **`reasons`**: The 6 bento grid cards (title, description, tags, icons).
- **`journey`**: Timeline chapters and memories.
- **`memories`**: Polaroid cards (you can also drop real image paths in place of icons!).
- **`wishJarNotes`**: Affirmation notes inside the magic jar.
- **`surprise`**: VIP pass title, voucher perks, and promo code.

---

## 🚀 How to Run Locally

You can simply **double-click `index.html`** in any web browser (Chrome, Safari, Firefox, Edge).

Or if you'd like to run a local dev server:
```bash
# Using Python
python3 -m http.server 3000

# Using Node.js (npx)
npx serve .
```
Then visit `http://localhost:3000` in your browser.

---

## 🌐 How to Deploy & Share With Sowji for Free (Under 60 seconds)

### Option 1: GitHub Pages (Recommended)
1. Create a free GitHub repository (e.g. `sowji-birthday`).
2. Push or upload the `sowji-birthday` folder contents.
3. Go to **Settings** > **Pages** > Select `main` branch > **Save**.
4. In ~30 seconds, your website will be live at `https://<your-username>.github.io/sowji-birthday/` to send to her!

### Option 2: Vercel / Netlify
1. Go to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com).
2. Drag and drop the `sowji-birthday` folder.
3. Instantly get a custom link like `https://sowji-birthday.vercel.app`!
