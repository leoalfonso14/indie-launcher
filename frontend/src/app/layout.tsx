import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "IndieLauncher.AI | The Tactical HUD for Indie Game Success",
  description: "AI-powered trailer auditing and streamer discovery for indie game developers.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "IndieLauncher.AI",
    description: "AI-powered trailer auditing and streamer discovery for indie game developers.",
    images: [{ url: "/logo.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden`}>
        {/* Hardware overlays for that Tactical HUD feel */}
        <div className="scanline-overlay" />
        <div className="grain-overlay" />
        
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 md:p-12 lg:p-16">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
