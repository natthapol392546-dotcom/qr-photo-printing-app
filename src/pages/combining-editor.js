import { appState, saveState } from '../state.js';
import { gridTemplates } from '../components/grid-templates.js';
import { openUploadDialog } from '../components/image-upload.js';
import { openImageEditor } from '../components/image-editor.js';
import { frameTemplates, getFrameSVG } from '../components/frame-templates.js';

/**
 * Grid layout definitions used by the editor.
 * Each layout specifies CSS grid properties and per-cell grid-area placements.
 */
const editorLayouts = {
  single: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr',
    cells: [{ gridArea: '1 / 1 / 2 / 2' }],
  },
  'double-horizontal': {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr',
    cells: [
      { gridArea: '1 / 1 / 2 / 2' },
      { gridArea: '1 / 2 / 2 / 3' },
    ],
  },
  'double-vertical': {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr',
    cells: [
      { gridArea: '1 / 1 / 2 / 2' },
      { gridArea: '2 / 1 / 3 / 2' },
    ],
  },
  triple: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    cells: [
      { gridArea: '1 / 1 / 3 / 2' },
      { gridArea: '1 / 2 / 2 / 3' },
      { gridArea: '2 / 2 / 3 / 3' },
    ],
  },
  quad: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    cells: [
      { gridArea: '1 / 1 / 2 / 2' },
      { gridArea: '1 / 2 / 2 / 3' },
      { gridArea: '2 / 1 / 3 / 2' },
      { gridArea: '2 / 2 / 3 / 3' },
    ],
  },
  column: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr 1fr',
    cells: [
      { gridArea: '1 / 1 / 2 / 2' },
      { gridArea: '2 / 1 / 3 / 2' },
      { gridArea: '3 / 1 / 4 / 2' },
    ],
  },
};

/**
 * Get the current layout config or fall back to 'single'.
 */
function getLayout() {
  return editorLayouts[appState.selectedGrid] || editorLayouts.single;
}

/**
 * Build the HTML for a single grid cell.
 */
function buildCellHTML(cellIndex) {
  const imageData =
    appState.images && appState.images[cellIndex]
      ? appState.images[cellIndex]
      : null;

  if (imageData) {
    return `
      <div class="grid-cell grid-cell--filled" data-cell-index="${cellIndex}">
        <img src="${imageData}" alt="Photo ${cellIndex + 1}" class="grid-cell-img" />
        <button class="grid-cell-edit-btn" data-cell-index="${cellIndex}" aria-label="Edit photo ${cellIndex + 1}">
          ✏️
        </button>
      </div>`;
  }

  return `
    <div class="grid-cell grid-cell--empty" data-cell-index="${cellIndex}">
      <span class="grid-cell-placeholder">📷</span>
      <span class="grid-cell-label">Tap to add</span>
    </div>`;
}

/**
 * Check whether every cell in the layout has an image.
 */
function allCellsFilled() {
  const layout = getLayout();
  if (!appState.images) return false;
  return layout.cells.every((_, i) => !!appState.images[i]);
}

/**
 * Compose the final image onto an offscreen canvas (1200×1800, 2:3 ratio).
 * Returns a Promise that resolves with the data URL.
 */
function composeFinalImage() {
  return new Promise((resolve, reject) => {
    const layout = getLayout();
    const CANVAS_W = 1200;
    const CANVAS_H = 1800;

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Fill with dark background in case of tiny gaps
    ctx.fillStyle = '#0d0d14';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Parse grid template to compute pixel rects per cell
    const cellRects = computeCellRects(layout, CANVAS_W, CANVAS_H);
    const totalCells = layout.cells.length;
    let loadedCount = 0;

    if (totalCells === 0) {
      resolve(canvas.toDataURL('image/png'));
      return;
    }

    cellRects.forEach((rect, index) => {
      const img = new Image();
      img.onload = () => {
        // Draw image to fill the cell rect (cover behaviour)
        drawImageCover(ctx, img, rect.x, rect.y, rect.w, rect.h);
        loadedCount++;
        if (loadedCount === totalCells) {
          drawFrameAndResolve(ctx, canvas, resolve);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === totalCells) {
          drawFrameAndResolve(ctx, canvas, resolve);
        }
      };
      img.src = appState.images[index];
    });
  });
}

function drawFrameAndResolve(ctx, canvas, resolve) {
  const currentFrame = appState.selectedFrame || 0;
  if (currentFrame === 0) {
    // Basic or no frame, you can skip or just render it
  }
  const svgStr = getFrameSVG(currentFrame, canvas.width, canvas.height);
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const frameImg = new Image();
  frameImg.onload = () => {
    ctx.drawImage(frameImg, 0, 0);
    URL.revokeObjectURL(url);
    resolve(canvas.toDataURL('image/png'));
  };
  frameImg.onerror = () => {
    URL.revokeObjectURL(url);
    resolve(canvas.toDataURL('image/png'));
  };
  frameImg.src = url;
}

/**
 * Compute pixel rectangles for each cell based on the CSS grid definition.
 */
function computeCellRects(layout, canvasW, canvasH) {
  const colFractions = layout.gridTemplateColumns
    .split(/\s+/)
    .map(() => 1); // all 1fr
  const rowFractions = layout.gridTemplateRows
    .split(/\s+/)
    .map(() => 1);

  const GAP = 4; // small gap in pixels
  const totalColGap = GAP * (colFractions.length - 1);
  const totalRowGap = GAP * (rowFractions.length - 1);

  const totalColFr = colFractions.reduce((a, b) => a + b, 0);
  const totalRowFr = rowFractions.reduce((a, b) => a + b, 0);

  const availW = canvasW - totalColGap;
  const availH = canvasH - totalRowGap;

  // Column edges
  const colEdges = [0];
  colFractions.forEach((fr, i) => {
    const prevEdge = colEdges[colEdges.length - 1];
    const size = (fr / totalColFr) * availW;
    colEdges.push(prevEdge + size + (i < colFractions.length - 1 ? GAP : 0));
  });

  // Row edges
  const rowEdges = [0];
  rowFractions.forEach((fr, i) => {
    const prevEdge = rowEdges[rowEdges.length - 1];
    const size = (fr / totalRowFr) * availH;
    rowEdges.push(prevEdge + size + (i < rowFractions.length - 1 ? GAP : 0));
  });

  // Map each cell's grid-area to pixel rect
  return layout.cells.map((cell) => {
    const parts = cell.gridArea.split('/').map((s) => parseInt(s.trim(), 10));
    const rowStart = parts[0] - 1;
    const colStart = parts[1] - 1;
    const rowEnd = parts[2] - 1;
    const colEnd = parts[3] - 1;

    const x = colEdges[colStart];
    const y = rowEdges[rowStart];
    const x2 = colEdges[colEnd] - (colEnd < colFractions.length ? GAP : 0);
    const y2 = rowEdges[rowEnd] - (rowEnd < rowFractions.length ? GAP : 0);

    return { x, y, w: x2 - x, h: y2 - y };
  });
}

/**
 * Draw an image using "cover" mode into a target rectangle.
 */
function drawImageCover(ctx, img, dx, dy, dw, dh) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const rectRatio = dw / dh;

  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

  if (imgRatio > rectRatio) {
    // Image wider than rect: crop sides
    sw = img.naturalHeight * rectRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    // Image taller than rect: crop top/bottom
    sh = img.naturalWidth / rectRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

/**
 * Render the combining-editor page HTML.
 */
export function render() {
  const layout = getLayout();

  // Initialize images array if needed
  if (!appState.images) {
    appState.images = [];
  }

  const cellsHTML = layout.cells
    .map((cell, index) => {
      const cellContent = buildCellHTML(index);
      // Wrap with grid-area positioning
      return `<div class="grid-cell-wrapper" style="grid-area: ${cell.gridArea};">
        ${cellContent}
      </div>`;
    })
    .join('');

  const templates = frameTemplates || [];
  const currentFrame = appState.selectedFrame ?? 0;
  const templateThumbs = templates
    .map((tpl, originalIndex) => ({ tpl, originalIndex }))
    .filter(item => item.tpl.layouts?.includes('multi'))
    .map(
      (item) => `
      <button 
        class="template-thumb ${item.originalIndex === currentFrame ? 'active' : ''}" 
        data-index="${item.originalIndex}" 
        aria-label="${item.tpl.name}"
      >
        <div class="thumb-preview">${getFrameSVG(item.originalIndex, 48, 72)}</div>
        <span class="thumb-label">${item.tpl.name}</span>
      </button>
    `
    )
    .join('');

  const allFilled = allCellsFilled();

  return `
    <style>
      /* ===== Combining Editor Page ===== */
      .combining-editor-page {
        min-height: 100dvh;
        background: var(--bg-color);
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
      }

      /* Header */
      .ce-header {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        background: var(--surface-color);
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .ce-back-btn {
        background: none;
        border: none;
        color: var(--primary-color);
        font-size: 22px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 8px;
        transition: background 0.2s;
        text-decoration: none;
        display: flex;
        align-items: center;
      }
      .ce-back-btn:hover { background: rgba(0,0,0,0.05); }

      .ce-header-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
      }

      /* Main grid area */
      .ce-grid-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .ce-grid {
        display: grid;
        gap: 4px;
        width: 100%;
        max-width: 360px;
        aspect-ratio: 2 / 3;
        background: var(--bg-color);
        border-radius: 12px;
        overflow: hidden;
        border: 2px solid rgba(0,0,0,0.05);
      }

      /* Wrapper per cell — sized by CSS grid */
      .grid-cell-wrapper {
        position: relative;
        min-height: 0;
        min-width: 0;
        overflow: hidden;
      }

      /* Cell base */
      .grid-cell {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        overflow: hidden;
        cursor: pointer;
        transition: background 0.2s;
      }

      /* Empty cell */
      .grid-cell--empty {
        background: var(--surface-color);
        border: 2px dashed var(--primary-color);
      }
      .grid-cell--empty:hover {
        background: var(--bg-color);
        border-color: var(--secondary-color);
      }

      .grid-cell-placeholder {
        font-size: 28px;
        line-height: 1;
        margin-bottom: 4px;
      }

      .grid-cell-label {
        font-size: 11px;
        color: var(--primary-color);
        font-weight: 500;
      }

      /* Filled cell */
      .grid-cell--filled {
        background: #000;
      }

      .grid-cell-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .grid-cell-edit-btn {
        position: absolute;
        top: 6px;
        right: 6px;
        width: 30px;
        height: 30px;
        background: rgba(13,13,20,0.75);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
        padding: 0;
      }
      .grid-cell--filled:hover .grid-cell-edit-btn {
        opacity: 1;
      }

      /* Action bar */
      .ce-action-bar {
        display: flex;
        gap: 12px;
        padding: 16px 20px;
        padding-bottom: max(32px, env(safe-area-inset-bottom));
        border-top: 1px solid rgba(0,0,0,0.05);
        background: var(--surface-color);
        position: sticky;
        bottom: 0;
      }

      .ce-btn {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.1s;
      }
      .ce-btn:active {
        transform: scale(0.98);
      }

      .ce-btn--secondary {
        background: transparent;
        color: #fd475d;
        border: 2px solid #fd475d;
      }
      .ce-btn--secondary:hover {
        background: rgba(253, 71, 93, 0.1);
      }

      .ce-btn--primary {
        background: #fd475d;
        color: #ffffff;
      }
      .ce-btn--primary:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        transform: none;
      }
      .ce-btn--primary:not(:disabled):hover {
        opacity: 0.9;
      }
    </style>

    <div class="combining-editor-page">
      <header class="ce-header">
        <a href="#combining-select" class="ce-back-btn" aria-label="Back to layout selection">←</a>
        <h1 class="ce-header-title">Edit Layout</h1>
      </header>

      <div class="ce-grid-container">
        <div class="ce-grid"
             style="grid-template-columns: ${layout.gridTemplateColumns};
                    grid-template-rows: ${layout.gridTemplateRows}; position: relative;">
          ${cellsHTML}
          <div class="preview-frame-layer" id="frame-layer" style="position: absolute; inset: 0; pointer-events: none;">
            ${getFrameSVG(currentFrame, 360, 540)}
          </div>
        </div>
      </div>

      <div class="template-bar" id="template-bar" style="margin-top: 16px;">
        ${templateThumbs}
      </div>

      <div class="ce-action-bar">
        <button class="ce-btn ce-btn--secondary" id="ce-remake-btn">Remake</button>
        <button class="ce-btn ce-btn--primary" id="ce-submit-btn" ${allFilled ? '' : 'disabled'}>Submit</button>
      </div>
    </div>
  `;
}

/**
 * Re-render just the grid area (not the full page) to update cells after an image change.
 */
function refreshGrid() {
  const layout = getLayout();
  const gridEl = document.querySelector('.ce-grid');
  if (!gridEl) return;

  const cellsHTML = layout.cells
    .map((cell, index) => {
      const cellContent = buildCellHTML(index);
      return `<div class="grid-cell-wrapper" style="grid-area: ${cell.gridArea};">
        ${cellContent}
      </div>`;
    })
    .join('');

  gridEl.innerHTML = cellsHTML;

  // Re-bind cell events
  bindCellEvents();

  // Update submit button state
  const submitBtn = document.getElementById('ce-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = !allCellsFilled();
  }
}

/**
 * Handle clicking on a cell (upload or edit).
 */
async function handleCellAction(cellIndex, isEdit) {
  try {
    if (isEdit && appState.images && appState.images[cellIndex]) {
      // Re-edit existing image
      const result = await openImageEditor(
        appState.images[cellIndex],
        { cellIndex }
      );
      if (result && result.dataUrl) {
        appState.images[cellIndex] = result.dataUrl;
        refreshGrid();
      }
    } else {
      // Upload new image
      const imageFile = await openUploadDialog();
      if (!imageFile) return;

      const result = await openImageEditor(imageFile, { cellIndex });
      if (result && result.dataUrl) {
        if (!appState.images) appState.images = [];
        appState.images[cellIndex] = result.dataUrl;
        refreshGrid();
      }
    }
  } catch (err) {
    console.error('Image action failed:', err);
  }
}

/**
 * Bind click events to grid cells.
 */
function bindCellEvents() {
  // Empty cells — upload
  document.querySelectorAll('.grid-cell--empty').forEach((cell) => {
    cell.addEventListener('click', () => {
      const index = parseInt(cell.getAttribute('data-cell-index'), 10);
      handleCellAction(index, false);
    });
  });

  // Filled cells — clicking image re-edits
  document.querySelectorAll('.grid-cell--filled').forEach((cell) => {
    const img = cell.querySelector('.grid-cell-img');
    if (img) {
      img.addEventListener('click', () => {
        const index = parseInt(cell.getAttribute('data-cell-index'), 10);
        handleCellAction(index, true);
      });
    }
  });

  // Edit buttons on filled cells
  document.querySelectorAll('.grid-cell-edit-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.getAttribute('data-cell-index'), 10);
      handleCellAction(index, true);
    });
  });
}

/**
 * Attach event listeners after the page has been rendered into the DOM.
 */
export function init() {
  // Cell interactions
  bindCellEvents();

  // Remake button — clear images and go back to layout selection
  const remakeBtn = document.getElementById('ce-remake-btn');
  if (remakeBtn) {
    remakeBtn.addEventListener('click', () => {
      appState.images = [];
      appState.selectedGrid = null;
      window.location.hash = '#combining-select';
    });
  }

  // Submit button — compose final image and navigate to print
  const submitBtn = document.getElementById('ce-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      if (!allCellsFilled()) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Composing…';

      try {
        const finalDataUrl = await composeFinalImage();
        appState.finalImage = finalDataUrl;
        window.location.hash = '#print';
      } catch (err) {
        console.error('Failed to compose image:', err);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    });
  }

  // Template bar selection
  const templateThumbs = document.querySelectorAll('.template-thumb');
  templateThumbs.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active from all
      templateThumbs.forEach((b) => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');

      const index = parseInt(btn.getAttribute('data-index') || '0', 10);
      appState.selectedFrame = index;
      saveState();

      // Update frame layer overlay
      const frameLayer = document.getElementById('frame-layer');
      if (frameLayer) {
        // Assume grid display size approx 360x540
        frameLayer.innerHTML = getFrameSVG(index, 360, 540);
      }
    });
  });
}
