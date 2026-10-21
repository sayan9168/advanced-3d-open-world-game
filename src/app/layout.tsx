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
  title: "SAYANOX STRIKE | Anime Open-World Shooter",
  description:
    "Full-screen anime-style 3D open-world shooting game. Works on Android & PC. More advanced than Minecraft.",
  keywords: ["3d game", "shooter", "anime", "open world", "android game", "browser game", "sayanox"],
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
