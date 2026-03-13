// script.js for Villa Panorama del Mar landing page
// Handles mobile menu, smooth scroll, and gallery interactions

// Language switcher - toggle body class for language
let currentLang = 'en';
const setLang = (lang) => {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.body.classList.remove('lang-en', 'lang-es');
  document.body.classList.add('lang-' + lang);
  // Update active button
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('lang-es').classList.toggle('active', lang === 'es');
};

document.getElementById('lang-en').addEventListener('click', () => setLang('en'));
document.getElementById('lang-es').addEventListener('click', () => setLang('es'));
window.addEventListener('DOMContentLoaded', () => setLang(currentLang));

// Fade-in animation for sections on scroll
const sections = document.querySelectorAll('section');
const revealSection = () => {
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      section.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', revealSection);
window.addEventListener('load', revealSection);

// Generic slider function for any slider
function initSlider(selector, options = {}) {
  const slider = document.querySelector(selector);
  if (!selector.includes('bg')) {
    // Standard content slider (gallery)
    if (!slider) return;
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(track.children);
    const prevBtn = slider.querySelector('.slider-btn-prev');
    const nextBtn = slider.querySelector('.slider-btn-next');
    let current = 0;
    const total = slides.length;

    function goTo(idx) {
      current = idx;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === current);
      });
    }
    function next() {
      goTo((current + 1) % total);
    }
    function prev() {
      goTo((current - 1 + total) % total);
    }
    prevBtn.addEventListener('click', next);
    nextBtn.addEventListener('click', prev);

    // Swipe support
    let startX = null;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });
    track.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (dx > 40) prev();
      else if (dx < -40) next();
      startX = null;
    });

    // Keyboard navigation
    slider.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    });

    goTo(0);
    return { goTo, next, prev };
  } else {
    // Background hero slider - auto-advancing
    if (!slider) return;
    const track = slider.querySelector('.bg-slider-track');
    const slides = Array.from(track.children);
    let current = 0;
    const total = slides.length;
    
    function goTo(idx) {
      current = idx;
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === current);
      });
    }
    function next() {
      goTo((current + 1) % total);
    }
    
    // Auto-advance every 5 seconds
    let auto = setInterval(next, 5000);
    slider.addEventListener('mouseenter', () => clearInterval(auto));
    slider.addEventListener('mouseleave', () => auto = setInterval(next, 5000));
    
    goTo(0);
    return { goTo, next };
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Initialize gallery slider
  initSlider('#gallery-slider');
  // Initialize hero background slider
  initSlider('#hero-bg-slider');

  // Initialize accordions (Logistics, House Rules, Location)
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const contentId = this.getAttribute('data-accordion') + '-content';
      const content = document.getElementById(contentId);
      const isActive = this.classList.contains('active');

      // Close all other accordions
      accordionHeaders.forEach(h => {
        if (h !== this) {
          h.classList.remove('active');
          const otherId = h.getAttribute('data-accordion') + '-content';
          document.getElementById(otherId).classList.remove('show');
        }
      });

      // Toggle current accordion
      this.classList.toggle('active');
      content.classList.toggle('show');
    });
  });

  // Image Zoom Modal
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const galleryImages = Array.from(document.querySelectorAll('.slider-img'));
  const featureImages = Array.from(document.querySelectorAll('.feature-card img'));
  const closeModal = document.getElementsByClassName('close-btn')[0];
  const prevBtn = document.querySelector('.modal .prev');
  const nextBtn = document.querySelector('.modal .next');

  let currentImageIndex;

  function openModal(imageSrc, showNav = false) {
    modal.style.display = 'block';
    modalImg.src = imageSrc;
    if (showNav) {
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }

  function closeModalHandler() {
    modal.style.display = 'none';
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    modalImg.src = galleryImages[currentImageIndex].src;
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    modalImg.src = galleryImages[currentImageIndex].src;
  }

  featureImages.forEach((img) => {
    img.addEventListener('click', function() {
      openModal(this.src, false);
    });
  });

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', function() {
      currentImageIndex = index;
      openModal(this.src, true);
    });
  });

  closeModal.onclick = closeModalHandler;
  prevBtn.onclick = showPrevImage;
  nextBtn.onclick = showNextImage;

  window.onclick = function(event) {
    if (event.target == modal) {
      closeModalHandler();
    }
  }

  window.addEventListener('keydown', function(event) {
    if (modal.style.display === 'block' && prevBtn.style.display === 'block') {
      if (event.key === 'ArrowRight') {
        showNextImage();
      } else if (event.key === 'ArrowLeft') {
        showPrevImage();
      } else if (event.key === 'Escape') {
        closeModalHandler();
      }
    }
    else if (modal.style.display === 'block' && event.key === 'Escape') {
      closeModalHandler();
    }
  });
});

// Brevo form handles submission automatically
