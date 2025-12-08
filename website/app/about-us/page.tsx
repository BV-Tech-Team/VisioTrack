"use client";

import React, { useEffect } from "react";
import { FiMail, FiLinkedin, FiTwitter, FiGithub } from "react-icons/fi";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Md Azizur Rahman",
      role: "Full Stack Developer",
      image: "/photos/aziz.jpg",
      bio: "A problem-solving enthusiast who thrives on technical challenges. Aziz combines expertise in computer vision algorithms and backend development to create robust tracking solutions. With a background in competitive programming, he ensures our platform is technically sound.",
      website: "https://azizerorahman.tech/",
      social: {
        email: "azizerorahman@gmail.com",
        linkedin: "https://www.linkedin.com/in/azizerorahman/",
        twitter: "https://twitter.com/azizerorahman",
        github: "https://github.com/azizerorahman/",
      },
    },
    {
      id: 2,
      name: "Md Nezam Uddin",
      role: "Full Stack Developer",
      image: "/photos/Nezam.jpg",
      bio: "Our algorithm specialist with expertise across the entire stack. Nezam's background in machine learning drives our vision tracking engine, while his frontend skills ensure beautiful presentation. He constantly refines our algorithms to deliver precise tracking results.",
      website: "https://ne-zam.netlify.app/",
      social: {
        email: "nezam0266@gmail.com",
        linkedin: "https://www.linkedin.com/in/md-nezam-uddin-497a54282/",
        twitter: "https://twitter.com/mdnezam",
        github: "https://github.com/mdnezam-uddin",
      },
    },
    {
      id: 3,
      name: "Nasim Rana Feroz",
      role: "Full Stack Developer",
      image: "/photos/nasim.jpg",
      bio: "A versatile developer passionate about seamless user experiences. Nasim excels in React and Node.js, with a keen eye for UI/UX design that makes our platform both beautiful and functional. When not coding, he explores new computer vision techniques to enhance our tracking capabilities.",
      website: "https://nas-im.onrender.com/",
      social: {
        email: "feroznasimrana@gmail.com",
        linkedin: "https://www.linkedin.com/in/nasim-rana-feroz",
        twitter: "https://twitter.com/nasimferoz",
        github: "https://github.com/NasimRanaFeroz",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#e8f1f5]">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center px-20">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
            <div className="w-16 h-1 bg-blue-600 mb-6"></div>
            <p className="mb-6 text-black">
              We&apos;re building a smarter way to analyze and track objects
              using cutting-edge computer vision technology. Our platform
              combines advanced machine learning algorithms with intuitive user
              interfaces to help users train and test vision models that truly
              match their needs.
            </p>
            <p className="text-black">
              By leveraging deep learning and real-time processing, we&apos;re
              creating a platform where accuracy, speed, and ease of use are
              understood and delivered with precision and care.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="aspect-video rounded-lg shadow-xl overflow-hidden">
              <Image
                src="/photos/reality.png"
                alt="Our mission"
                width={800}
                height={450}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Team
            </h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="max-w-2xl mx-auto text-black">
              We&apos;re three friends who met in our software engineering
              program and bonded over our shared love of AI and computer vision.
              Together, we&apos;re combining our technical skills and passion
              for innovation to build something special.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-5xl">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                className="bg-[#e8f1f5] rounded-lg overflow-hidden shadow-lg"
              >
                <div className="h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={400}
                    height={320}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="mb-6 text-black">{member.bio}</p>

                  {member.website && (
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      Visit Portfolio 🌐
                    </a>
                  )}

                  <div className="flex space-x-4">
                    <a
                      href={`mailto:${member.social.email}`}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      title="Email"
                    >
                      <FiMail size={20} />
                    </a>
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      title="LinkedIn"
                    >
                      <FiLinkedin size={20} />
                    </a>
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      title="Twitter"
                    >
                      <FiTwitter size={20} />
                    </a>
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      title="GitHub"
                    >
                      <FiGithub size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#e8f1f5] py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-black">
                We&apos;re constantly exploring new technologies and approaches
                to make computer vision more accessible and powerful for
                everyone.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-black">
                We believe in building a community of developers and researchers
                who share their knowledge and help others advance in computer
                vision.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Trust & Transparency</h3>
              <p className="text-black">
                We&apos;re committed to providing accurate results and being
                transparent about how our platform works and processes data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
