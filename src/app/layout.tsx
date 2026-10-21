import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sayanox Open World 3D | Advanced Browser Game",
  description:
    "Fully playable advanced 3D open-world game built with Next.js, React Three Fiber & Three.js. Explore, collect, survive.",
  keywords: ["3d game", "open world", "react three fiber", "browser game", "sayanox"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}
