// ============================================
// Sahi Nutrition — Animation & Scroll System
// ============================================
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ---- Lenis Smooth Scroll ----
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  syncTouch: true,
});

// Sync Lenis with GSAP ticker for unified animation loop
gsap.ticker.add((time: number) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ---- ScrollTrigger Defaults ----
ScrollTrigger.defaults({
  toggleActions: 'play none none reverse',
});

// ---- Utility: Animate elements on scroll ----
function initScrollAnimations() {
  // Fade Up animations
  gsap.utils.toArray<HTMLElement>('.gsap-fade-up').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 20%',
        },
      }
    );
  });

  // Fade Left animations
  gsap.utils.toArray<HTMLElement>('.gsap-fade-left').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      }
    );
  });

  // Fade Right animations
  gsap.utils.toArray<HTMLElement>('.gsap-fade-right').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      }
    );
  });

  // Staggered card reveals
  gsap.utils.toArray<HTMLElement>('.gsap-stagger-parent').forEach((parent) => {
    const children = parent.querySelectorAll('.gsap-stagger-child');
    gsap.fromTo(children,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: parent,
          start: 'top 80%',
        },
      }
    );
  });

  // Scale-in animations
  gsap.utils.toArray<HTMLElement>('.gsap-scale-in').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      }
    );
  });

  // Section dividers
  gsap.utils.toArray<HTMLElement>('.section-divider').forEach((el) => {
    gsap.fromTo(el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
      }
    );
  });
}

// ---- Navbar scroll effect ----
function initNavbar() {
  const nav = document.querySelector('.navbar') as HTMLElement;
  if (!nav) return;

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      if (self.direction === 1 && self.scroll() > 80) {
        nav.classList.add('navbar--scrolled');
      }
      if (self.scroll() <= 80) {
        nav.classList.remove('navbar--scrolled');
      }
    },
  });
}

// ---- Hero Section Animations ----
function initHeroAnimations() {
  const tl = gsap.timeline({ delay: 0.3 });
  
  tl.fromTo('.hero__label',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  )
  .fromTo('.hero__title',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    '-=0.3'
  )
  .fromTo('.hero__subtitle',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    '-=0.4'
  )
  .fromTo('.hero__cta',
    { opacity: 0, y: 20, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
    '-=0.3'
  )
  .fromTo('.hero__image',
    { opacity: 0, scale: 0.9, x: 30 },
    { opacity: 1, scale: 1, x: 0, duration: 1, ease: 'power3.out' },
    '-=0.6'
  );

  // Parallax on hero image
  gsap.to('.hero__image', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // Scroll indicator bounce
  gsap.to('.hero__scroll-indicator', {
    y: 10,
    duration: 1.5,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
  });
}

// ---- "Are You Ready?" Section ----
function initReadySection() {
  const readyTitle = document.querySelector('.ready__title');
  if (!readyTitle) return;

  // Split text into words for animation
  const words = readyTitle.textContent?.split(' ') || [];
  readyTitle.innerHTML = words.map(word => `<span class="ready__word">${word}</span>`).join(' ');

  gsap.fromTo('.ready__word',
    { opacity: 0, y: 80, rotationX: 45 },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.ready',
        start: 'top 60%',
        end: 'center center',
        scrub: false,
      },
    }
  );
}

// ---- Smooth scroll to anchor ----
function initSmoothNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector((anchor as HTMLAnchorElement).getAttribute('href')!);
      if (target) {
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      }
    });
  });
}

// ---- Counter Animation ----
export function animateCounter(el: HTMLElement, target: number, duration: number = 2) {
  const obj = { value: 0 };
  gsap.to(obj, {
    value: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = Math.round(obj.value).toLocaleString();
    },
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      once: true,
    },
  });
}

// ---- Initialize Everything ----
export function initAnimations() {
  initNavbar();
  initHeroAnimations();
  initScrollAnimations();
  initReadySection();
  initSmoothNavigation();
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure all elements are rendered
  requestAnimationFrame(() => {
    initAnimations();
  });
});

export { lenis, gsap, ScrollTrigger };
