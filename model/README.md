# VisioTrack - Object Tracking Model

Real-time object tracking using SiamRPN (Siamese Region Proposal Network) with PyTorch.

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- PyTorch 1.9+
- OpenCV 4.5+
- FFmpeg (for video encoding)

### Installation

```bash
pip install -r requirements.txt
```

## 📦 Deployment Options

### Option 1: Hugging Face Spaces (Production)

**Files Required:**

- `app.py` - FastAPI server
- `siamrpn.py` - Tracker implementation
- `model.pth` - Pre-trained weights
- `requirements.txt` - Dependencies
- `Dockerfile` - Container configuration
- `README_HF.md` - Space metadata

**Files NOT Needed:**

- `colab_api.py` ❌
- `VisioTrack_Colab.ipynb` ❌
- `README.md` ❌

**Deploy:**

1. Create new Space on Hugging Face
2. Select Docker SDK
3. Upload required files
4. Rename `README_HF.md` to `README.md` in the Space
5. Space will auto-deploy at `https://username-spacename.hf.space`

### Option 2: Google Colab (Free GPU)

**Files Required:**

- `VisioTrack_Colab.ipynb` - Main notebook
- `colab_api.py` - Flask server
- `siamrpn.py` - Tracker implementation
- `model.pth` - Pre-trained weights
- `requirements.txt` - Dependencies

**Files NOT Needed:**

- `app.py` ❌
- `Dockerfile` ❌
- `README_HF.md` ❌
- `README.md` ❌

**Deploy:**

1. Upload files to Google Colab
2. Open `VisioTrack_Colab.ipynb`
3. Enable GPU: Runtime → Change runtime type → T4 GPU
4. Run all cells
5. Copy ngrok URL from output
6. Use URL in frontend configuration

## 🔧 Local Development

```bash
# Run FastAPI server
uvicorn app:app --host 0.0.0.0 --port 7860

# Or run Flask server (for Colab testing)
python colab_api.py
```

## 📡 API Endpoints

### POST /track

Track object in video with bounding box.

**Parameters:**

- `video` (file) - Video file
- `bbox_x` (int) - X coordinate
- `bbox_y` (int) - Y coordinate
- `bbox_w` (int) - Width
- `bbox_h` (int) - Height

**Response:** Processed video with tracking visualization

### GET /health

Health check and GPU status

### GET /info

API documentation (FastAPI only)

## 📝 Example Usage

```bash
curl -X POST "http://localhost:7860/track" \
  -F "video=@test_video.mp4" \
  -F "bbox_x=100" \
  -F "bbox_y=100" \
  -F "bbox_w=200" \
  -F "bbox_h=200" \
  -o tracked_output.mp4
```

## 🏗️ Architecture

- **SiamRPN Model** - 5-layer CNN with Region Proposal Network
- **Tracker** - Frame-by-frame object localization
- **Video Processing** - OpenCV + FFmpeg pipeline
- **API Server** - FastAPI (HF) / Flask (Colab)

## ⚙️ Configuration

Model parameters in `siamrpn.py`:

- `exemplar_sz`: 127 (template size)
- `instance_sz`: 271 (search region size)
- `penalty_k`: 0.055 (scale penalty)
- `window_influence`: 0.42 (smoothing)
- `lr`: 0.295 (learning rate for updates)

---

© 2025 BV Tech Team. All rights reserved.
