// Photo Frame page – upload, position, frame, and submit
import { appState, saveState } from '../state.js';
import { frameTemplates, getFrameSVG } from '../components/frame-templates.js';
import { openUploadDialog } from '../components/image-upload.js';

/* ── Local interaction state (not persisted beyond page life) ── */
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let lastPinchDist = 0;

/* ── Render ── */
export function render() {
  const templates = frameTemplates || [];
  const currentFrame = appState.selectedFrame ?? 0;

  const templateThumbs = templates
    .map(
      (tpl, i) => `
      <button
        class="template-thumb ${i === currentFrame ? 'active' : ''}"
        data-index="${i}"
        aria-label="${tpl.name}"
      >
        <div class="thumb-preview">${getFrameSVG(i, 48, 72)}</div>
        <span class="thumb-label">${tpl.name}</span>
      </button>`
    )
    .join('');

  const hasImage = !!appState.frameImage;
  const t = appState.frameTransform;

  return `
    <div class="page photo-frame-page fade-in">
      <!-- Header -->
      <header class="page-header">
        <button class="back-btn" id="btn-back" aria-label="Go back">←</button>
        <h1 class="page-title">Photo Frame</h1>
        <div class="header-spacer"></div>
      </header>

      <!-- Preview -->
      <div class="preview-area">
        <div class="preview-wrapper" id="preview-area" style="position: relative; overflow: hidden; touch-action: none;">
          <div class="preview-image-layer" id="image-layer"
               style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; transform: translate(${t.x}px, ${t.y}px) scale(${t.scale});">
            ${
              hasImage
                ? `<img src="${appState.frameImage}" class="preview-photo" draggable="false" alt="Your photo" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`
                : ''
            }
          </div>

          <div class="preview-frame-layer" id="frame-layer" style="position: absolute; inset: 0; pointer-events: none;">
            ${getFrameSVG(currentFrame, 400, 600)}
          </div>

          ${
            !hasImage
              ? `<button class="camera-placeholder" id="btn-upload-placeholder" aria-label="Upload a photo" style="background: none; border: none; width: 100%; height: 100%; cursor: pointer;">
                  <div class="camera-circle">📷</div>
                  <span class="upload-text">Tap to upload photo</span>
                </button>`
              : ''
          }
        </div>
      </div>

      <!-- Template bar -->
      <div class="template-bar" id="template-bar">
        ${templateThumbs}
      </div>

      <!-- Actions -->
      <div class="action-bar">
        <button class="btn btn-secondary" id="btn-remake">Remake</button>
        <button class="btn btn-primary" id="btn-submit" ${!hasImage ? 'disabled' : ''}>Submit</button>
      </div>
    </div>
  `;
}

/* ── Init ── */
export function init() {
  /* Back button */
  document.getElementById('btn-back')?.addEventListener('click', () => {
    window.location.hash = '#home';
  });

  /* Upload placeholder */
  document.getElementById('btn-upload-placeholder')?.addEventListener('click', handleUpload);

  /* Template selection */
  document.getElementById('template-bar')?.addEventListener('click', (e) => {
    const thumb = /** @type {HTMLElement} */ (e.target).closest('.template-thumb');
    if (!thumb) return;
    const idx = parseInt(thumb.dataset.index, 10);
    if (Number.isNaN(idx)) return;
    appState.selectedFrame = idx;
    refreshPreview();
  });

  /* Remake */
  document.getElementById('btn-remake')?.addEventListener('click', () => {
    appState.frameImage = null;
    appState.frameTransform = { x: 0, y: 0, scale: 1, rotation: 0 };
    appState.selectedFrame = 0;
    rerender();
  });

  /* Submit */
  document.getElementById('btn-submit')?.addEventListener('click', async () => {
    if (!appState.frameImage) return;
    // Generate the final composed image (from state helper)
    const { generateFrameImage } = await import('../state.js');
    await generateFrameImage();
    window.location.hash = '#print';
  });

  /* Image interaction – drag / zoom */
  setupImageInteraction();
}

/* ── Helpers ── */

async function handleUpload() {
  try {
    const dataUrl = await openUploadDialog();
    if (dataUrl) {
      appState.frameImage = dataUrl;
      appState.frameTransform = { x: 0, y: 0, scale: 1, rotation: 0 };
      rerender();
    }
  } catch (_) {
    /* user cancelled */
  }
}

/** Re-render the whole page (simple approach – works because the page is lightweight) */
function rerender() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = render();
  init();
}

/** Refresh only the frame overlay & template highlights without full re-render */
function refreshPreview() {
  const frameLayer = document.getElementById('frame-layer');
  if (frameLayer) {
    frameLayer.innerHTML = getFrameSVG(appState.selectedFrame, 400, 600);
  }

  document.querySelectorAll('.template-thumb').forEach((el) => {
    const idx = parseInt(/** @type {HTMLElement} */ (el).dataset.index, 10);
    el.classList.toggle('active', idx === appState.selectedFrame);
  });
  
  saveState();
}

/** Set up pointer / touch / wheel events for drag & pinch-zoom on the image layer */
function setupImageInteraction() {
  const area = document.getElementById('preview-area');
  const layer = document.getElementById('image-layer');
  if (!area || !layer) return;

  const t = appState.frameTransform;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3.0;

  /* ── Pointer (mouse + single-touch) drag ── */
  area.addEventListener('pointerdown', (e) => {
    if (!appState.frameImage) return;
    isDragging = true;
    dragStart = { x: e.clientX - t.x, y: e.clientY - t.y };
    area.setPointerCapture(e.pointerId);
    area.style.cursor = 'grabbing';
  });

  area.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    t.x = e.clientX - dragStart.x;
    t.y = e.clientY - dragStart.y;
    applyTransform(layer, t);
  });

  area.addEventListener('pointerup', () => {
    if (isDragging) saveState();
    isDragging = false;
    area.style.cursor = '';
  });

  area.addEventListener('pointercancel', () => {
    isDragging = false;
    area.style.cursor = '';
  });

  /* ── Wheel zoom ── */
  area.addEventListener(
    'wheel',
    (e) => {
      if (!appState.frameImage) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      t.scale = clamp(t.scale + delta, MIN_SCALE, MAX_SCALE);
      applyTransform(layer, t);
      // save after a short debounce or immediately
      saveState();
    },
    { passive: false }
  );

  /* ── Touch pinch zoom ── */
  area.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length < 2 || !appState.frameImage) return;
      e.preventDefault();
      const dist = getTouchDistance(e.touches[0], e.touches[1]);
      if (lastPinchDist > 0) {
        const pinchDelta = (dist - lastPinchDist) * 0.005;
        t.scale = clamp(t.scale + pinchDelta, MIN_SCALE, MAX_SCALE);
        applyTransform(layer, t);
      }
      lastPinchDist = dist;
    },
    { passive: false }
  );

  area.addEventListener('touchend', () => {
    if (lastPinchDist > 0) saveState();
    lastPinchDist = 0;
  });
}

function applyTransform(layer, t) {
  layer.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.scale})`;
}

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

function getTouchDistance(a, b) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
