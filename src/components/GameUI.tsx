"use client";

import { useGameStore } from "@/store/gameStore";
import { useEffect, useState } from "react";

export function GameUI() {
  const { score, health, collectibles, totalCollectibles } = useGameStore();
  const [showHelp, setShowHelp] = useState(true);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const onLockChange = () => {
      setLocked(!!document.pointerLockElement);
      if (document.pointerLockElement) setShowHelp(false);
    };
    document.addEventListener("pointerlockchange", onLockChange);
    return () => document.removeEventListener("pointerlockchange", onLockChange);
  }, []);

  return (
    <>
      {locked && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="w-1 h-1 bg-white rounded-full opacity-80" />
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 p-4 pointer-events-none z-30 flex justify-between items-start">
        <div className="bg-black/50 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10">
          <div className="text-emerald-400 text-sm font-medium tracking-wider">SCORE</div>
          <div className="text-3xl font-bold text-white tabular-nums">{score}</div>
        </div>

        <div className="bg-black/50 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 text-center">
          <div className="text-amber-400 text-sm font-medium tracking-wider">COLLECTIBLES</div>
          <div className="text-2xl font-bold text-white">
            {collectibles} <span className="text-zinc-400 text-lg">/ {totalCollectibles}</span>
          </div>
        </div>

        <div className="bg-black/50 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 min-w-[140px]">
          <div className="text-red-400 text-sm font-medium tracking-wider mb-1">HEALTH</div>
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{ width: `${health}%` }}
            />
          </div>
          <div className="text-right text-xs text-zinc-300 mt-1">{health}%</div>
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 pointer-events-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <h1 className="text-3xl font-bold text-emerald-400 mb-2">Sayanox Open World</h1>
            <p className="text-zinc-400 mb-6">Advanced 3D Browser Game</p>

            <div className="text-left space-y-3 mb-8 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-300">Move</span>
                <kbd className="bg-zinc-800 px-2 py-1 rounded text-xs">WASD / Arrows</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Look</span>
                <kbd className="bg-zinc-800 px-2 py-1 rounded text-xs">Mouse</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Jump</span>
                <kbd className="bg-zinc-800 px-2 py-1 rounded text-xs">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Sprint</span>
                <kbd className="bg-zinc-800 px-2 py-1 rounded text-xs">Shift</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-300">Collect</span>
                <span className="text-amber-400">Golden crystals</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowHelp(false);
                document.body.requestPointerLock();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Click to Play
            </button>
            <p className="text-xs text-zinc-500 mt-4">ESC to release mouse</p>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40 pointer-events-none z-20">
        Built by Sayanox · React Three Fiber
      </div>
    </>
  );
}
