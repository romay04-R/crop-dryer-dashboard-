import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { DeviceProvider } from "@/components/DeviceContext";
import Navbar from "@/components/Navbar";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Crop Dryer Dashboard",
  description: "Live monitoring for the crop drying system",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17140F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body">
        <DeviceProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
          <footer className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-panel-faint">
              Crop Dryer Monitor · reads live from your API
            </p>
          </footer>
        </DeviceProvider>
      </body>
    </html>
  );
}
