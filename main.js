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

//

// Schedule filtering functionality
document.addEventListener('DOMContentLoaded', function () {
  const scheduleFilters = document.querySelectorAll('.schedule-filter');
  const scheduleCards = document.querySelectorAll('.schedule-card');
  const scheduleDayGroups = document.querySelectorAll('.schedule-day-group');
  const scheduleEmpty = document.querySelector('.schedule-empty');

  // Highlight current day
  function highlightCurrentDay() {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const today = new Date().getDay();
    const todayName = days[today];

    scheduleDayGroups.forEach((group) => {
      const day = group.getAttribute('data-day');
      if (day === todayName) {
        group.classList.add('active-day');
        const title = group.querySelector('.schedule-day-title');
        if (title && !title.querySelector('.current-day-indicator')) {
          const indicator = document.createElement('span');
          indicator.className = 'current-day-indicator';
          indicator.textContent = 'Сегодня';
          title.appendChild(indicator);
        }
      }
    });
  }

  // Filter schedule
  function filterSchedule(filter) {
    let hasVisibleCards = false;
    let hasVisibleDays = false;

    scheduleCards.forEach((card) => {
      const cardType = card.getAttribute('data-type');

      if (filter === 'all' || cardType === filter) {
        card.classList.remove('hidden');
        hasVisibleCards = true;
      } else {
        card.classList.add('hidden');
      }
    });

    // Show/hide day groups based on visible cards
    scheduleDayGroups.forEach((group) => {
      const dayCards = group.querySelectorAll('.schedule-card');
      const visibleDayCards = group.querySelectorAll(
        '.schedule-card:not(.hidden)',
      );

      if (visibleDayCards.length > 0) {
        group.classList.remove('hidden');
        hasVisibleDays = true;
      } else {
        group.classList.add('hidden');
      }
    });

    // Show empty state if no cards visible
    if (hasVisibleDays) {
      scheduleEmpty.classList.remove('visible');
    } else {
      scheduleEmpty.classList.add('visible');
    }
  }

  // Initialize filters
  scheduleFilters.forEach((filter) => {
    filter.addEventListener('click', function () {
      const filterValue = this.getAttribute('data-filter');

      // Update active filter
      scheduleFilters.forEach((f) => f.classList.remove('active'));
      this.classList.add('active');

      // Apply filter
      filterSchedule(filterValue);
    });
  });

  // Mobile filter enhancement
  function initMobileFilters() {
    if (window.innerWidth <= 768) {
      scheduleFilters.forEach((filter) => {
        filter.setAttribute('aria-label', `Показать ${filter.textContent}`);
      });
    }
  }

  // Keyboard navigation for filters
  function initKeyboardNavigation() {
    scheduleFilters.forEach((filter, index) => {
      filter.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % scheduleFilters.length;
          scheduleFilters[nextIndex].focus();
        }

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex =
            (index - 1 + scheduleFilters.length) % scheduleFilters.length;
          scheduleFilters[prevIndex].focus();
        }
      });
    });
  }

  // Initialize
  highlightCurrentDay();
  initMobileFilters();
  initKeyboardNavigation();

  // Re-initialize on resize
  window.addEventListener('resize', initMobileFilters);

  // Add empty state message if not exists
  if (!scheduleEmpty) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'schedule-empty';
    emptyDiv.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 20px;">🥊</div>
      <h3 style="color: #ffffff; margin-bottom: 10px;">Тренировки не найдены</h3>
      <p>Попробуйте выбрать другой фильтр</p>
    `;
    document.querySelector('.schedule-cards').appendChild(emptyDiv);
  }
});

// Additional utility functions for schedule
function getTodaySchedule() {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  const today = new Date().getDay();
  const todayName = days[today];

  return document.querySelector(`.schedule-day-group[data-day="${todayName}"]`);
}

function scrollToToday() {
  const todaySchedule = getTodaySchedule();
  if (todaySchedule) {
    todaySchedule.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

// Export functions for global access (if needed)
window.scheduleUtils = {
  filterSchedule: function (filter) {
    const filterBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (filterBtn) filterBtn.click();
  },
  showToday: function () {
    scrollToToday();
  },
  showAll: function () {
    const allFilter = document.querySelector('[data-filter="all"]');
    if (allFilter) allFilter.click();
  },
};
