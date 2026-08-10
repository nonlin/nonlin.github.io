import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

const title =
  "George Erfesoglou — Agentic Systems, Runtime QA & Real-World Software";
const description =
  "Outcome engineer building agentic systems, runtime QA, simulation and evaluation workflows, connected-device software, and production-ready real-time experiences.";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nonlin.github.io";
const metadataBase = new URL(siteUrl);
const socialImage = new URL("/og.png", metadataBase).toString();

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: title,
    template: "%s · George Erfesoglou",
  },
  description,
  keywords: [
    "George Erfesoglou",
    "Unity developer",
    "Unreal Engine developer",
    "SDK engineer",
    "connected devices",
    "BLE",
    "C++",
    "C#",
    "real-time systems",
    "agentic systems",
    "outcome engineering",
    "runtime QA",
    "AI agents",
    "vision-language models",
    "simulation and evaluation",
  ],
  authors: [{ name: "George Erfesoglou", url: "https://github.com/nonlin" }],
  creator: "George Erfesoglou",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: metadataBase,
    siteName: "George Erfesoglou",
    title,
    description: "Agents that can act. Evidence that can say no.",
    images: [
      {
        url: socialImage,
        width: 1731,
        height: 909,
        alt: "George Erfesoglou — Agentic Systems, Runtime QA and Real-World Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "Agents that can act. Evidence that can say no.",
    images: [socialImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0c13",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${workSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
