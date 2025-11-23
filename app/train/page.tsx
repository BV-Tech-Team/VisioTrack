"use client";

import React, { useState, useEffect } from "react";

interface VideoItem {
  id: string;
  name: string;
  videoPath: string;
  jsonPath: string;
}

interface JsonData {
  frames: Array<{
    frame: number;
    bbox: number[];
    visible: boolean;
  }>;
}

export default function Train() {
  const videos: VideoItem[] = [
    {
      id: "cat1",
      name: "Cat Video 1",
      videoPath: "/train-videos/cat_video1.mp4",
      jsonPath: "/train-json/cat_video1.json",
    },
    {
      id: "cat2",
      name: "Cat Video 2",
      videoPath: "/train-videos/cat_video2.mp4",
      jsonPath: "/train-json/cat_video2.json",
    },
    {
      id: "car1",
      name: "Car Video 1",
      videoPath: "/train-videos/car_video1.mp4",
      jsonPath: "/train-json/car_video1.json",
    },
    {
      id: "car2",
      name: "Car Video 2",
      videoPath: "/train-videos/car_video2.mp4",
      jsonPath: "/train-json/car_video2.json",
    },
    {
      id: "football1",
      name: "Football Video 1",
      videoPath: "/train-videos/football_video1.mp4",
      jsonPath: "/train-json/football_video1.json",
    },
    {
      id: "football2",
      name: "Football Video 2",
      videoPath: "/train-videos/football_video2.mp4",
      jsonPath: "/train-json/football_video2.json",
    },
    {
      id: "football3",
      name: "Football Video 3",
      videoPath: "/train-videos/football_video3.mp4",
      jsonPath: "/train-json/football_video1.json",
    },
    {
      id: "football4",
      name: "Football Video 4",
      videoPath: "/train-videos/football_video4.mp4",
      jsonPath: "/train-json/football_video2.json",
    },
  ];

  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(videos[0]);
  const [jsonData, setJsonData] = useState<JsonData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadJson = async () => {
      setLoading(true);
      try {
        const response = await fetch(selectedVideo.jsonPath);
        const data = await response.json();
        setJsonData(data);
      } catch (error) {
        console.error("Error loading JSON:", error);
        setJsonData(null);
      } finally {
        setLoading(false);
      }
    };

    loadJson();
  }, [selectedVideo]);

  return (
    <div className="min-h-screen bg-[#e8f1f5] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Train Videos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Video List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-black">Video List</h2>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedVideo.id === video.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-black hover:bg-blue-100"
                    }`}
                  >
                    <div className="font-semibold">{video.name}</div>
                    <div className="text-sm opacity-75">
                      {selectedVideo.id === video.id
                        ? "Now Playing"
                        : "Click to play"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Video Player and JSON */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-black">
                {selectedVideo.name}
              </h2>
              <div className="w-full max-w-3xl mx-auto">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    key={selectedVideo.id}
                    controls
                    className="w-full h-full"
                    autoPlay
                  >
                    <source src={selectedVideo.videoPath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>

            {/* JSON Display */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Tracking Data (JSON)
              </h2>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading JSON data...</p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-900 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                    <pre className="text-green-400 text-sm font-mono">
                      {JSON.stringify(jsonData, null, 2)}
                    </pre>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      <strong>Total Frames:</strong>{" "}
                      {jsonData?.frames?.length || 0}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
