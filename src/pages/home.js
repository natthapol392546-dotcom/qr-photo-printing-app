// Home page – main menu with mode selection cards

export function render() {
  return `
    <div class="page home-page fade-in">
      <header class="home-header">
        <div class="logo-mark">
          <span class="logo-icon">📸</span>
          <h1 class="logo-text">Print<span class="logo-accent">Snap</span></h1>
        </div>
        <p class="subtitle">Premium Photo Printing</p>
      </header>

      <div class="mode-cards">
        <button class="glass-card mode-card" id="card-photo-frame" aria-label="Photo Frame mode">
          <div class="card-icon-wrap">
            <span class="card-icon">🖼️</span>
          </div>
          <h2 class="card-title">Photo Frame</h2>
          <p class="card-desc">Add beautiful frames to your photo</p>
          <span class="card-arrow">→</span>
        </button>

        <button class="glass-card mode-card" id="card-combining" aria-label="Combining Photos mode">
          <div class="card-icon-wrap">
            <span class="card-icon">🪟</span>
          </div>
          <h2 class="card-title">Combining Photos</h2>
          <p class="card-desc">Combine multiple photos in creative layouts</p>
          <span class="card-arrow">→</span>
        </button>
      </div>

      <footer class="home-footer">
        <div class="qr-hint">
          <span class="qr-icon">📱</span>
          <span>Scan QR code to start printing</span>
        </div>
      </footer>
    </div>
  `;
}

export function init() {
  const photoFrameCard = document.getElementById('card-photo-frame');
  const combiningCard = document.getElementById('card-combining');

  if (photoFrameCard) {
    photoFrameCard.addEventListener('click', () => {
      photoFrameCard.classList.add('card-pressed');
      setTimeout(() => {
        window.location.hash = '#photo-frame';
      }, 150);
    });
  }

  if (combiningCard) {
    combiningCard.addEventListener('click', () => {
      combiningCard.classList.add('card-pressed');
      setTimeout(() => {
        window.location.hash = '#combining-select';
      }, 150);
    });
  }
}
