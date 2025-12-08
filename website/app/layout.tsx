import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

export const metadata: Metadata = {
  title: "VisioTrack - Advanced Object Tracking Platform",
  description: "Real-time object tracking platform using SiamRPN for computer vision applications. Train, test, and deploy cutting-edge tracking models.",
  icons: {
    icon: "/photos/logo.png",
  },
  keywords: ["object tracking", "computer vision", "SiamRPN", "machine learning", "AI", "video analysis"],
  authors: [{ name: "BV Tech Team" }],
  openGraph: {
    title: "VisioTrack - Advanced Object Tracking Platform",
    description: "Real-time object tracking using SiamRPN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: some browser extensions (or other client-side
    // modifications) can add attributes to the root `<html>` element which
    // differ from the server-rendered HTML and trigger hydration warnings.
    // We add `suppressHydrationWarning` on the root to avoid noisy console
    // warnings while keeping React hydration intact.
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ErrorBoundary>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
