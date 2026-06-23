// Frame templates for Photo Frame mode
// Using SVG-based decorative frames

export const frameTemplates = [
  {
    id: 'none',
    name: 'None',
    thumbnail: '⬜'
  },
  {
    id: 'blue-stripes',
    name: 'Blue Stripes',
    thumbnail: '🟦'
  },
  {
    id: 'pink-wavy',
    name: 'Pink Wavy',
    thumbnail: '🎀'
  },
  {
    id: 'orange-stitch',
    name: 'Orange Stitch',
    thumbnail: '🟧'
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
    id: 'film-strip',
    name: 'Film',
    thumbnail: '🎬'
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

    case 'blue-stripes':
      const bw1 = width * 0.13;
      const bh1 = height * 0.13;
      const uid1 = Math.random().toString(36).substr(2, 9);
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <mask id="hole-${id}-${uid1}">
            <rect width="${width}" height="${height}" fill="white" />
            <rect x="${bw1}" y="${bh1}" width="${width - (bw1 * 2)}" height="${height - (bh1 * 2)}" fill="black" />
          </mask>
          <pattern id="pat-blue-${uid1}" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#FDF8EE" />
            <path d="M0,0 L40,40 M40,0 L0,40" stroke="#E5DCCB" stroke-width="1" />
            <rect x="15" y="0" width="10" height="40" fill="#7898C4" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#pat-blue-${uid1})" mask="url(#hole-${id}-${uid1})" />
      </svg>`;

    case 'pink-wavy':
      const bw2 = width * 0.13;
      const bh2 = height * 0.13;
      const uid2 = Math.random().toString(36).substr(2, 9);
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <mask id="hole-${id}-${uid2}">
            <rect width="${width}" height="${height}" fill="white" />
            <rect x="${bw2}" y="${bh2}" width="${width - (bw2 * 2)}" height="${height - (bh2 * 2)}" fill="black" />
          </mask>
          <pattern id="pat-pink-${uid2}" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(5)">
            <rect width="60" height="60" fill="#FFFFFF" />
            <rect x="0" y="0" width="30" height="30" fill="#F8BBD0" />
            <rect x="30" y="30" width="30" height="30" fill="#F8BBD0" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#pat-pink-${uid2})" mask="url(#hole-${id}-${uid2})" />
      </svg>`;

    case 'orange-stitch':
      const bw3 = width * 0.13;
      const bh3 = height * 0.13;
      const uid3 = Math.random().toString(36).substr(2, 9);
      return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
        <defs>
          <mask id="hole-${id}-${uid3}">
            <rect width="${width}" height="${height}" fill="white" />
            <rect x="${bw3}" y="${bh3}" width="${width - (bw3 * 2)}" height="${height - (bh3 * 2)}" fill="black" />
          </mask>
          <pattern id="pat-orange-${uid3}" width="60" height="60" patternUnits="userSpaceOnUse">
            <rect width="60" height="60" fill="#FDF8EE" />
            <rect x="0" y="0" width="30" height="30" fill="#F27D42" />
            <rect x="3" y="3" width="24" height="24" fill="none" stroke="#FDF8EE" stroke-width="1.5" stroke-dasharray="4,2" />
            <rect x="30" y="30" width="30" height="30" fill="#F27D42" />
            <rect x="33" y="33" width="24" height="24" fill="none" stroke="#FDF8EE" stroke-width="1.5" stroke-dasharray="4,2" />
            <rect x="33" y="3" width="24" height="24" fill="none" stroke="#F27D42" stroke-width="1.5" stroke-dasharray="4,2" />
            <rect x="3" y="33" width="24" height="24" fill="none" stroke="#F27D42" stroke-width="1.5" stroke-dasharray="4,2" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#pat-orange-${uid3})" mask="url(#hole-${id}-${uid3})" />
      </svg>`;

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
