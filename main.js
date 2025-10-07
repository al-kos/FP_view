// ===== MOBILE MENU MODULE =====
const MobileMenu = {
  init() {
    this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
    this.mobileMenuClose = document.getElementById('mobileMenuClose');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.navLinks = document.querySelectorAll('.nav__link');
    this.mobileLogoLink = document.getElementById('mobileLogoLink');

    this.setupEventListeners();
  },

  setupEventListeners() {
    // Open mobile menu
    this.mobileMenuBtn.addEventListener('click', () => {
      this.mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // Close mobile menu
    this.mobileMenuClose.addEventListener('click', () => {
      this.closeMenu();
    });

    // Close mobile menu when clicking on links
    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Close mobile menu when clicking on logo link
    if (this.mobileLogoLink) {
      this.mobileLogoLink.addEventListener('click', () => {
        this.closeMenu();
      });
    }

    // Close mobile menu when clicking outside
    this.mobileMenu.addEventListener('click', (e) => {
      if (e.target === this.mobileMenu) {
        this.closeMenu();
      }
    });
  },

  closeMenu() {
    this.mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  },
};

// ===== SCROLL ANIMATIONS MODULE =====
const ScrollAnimations = {
  init() {
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
    this.triggerInitialAnimations();
  },

  setupIntersectionObserver() {
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
  },

  setupSmoothScrolling() {
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
  },

  triggerInitialAnimations() {
    setTimeout(() => {
      document.querySelectorAll('.fade-in-up').forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
          element.classList.add('visible');
        }
      });
    }, 100);
  },
};

// ===== SCHEDULE MANAGER MODULE =====
const ScheduleManager = {
  init() {
    this.scheduleFilters = document.querySelectorAll('.schedule-filter');
    this.scheduleCards = document.querySelectorAll('.schedule-card');
    this.scheduleDayGroups = document.querySelectorAll('.schedule-day-group');
    this.scheduleEmpty = document.querySelector('.schedule-empty');

    this.setupFilters();
    this.highlightCurrentDay();
    this.setupAccessibility();

    this.activateAllFilter();
  },

  activateAllFilter() {
    const allFilter = document.querySelector('[data-filter="all"]');
    if (allFilter) {
      this.setActiveFilter(allFilter);
      this.filterSchedule('all');
    }
  },

  setupFilters() {
    this.scheduleFilters.forEach((filter) => {
      filter.addEventListener('click', () => {
        const filterValue = filter.getAttribute('data-filter');
        this.setActiveFilter(filter);
        this.filterSchedule(filterValue);
      });
    });
  },

  setActiveFilter(activeFilter) {
    this.scheduleFilters.forEach((f) => f.classList.remove('active'));
    activeFilter.classList.add('active');
  },

  filterSchedule(filter) {
    let hasVisibleDays = false;

    // Filter cards
    this.scheduleCards.forEach((card) => {
      const cardType = card.getAttribute('data-type');
      const shouldShow = filter === 'all' || cardType === filter;

      if (shouldShow) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    // Show/hide day groups based on visible cards
    this.scheduleDayGroups.forEach((group) => {
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
      this.scheduleEmpty?.classList.remove('visible');
    } else {
      this.scheduleEmpty?.classList.add('visible');
    }
  },

  highlightCurrentDay() {
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

    this.scheduleDayGroups.forEach((group) => {
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
  },

  setupAccessibility() {
    // Mobile filter enhancement
    if (window.innerWidth <= 768) {
      this.scheduleFilters.forEach((filter) => {
        filter.setAttribute('aria-label', `Показать ${filter.textContent}`);
      });
    }

    // Keyboard navigation
    this.scheduleFilters.forEach((filter, index) => {
      filter.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          filter.click();
        }

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % this.scheduleFilters.length;
          this.scheduleFilters[nextIndex].focus();
        }

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex =
            (index - 1 + this.scheduleFilters.length) %
            this.scheduleFilters.length;
          this.scheduleFilters[prevIndex].focus();
        }
      });
    });

    // Re-initialize on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.scheduleFilters.forEach((filter) => {
          filter.setAttribute('aria-label', `Показать ${filter.textContent}`);
        });
      }
    });
  },

  createEmptyState() {
    if (!this.scheduleEmpty) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'schedule-empty';
      emptyDiv.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">🥊</div>
        <h3 style="color: #ffffff; margin-bottom: 10px;">Тренировки не найдены</h3>
        <p>Попробуйте выбрать другой фильтр</p>
      `;
      document.querySelector('.schedule-cards').appendChild(emptyDiv);
      this.scheduleEmpty = emptyDiv;
    }
  },
};

// ===== UTILITY FUNCTIONS =====
const ScheduleUtils = {
  getTodaySchedule() {
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

    return document.querySelector(
      `.schedule-day-group[data-day="${todayName}"]`,
    );
  },

  scrollToToday() {
    const todaySchedule = this.getTodaySchedule();
    if (todaySchedule) {
      todaySchedule.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  },

  filterSchedule(filter) {
    const filterBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (filterBtn) filterBtn.click();
  },

  showToday() {
    this.scrollToToday();
  },

  showAll() {
    const allFilter = document.querySelector('[data-filter="all"]');
    if (allFilter) allFilter.click();
  },
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize modules
  MobileMenu.init();
  ScrollAnimations.init();
  ScheduleManager.init();

  // Add loading class for better UX
  document.body.classList.add('loaded');

  // Create empty state for schedule if needed
  ScheduleManager.createEmptyState();

  // Update current year in footer
  updateCurrentYear();
});

// ===== GLOBAL EXPORTS =====
window.scheduleUtils = ScheduleUtils;

// ===== CURRENT YEAR UPDATE =====
function updateCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
