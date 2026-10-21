# Sayanox Advanced 3D Open World Game

A fully playable **advanced 3D open-world browser game** built with modern web technologies.

## Features

- **Large procedural terrain** with hills and valleys
- **First-person movement** with WASD + mouse look + jump + sprint
- **Physics** powered by Rapier (realistic gravity & collisions)
- **120+ trees**, rocks, and environmental details
- **25 collectible golden crystals** to find and gather
- **Daytime sky + stars**, fog, shadows, and lighting
- **Beautiful HUD** with score, health, and collectible counter
- **Pointer lock** for immersive mouse control
- Fully responsive and runs entirely in the browser

## Tech Stack

- **Next.js 15+** (App Router)
- **React Three Fiber** + **Drei**
- **Three.js**
- **@react-three/rapier** (physics)
- **Zustand** (state)
- **Tailwind CSS**
- **TypeScript**

## Controls

| Action     | Key              |
|------------|------------------|
| Move       | WASD / Arrow Keys|
| Look       | Mouse            |
| Jump       | Space            |
| Sprint     | Shift            |
| Collect    | Walk into crystals|

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build & Deploy

```bash
npm run build
npm start
```

Deploy instantly on **Vercel** (recommended).

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Entry with dynamic Game load
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Game.tsx          # Main Canvas + Physics
│   ├── Player.tsx        # FPS controller + camera
│   ├── World.tsx         # Terrain, trees, rocks, collectibles
│   └── GameUI.tsx        # HUD + start screen
└── store/
    └── gameStore.ts      # Score, health, collectibles
```

## Author

**Sayan Mahata**  
GitHub: [sayan9168](https://github.com/sayan9168)  
Sayanox Enterprises

---

Made with ❤️ for the open web.
