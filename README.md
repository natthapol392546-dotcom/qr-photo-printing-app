# 📸 PrintSnap - QR Code Photo Printing Web App

A premium mobile-first web application for photo printing services. Users scan a QR code to access the app, upload photos, apply frames or combine multiple photos, and submit for printing.

![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

## ✨ Features

### 🖼️ Photo Frame Mode
- Choose from 8 decorative frame templates (Classic, Polaroid, Vintage, Neon, Film Strip, etc.)
- Upload photos from camera, gallery, or files
- Pan and zoom to position your photo within the frame
- Real-time preview with frame overlay

### 🪟 Combining Photos Mode
- 6 grid layout options (Single, Double H/V, Triple, Quad, Column)
- Visual layout previews for easy selection
- Per-cell image editing with zoom, rotate, and repositioning
- Automatic image composition for print-ready output

### 🖨️ Print System
- Alphanumeric print code validation (6-8 characters)
- Final preview before submission
- Mock print API (ready for real API integration)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Usage Flow

1. **Scan QR Code** → Opens the web app on your phone
2. **Choose Mode** → Photo Frame or Combining Photos
3. **Upload & Edit** → Add photos, apply frames/layouts, adjust positioning
4. **Enter Print Code** → Input your unique print code
5. **Print** → Submit for printing

## 🎨 Design

- **Theme**: Premium dark UI with glassmorphism effects
- **Colors**: Deep navy background with purple/cyan accents
- **Animations**: Smooth page transitions, micro-interactions
- **Mobile-first**: Optimized for phone screens (max-width: 430px)
- **Print Size**: 4×6 inches (2:3 aspect ratio)

## 🛠️ Tech Stack

- **Vite** - Fast build tool
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Custom properties, CSS Grid, animations
- **Canvas API** - Image composition and editing

## 📂 Project Structure

```
photo-print-app/
├── index.html              # Entry point
├── src/
│   ├── main.js             # App router & lifecycle
│   ├── state.js            # Global state management
│   ├── pages/
│   │   ├── home.js         # Main menu
│   │   ├── photo-frame.js  # Photo frame mode
│   │   ├── combining-select.js  # Grid layout selection
│   │   ├── combining-editor.js  # Multi-photo editor
│   │   └── print.js        # Print code & submission
│   ├── components/
│   │   ├── image-editor.js # Zoom/pan/rotate editor
│   │   ├── image-upload.js # Upload dialog
│   │   ├── frame-templates.js  # SVG frame definitions
│   │   ├── grid-templates.js   # Grid layout configs
│   │   └── toast.js        # Toast notifications
│   └── styles/
│       ├── main.css        # Design system
│       ├── pages.css       # Page layouts
│       └── components.css  # Component styles
└── public/
    └── frames/             # Frame assets (future)
```

## 📄 License

MIT
