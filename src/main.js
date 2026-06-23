// Main application entry point
import { appState } from './state.js';

// Page imports
import { render as renderHome, init as initHome } from './pages/home.js';
import { render as renderPhotoFrame, init as initPhotoFrame } from './pages/photo-frame.js';
import { render as renderCombiningSelect, init as initCombiningSelect } from './pages/combining-select.js';
import { render as renderCombiningEditor, init as initCombiningEditor } from './pages/combining-editor.js';
import { render as renderPrint, init as initPrint } from './pages/print.js';

// Route definitions
const routes = {
  '': { render: renderHome, init: initHome },
  '#home': { render: renderHome, init: initHome },
  '#photo-frame': { render: renderPhotoFrame, init: initPhotoFrame },
  '#combining-select': { render: renderCombiningSelect, init: initCombiningSelect },
  '#combining-editor': { render: renderCombiningEditor, init: initCombiningEditor },
  '#print': { render: renderPrint, init: initPrint },
};

// Current page cleanup function
let currentCleanup = null;

function navigateTo(hash) {
  const app = document.getElementById('app');
  const route = routes[hash] || routes[''];
  
  // Run cleanup for previous page
  if (currentCleanup && typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }
  
  // Add exit animation
  app.classList.add('page-exit');
  
  setTimeout(() => {
    // Render new page
    app.innerHTML = route.render();
    app.classList.remove('page-exit');
    app.classList.add('page-enter');
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Initialize page event handlers
    if (route.init) {
      currentCleanup = route.init();
    }
    
    // Remove animation class after transition
    setTimeout(() => {
      app.classList.remove('page-enter');
    }, 400);
  }, 200);
}

// Listen for hash changes
window.addEventListener('hashchange', () => {
  navigateTo(window.location.hash);
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  navigateTo(window.location.hash || '');
});

// Delete the default Vite files we don't need
// (They were scaffolded by create-vite)
