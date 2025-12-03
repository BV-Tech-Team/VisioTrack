# VisioTrack - Frontend

Modern web interface for real-time object tracking visualization and testing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout
├── globals.css           # Global styles
├── train/
│   └── page.tsx         # Training video viewer
├── test/
│   └── page.tsx         # Interactive testing interface
├── about-us/
│   └── page.tsx         # Team page
├── resources/
│   └── page.tsx         # Documentation
├── privacy-policy/
│   └── page.tsx         # Privacy policy
└── components/
    ├── Navbar.tsx       # Navigation bar
    └── Footer.tsx       # Footer component

public/
├── photos/              # Images and logo
├── train-videos/        # Pre-labeled training videos
├── train-json/          # Annotation data
└── test-videos/         # Sample test videos
```

## 🎯 Features

### Landing Page
- Animated hero section with Framer Motion
- Feature showcase cards
- Statistics display
- Call-to-action buttons

### Train Page
- Browse pre-labeled training videos
- View JSON annotations with bounding boxes
- Video player with frame-by-frame data
- Side-by-side video and JSON display

### Test Page
- Upload custom videos or select from library
- Interactive canvas for bounding box drawing
- API configuration (Colab ngrok URL)
- Real-time tracking submission
- Result video display and download

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-api-url.hf.space
```

Or configure directly in the Test page using the "Configure API" button.

### API Setup

**Option 1: Hugging Face Spaces**
```
NEXT_PUBLIC_API_URL=https://username-visiotrack.hf.space
```

**Option 2: Google Colab (ngrok)**
```
NEXT_PUBLIC_API_URL=https://abc123.ngrok.io
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **UI:** React 19
- **Video:** HTML5 Canvas API

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BV-Tech-Team/VisioTrack)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically

### Deploy to Other Platforms

```bash
npm run build
# Upload .next/ and public/ directories
# Set start command: npm start
```

## 🎨 Customization

### Colors
Edit `app/globals.css` and `tailwind.config.js`

### Pages
Modify files in `app/` directory - auto-routing enabled

### Components
Create/edit in `app/components/`

## 📝 Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔗 API Integration

The frontend communicates with the backend API:

```typescript
// Example API call
const formData = new FormData();
formData.append('video', videoFile);
formData.append('bbox_x', x);
formData.append('bbox_y', y);
formData.append('bbox_w', width);
formData.append('bbox_h', height);

const response = await fetch(`${apiUrl}/track`, {
  method: 'POST',
  body: formData
});
```

## 🐛 Troubleshooting

**API Connection Issues:**
- Verify API URL in `.env.local` or Test page configuration
- Check CORS settings on backend
- Ensure ngrok tunnel is active (for Colab)

**Video Upload Errors:**
- Check file format (MP4 recommended)
- Verify file size limits
- Ensure valid bounding box coordinates

**Build Errors:**
- Clear `.next/` directory: `rm -rf .next`
- Delete `node_modules/` and reinstall
- Check Node.js version compatibility

---

© 2025 BV Tech Team. All rights reserved.
