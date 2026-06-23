// Frame templates for Photo Frame mode
// Using SVG-based decorative frames

export const frameTemplates = [
  {
    id: 'none',
    name: 'None',
    thumbnail: '⬜'
  },
  {
    id: 'classic-white',
    name: 'Classic',
    thumbnail: '🤍'
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    thumbnail: '📸'
  },
  {
    id: 'vintage-gold',
    name: 'Vintage',
    thumbnail: '✨'
  },
  {
    id: 'neon-glow',
    name: 'Neon',
    thumbnail: '💜'
  },
  {
    id: 'film-strip',
    name: 'Film',
    thumbnail: '🎬'
  },
  {
    id: 'rounded',
    name: 'Rounded',
    thumbnail: '🔲'
  },
  {
    id: 'gradient',
    name: 'Gradient',
    thumbnail: '🌈'
  }
];

/**
 * Generate SVG frame overlay for a given template index and dimensions.
 * Returns an SVG string that acts as a decorative frame overlay.
 */
export function getFrameSVG(templateIndex, width, height) {
  const template = frameTemplates[templateIndex] || frameTemplates[0];
  const id = template.id;

  switch (id) {
    case 'none':
      return '';

    case 'classic-white':
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <rect x="2" y="2" width="${width - 4}" height="${height - 4}" rx="4" stroke="white" stroke-width="16" fill="none"/>
        <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="2" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
      </svg>`;

    case 'polaroid':
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <rect x="0" y="0" width="${width}" height="${height}" rx="6" fill="white"/>
        <rect x="20" y="20" width="${width - 40}" height="${height - 120}" rx="2" fill="black"/>
        <text x="${width / 2}" y="${height - 40}" text-anchor="middle" fill="#333" font-family="Inter,sans-serif" font-size="${Math.max(12, width * 0.04)}" font-style="italic">your moment</text>
      </svg>`;

    case 'vintage-gold':
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#D4A843"/>
            <stop offset="50%" style="stop-color:#F4E09D"/>
            <stop offset="100%" style="stop-color:#D4A843"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="6" stroke="url(#gold-grad)" stroke-width="14" fill="none"/>
        <rect x="18" y="18" width="${width - 36}" height="${height - 36}" rx="3" stroke="url(#gold-grad)" stroke-width="3" fill="none"/>
        <!-- corner ornaments -->
        <circle cx="24" cy="24" r="6" fill="url(#gold-grad)"/>
        <circle cx="${width - 24}" cy="24" r="6" fill="url(#gold-grad)"/>
        <circle cx="24" cy="${height - 24}" r="6" fill="url(#gold-grad)"/>
        <circle cx="${width - 24}" cy="${height - 24}" r="6" fill="url(#gold-grad)"/>
      </svg>`;

    case 'neon-glow':
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <filter id="neon-blur">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="8" stroke="#6c63ff" stroke-width="4" fill="none" filter="url(#neon-blur)"/>
        <rect x="8" y="8" width="${width - 16}" height="${height - 16}" rx="8" stroke="#00d4ff" stroke-width="2" fill="none"/>
      </svg>`;

    case 'film-strip':
      const holeSize = Math.max(6, width * 0.025);
      const holeGap = Math.max(16, height * 0.035);
      const holes = Math.floor((height - 20) / holeGap);
      let holesLeft = '';
      let holesRight = '';
      for (let i = 0; i < holes; i++) {
        const cy = 20 + i * holeGap;
        holesLeft += `<rect x="6" y="${cy}" width="${holeSize}" height="${holeSize * 1.3}" rx="2" fill="#222"/>`;
        holesRight += `<rect x="${width - 6 - holeSize}" y="${cy}" width="${holeSize}" height="${holeSize * 1.3}" rx="2" fill="#222"/>`;
      }
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <rect x="0" y="0" width="${width}" height="${height}" rx="4" fill="#1a1a1a"/>
        <rect x="${holeSize + 14}" y="10" width="${width - (holeSize + 14) * 2}" height="${height - 20}" rx="2" fill="black"/>
        ${holesLeft}
        ${holesRight}
      </svg>`;

    case 'rounded':
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <rect x="4" y="4" width="${width - 8}" height="${height - 8}" rx="24" stroke="rgba(255,255,255,0.6)" stroke-width="8" fill="none"/>
      </svg>`;

    case 'gradient':
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b6b"/>
            <stop offset="25%" style="stop-color:#ffd93d"/>
            <stop offset="50%" style="stop-color:#6bcb77"/>
            <stop offset="75%" style="stop-color:#4d96ff"/>
            <stop offset="100%" style="stop-color:#9b59b6"/>
          </linearGradient>
        </defs>
        <rect x="3" y="3" width="${width - 6}" height="${height - 6}" rx="8" stroke="url(#rainbow)" stroke-width="10" fill="none"/>
      </svg>`;

    default:
      return '';
  }
}

export function getFrameById(id) {
  return frameTemplates.find(f => f.id === id) || frameTemplates[0];
}
