// Global application state
export const appState = {
  // Current mode: 'photo-frame' or 'combining'
  mode: null,
  
  // Photo Frame mode state
  selectedFrame: 0,
  frameImage: null,       // data URL of uploaded image
  frameTransform: {       // image transform within frame
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0
  },
  
  // Combining Photos mode state
  selectedGrid: null,     // grid template key
  images: {},             // { cellIndex: { dataUrl, transform: { x, y, scale, rotation } } }
  
  // Final composed image for printing
  finalImage: null,       // data URL of final composed canvas
  
  // Print state
  printCode: '',
  printStatus: null       // null, 'loading', 'success', 'error'
};

// Reset all state
export function resetState() {
  appState.mode = null;
  appState.selectedFrame = 0;
  appState.frameImage = null;
  appState.frameTransform = { x: 0, y: 0, scale: 1, rotation: 0 };
  appState.selectedGrid = null;
  appState.images = {};
  appState.finalImage = null;
  appState.printCode = '';
  appState.printStatus = null;
}

// Reset only frame mode
export function resetFrameState() {
  appState.frameImage = null;
  appState.frameTransform = { x: 0, y: 0, scale: 1, rotation: 0 };
  appState.selectedFrame = 0;
  appState.finalImage = null;
}

// Reset only combining mode
export function resetCombiningState() {
  appState.images = {};
  appState.finalImage = null;
}

// Generate final image from photo frame mode
export function generateFrameImage() {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 4x6 inches at 300dpi = 1200x1800, but we'll use a reasonable screen size
    canvas.width = 800;
    canvas.height = 1200;
    
    if (appState.frameImage) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const t = appState.frameTransform;
        const centerX = canvas.width / 2 + t.x * (canvas.width / 400);
        const centerY = canvas.height / 2 + t.y * (canvas.height / 600);
        
        ctx.translate(centerX, centerY);
        ctx.rotate((t.rotation * Math.PI) / 180);
        ctx.scale(t.scale, t.scale);
        
        // Draw image centered
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
        
        ctx.restore();
        
        appState.finalImage = canvas.toDataURL('image/jpeg', 0.9);
        resolve(appState.finalImage);
      };
      img.src = appState.frameImage;
    } else {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      appState.finalImage = canvas.toDataURL('image/jpeg', 0.9);
      resolve(appState.finalImage);
    }
  });
}
