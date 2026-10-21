import { create } from "zustand";

interface GameState {
  score: number;
  kills: number;
  health: number;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  isPointerLocked: boolean;
  isFullscreen: boolean;
  isMobile: boolean;
  gameStarted: boolean;
  addScore: (amount: number) => void;
  addKill: () => void;
  takeDamage: (amount: number) => void;
  shoot: () => boolean;
  reload: () => void;
  setPointerLocked: (locked: boolean) => void;
  setFullscreen: (fs: boolean) => void;
  setIsMobile: (mobile: boolean) => void;
  startGame: () => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  kills: 0,
  health: 100,
  ammo: 30,
  maxAmmo: 30,
  isReloading: false,
  isPointerLocked: false,
  isFullscreen: false,
  isMobile: false,
  gameStarted: false,

  addScore: (amount) => set((s) => ({ score: s.score + amount })),
  addKill: () => set((s) => ({ kills: s.kills + 1, score: s.score + 150 })),
  takeDamage: (amount) =>
    set((s) => ({ health: Math.max(0, s.health - amount) })),
  shoot: () => {
    const { ammo, isReloading } = get();
    if (ammo <= 0 || isReloading) return false;
    set({ ammo: ammo - 1 });
    return true;
  },
  reload: () => {
    const { isReloading, maxAmmo } = get();
    if (isReloading) return;
    set({ isReloading: true });
    setTimeout(() => {
      set({ ammo: maxAmmo, isReloading: false });
    }, 1500);
  },
  setPointerLocked: (locked) => set({ isPointerLocked: locked }),
  setFullscreen: (fs) => set({ isFullscreen: fs }),
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  startGame: () => set({ gameStarted: true }),
  reset: () =>
    set({
      score: 0,
      kills: 0,
      health: 100,
      ammo: 30,
      isReloading: false,
      gameStarted: false,
    }),
}));
