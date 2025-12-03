#!/usr/bin/env python
"""
FastAPI Server for VisioTrack on Hugging Face Spaces
REST API for object tracking in videos
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import torch
import numpy as np
import tempfile
import os
import subprocess
import shutil
from pathlib import Path
from siamrpn import TrackerSiamRPN
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="VisioTrack API",
    description="Object tracking API using SiamRPN",
    version="1.0.0",
    docs_url="/",  # Swagger UI at root
    redoc_url="/redoc"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_PATH = "model.pth"
tracker = None
device = None

def load_tracker():
    """Load the SiamRPN tracker with GPU support"""
    global tracker, device
    if tracker is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file '{MODEL_PATH}' not found!")
        
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        tracker = TrackerSiamRPN(net_path=MODEL_PATH)
        logger.info(f"✓ Tracker loaded on {device}")
    return tracker

def process_video_tracking(video_path: str, bbox_x: int, bbox_y: int, 
                          bbox_w: int, bbox_h: int):
    """
    Process video with object tracking
    
    Args:
        video_path: Path to input video
        bbox_x, bbox_y, bbox_w, bbox_h: Bounding box coordinates
        
    Returns:
        tuple: (output_path, message, metadata)
    """
    try:
        tracker_instance = load_tracker()
        
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            return None, "Could not open video file", None
        
        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        if fps == 0:
            fps = 30
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        logger.info(f"Video: {width}x{height} @ {fps}fps, {total_frames} frames")
        
        ret, frame = cap.read()
        if not ret:
            return None, "Could not read first frame", None
        
        # Validate bounding box
        if bbox_w <= 0 or bbox_h <= 0:
            return None, "Invalid bounding box dimensions", None
        
        if (bbox_x < 0 or bbox_y < 0 or 
            bbox_x + bbox_w > width or bbox_y + bbox_h > height):
            return None, f"Bounding box out of bounds (frame: {width}x{height})", None
        
        bbox = [bbox_x, bbox_y, bbox_w, bbox_h]
        
        # Initialize tracker
        tracker_instance.init(frame, bbox)
        
        # Create temporary output file
        temp_output = tempfile.NamedTemporaryFile(delete=False, suffix='_temp.mp4')
        temp_output.close()
        
        # Use XVID codec for initial write
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        writer = cv2.VideoWriter(temp_output.name, fourcc, fps, (width, height))
        
        if not writer.isOpened():
            return None, "Could not create video writer", None
        
        # Draw first frame with initial bbox
        x, y, w, h = [int(v) for v in bbox]
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
        cv2.putText(frame, 'Frame: 1', (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        writer.write(frame)
        
        # Process remaining frames
        frame_count = 1
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Update tracker
            bbox = tracker_instance.update(frame)
            
            # Draw tracking result
            x, y, w, h = [int(v) for v in bbox]
            x = max(0, min(x, width - 1))
            y = max(0, min(y, height - 1))
            w = max(1, min(w, width - x))
            h = max(1, min(h, height - y))
            
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
            cv2.putText(frame, f'Frame: {frame_count}', (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            writer.write(frame)
            
            if frame_count % 30 == 0:
                logger.info(f"Processed {frame_count}/{total_frames} frames")
        
        cap.release()
        writer.release()
        
        # Re-encode with H.264 for browser compatibility
        final_output = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        final_output.close()
        
        try:
            logger.info("Re-encoding video for browser compatibility...")
            subprocess.run([
                'ffmpeg', '-i', temp_output.name,
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '23',
                '-pix_fmt', 'yuv420p',
                '-movflags', '+faststart',
                '-y',
                final_output.name
            ], check=True, capture_output=True, text=True)
            
            os.unlink(temp_output.name)
            logger.info("✓ Video re-encoded successfully")
            
        except (subprocess.CalledProcessError, FileNotFoundError) as e:
            logger.warning(f"FFmpeg encoding failed: {e}, using original")
            shutil.move(temp_output.name, final_output.name)
        
        metadata = {
            'frames_processed': frame_count,
            'resolution': f"{width}x{height}",
            'fps': fps,
            'device': str(device)
        }
        
        return final_output.name, f"Successfully tracked {frame_count} frames", metadata
        
    except Exception as e:
        logger.error(f"Tracking error: {str(e)}")
        return None, f"Error: {str(e)}", None


@app.get("/health")
async def health_check():
    """
    Health check endpoint (required by HF Spaces)
    """
    return JSONResponse({
        'status': 'healthy',
        'gpu_available': torch.cuda.is_available(),
        'gpu_name': torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
        'model_loaded': tracker is not None
    })


@app.post("/track")
async def track_video(
    video: UploadFile = File(..., description="Video file to process"),
    bbox_x: int = Form(..., description="X coordinate of bounding box"),
    bbox_y: int = Form(..., description="Y coordinate of bounding box"),
    bbox_w: int = Form(..., description="Width of bounding box"),
    bbox_h: int = Form(..., description="Height of bounding box")
):
    """
    Main tracking endpoint
    
    Upload a video and bounding box coordinates to track an object.
    Returns the processed video with tracking visualization.
    """
    temp_input = None
    output_path = None
    
    try:
        # Validate file type
        if not video.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Save uploaded video
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        content = await video.read()
        temp_input.write(content)
        temp_input.close()
        
        logger.info(f"Processing video: {video.filename}")
        logger.info(f"Bounding box: ({bbox_x}, {bbox_y}, {bbox_w}, {bbox_h})")
        
        # Process video
        output_path, message, metadata = process_video_tracking(
            temp_input.name, bbox_x, bbox_y, bbox_w, bbox_h
        )
        
        if output_path is None:
            raise HTTPException(status_code=400, detail=message)
        
        # Return processed video
        return FileResponse(
            output_path,
            media_type='video/mp4',
            filename='tracked_video.mp4',
            headers={
                'X-Frames-Processed': str(metadata['frames_processed']),
                'X-Resolution': metadata['resolution'],
                'X-FPS': str(metadata['fps'])
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Cleanup temporary files
        if temp_input and os.path.exists(temp_input.name):
            try:
                os.unlink(temp_input.name)
            except:
                pass


@app.get("/info")
async def get_info():
    """
    Get API information and usage instructions
    """
    return {
        'name': 'VisioTrack API',
        'version': '1.0.0',
        'description': 'Object tracking API using SiamRPN',
        'endpoints': {
            '/health': 'Health check',
            '/track': 'Track object in video (POST with multipart/form-data)',
            '/info': 'API information',
            '/': 'Interactive API documentation (Swagger UI)'
        },
        'usage': {
            'method': 'POST',
            'endpoint': '/track',
            'content_type': 'multipart/form-data',
            'parameters': {
                'video': 'Video file',
                'bbox_x': 'X coordinate (int)',
                'bbox_y': 'Y coordinate (int)',
                'bbox_w': 'Width (int)',
                'bbox_h': 'Height (int)'
            }
        },
        'example_curl': '''
curl -X POST "https://your-space.hf.space/track" \\
  -F "video=@video.mp4" \\
  -F "bbox_x=100" \\
  -F "bbox_y=100" \\
  -F "bbox_w=200" \\
  -F "bbox_h=200" \\
  -o tracked_video.mp4
        '''
    }


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    logger.info("=" * 50)
    logger.info("VisioTrack FastAPI Server Starting...")
    logger.info("=" * 50)
    try:
        load_tracker()
        logger.info("✓ Model loaded successfully")
    except Exception as e:
        logger.error(f"✗ Failed to load model: {e}")
    logger.info("=" * 50)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
