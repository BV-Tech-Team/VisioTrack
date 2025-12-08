"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-300 bg-[#e8f1f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo on the left */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/photos/logo.png"
                alt="VisioTrack Logo"
                width={45}
                height={45}
                className="h-11 w-11"
              />
              <Image
                src="/photos/logo_name.png"
                alt="VisioTrack"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Train and Test in the middle */}
          <div className="flex space-x-12">
            <Link href="/train" className="relative inline-block group">
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="text-black font-bold text-xl inline-block"
              >
                Train Model
              </motion.span>
              <span className="absolute left-0 -bottom-1 h-0.5 bg-black w-0 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link href="/test" className="relative inline-block group">
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="text-black font-bold text-xl inline-block"
              >
                Evaluate Model
              </motion.span>
              <span className="absolute left-0 -bottom-1 h-0.5 bg-black w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* About Us on the right */}
          <div>
            <Link href="/about-us" className="relative inline-block group">
              <motion.span
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="text-black font-bold text-xl inline-block"
              >
                About Us
              </motion.span>
              <span className="absolute left-0 -bottom-1 h-0.5 bg-black w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
