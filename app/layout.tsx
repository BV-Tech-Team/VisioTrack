import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "VisioTrack",
  description: "Real-Time Object Tracking Using SiamRPN",
  icons: {
    icon: "photos/logo.png",
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
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
