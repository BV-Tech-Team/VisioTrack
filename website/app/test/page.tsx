"use client";

import React, { useState, useRef, useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

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
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null
  );
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [apiUrl, setApiUrl] = useState<string>("");
  const [banner, setBanner] = useState<
    | { type: "info" | "success" | "warning" | "error"; message: string }
    | null
  >(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedFileRef = useRef<File | null>(null);

  useEffect(() => {
    // Load API URL from environment or localStorage
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    const savedApiUrl = localStorage.getItem("visiotrack_api_url");
    setApiUrl(envApiUrl || savedApiUrl || "");
  }, []);

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
      uploadedFileRef.current = file; // Store the actual file
      const videoURL = URL.createObjectURL(file);
      const newVideo: VideoItem = {
        id: `uploaded_${Date.now()}`,
        name: file.name,
        videoPath: videoURL,
        isUploaded: true,
      };
      setVideos([...videos, newVideo]);
      setSelectedVideo(newVideo);
      setProcessedVideoUrl(null); // Clear previous results
      setStatusMessage("");
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
      setBanner({
        type: "warning",
        message: "Select a video and draw a bounding box before tracking.",
      });
      return;
    }

    if (!apiUrl) {
      setBanner({
        type: "warning",
        message: "Configure your API URL first using the Configure API button.",
      });
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Preparing video for tracking...");
    setBanner(null);
    setProcessedVideoUrl(null);

    try {
      let videoBlob: Blob;

      // Get video file
      if (selectedVideo.isUploaded && uploadedFileRef.current) {
        // Use the uploaded file directly
        videoBlob = uploadedFileRef.current;
      } else {
        // Fetch preloaded video
        setStatusMessage("Downloading video...");
        const response = await fetch(selectedVideo.videoPath);
        if (!response.ok) throw new Error("Failed to fetch video");
        videoBlob = await response.blob();
      }

      // Prepare form data
      const formData = new FormData();
      formData.append("video", videoBlob, "video.mp4");
      formData.append("bbox_x", Math.round(boundingBox.x).toString());
      formData.append("bbox_y", Math.round(boundingBox.y).toString());
      formData.append(
        "bbox_w",
        Math.round(Math.abs(boundingBox.width)).toString()
      );
      formData.append(
        "bbox_h",
        Math.round(Math.abs(boundingBox.height)).toString()
      );

      setStatusMessage("Sending to Colab API (GPU processing)...");

      // Send to Colab API
      const response = await fetch(`${apiUrl}/track`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      setStatusMessage("Processing complete! Downloading result...");

      // Get the processed video with correct MIME type
      const processedBlob = await response.blob();
      // Create a new blob with explicit video/mp4 MIME type (avoid reusing 'videoBlob' name)
      const resultBlob = new Blob([processedBlob], { type: "video/mp4" });
      const url = URL.createObjectURL(resultBlob);
      setProcessedVideoUrl(url);
      setStatusMessage("✅ Tracking completed successfully!");
    } catch (error) {
      console.error("Error:", error);
      const friendlyMessage =
        error instanceof Error ? error.message : "Unknown error";
      setStatusMessage(`❌ Error: ${friendlyMessage}`);
      setBanner({
        type: "error",
        message: `Failed to process video. ${friendlyMessage}. Check that the API is reachable and your bounding box is valid.`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBoundingBox(null);
    setStartPoint(null);
    setProcessedVideoUrl(null);
    setStatusMessage("");
    drawVideoFrame();
  };

  const handleDownloadResult = () => {
    if (!processedVideoUrl) return;

    const a = document.createElement("a");
    a.href = processedVideoUrl;
    a.download = `tracked_${selectedVideo?.name || "video"}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleConfigureApi = () => {
    const url = prompt(
      "Enter your Colab API URL (from ngrok):\n\nExample: https://abc123.ngrok.io",
      apiUrl
    );
    if (url) {
      const cleanUrl = url.trim().replace(/\/$/, ""); // Remove trailing slash
      setApiUrl(cleanUrl);
      localStorage.setItem("visiotrack_api_url", cleanUrl);
      setBanner({
        type: "success",
        message: "API URL saved. You can start testing now.",
      });
    }
  };

  const handleTestApi = async () => {
    if (!apiUrl) {
      setBanner({
        type: "warning",
        message: "Please configure API URL first.",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/health`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await response.json();
      setBanner({
        type: "success",
        message: `API is working. Status: ${data.status}. GPU: ${
          data.gpu_available ? data.gpu_name : "Not available"
        }`,
      });
    } catch (error) {
      setBanner({
        type: "error",
        message: `Cannot connect to API. ${
          error instanceof Error ? error.message : "Unknown error"
        }. Make sure your backend is running and reachable.`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f1f5] py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide">Testing Workspace</p>
              <h1 className="text-3xl font-bold text-black">Test Videos</h1>
              <p className="text-sm text-gray-600 mt-1">
                Upload or pick a sample, draw a box, then run tracking on the configured API.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleTestApi}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold shadow-sm"
                title="Test API connection"
              >
                🔌 Test API
              </button>
              <button
                onClick={handleConfigureApi}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold shadow-sm"
                title="Configure Colab API URL"
              >
                ⚙️ Configure API
              </button>
              <div
                className={`px-3 py-2 rounded-lg text-sm font-semibold border ${
                  apiUrl
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {apiUrl ? "✓ API Configured" : "⚠️ API Not Configured"}
              </div>
            </div>
          </div>
        </div>

        {banner && (
          <div
            className={`mb-6 p-4 rounded-lg border shadow-sm ${
              banner.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : banner.type === "warning"
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : banner.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-blue-50 border-blue-200 text-blue-800"
            }`}
          >
            <div className="font-semibold">
              {banner.type === "success" && "Success"}
              {banner.type === "warning" && "Heads up"}
              {banner.type === "error" && "Error"}
              {banner.type === "info" && "Info"}
            </div>
            <div className="text-sm mt-1">{banner.message}</div>
          </div>
        )}

        {/* API Status Banner */}
        {apiUrl && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-black">API URL:</span>
                <span className="ml-2 text-blue-700 font-mono text-sm">
                  {apiUrl}
                </span>
              </div>
              <span className="text-xs text-gray-600">✓ Configured</span>
            </div>
          </div>
        )}

        {!apiUrl && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-semibold text-black">
                  API URL Not Configured
                </div>
                <div className="text-sm text-gray-700">
                  Click Configure API button to set your Colab ngrok URL before
                  tracking
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <div className="flex gap-4 mt-6 justify-center flex-wrap">
                    <button
                      onClick={handleReset}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                    >
                      Reset
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!boundingBox || isProcessing || !apiUrl}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        !boundingBox || isProcessing || !apiUrl
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {isProcessing
                        ? "Processing..."
                        : "🚀 Start Tracking (GPU)"}
                    </button>
                  </div>

                  {/* Status Message */}
                  {isProcessing && !statusMessage && (
                    <div className="mt-6">
                      <LoadingSpinner size="md" text="Processing your video..." />
                    </div>
                  )}
                  {statusMessage && (
                    <div
                      className={`mt-4 p-4 rounded-lg ${
                        statusMessage.includes("❌")
                          ? "bg-red-50 border border-red-200 text-red-800"
                          : statusMessage.includes("✅")
                          ? "bg-green-50 border border-green-200 text-green-800"
                          : "bg-blue-50 border border-blue-200 text-blue-800"
                      }`}
                    >
                      <div className="font-semibold">{statusMessage}</div>
                    </div>
                  )}
                </div>

                {/* Processed Video Result */}
                {processedVideoUrl && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-black">
                        Tracking Result
                      </h3>
                      <button
                        onClick={handleDownloadResult}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                      >
                        📥 Download Video
                      </button>
                    </div>
                    <div className="w-full max-w-3xl mx-auto">
                      <video
                        src={processedVideoUrl}
                        controls
                        autoPlay
                        muted
                        playsInline
                        className="w-full rounded-lg bg-black"
                        onError={(e) => {
                          console.error("Video playback error:", e);
                          const videoElement =
                            e.currentTarget as HTMLVideoElement;
                          console.error("Video error details:", {
                            error: videoElement.error,
                            networkState: videoElement.networkState,
                            readyState: videoElement.readyState,
                            src: videoElement.src,
                          });
                          setStatusMessage(
                            "⚠️ Video playback failed. The download button still works! Try re-generating or use a different browser."
                          );
                        }}
                        onLoadedData={() => {
                          console.log("Video loaded successfully");
                        }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-bold mb-3 text-black">
                    📖 How to Use
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-black">
                    <li>
                      <strong>Configure API:</strong> Click Configure API and
                      paste your Colab ngrok URL
                    </li>
                    <li>
                      <strong>Select Video:</strong> Choose from the list or
                      upload your own
                    </li>
                    <li>
                      <strong>Draw Bounding Box:</strong> Click and drag on the
                      video frame
                    </li>
                    <li>
                      <strong>Start Tracking:</strong> Click the button to
                      process with GPU
                    </li>
                    <li>
                      <strong>Download Result:</strong> Save the tracked video
                      when complete
                    </li>
                  </ol>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold mb-2 text-black">
                      🚀 Colab Setup:
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      <li>Open the VisioTrack_Colab.ipynb in Google Colab</li>
                      <li>
                        Enable GPU (Runtime → Change runtime type → T4 GPU)
                      </li>
                      <li>Run all cells in the notebook</li>
                      <li>Copy the ngrok URL from Step 3</li>
                      <li>Paste it here using Configure API button</li>
                    </ol>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-lg">
                <EmptyState
                  icon={
                    <svg
                      className="w-16 h-16 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  }
                  title="No Video Selected"
                  description="Choose a video from the list or upload your own to start tracking objects"
                  action={{
                    label: "Upload Video",
                    onClick: () => fileInputRef.current?.click(),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
