#!/usr/bin/env python
"""
Colab API Server for VisioTrack
Run this in Google Colab to expose tracking API
"""

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import torch
import numpy as np
import tempfile
import os
import base64
from pathlib import Path
from siamrpn import TrackerSiamRPN
from werkzeug.utils import secure_filename
import json
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Model path
MODEL_PATH = "model.pth"

# Global tracker instance
tracker = None

def load_tracker():
    """Load the SiamRPN tracker with the pretrained model"""
    global tracker
    if tracker is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file '{MODEL_PATH}' not found!")
        tracker = TrackerSiamRPN(net_path=MODEL_PATH)
        print(f"✓ Tracker loaded. GPU: {torch.cuda.is_available()}")
    return tracker


def process_video_tracking(video_path, bbox_x, bbox_y, bbox_w, bbox_h):
    """
    Process video with object tracking
    
    Args:
        video_path: Path to input video
        bbox_x, bbox_y, bbox_w, bbox_h: Bounding box coordinates
        
    Returns:
        Path to output video with tracking results
    """
    try:
        tracker = load_tracker()
        
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            return None, "Error: Could not open video file"
        
        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        ret, frame = cap.read()
        if not ret:
            return None, "Error: Could not read first frame"
        
        # Validate bounding box
        if bbox_w <= 0 or bbox_h <= 0:
            return None, "Error: Invalid bounding box dimensions"
        
        if bbox_x < 0 or bbox_y < 0 or bbox_x + bbox_w > width or bbox_y + bbox_h > height:
            return None, f"Error: Bounding box out of bounds. Frame size: {width}x{height}"
        
        bbox = (bbox_x, bbox_y, bbox_w, bbox_h)
        
        # Initialize tracker
        tracker.init(frame, bbox)
        
        # Create temporary output file
        output_path = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4').name
        
        # Use XVID codec which is widely supported
        fourcc = cv2.VideoWriter_fourcc(*'XVID')
        writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
            
        if not writer.isOpened():
            return None, "Error: Could not create video writer"
        
        # Draw first frame with initial bbox
        x, y, w, h = [int(v) for v in bbox]
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
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
            bbox = tracker.update(frame)
            
            # Draw tracking result
            x, y, w, h = [int(v) for v in bbox]
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, f'Frame: {frame_count}', (10, 30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            
            writer.write(frame)
            
            # Print progress every 30 frames
            if frame_count % 30 == 0:
                print(f"Processed {frame_count}/{total_frames} frames")
        
        # Cleanup
        cap.release()
        writer.release()
        
        # Re-encode with ffmpeg for better browser compatibility
        print("Re-encoding video for browser compatibility...")
        final_output = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4').name
        
        try:
            # Use ffmpeg to re-encode with H.264 and AAC (browser-friendly)
            subprocess.run([
                'ffmpeg', '-i', output_path,
                '-c:v', 'libx264',  # H.264 video codec
                '-preset', 'fast',   # Fast encoding
                '-crf', '23',        # Quality (lower = better, 23 is good)
                '-pix_fmt', 'yuv420p',  # Pixel format for compatibility
                '-movflags', '+faststart',  # Enable streaming
                '-y',  # Overwrite output file
                final_output
            ], check=True, capture_output=True, text=True)
            
            # Remove temporary file
            os.unlink(output_path)
            output_path = final_output
            print("✓ Video re-encoded successfully")
        except subprocess.CalledProcessError as e:
            print(f"Warning: ffmpeg re-encoding failed: {e.stderr}")
            print("Using original video")
            # Keep using the original output_path
        except FileNotFoundError:
            print("Warning: ffmpeg not found, using original video")
            # Keep using the original output_path
        
        return output_path, f"Successfully tracked {frame_count} frames"
        
    except Exception as e:
        return None, f"Error: {str(e)}"


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'gpu_available': torch.cuda.is_available(),
        'gpu_name': torch.cuda.get_device_name(0) if torch.cuda.is_available() else None
    })


@app.route('/track', methods=['POST'])
def track_video():
    """
    Main tracking endpoint
    Expects multipart/form-data with:
    - video: video file
    - bbox_x, bbox_y, bbox_w, bbox_h: bounding box coordinates
    """
    try:
        # Check if video file is present
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        
        if video_file.filename == '':
            return jsonify({'error': 'Empty filename'}), 400
        
        # Get bounding box coordinates
        try:
            bbox_x = int(request.form.get('bbox_x', 0))
            bbox_y = int(request.form.get('bbox_y', 0))
            bbox_w = int(request.form.get('bbox_w', 0))
            bbox_h = int(request.form.get('bbox_h', 0))
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid bounding box coordinates'}), 400
        
        # Save uploaded video temporarily
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        video_file.save(temp_input.name)
        temp_input.close()
        
        print(f"Processing video: {video_file.filename}")
        print(f"Bounding box: ({bbox_x}, {bbox_y}, {bbox_w}, {bbox_h})")
        
        # Process video
        output_path, message = process_video_tracking(
            temp_input.name, bbox_x, bbox_y, bbox_w, bbox_h
        )
        
        # Clean up input file
        os.unlink(temp_input.name)
        
        if output_path is None:
            return jsonify({'error': message}), 400
        
        # Return the processed video
        return send_file(
            output_path,
            mimetype='video/mp4',
            as_attachment=True,
            download_name='tracked_video.mp4'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/track-url', methods=['POST'])
def track_video_url():
    """
    Alternative endpoint that accepts video URL and returns processed video URL
    Useful for larger files or async processing
    """
    try:
        data = request.get_json()
        
        video_url = data.get('video_url')
        bbox = data.get('bbox', {})
        
        bbox_x = int(bbox.get('x', 0))
        bbox_y = int(bbox.get('y', 0))
        bbox_w = int(bbox.get('w', 0))
        bbox_h = int(bbox.get('h', 0))
        
        # Download video from URL
        import urllib.request
        temp_input = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        urllib.request.urlretrieve(video_url, temp_input.name)
        temp_input.close()
        
        # Process video
        output_path, message = process_video_tracking(
            temp_input.name, bbox_x, bbox_y, bbox_w, bbox_h
        )
        
        os.unlink(temp_input.name)
        
        if output_path is None:
            return jsonify({'error': message}), 400
        
        # Read output video and encode as base64 (for smaller videos)
        # Or upload to cloud storage and return URL
        with open(output_path, 'rb') as f:
            video_data = base64.b64encode(f.read()).decode('utf-8')
        
        os.unlink(output_path)
        
        return jsonify({
            'success': True,
            'message': message,
            'video_base64': video_data
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("=" * 50)
    print("VisioTrack Colab API Server")
    print("=" * 50)
    print(f"GPU Available: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"GPU Device: {torch.cuda.get_device_name(0)}")
    print("=" * 50)
    
    # Note: In Colab, use flask_ngrok to expose the server
    app.run(host='0.0.0.0', port=5000, debug=False)
