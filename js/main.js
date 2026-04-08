'use strict';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const header = document.getElementById('site-header');

function updateHeader() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const burger   = document.getElementById('nav-burger');
const navLinks = document.getElementById('nav-links');

burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

const revealEls = document.querySelectorAll('.reveal, .fade-up');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

function initImages() {
  const images = document.querySelectorAll('img[src]');
  images.forEach(img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('loaded');
      return;
    }
    img.addEventListener('load', () => img.classList.add('loaded'));
    img.addEventListener('error', () => {
      img.style.opacity = '0';
    });
  });
}
initImages();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showFormMessage('Please fill in your name, email and message.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      showFormMessage(
        'Thank you! Your message has been sent. Angela will be in touch within 24 hours.',
        'success'
      );
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1200);
  });
}

function showFormMessage(text, type) {
  const existing = form.querySelector('.form__msg');
  if (existing) existing.remove();

  const msg = document.createElement('p');
  msg.className = 'form__msg';
  msg.textContent = text;
  msg.style.cssText = `
    font-size: 0.85rem;
    padding: 0.85rem 1rem;
    border-radius: 4px;
    margin-top: 0.75rem;
    text-align: center;
    background: ${type === 'success' ? '#edf5ea' : '#fdf0f0'};
    color: ${type === 'success' ? '#3a6b32' : '#8b2525'};
    border: 1px solid ${type === 'success' ? '#b8d9b2' : '#f0b8b8'};
  `;
  form.appendChild(msg);

  if (type === 'success') {
    setTimeout(() => msg.remove(), 6000);
  }
}

const sections   = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav__link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle(
            'active',
            a.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));
