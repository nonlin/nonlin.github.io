import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { headers } from "next/headers";
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

const title = "George Erfesoglou — Runtime Systems for Real-World Experiences";
const description =
  "Director of Software building Unity and Unreal SDKs, native transports, connected-device systems, creative tooling, and production-ready real-time experiences.";

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host =
    incomingHeaders.get("x-forwarded-host") ??
    incomingHeaders.get("host") ??
    "nonlin.github.io";
  const protocol =
    incomingHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
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
    description:
      "The software layer between strange hardware and believable worlds.",
    images: [
      {
        url: socialImage,
        width: 1735,
        height: 906,
        alt: "George Erfesoglou — Runtime Systems for Real-World Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description:
      "The software layer between strange hardware and believable worlds.",
    images: [socialImage],
  },
  };
}

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
