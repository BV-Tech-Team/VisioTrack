# VisioTrack

Real-time object tracking platform using SiamRPN (Siamese Region Proposal Network) for computer vision applications.

## Overview

VisioTrack is a full-stack application that enables users to track objects in videos using deep learning. The system consists of:

- **Frontend** - Next.js web interface for video upload and visualization
- **Backend** - Python API with SiamRPN tracking model

## Project Structure

```
VisioTrack/
├── model/               # Python backend (API + ML model)
│   ├── app.py          # FastAPI server (HF Spaces)
│   ├── colab_api.py    # Flask server (Colab)
│   ├── siamrpn.py      # SiamRPN tracker
│   ├── model.pth       # Pre-trained weights
│   ├── Dockerfile      # Container config
│   └── README.md       # Backend documentation
│
└── website/            # Next.js frontend
    ├── app/            # Pages and components
    ├── public/         # Static assets
    └── README.md       # Frontend documentation
```

## Features

### Training Mode

- View pre-labeled training videos
- Analyze frame-by-frame annotations
- Understand tracking behavior

### Testing Mode

- Upload custom videos
- Draw bounding boxes on first frame
- Submit to backend for GPU processing
- Download tracked results

### Key Capabilities

- Real-time object tracking
- GPU acceleration support
- Browser-compatible video encoding
- Interactive web interface
- REST API integration

## Tech Stack

### Frontend

- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS v4
- Framer Motion

### Backend

- Python 3.10+
- PyTorch
- FastAPI / Flask
- OpenCV
- FFmpeg

### Deployment

- Vercel (Frontend)
- Hugging Face Spaces (Backend)
- Google Colab (Backend - Free GPU)

## 📖 Documentation

- **Frontend Setup:** [website/README.md](website/README.md)
- **Backend Setup:** [model/README.md](model/README.md)
- **API Reference:** Available at `/docs` endpoint (FastAPI)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Acknowledgments

- SiamRPN algorithm and pre-trained model
- GOT-10k dataset
- Hugging Face Spaces platform
- Google Colab for free GPU access

---

© 2025 BV Tech Team. All rights reserved.
