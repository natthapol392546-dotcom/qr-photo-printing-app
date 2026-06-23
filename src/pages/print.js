// Print page – preview final image, enter print code, submit
import { appState, resetState } from '../state.js';

/* ── Render ── */
export function render() {
  const previewSrc = appState.finalImage || '';

  return `
    <div class="page print-page fade-in">
      <!-- Header -->
      <header class="page-header">
        <button class="back-btn" id="btn-back" aria-label="Go back">←</button>
        <h1 class="page-title">Print Your Photo</h1>
        <div class="header-spacer"></div>
      </header>

      <!-- Preview -->
      <div class="print-preview">
        ${
          previewSrc
            ? `<img src="${previewSrc}" class="print-preview-img" alt="Final photo preview" />`
            : `<div class="print-preview-empty">
                <span class="empty-icon">🖼️</span>
                <span>No image to preview</span>
              </div>`
        }
      </div>

      <!-- Print code form -->
      <div class="print-form" id="print-form">
        <label class="form-label" for="print-code-input">Enter your print code</label>
        <div class="input-wrap" id="input-wrap">
          <input
            type="text"
            id="print-code-input"
            class="form-input"
            maxlength="8"
            minlength="6"
            pattern="[A-Za-z0-9]{6,8}"
            placeholder="e.g. ABC123"
            autocomplete="off"
            spellcheck="false"
          />
        </div>
        <span class="form-helper" id="form-helper">6-8 characters, letters and numbers</span>
        <span class="form-error" id="form-error"></span>
      </div>

      <!-- Submit -->
      <!-- Submit -->
      <div class="print-actions">
        <button class="btn btn-secondary" id="btn-download" ${!previewSrc ? 'disabled' : ''}>
          <span class="btn-icon">💾</span> Save Image
        </button>
        <button class="btn btn-print" id="btn-print" ${!previewSrc ? 'disabled' : ''}>
          <span class="btn-print-label">🖨️ Print Now</span>
          <span class="btn-spinner hidden" id="btn-spinner"></span>
        </button>
      </div>

      <!-- Success state (hidden initially) -->
      <div class="print-success hidden" id="print-success">
        <div class="success-icon">✅</div>
        <p class="success-msg">Print job submitted successfully!</p>
        <button class="btn btn-secondary" id="btn-print-another">Print Another</button>
      </div>
    </div>
  `;
}

/* ── Init ── */
export function init() {
  const backBtn = document.getElementById('btn-back');
  const input = /** @type {HTMLInputElement} */ (document.getElementById('print-code-input'));
  const printBtn = document.getElementById('btn-print');
  const inputWrap = document.getElementById('input-wrap');
  const formError = document.getElementById('form-error');
  const formHelper = document.getElementById('form-helper');
  const spinner = document.getElementById('btn-spinner');
  const printLabel = document.querySelector('.btn-print-label');
  const successPanel = document.getElementById('print-success');
  const printForm = document.getElementById('print-form');
  const printAnotherBtn = document.getElementById('btn-print-another');

  /* Back */
  backBtn?.addEventListener('click', () => {
    window.history.back();
  });

  /* Auto uppercase while typing */
  input?.addEventListener('input', () => {
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    clearError();
  });

  /* Submit */
  printBtn?.addEventListener('click', async () => {
    if (!input) return;
    const code = input.value.trim();

    // Validate
    if (!isValidCode(code)) {
      showError('Please enter a valid code (6-8 alphanumeric characters)');
      return;
    }

    // Store in state
    appState.printCode = code;
    appState.printStatus = 'loading';

    // Loading state
    printBtn.setAttribute('disabled', 'true');
    printLabel?.classList.add('hidden');
    spinner?.classList.remove('hidden');

    // Mock delay
    await delay(2000);

    // Success
    appState.printStatus = 'success';
    spinner?.classList.add('hidden');
    printBtn.classList.add('hidden');
    printForm?.classList.add('hidden');
    successPanel?.classList.remove('hidden');

    // Save mock stats
    const stats = JSON.parse(localStorage.getItem('printStats') || '{"totalPrints": 0, "templates": {}}');
    stats.totalPrints++;
    const usedTemplate = appState.mode === 'photo-frame' 
      ? `frame-${appState.selectedFrame}` 
      : `grid-${appState.selectedGrid}`;
    stats.templates[usedTemplate] = (stats.templates[usedTemplate] || 0) + 1;
    localStorage.setItem('printStats', JSON.stringify(stats));

    showToast('Print job submitted successfully!');
  });

  /* Print another */
  printAnotherBtn?.addEventListener('click', () => {
    resetState();
    window.location.hash = '#home';
  });

  /* Download Image */
  document.getElementById('btn-download')?.addEventListener('click', () => {
    if (!appState.finalImage) return;
    const a = document.createElement('a');
    a.href = appState.finalImage;
    a.download = `photo-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Image saved successfully!');
  });

  /* ── Helpers ── */

  function isValidCode(code) {
    return /^[A-Za-z0-9]{6,8}$/.test(code);
  }

  function showError(msg) {
    inputWrap?.classList.add('input-error');
    if (formError) {
      formError.textContent = msg;
      formError.classList.remove('hidden');
    }
    formHelper?.classList.add('hidden');
  }

  function clearError() {
    inputWrap?.classList.remove('input-error');
    formError?.classList.add('hidden');
    if (formError) formError.textContent = '';
    formHelper?.classList.remove('hidden');
  }
}

/* ── Utilities ── */

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast toast-success fade-in';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
}
