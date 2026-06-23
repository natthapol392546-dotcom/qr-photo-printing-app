// Image Editor Component
// Supports: zoom (pinch/scroll), drag/pan, rotate 90°, re-upload

export function openImageEditor(imageDataUrl, options = {}) {
  return new Promise((resolve, reject) => {
    const modal = document.getElementById('modal-container');
    
    let transform = {
      x: 0,
      y: 0,
      scale: 1,
      rotation: options.initialRotation || 0
    };
    
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastPinchDist = 0;
    let currentImageUrl = imageDataUrl;

    modal.innerHTML = `
      <div class="image-editor-overlay fade-in">
        <div class="editor-header">
          <button class="editor-cancel-btn" id="editor-cancel">✕</button>
          <h3>Edit Photo</h3>
          <div style="width:40px"></div>
        </div>
        <div class="editor-canvas-wrapper">
          <div class="editor-canvas-container" id="editor-canvas-container">
            <img id="editor-image" src="${imageDataUrl}" draggable="false" />
          </div>
        </div>
        <div class="editor-toolbar">
          <div class="editor-tool-group">
            <button class="tool-btn" id="editor-zoom-out" title="Zoom Out">
              <span>−</span>
            </button>
            <div class="zoom-indicator" id="zoom-indicator">100%</div>
            <button class="tool-btn" id="editor-zoom-in" title="Zoom In">
              <span>+</span>
            </button>
          </div>
          <div class="editor-tool-group">
            <button class="tool-btn" id="editor-rotate" title="Rotate 90°">
              <span>↻</span>
            </button>
            <button class="tool-btn" id="editor-reupload" title="Change Photo">
              <span>📷</span>
            </button>
            <button class="tool-btn" id="editor-reset" title="Reset">
              <span>↺</span>
            </button>
          </div>
        </div>
        <div class="editor-actions">
          <button class="btn btn-secondary" id="editor-action-cancel">Cancel</button>
          <button class="btn btn-primary" id="editor-action-confirm">Confirm</button>
        </div>
      </div>
    `;
    modal.style.display = 'block';

    const container = document.getElementById('editor-canvas-container');
    const image = document.getElementById('editor-image');
    const zoomIndicator = document.getElementById('zoom-indicator');

    function updateTransform() {
      image.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`;
      zoomIndicator.textContent = `${Math.round(transform.scale * 100)}%`;
    }

    function resetTransform() {
      transform = { x: 0, y: 0, scale: 1, rotation: 0 };
      updateTransform();
    }

    // Mouse/touch drag
    const onPointerDown = (e) => {
      if (e.touches && e.touches.length === 2) return; // pinch handled separately
      isDragging = true;
      const point = e.touches ? e.touches[0] : e;
      lastX = point.clientX;
      lastY = point.clientY;
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches.length === 2) return;
      e.preventDefault();
      const point = e.touches ? e.touches[0] : e;
      const dx = point.clientX - lastX;
      const dy = point.clientY - lastY;
      transform.x += dx;
      transform.y += dy;
      lastX = point.clientX;
      lastY = point.clientY;
      updateTransform();
    };

    const onPointerUp = () => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    // Pinch to zoom
    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const scaleDelta = dist / lastPinchDist;
        transform.scale = Math.min(Math.max(transform.scale * scaleDelta, 0.3), 5);
        lastPinchDist = dist;
        updateTransform();
      }
    };

    // Scroll to zoom
    const onWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      transform.scale = Math.min(Math.max(transform.scale * delta, 0.3), 5);
      updateTransform();
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mouseup', onPointerUp);
    container.addEventListener('mouseleave', onPointerUp);
    container.addEventListener('touchstart', (e) => {
      onTouchStart(e);
      if (e.touches.length === 1) onPointerDown(e);
    }, { passive: false });
    container.addEventListener('touchmove', (e) => {
      onTouchMove(e);
      if (e.touches.length === 1) onPointerMove(e);
    }, { passive: false });
    container.addEventListener('touchend', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Toolbar buttons
    document.getElementById('editor-zoom-in').addEventListener('click', () => {
      transform.scale = Math.min(transform.scale * 1.2, 5);
      updateTransform();
    });

    document.getElementById('editor-zoom-out').addEventListener('click', () => {
      transform.scale = Math.max(transform.scale * 0.8, 0.3);
      updateTransform();
    });

    document.getElementById('editor-rotate').addEventListener('click', () => {
      transform.rotation = (transform.rotation + 90) % 360;
      updateTransform();
    });

    document.getElementById('editor-reset').addEventListener('click', resetTransform);

    document.getElementById('editor-reupload').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            currentImageUrl = ev.target.result;
            image.src = currentImageUrl;
            resetTransform();
          };
          reader.readAsDataURL(file);
        }
      });
      input.click();
    });

    const cleanup = () => {
      modal.innerHTML = '';
      modal.style.display = 'none';
    };

    document.getElementById('editor-action-confirm').addEventListener('click', () => {
      // Generate cropped result
      const result = {
        dataUrl: currentImageUrl,
        transform: { ...transform }
      };
      cleanup();
      resolve(result);
    });

    document.getElementById('editor-action-cancel').addEventListener('click', () => {
      cleanup();
      reject(new Error('Cancelled'));
    });

    document.getElementById('editor-cancel').addEventListener('click', () => {
      cleanup();
      reject(new Error('Cancelled'));
    });

    updateTransform();
  });
}
