"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Game = dynamic(() => import("@/components/Game"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6" />
      <h1 className="text-2xl font-bold tracking-wide">Sayanox Open World</h1>
      <p className="text-zinc-400 mt-2">Loading advanced 3D world...</p>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="fixed inset-0 w-full h-full">
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
            Loading...
          </div>
        }
      >
        <Game />
      </Suspense>
    </main>
  );
}
