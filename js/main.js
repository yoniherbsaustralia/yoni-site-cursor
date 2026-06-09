/* ============================================
   YONI HERBS AUSTRALIA - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileMenu();
  initHeaderScroll();
  initScrollAnimations();
  initFAQ();
  initSmoothScroll();
  initFormValidation();
});

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Mobile dropdown toggle
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });
}

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  if (animatedElements.length === 0) return;
  
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
  
  animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    }
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        if (navLinks?.classList.contains('active')) {
          navLinks.classList.remove('active');
          menuToggle?.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });
}

/* ============================================
   FORM VALIDATION
   ============================================ */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      // Clear previous errors
      form.querySelectorAll('.form-error').forEach(el => el.remove());
      form.querySelectorAll('.form-input, .form-textarea').forEach(el => {
        el.style.borderColor = '';
      });
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          showFieldError(field, 'This field is required');
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          isValid = false;
          showFieldError(field, 'Please enter a valid email address');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      } else {
        // Show success message (for demo purposes)
        e.preventDefault();
        showFormSuccess(form);
      }
    });
  });
}

function showFieldError(field, message) {
  field.style.borderColor = '#e74c3c';
  const error = document.createElement('span');
  error.className = 'form-error';
  error.style.cssText = 'color: #e74c3c; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
  error.textContent = message;
  field.parentNode.appendChild(error);
}

function showFormSuccess(form) {
  const successMessage = document.createElement('div');
  successMessage.className = 'form-success';
  successMessage.style.cssText = `
    background: linear-gradient(135deg, #d4a853 0%, #e8c875 100%);
    color: #0a1628;
    padding: 1.5rem;
    border-radius: 0.5rem;
    text-align: center;
    font-weight: 600;
    margin-top: 1rem;
  `;
  successMessage.innerHTML = `
    <p style="margin: 0;">Thank you for your message!</p>
    <p style="margin: 0.5rem 0 0; font-weight: 400; font-size: 0.875rem;">We'll get back to you within 24-48 hours.</p>
  `;
  
  form.reset();
  form.appendChild(successMessage);
  
  setTimeout(() => {
    successMessage.remove();
  }, 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
