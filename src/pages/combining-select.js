import { appState, saveState } from '../state.js';
import { gridTemplates } from '../components/grid-templates.js';

/**
 * Layout option definitions with mini-preview CSS configurations.
 * Each layout maps to a gridTemplates key and describes how many photos it holds.
 */
const layoutOptions = [
  {
    id: 'single',
    name: 'Single',
    photoCount: 1,
    previewCells: [{ gridArea: '1 / 1 / 2 / 2' }],
    previewGrid: { columns: '1fr', rows: '1fr' },
  },
  {
    id: 'double-horizontal',
    name: 'Double Horizontal',
    photoCount: 2,
    previewCells: [
      { gridArea: '1 / 1 / 2 / 2' },
      { gridArea: '1 / 2 / 2 / 3' },
    ],
    previewGrid: { columns: '1fr 1fr', rows: '1fr' },
  },
  {
    id: 'double-vertical',
    name: 'Double Vertical',
    photoCount: 2,
    previewCells: [
      { gridArea: '1 / 1 / 2 / 2' },
      { gridArea: '2 / 1 / 3 / 2' },
    ],
    previewGrid: { columns: '1fr', rows: '1fr 1fr' },
  },
  {
    id: 'triple',
    name: 'Triple',
    photoCount: 3,
    previewCells: [
      { gridArea: '1 / 1 / 3 / 2' },
      { gridArea: '1 / 2 / 2 / 3' },
      { gridArea: '2 / 2 / 3 / 3' },
    ],
    previewGrid: { columns: '1fr 1fr', rows: '1fr 1fr' },
  },
  {
    id: 'quad',
    name: 'Quad',
    photoCount: 4,
    previewCells: [
      { gridArea: '1 / 1 / 2 / 2' },
      { gridArea: '1 / 2 / 2 / 3' },
      { gridArea: '2 / 1 / 3 / 2' },
      { gridArea: '2 / 2 / 3 / 3' },
    ],
    previewGrid: { columns: '1fr 1fr', rows: '1fr 1fr' },
  },
  {
    id: 'column',
    name: 'Column',
    photoCount: 3,
    previewCells: [
      { gridArea: '1 / 1 / 2 / 2' },
      { gridArea: '2 / 1 / 3 / 2' },
      { gridArea: '3 / 1 / 4 / 2' },
    ],
    previewGrid: { columns: '1fr', rows: '1fr 1fr 1fr' },
  },
];

/**
 * Build a mini preview grid for a layout option card.
 */
function buildPreviewHTML(option) {
  const cellsHTML = option.previewCells
    .map(
      (cell) =>
        `<div class="preview-cell" style="grid-area: ${cell.gridArea};"></div>`
    )
    .join('');

  return `
    <div class="layout-preview"
         style="display:grid;
                grid-template-columns: ${option.previewGrid.columns};
                grid-template-rows: ${option.previewGrid.rows};
                gap: 3px;
                width: 100%;
                aspect-ratio: 2 / 3;">
      ${cellsHTML}
    </div>`;
}

/**
 * Render the combining-select page HTML.
 */
export function render() {
  const currentSelection = appState.selectedGrid || '';

  const cardsHTML = layoutOptions
    .map(
      (option) => `
      <div class="layout-card${option.id === currentSelection ? ' selected' : ''}"
           data-layout-id="${option.id}"
           tabindex="0"
           role="button"
           aria-pressed="${option.id === currentSelection}">
        ${buildPreviewHTML(option)}
        <span class="layout-card-name">${option.name}</span>
        <span class="layout-card-count">${option.photoCount} Photo${option.photoCount > 1 ? 's' : ''}</span>
      </div>`
    )
    .join('');

  return `
    <style>
      /* ===== Combining Select Page ===== */
      .combining-select-page {
        min-height: 100vh;
        background: var(--bg-color);
        color: var(--text-color);
        display: flex;
        flex-direction: column;
        font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
      }

      /* Header */
      .cs-header {
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

      .cs-back-btn {
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
      .cs-back-btn:hover { background: rgba(0,0,0,0.05); }

      .cs-header-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-color);
        margin: 0;
      }

      /* Section title */
      .cs-section-title {
        font-size: 15px;
        font-weight: 500;
        color: #9ca3af;
        text-transform: uppercase;
        letter-spacing: 1.2px;
        padding: 24px 20px 12px;
        margin: 0;
      }

      /* Layout options grid */
      .layout-options-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 14px;
        padding: 8px 20px 24px;
        flex: 1;
      }
      @media (max-width: 480px) {
        .layout-options-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* Individual layout card */
      .layout-card {
        background: var(--surface-color);
        border: 2px solid transparent;
        border-radius: 14px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        transition: border-color 0.25s, box-shadow 0.25s, transform 0.15s;
        user-select: none;
      }
      .layout-card:hover {
        border-color: rgba(108,99,255,0.4);
        transform: translateY(-2px);
      }
      .layout-card:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }
      .layout-card.selected {
        border-color: var(--primary-color);
        box-shadow: 0 0 18px rgba(0,212,255,0.25), inset 0 0 12px rgba(0,212,255,0.06);
      }

      /* Mini preview inside card */
      .layout-preview {
        border-radius: 8px;
        overflow: hidden;
        background: var(--bg-color);
      }
      .preview-cell {
        background: var(--surface-color);
        border-radius: 4px;
        min-height: 0;
      }

      .layout-card-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--text-color);
        text-align: center;
        line-height: 1.2;
      }
      .layout-card-count {
        font-size: 11px;
        color: var(--primary-color);
        font-weight: 500;
      }

      /* Bottom bar */
      .cs-bottom-bar {
        padding: 16px 20px;
        padding-bottom: max(16px, env(safe-area-inset-bottom));
        border-top: 1px solid rgba(255,255,255,0.08);
        background: var(--surface-color);
        backdrop-filter: blur(10px);
        position: sticky;
        bottom: 0;
      }

      .cs-next-btn {
        width: 100%;
        padding: 14px;
        border: none;
        border-radius: 12px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.1s;
        background: #fd475d;
        color: #ffffff;
      }
      .cs-next-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
        transform: none;
      }
      .cs-next-btn:not(:disabled):hover {
        opacity: 0.9;
      }
      .cs-next-btn:not(:disabled):active {
        transform: scale(0.98);
      }
    </style>

    <div class="combining-select-page">
      <header class="cs-header">
        <a href="#home" class="cs-back-btn" aria-label="Back to home">←</a>
        <h1 class="cs-header-title">Combining Photos</h1>
      </header>

      <h2 class="cs-section-title">Choose Your Layout</h2>

      <div class="layout-options-grid">
        ${cardsHTML}
      </div>

      <div class="cs-bottom-bar">
        <button class="cs-next-btn" id="cs-next-btn" ${currentSelection ? '' : 'disabled'}>
          Next Step
        </button>
      </div>
    </div>
  `;
}

/**
 * Attach event listeners after the page has been rendered into the DOM.
 */
export function init() {
  const cards = document.querySelectorAll('.layout-card');
  const nextBtn = document.getElementById('cs-next-btn');

  function selectCard(card) {
    // Deselect all
    cards.forEach((c) => {
      c.classList.remove('selected');
      c.setAttribute('aria-pressed', 'false');
    });

    // Select the clicked card
    card.classList.add('selected');
    card.setAttribute('aria-pressed', 'true');

    const layoutId = card.getAttribute('data-layout-id');
    appState.selectedGrid = layoutId;
    saveState();

    // Enable next button
    if (nextBtn) {
      nextBtn.disabled = false;
    }
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => selectCard(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCard(card);
      }
    });
  });

  // Next Step navigation
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (appState.selectedGrid) {
        window.location.hash = '#combining-editor';
      }
    });
  }
}
