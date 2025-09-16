// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav__link');

// Open mobile menu
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.add('active');
  document.body.style.overflow = 'hidden';
});

// Close mobile menu
mobileMenuClose.addEventListener('click', () => {
  mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
});

// Close mobile menu when clicking on links
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close mobile menu when clicking on logo link
const mobileLogoLink = document.getElementById('mobileLogoLink');
if (mobileLogoLink) {
  mobileLogoLink.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
}

// Close mobile menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all elements with fade-in-up class
document.querySelectorAll('.fade-in-up').forEach((element) => {
  observer.observe(element);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  });
});

// Header scroll behavior
// let lastScrollTop = 0;
// const header = document.querySelector('.header');

// window.addEventListener('scroll', () => {
//   const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

//   if (scrollTop > lastScrollTop && scrollTop > 100) {
//     header.style.transform = 'translateY(-100%)';
//   } else {
//     header.style.transform = 'translateY(0)';
//   }

//   lastScrollTop = scrollTop;
// });

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Here you would typically send the form data to a server
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData);

    console.log('Form submitted:', formObject);

    // Show success message (you can replace this with a proper notification)
    alert(
      'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.',
    );
    this.reset();
  });
}

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', function () {
  // Trigger initial animations
  setTimeout(() => {
    document.querySelectorAll('.fade-in-up').forEach((element) => {
      if (element.getBoundingClientRect().top < window.innerHeight) {
        element.classList.add('visible');
      }
    });
  }, 100);

  // Add loading class for better UX
  document.body.classList.add('loaded');
});
