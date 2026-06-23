// Image upload handler - supports camera, gallery, and file input

export function openUploadDialog() {
  return new Promise((resolve, reject) => {
    const modal = document.getElementById('modal-container');
    modal.innerHTML = `
      <div class="modal-backdrop" id="upload-backdrop">
        <div class="upload-modal slide-up">
          <div class="upload-modal-header">
            <h3>Add Photo</h3>
            <button class="upload-close-btn" id="upload-close">&times;</button>
          </div>
          <div class="upload-options">
            <button class="upload-option" id="upload-camera">
              <span class="upload-option-icon">📷</span>
              <span class="upload-option-text">Take Photo</span>
              <span class="upload-option-arrow">›</span>
            </button>
            <button class="upload-option" id="upload-gallery">
              <span class="upload-option-icon">🖼️</span>
              <span class="upload-option-text">Photo Gallery</span>
              <span class="upload-option-arrow">›</span>
            </button>
            <button class="upload-option" id="upload-file">
              <span class="upload-option-icon">📁</span>
              <span class="upload-option-text">Browse Files</span>
              <span class="upload-option-arrow">›</span>
            </button>
          </div>
        </div>
      </div>
    `;
    modal.style.display = 'block';

    const cleanup = () => {
      modal.innerHTML = '';
      modal.style.display = 'none';
    };

    const handleFile = (file) => {
      if (!file) {
        cleanup();
        reject(new Error('No file selected'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        cleanup();
        resolve(e.target.result);
      };
      reader.onerror = () => {
        cleanup();
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    };

    const createFileInput = (accept, capture) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;
      if (capture) input.setAttribute('capture', capture);
      input.addEventListener('change', (e) => {
        handleFile(e.target.files[0]);
      });
      input.click();
    };

    document.getElementById('upload-camera').addEventListener('click', () => {
      createFileInput('image/*', 'environment');
    });

    document.getElementById('upload-gallery').addEventListener('click', () => {
      createFileInput('image/*', '');
    });

    document.getElementById('upload-file').addEventListener('click', () => {
      createFileInput('image/*', '');
    });

    document.getElementById('upload-close').addEventListener('click', () => {
      cleanup();
      reject(new Error('Cancelled'));
    });

    document.getElementById('upload-backdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        cleanup();
        reject(new Error('Cancelled'));
      }
    });
  });
}
