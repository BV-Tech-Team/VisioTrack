---
title: VisioTrack API
emoji: 🎯
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# VisioTrack - FastAPI Object Tracking API

REST API for real-time object tracking using SiamRPN.

## API Endpoints

- `GET /` - Interactive API documentation (Swagger UI)
- `GET /health` - Health check
- `POST /track` - Track object in video
- `GET /info` - API usage information

## Usage Example

```bash
curl -X POST "https://your-space-url.hf.space/track" \
  -F "video=@your_video.mp4" \
  -F "bbox_x=100" \
  -F "bbox_y=100" \
  -F "bbox_w=200" \
  -F "bbox_h=200" \
  -o tracked_output.mp4
