/**
 * Piyush Keshri - Generative AI & Backend Portfolio Application Logic
 * Implements: Theme Toggle, Lightbox, Mobile Nav, and Form Success
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initLightbox();
  initContactForm();
});

/**
 * 1. Theme Management (Light / Dark Mode)
 * Defaults to Light Mode unless explicitly set to dark in localStorage.
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Check stored theme only (Light mode by default)
  const savedTheme = localStorage.getItem('theme');
  const isDarkMode = savedTheme === 'dark';

  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.replace('light', 'dark');
    themeToggle.setAttribute('aria-label', 'Switch to light theme');
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.replace('dark', 'light');
    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
  }

  // Toggle Action
  themeToggle.addEventListener('click', () => {
    const isDarkNow = document.body.classList.toggle('dark-mode');
    if (isDarkNow) {
      document.documentElement.classList.replace('light', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
      document.documentElement.classList.replace('dark', 'light');
      localStorage.setItem('theme', 'light');
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }
  });
}

/**
 * 2. Mobile Navigation Toggle
 */
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!menuToggle || !mobileNav) return;

  const menuOpenIcon = menuToggle.querySelector('.menu-open-icon');
  const menuCloseIcon = menuToggle.querySelector('.menu-close-icon');

  function toggleMenu(open) {
    const shouldOpen = open !== undefined ? open : menuToggle.getAttribute('aria-expanded') === 'false';
    
    menuToggle.setAttribute('aria-expanded', shouldOpen);
    mobileNav.setAttribute('aria-hidden', !shouldOpen);
    
    if (shouldOpen) {
      mobileNav.classList.add('active');
      menuOpenIcon.classList.add('hidden');
      menuCloseIcon.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    } else {
      mobileNav.classList.remove('active');
      menuOpenIcon.classList.remove('hidden');
      menuCloseIcon.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  menuToggle.addEventListener('click', () => toggleMenu());

  // Close mobile nav when clicking any link
  const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when pressing Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
      toggleMenu(false);
      menuToggle.focus();
    }
  });
}

/**
 * 3. Portfolio Lightbox Modal (with accessible focus trapping)
 */
function initLightbox() {
  const lightbox = document.getElementById('project-lightbox');
  const projectCards = document.querySelectorAll('.project-card');
  const closeBtn = document.getElementById('close-modal-btn');
  
  if (!lightbox || projectCards.length === 0 || !closeBtn) return;

  const modalImg = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalGithubLink = document.getElementById('modal-github-link');
  const modalAppLink = document.getElementById('modal-app-link');

  let triggerElement = null; // Store element that opened modal to restore focus later

  function openLightbox(card) {
    triggerElement = document.activeElement;

    // Retrieve metadata from card data-attributes
    const imageSrc = card.getAttribute('data-image');
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');
    const githubUrl = card.getAttribute('data-github') || '#';
    const appUrl = card.getAttribute('data-app') || '#';

    // Populate modal contents
    modalImg.src = imageSrc;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    if (modalGithubLink) modalGithubLink.setAttribute('href', githubUrl);
    if (modalAppLink) modalAppLink.setAttribute('href', appUrl);

    // Show Lightbox
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Trap Focus
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Clear image src to avoid flash of old image next time
    modalImg.src = '';
    
    // Restore focus
    if (triggerElement) {
      triggerElement.focus();
    }
  }

  // Bind click event to each card
  projectCards.forEach(card => {
    // Click card wrapper or view btn
    card.addEventListener('click', (e) => {
      openLightbox(card);
    });

    // Support keyboard activation (Enter key)
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        openLightbox(card);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  
  // Close when clicking overlay backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Key listening (Escape to close, Tab to trap focus)
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('hidden')) {
      if (e.key === 'Escape') {
        closeLightbox();
      }
      
      if (e.key === 'Tab') {
        const focusableElements = lightbox.querySelectorAll('button, [tabindex="0"]');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    }
  });
}

/**
 * 4. Contact Form Submission Feedback
 */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    
    // Check if the user has updated the key from default placeholder
    const accessKey = formData.get('access_key');
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      alert('Please configure your Web3Forms Access Key in index.html (see the guide in portfolio App Data directory).');
      return;
    }

    const originalContent = form.innerHTML;
    form.style.opacity = '0';

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setTimeout(() => {
          form.innerHTML = `
            <div class="success-message" style="text-align: center; padding: 2.5rem 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 350px;">
              <div class="success-icon neumorphic-inset" style="width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; color: var(--color-accent);">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-primary); margin-bottom: 1rem; letter-spacing: -0.02em;">INQUIRY RECEIVED</h3>
              <p style="font-size: 0.95rem; color: var(--color-secondary); max-width: 320px; line-height: 1.6; margin-bottom: 2rem;">
                Thank you. Your message has been sent to Piyush's Gmail inbox. You should receive a response shortly.
              </p>
              <button type="button" id="reset-form-btn" class="btn-secondary" style="font-size: 0.85rem; padding: 10px 20px;">Send Another Message</button>
            </div>
          `;
          form.style.opacity = '1';

          const resetBtn = document.getElementById('reset-form-btn');
          if (resetBtn) {
            resetBtn.addEventListener('click', () => {
              form.style.opacity = '0';
              setTimeout(() => {
                form.innerHTML = originalContent;
                form.style.opacity = '1';
                initContactForm(); // Re-initialize submission logic
              }, 300);
            });
          }
        }, 300);
      } else {
        form.style.opacity = '1';
        alert("Submission failed: " + data.message);
      }
    })
    .catch(error => {
      form.style.opacity = '1';
      alert("Submission error. Please check your connection.");
    });
  });
}
