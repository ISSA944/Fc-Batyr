/* =============================================
   FC BATYR — app.js (Premium Edition)
   Modern, Responsive Footer Academy Website
   ============================================= */

// ── PRELOADER
setTimeout(() => {
  const pre = document.getElementById('preloader');
  if (pre) pre.classList.add('hidden');
}, 1800);

// ── HEADER — scroll behavior: hide on down, show on up, add gold border when scrolled
(function() {
  const hdr = document.querySelector('.site-header');
  if (!hdr) return;
  
  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        
        // Add 'scrolled' class when scrolled past 50px
        if (y > 50) {
          hdr.classList.add('scrolled');
        } else {
          hdr.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll direction
        if (y > 200) {
          if (y > lastY) {
            // Scrolling DOWN - hide header
            hdr.classList.add('hide-up');
          } else {
            // Scrolling UP - show header
            hdr.classList.remove('hide-up');
          }
        } else {
          hdr.classList.remove('hide-up');
        }
        
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── BURGER MENU
(function() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('slideNav');
  const overlay = document.getElementById('navOverlay');
  
  if (!burger || !nav || !overlay) return;

  const openMenu = () => {
    burger.classList.add('open');
    nav.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Toggle on burger click
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    burger.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close on overlay click
  overlay.addEventListener('click', closeMenu);

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
  });
})();

// ── SCROLL REVEAL ANIMATIONS
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('[data-reveal]').forEach(el => {
    observer.observe(el);
  });
})();

// ── FORM VALIDATION & SUBMISSION
(function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Validation rules
  const rules = {
    fullName: {
      required: true,
      min: 2,
      errorMsg: 'Full name must be at least 2 characters'
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMsg: 'Please enter a valid email address'
    },
    phone: {
      required: true,
      pattern: /^[\d\s\+\-\(\)]{10,}$/,
      errorMsg: 'Please enter a valid phone number'
    },
    age: {
      required: true,
      errorMsg: 'Please select an age group'
    },
    message: {
      required: true,
      min: 5,
      errorMsg: 'Message must be at least 5 characters'
    }
  };

  // Validate single field
  function validateField(name, value) {
    const rule = rules[name];
    if (!rule) return { valid: true };

    value = value.trim();

    if (rule.required && !value) {
      return { valid: false, message: rule.errorMsg };
    }

    if (value && rule.min && value.length < rule.min) {
      return { valid: false, message: rule.errorMsg };
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return { valid: false, message: rule.errorMsg };
    }

    return { valid: true };
  }

  // Update field styling
  function updateField(input) {
    const field = input.closest('.field');
    if (!field) return;

    const result = validateField(input.name, input.value);
    const errorEl = field.querySelector('.field-error');

    if (result.valid) {
      field.classList.remove('invalid');
      if (errorEl) errorEl.textContent = '';
    } else {
      field.classList.add('invalid');
      if (errorEl) errorEl.textContent = result.message;
    }

    return result.valid;
  }

  // Live validation on blur
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', () => updateField(input));
    input.addEventListener('input', () => {
      const field = input.closest('.field');
      if (field && field.classList.contains('invalid')) {
        updateField(input);
      }
    });
  });

  // Submit handler
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    form.querySelectorAll('input, select, textarea').forEach(input => {
      if (!updateField(input)) allValid = false;
    });

    if (!allValid) return;

    const submitBtn = form.querySelector('.submit-btn');
    const statusEl = document.getElementById('formStatus');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    try {
      // Prepare form data
      const formData = new FormData(form);
      
      // Send to Web3Forms (you can change the endpoint)
      // For now, we'll just show a success message
      // If you have a backend, replace this with your API endpoint
      
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 800));

      statusEl.className = 'form-status ok';
      statusEl.textContent = '✓ Thank you! We\'ll be in touch soon.';
      form.reset();
      form.querySelectorAll('.field').forEach(f => f.classList.remove('invalid'));

    } catch (error) {
      statusEl.className = 'form-status error';
      statusEl.textContent = '✗ Error sending form. Please try again.';
      console.error('Form submission error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
})();

// ── SCROLL TO SMOOTH
(function() {
  document.docume

nt.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
      const id = e.target.getAttribute('href').substring(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, true);
})();
