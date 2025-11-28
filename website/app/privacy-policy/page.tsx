"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState("privacy");
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  // Read ?tab= query parameter and set the active tab accordingly
  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "terms" || tab === "cookies") {
      setActiveTab(tab);
    } else {
      setActiveTab("privacy");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#e8f1f5] py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Legal Information
          </h1>
          <p className="text-black text-lg">
            Everything you need to know about our policies
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              activeTab === "privacy"
                ? "bg-blue-600 text-white"
                : "bg-white text-black hover:bg-blue-100"
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              activeTab === "terms"
                ? "bg-blue-600 text-white"
                : "bg-white text-black hover:bg-blue-100"
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab("cookies")}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              activeTab === "cookies"
                ? "bg-blue-600 text-white"
                : "bg-white text-black hover:bg-blue-100"
            }`}
          >
            Cookie Policy
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Privacy Policy */}
          {activeTab === "privacy" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Privacy Policy</h2>
              <p className="text-sm text-gray-600 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-6">
                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    1. Information We Collect
                  </h3>
                  <p className="text-black mb-4">
                    We collect information you provide directly to us,
                    including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-black ml-4">
                    <li>Account information (name, email address, password)</li>
                    <li>Vision model training data and test results</li>
                    <li>Usage data and analytics</li>
                    <li>Device and browser information</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    2. How We Use Your Information
                  </h3>
                  <p className="text-black mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-black ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process your vision model training requests</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Monitor and analyze trends and usage</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">3. Data Security</h3>
                  <p className="text-black">
                    We implement appropriate technical and organizational
                    measures to protect your personal information against
                    unauthorized access, alteration, disclosure, or destruction.
                    However, no method of transmission over the Internet is 100%
                    secure.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">4. Data Retention</h3>
                  <p className="text-black">
                    We retain your personal information for as long as necessary
                    to provide our services and fulfill the purposes outlined in
                    this privacy policy. You may request deletion of your data
                    at any time.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">5. Your Rights</h3>
                  <p className="text-black mb-4">You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 text-black ml-4">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to processing of your data</li>
                    <li>Export your data</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">6. Contact Us</h3>
                  <p className="text-black">
                    If you have any questions about this Privacy Policy, please
                    contact us at{" "}
                    <a
                      href="mailto:privacy@visiotrack.com"
                      className="text-blue-600 hover:underline"
                    >
                      privacy@visiotrack.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* Terms of Service */}
          {activeTab === "terms" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Terms of Service</h2>
              <p className="text-sm text-gray-600 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-6">
                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    1. Acceptance of Terms
                  </h3>
                  <p className="text-black">
                    By accessing and using VisioTrack, you accept and agree to
                    be bound by the terms and provision of this agreement. If
                    you do not agree to these terms, please do not use our
                    service.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">2. Use License</h3>
                  <p className="text-black mb-4">
                    Permission is granted to temporarily use VisioTrack for
                    personal or commercial purposes. This is the grant of a
                    license, not a transfer of title, and under this license you
                    may not:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-black ml-4">
                    <li>Modify or copy the materials</li>
                    <li>
                      Use the materials for any commercial purpose without
                      authorization
                    </li>
                    <li>
                      Attempt to reverse engineer any software contained on
                      VisioTrack
                    </li>
                    <li>
                      Remove any copyright or proprietary notations from the
                      materials
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">3. User Accounts</h3>
                  <p className="text-black">
                    You are responsible for maintaining the confidentiality of
                    your account and password. You agree to accept
                    responsibility for all activities that occur under your
                    account.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">4. Acceptable Use</h3>
                  <p className="text-black mb-4">
                    You agree not to use VisioTrack to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-black ml-4">
                    <li>Upload malicious code or harmful data</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    5. Service Modifications
                  </h3>
                  <p className="text-black">
                    We reserve the right to modify or discontinue our service at
                    any time without notice. We shall not be liable to you or
                    any third party for any modification, suspension, or
                    discontinuance of the service.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    6. Limitation of Liability
                  </h3>
                  <p className="text-black">
                    VisioTrack shall not be liable for any damages arising out
                    of the use or inability to use our service, even if we have
                    been notified of the possibility of such damages.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    7. Contact Information
                  </h3>
                  <p className="text-black">
                    Questions about the Terms of Service should be sent to{" "}
                    <a
                      href="mailto:legal@visiotrack.com"
                      className="text-blue-600 hover:underline"
                    >
                      legal@visiotrack.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* Cookie Policy */}
          {activeTab === "cookies" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Cookie Policy</h2>
              <p className="text-sm text-gray-600 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-6">
                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    1. What Are Cookies
                  </h3>
                  <p className="text-black">
                    Cookies are small text files that are placed on your
                    computer or mobile device when you visit our website. They
                    help us provide you with a better experience and allow
                    certain features to function properly.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    2. Types of Cookies We Use
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Essential Cookies
                      </h4>
                      <p className="text-black">
                        These cookies are necessary for the website to function
                        properly. They enable basic functions like page
                        navigation and access to secure areas.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Performance Cookies
                      </h4>
                      <p className="text-black">
                        These cookies help us understand how visitors interact
                        with our website by collecting and reporting information
                        anonymously.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Functionality Cookies
                      </h4>
                      <p className="text-black">
                        These cookies enable the website to remember choices you
                        make and provide enhanced features and personalization.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">
                        Analytics Cookies
                      </h4>
                      <p className="text-black">
                        We use analytics cookies to help us improve our website
                        by collecting information about how you use it.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    3. How We Use Cookies
                  </h3>
                  <p className="text-black mb-4">We use cookies to:</p>
                  <ul className="list-disc list-inside space-y-2 text-black ml-4">
                    <li>Keep you signed in to your account</li>
                    <li>Remember your preferences and settings</li>
                    <li>Understand how you use our website</li>
                    <li>Improve our services and user experience</li>
                    <li>Analyze website traffic and performance</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    4. Managing Cookies
                  </h3>
                  <p className="text-black mb-4">
                    You can control and manage cookies in various ways:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-black ml-4">
                    <li>
                      Browser settings: Most browsers allow you to refuse or
                      accept cookies
                    </li>
                    <li>
                      Delete cookies: You can delete cookies already stored on
                      your device
                    </li>
                    <li>
                      Third-party tools: Use privacy tools to manage tracking
                      cookies
                    </li>
                  </ul>
                  <p className="text-black mt-4">
                    Please note that disabling cookies may affect the
                    functionality of our website.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    5. Third-Party Cookies
                  </h3>
                  <p className="text-black">
                    We may use third-party services that set cookies on your
                    device. These include analytics providers and other service
                    providers. We do not have control over these cookies.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">
                    6. Updates to This Policy
                  </h3>
                  <p className="text-black">
                    We may update this Cookie Policy from time to time. We will
                    notify you of any changes by posting the new policy on this
                    page.
                  </p>
                </section>

                <section>
                  <h3 className="text-2xl font-bold mb-3">7. Contact Us</h3>
                  <p className="text-black">
                    If you have questions about our use of cookies, please
                    contact us at{" "}
                    <a
                      href="mailto:cookies@visiotrack.com"
                      className="text-blue-600 hover:underline"
                    >
                      cookies@visiotrack.com
                    </a>
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
