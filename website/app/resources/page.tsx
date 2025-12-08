"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "documentation" | "api" | "tutorials" | "support";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("documentation");

  return (
    <div className="min-h-screen bg-[#e8f1f5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-black mb-8 text-center">
          Resources
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { key: "documentation", label: "Documentation" },
            { key: "api", label: "API Reference" },
            { key: "tutorials", label: "Tutorials" },
            { key: "support", label: "Support" },
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-black hover:bg-blue-50"
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            {activeTab === "documentation" && (
              <div>
              <h2 className="text-3xl font-bold text-black mb-6">
                Documentation
              </h2>
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Getting Started
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    VisioTrack is a powerful computer vision platform designed
                    to help you track and analyze objects in videos. This
                    documentation will guide you through the entire process from
                    training to testing your models.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Installation and setup</li>
                    <li>Understanding the platform architecture</li>
                    <li>Preparing your video datasets</li>
                    <li>Best practices for object tracking</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Train Module
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The Train module allows you to review and analyze existing
                    training data. You can view videos along with their
                    associated tracking annotations in JSON format.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Viewing training videos</li>
                    <li>Understanding JSON annotation format</li>
                    <li>Validating tracking data</li>
                    <li>Exporting training datasets</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Test Module
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The Test module enables you to test object tracking by
                    selecting bounding boxes on video frames and submitting them
                    for processing.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Uploading test videos</li>
                    <li>Drawing bounding boxes</li>
                    <li>Submitting tracking requests</li>
                    <li>Analyzing tracking results</li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {activeTab === "api" && (
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">
                API Reference
              </h2>
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Processing API
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <code className="text-sm">POST /api/process-tracking</code>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Submit a video with bounding box coordinates for object
                    tracking.
                  </p>
                  <h4 className="font-semibold text-black mb-2">
                    Request Body:
                  </h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4">
                    {`{
  "videoPath": "/test-videos/test_cat.mp4",
  "boundingBox": {
    "x": 100,
    "y": 150,
    "width": 200,
    "height": 180
  }
}`}
                  </pre>
                  <h4 className="font-semibold text-black mb-2">Response:</h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    {`{
  "success": true,
  "trackingId": "track_12345",
  "message": "Tracking initiated successfully"
}`}
                  </pre>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Training Data API
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <code className="text-sm">
                      GET /train-json/[filename].json
                    </code>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Retrieve training annotations for a specific video.
                  </p>
                  <h4 className="font-semibold text-black mb-2">Response:</h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    {`{
  "frames": [
    {
      "frameNumber": 1,
      "boundingBox": {
        "x": 120,
        "y": 180,
        "width": 150,
        "height": 150
      }
    }
  ]
}`}
                  </pre>
                </section>
              </div>
            </div>
          )}

          {activeTab === "tutorials" && (
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Tutorials</h2>
              <div className="space-y-8">
                <section className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold text-black mb-3">
                    1. Basic Object Tracking
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Learn how to track a single object in a video using the Test
                    module.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Navigate to the Test page</li>
                    <li>Select a video from the list or upload your own</li>
                    <li>
                      Click and drag on the video frame to draw a bounding box
                      around the object
                    </li>
                    <li>
                      Click &quot;Start Tracking&quot; to submit the tracking
                      request
                    </li>
                    <li>Review the tracking results</li>
                  </ol>
                </section>

                <section className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold text-black mb-3">
                    2. Reviewing Training Data
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Understand how to review and validate existing training
                    annotations.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Go to the Train page</li>
                    <li>Browse the list of training videos</li>
                    <li>Click on a video to view it</li>
                    <li>
                      Review the JSON annotations displayed on the right side
                    </li>
                    <li>Verify the tracking data accuracy</li>
                  </ol>
                </section>

                <section className="border-b border-gray-200 pb-6">
                  <h3 className="text-xl font-semibold text-black mb-3">
                    3. Uploading Custom Videos
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Learn how to work with your own video files for testing.
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Navigate to the Test page</li>
                    <li>Click the &quot;Upload Video&quot; button</li>
                    <li>Select a video file from your computer</li>
                    <li>Wait for the video to load</li>
                    <li>Draw bounding boxes and start tracking</li>
                  </ol>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    4. Best Practices
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Tips for getting the best tracking results:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>
                      Draw bounding boxes tightly around the object you want to
                      track
                    </li>
                    <li>Ensure good lighting and contrast in your videos</li>
                    <li>Avoid excessive camera motion when possible</li>
                    <li>Use videos with clear object boundaries</li>
                    <li>Test with different object sizes and speeds</li>
                  </ul>
                </section>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Support</h2>
              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Get Help
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We&apos;re here to help you get the most out of VisioTrack.
                    Choose the option that works best for you:
                  </p>
                </section>

                <section className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-black mb-3">
                    Email Support
                  </h4>
                  <p className="text-gray-700 mb-2">
                    For technical questions and support:
                  </p>
                  <a
                    href="mailto:contact@visiotrack.com"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    contact@visiotrack.com
                  </a>
                  <p className="text-sm text-gray-600 mt-2">
                    Response time: Within 24 hours
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-semibold text-black mb-2">
                        What video formats are supported?
                      </h4>
                      <p className="text-gray-700">
                        VisioTrack supports common video formats including MP4,
                        AVI, MOV, and WebM. We recommend using MP4 for best
                        compatibility.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-semibold text-black mb-2">
                        How accurate is the object tracking?
                      </h4>
                      <p className="text-gray-700">
                        Tracking accuracy depends on several factors including
                        video quality, object visibility, and motion complexity.
                        Our system achieves high accuracy on well-lit videos
                        with clear object boundaries.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-semibold text-black mb-2">
                        Can I track multiple objects simultaneously?
                      </h4>
                      <p className="text-gray-700">
                        Currently, the platform supports single-object tracking
                        per request. Multi-object tracking features are planned
                        for future releases.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-semibold text-black mb-2">
                        What is the maximum video size?
                      </h4>
                      <p className="text-gray-700">
                        The maximum video file size is 100MB. For larger videos,
                        please contact our support team for assistance.
                      </p>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-semibold text-black mb-2">
                        How do I interpret the JSON tracking data?
                      </h4>
                      <p className="text-gray-700">
                        The JSON data contains frame-by-frame bounding box
                        coordinates (x, y, width, height) for the tracked
                        object. Refer to the API Reference section for detailed
                        format specifications.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    Community
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Join our community to connect with other users, share tips,
                    and stay updated on new features.
                  </p>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>
                      GitHub Discussions
                    </a>
                    <a
                      href="#"
                      className="inline-flex items-center px-4 py-2 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                      Follow on Twitter
                    </a>
                  </div>
                </section>
              </div>
            </div>
          )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
