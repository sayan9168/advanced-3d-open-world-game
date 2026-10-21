"use client";

import { useGameStore } from "@/store/gameStore";
import { useEffect, useState, useRef } from "react";

export function GameUI() {
  const {
    score, kills, health, ammo, maxAmmo, isReloading,
    gameStarted, isMobile, setIsMobile, startGame, reload,
  } = useGameStore();

  const [showHelp, setShowHelp] = useState(true);
  const joystickRef = useRef<HTMLDivElement>(null);
  const [joyPos, setJoyPos] = useState({ x: 0, y: 0 });
  const activeTouch = useRef<number | null>(null);

  useEffect(() => {
    const check = () => {
      const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 900;
      setIsMobile(mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [setIsMobile]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const handleJoyStart = (e: React.TouchEvent) => {
    e.preventDefault();
    activeTouch.current = e.changedTouches[0].identifier;
  };

  const handleJoyMove = (e: React.TouchEvent) => {
    if (activeTouch.current === null) return;
    const touch = Array.from(e.changedTouches).find((t) => t.identifier === activeTouch.current);
    if (!touch || !joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = (touch.clientX - cx) / 50;
    let dy = (touch.clientY - cy) / 50;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1) { dx /= len; dy /= len; }
    setJoyPos({ x: dx, y: dy });
  };

  const handleJoyEnd = () => {
    activeTouch.current = null;
    setJoyPos({ x: 0, y: 0 });
  };

  const handleShoot = () => {
    if ((window as any).__gameShoot) (window as any).__gameShoot();
  };

  if (!gameStarted && showHelp) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900/95 border border-pink-500/40 rounded-3xl p-6 md:p-10 max-w-lg w-full text-center shadow-2xl backdrop-blur-xl">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-2">
            SAYANOX STRIKE
          </h1>
          <p className="text-zinc-400 mb-1 text-sm">Anime Open-World Shooter</p>
          <p className="text-emerald-400/80 text-xs mb-6">More advanced than Minecraft • Full Android + PC</p>

          <div className="grid grid-cols-2 gap-3 text-left text-sm mb-8">
            <div className="bg-zinc-800/60 rounded-xl p-3">
              <div className="text-pink-400 font-semibold mb-1">PC</div>
              <div className="text-zinc-300 text-xs space-y-1">
                <div>WASD — Move</div>
                <div>Mouse — Look</div>
                <div>Click — Shoot</div>
                <div>Space — Jump</div>
                <div>R — Reload</div>
              </div>
            </div>
            <div className="bg-zinc-800/60 rounded-xl p-3">
              <div className="text-cyan-400 font-semibold mb-1">Android</div>
              <div className="text-zinc-300 text-xs space-y-1">
                <div>Joystick — Move</div>
                <div>FIRE — Shoot</div>
                <div>JUMP / RLD buttons</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setShowHelp(false);
              startGame();
              if (!isMobile) document.body.requestPointerLock();
            }}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl text-lg transition-all active:scale-95 shadow-lg shadow-pink-500/30"
          >
            START GAME
          </button>

          <button onClick={toggleFullscreen} className="mt-3 text-xs text-zinc-500 hover:text-zinc-300">
            Toggle Fullscreen
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isMobile && gameStarted && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <div className="w-5 h-5 border-2 border-white/80 rounded-full opacity-70" />
          <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-pink-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 p-3 md:p-4 pointer-events-none z-30 flex justify-between items-start gap-2">
        <div className="bg-black/55 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10">
          <div className="text-pink-400 text-[10px] font-bold tracking-widest">SCORE</div>
          <div className="text-2xl md:text-3xl font-black text-white tabular-nums">{score}</div>
        </div>
        <div className="bg-black/55 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10 text-center">
          <div className="text-cyan-400 text-[10px] font-bold tracking-widest">KILLS</div>
          <div className="text-2xl md:text-3xl font-black text-white">{kills}</div>
        </div>
        <div className="bg-black/55 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/10 min-w-[110px]">
          <div className="text-red-400 text-[10px] font-bold tracking-widest mb-1">HP</div>
          <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-600 to-pink-500 transition-all duration-300" style={{ width: `${health}%` }} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-28 md:bottom-6 right-4 md:right-6 z-30 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md rounded-2xl px-5 py-3 border border-cyan-500/30 text-right">
          <div className="text-cyan-400 text-xs font-bold">{isReloading ? "RELOADING..." : "AMMO"}</div>
          <div className="text-3xl font-black text-white">{ammo}<span className="text-zinc-500 text-lg">/{maxAmmo}</span></div>
        </div>
      </div>

      {isMobile && gameStarted && (
        <>
          <div
            ref={joystickRef}
            className="fixed bottom-8 left-6 w-32 h-32 rounded-full bg-white/10 border-2 border-white/20 z-40 touch-none"
            onTouchStart={handleJoyStart}
            onTouchMove={handleJoyMove}
            onTouchEnd={handleJoyEnd}
            onTouchCancel={handleJoyEnd}
          >
            <div
              className="absolute w-14 h-14 rounded-full bg-white/40 border border-white/50"
              style={{
                left: `calc(50% + ${joyPos.x * 36}px - 28px)`,
                top: `calc(50% + ${joyPos.y * 36}px - 28px)`,
              }}
            />
          </div>

          <button
            className="fixed bottom-28 right-6 w-20 h-20 rounded-full bg-pink-600/90 border-4 border-pink-300/50 text-white font-black text-sm z-40 active:scale-90 transition-transform shadow-lg shadow-pink-500/40"
            onTouchStart={(e) => { e.preventDefault(); handleShoot(); }}
          >
            FIRE
          </button>

          <button
            className="fixed bottom-8 right-28 w-16 h-16 rounded-full bg-emerald-600/90 border-2 border-emerald-300/40 text-white font-bold text-xs z-40 active:scale-90"
            onTouchStart={(e) => {
              e.preventDefault();
              window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
              setTimeout(() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space" })), 100);
            }}
          >
            JUMP
          </button>

          <button
            className="fixed bottom-8 right-6 w-16 h-16 rounded-full bg-cyan-700/90 border-2 border-cyan-300/40 text-white font-bold text-xs z-40 active:scale-90"
            onTouchStart={(e) => { e.preventDefault(); reload(); }}
          >
            RLD
          </button>
        </>
      )}

      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-40 bg-black/50 text-white/70 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-black/70"
      >
        Fullscreen
      </button>
    </>
  );
}
