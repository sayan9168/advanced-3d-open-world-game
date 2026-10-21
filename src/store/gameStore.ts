import { create } from "zustand";

interface GameState {
  score: number;
  health: number;
  collectibles: number;
  totalCollectibles: number;
  isPointerLocked: boolean;
  addScore: (amount: number) => void;
  takeDamage: (amount: number) => void;
  collectItem: () => void;
  setPointerLocked: (locked: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  health: 100,
  collectibles: 0,
  totalCollectibles: 25,
  isPointerLocked: false,
  addScore: (amount) => set((s) => ({ score: s.score + amount })),
  takeDamage: (amount) =>
    set((s) => ({ health: Math.max(0, s.health - amount) })),
  collectItem: () =>
    set((s) => ({
      collectibles: s.collectibles + 1,
      score: s.score + 100,
    })),
  setPointerLocked: (locked) => set({ isPointerLocked: locked }),
  reset: () =>
    set({
      score: 0,
      health: 100,
      collectibles: 0,
    }),
}));
