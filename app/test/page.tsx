"use client";

import React, { useState, useRef, useEffect } from "react";

interface VideoItem {
  id: string;
  name: string;
  videoPath: string;
  isUploaded?: boolean;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function Test() {
  const preloadedVideos: VideoItem[] = [
    {
      id: "test_cat",
      name: "Test Cat Video",
      videoPath: "/test-videos/test_cat.mp4",
    },
    {
      id: "test_car",
      name: "Test Car Video",
      videoPath: "/test-videos/test_car.mp4",
    },
    {
      id: "test_football",
      name: "Test Football Video",
      videoPath: "/test-videos/test_football.mp4",
    },
  ];

  const [videos, setVideos] = useState<VideoItem[]>(preloadedVideos);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedVideo && videoRef.current) {
      // Load video and pause at first frame
      videoRef.current.load();
      videoRef.current.addEventListener("loadeddata", () => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.pause();
        }
      });

      // Draw frame after seeking completes
      videoRef.current.addEventListener(
        "seeked",
        () => {
          drawVideoFrame();
        },
        { once: true }
      );
    }
  }, [selectedVideo]);

  const drawVideoFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      const videoURL = URL.createObjectURL(file);
      const newVideo: VideoItem = {
        id: `uploaded_${Date.now()}`,
        name: file.name,
        videoPath: videoURL,
        isUploaded: true,
      };
      setVideos([...videos, newVideo]);
      setSelectedVideo(newVideo);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsDrawing(true);
    setStartPoint({ x, y });
    setBoundingBox(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const width = currentX - startPoint.x;
    const height = currentY - startPoint.y;

    setBoundingBox({
      x: startPoint.x,
      y: startPoint.y,
      width,
      height,
    });

    // Redraw frame with bounding box
    drawVideoFrame();
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 3;
      ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSubmit = async () => {
    if (!selectedVideo || !boundingBox) {
      alert("Please select a video and draw a bounding box");
      return;
    }

    setIsProcessing(true);

    const payload = {
      videoPath: selectedVideo.videoPath,
      boundingBox: {
        x: Math.round(boundingBox.x),
        y: Math.round(boundingBox.y),
        width: Math.round(boundingBox.width),
        height: Math.round(boundingBox.height),
      },
    };

    try {
      // Replace with your actual backend endpoint
      const response = await fetch("/api/process-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Tracking result:", result);
        alert("Tracking request submitted successfully!");
      } else {
        throw new Error("Failed to process tracking");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit tracking request. Check console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBoundingBox(null);
    setStartPoint(null);
    drawVideoFrame();
  };

  return (
    <div className="min-h-screen bg-[#e8f1f5] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Test Videos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Video List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-black">Video List</h2>

              {/* Upload Button */}
              <div className="mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleVideoUpload}
                  accept="video/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  + Upload Video
                </button>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => {
                      setSelectedVideo(video);
                      setBoundingBox(null);
                      setStartPoint(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedVideo?.id === video.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-black hover:bg-blue-100"
                    }`}
                  >
                    <div className="font-semibold">{video.name}</div>
                    <div className="text-sm opacity-75">
                      {video.isUploaded ? "Uploaded" : "Test Video"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Video Frame and Controls */}
          <div className="lg:col-span-2 space-y-6">
            {selectedVideo ? (
              <>
                {/* Video Frame Canvas */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4 text-black">
                    {selectedVideo.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Draw a bounding box around the object you want to track
                  </p>

                  <div className="w-full max-w-3xl mx-auto">
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      {/* Hidden video element */}
                      <video
                        ref={videoRef}
                        className="hidden"
                        src={selectedVideo.videoPath}
                      />

                      {/* Canvas for drawing */}
                      <canvas
                        ref={canvasRef}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                        className="w-full h-auto cursor-crosshair"
                      />
                    </div>

                    {/* Bounding Box Info */}
                    {boundingBox && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-bold mb-2 text-black">
                          Bounding Box Coordinates:
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-sm text-black">
                          <div>X: {Math.round(boundingBox.x)}</div>
                          <div>Y: {Math.round(boundingBox.y)}</div>
                          <div>Width: {Math.round(boundingBox.width)}</div>
                          <div>Height: {Math.round(boundingBox.height)}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6 justify-center">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!boundingBox || isProcessing}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        !boundingBox || isProcessing
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isProcessing ? "Processing..." : "Start Tracking"}
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-black">
                    How to Use
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-black">
                    <li>Select a video from the list or upload your own</li>
                    <li>
                      Click and drag on the video frame to draw a bounding box
                      around the object
                    </li>
                    <li>
                      Click "Start Tracking" to send the data to the backend for
                      processing
                    </li>
                    <li>Use "Reset" to clear the bounding box and try again</li>
                  </ol>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <h2 className="text-2xl font-bold mb-4 text-black">
                  No Video Selected
                </h2>
                <p className="text-gray-600">
                  Please select a video from the list or upload a new one to get
                  started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
