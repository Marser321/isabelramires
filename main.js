document.addEventListener('DOMContentLoaded', () => {
  initializeNavbar();
  initializeMobileMenu();
  initializeRegistrationForm();
  initializePricingSimulator();
  initializePromoPlaceholder();
  initializeChat();
  initializeScrollAnimations();
});

const WHATSAPP_NUMBER = '16892311658';

function initializeNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('header[id], section[id], aside[id]');

  const updateNav = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    let currentId = 'inicio';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
}

function initializeMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      toggle.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

function initializeRegistrationForm() {
  const form = document.getElementById('course-registration-form');
  const successPanel = document.getElementById('registration-success');
  const whatsappLink = document.getElementById('registration-whatsapp');
  if (!form || !successPanel || !whatsappLink) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const profile = String(data.get('profile') || '').trim();
    const level = String(data.get('level') || '').trim();
    const goal = String(data.get('goal') || '').trim();

    const message = [
      'Hola Accountant Pro Services, me pre-registré al Curso de QuickBooks y Bookkeeping en USA.',
      `Nombre: ${name}`,
      `Email: ${email}`,
      `WhatsApp: ${phone}`,
      `Perfil: ${profile}`,
      `Nivel: ${level}`,
      `Objetivo: ${goal}`
    ].join('\n');

    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    successPanel.hidden = false;
    form.reset();
    showToast('Pre-registro recibido. APS te contactará por WhatsApp o email.');
    successPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

function initializePricingSimulator() {
  const revenueSelect = document.getElementById('sim-revenue-band');
  const planSelect = document.getElementById('sim-plan');
  const monthlyEl = document.getElementById('sim-monthly');
  const quarterlyEl = document.getElementById('sim-quarterly');
  const annualEl = document.getElementById('sim-annual');
  const planSummary = document.getElementById('sim-plan-summary');
  const includesList = document.getElementById('sim-includes');
  const whatsappLink = document.getElementById('sim-whatsapp');

  if (!revenueSelect || !planSelect || !monthlyEl || !quarterlyEl || !annualEl || !planSummary || !includesList || !whatsappLink) {
    return;
  }

  const pricing = {
    tipoA: {
      label: 'Tipo A: ingresos $0 - $250k',
      prices: {
        basico: 400,
        basicoNomina: 600,
        intermedio: 800,
        intermedioNomina: 1000,
        premium: 1800,
        premiumNomina: 2000
      }
    },
    tipoB: {
      label: 'Tipo B: ingresos $250k - $500k',
      prices: {
        basico: 600,
        basicoNomina: 800,
        intermedio: 1000,
        intermedioNomina: 1200,
        premium: 2000,
        premiumNomina: 2100
      }
    },
    tipoC: {
      label: 'Tipo C: ingresos $500k - $1M',
      prices: {
        basico: 1600,
        basicoNomina: 1800,
        intermedio: 2000,
        intermedioNomina: 2200,
        premium: 3000,
        premiumNomina: 3200
      }
    }
  };

  const plans = {
    basico: {
      label: 'Bookkeeping Básico',
      includes: [
        'Registros contables mensuales',
        'Conciliación bancaria',
        'Estados financieros mensuales'
      ]
    },
    basicoNomina: {
      label: 'Bookkeeping Básico + Nómina',
      includes: [
        'Todo lo incluido en Básico',
        'Procesamiento de nómina para hasta 5 empleados',
        'Soporte mensual de payroll'
      ]
    },
    intermedio: {
      label: 'Bookkeeping Intermedio',
      includes: [
        'Registros y conciliación mensual',
        'Estados financieros mensuales',
        'Consultoría 1 vez al mes'
      ]
    },
    intermedioNomina: {
      label: 'Bookkeeping Intermedio + Nómina',
      includes: [
        'Todo lo incluido en Intermedio',
        'Nómina para hasta 5 empleados',
        'Consultoría mensual'
      ]
    },
    premium: {
      label: 'Bookkeeping Premium',
      includes: [
        'Registros, conciliación y estados financieros',
        'Consultoría 1 vez al mes',
        'Planificación financiera cada 3 meses'
      ]
    },
    premiumNomina: {
      label: 'Bookkeeping Premium + Nómina',
      includes: [
        'Todo lo incluido en Premium',
        'Nómina para hasta 5 empleados',
        'Planificación trimestral'
      ]
    }
  };

  const formatNumber = (value) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

  const updateSimulator = () => {
    const selectedBand = pricing[revenueSelect.value];
    const selectedPlan = plans[planSelect.value];
    const monthly = selectedBand.prices[planSelect.value];
    const quarterly = monthly * 3;
    const annual = monthly * 12;

    planSummary.textContent = selectedPlan.label;
    monthlyEl.textContent = formatNumber(monthly);
    quarterlyEl.textContent = formatNumber(quarterly);
    annualEl.textContent = formatNumber(annual);

    includesList.replaceChildren();
    selectedPlan.includes.forEach((item) => {
      const li = document.createElement('li');
      const icon = document.createElement('i');
      const span = document.createElement('span');
      icon.className = 'fa-solid fa-circle-check';
      span.textContent = item;
      li.append(icon, span);
      includesList.appendChild(li);
    });

    const message = [
      'Hola Accountant Pro Services, quiero una evaluación para servicios de bookkeeping.',
      `Rango: ${selectedBand.label}`,
      `Plan: ${selectedPlan.label}`,
      `Estimado mensual: $${formatNumber(monthly)}`
    ].join('\n');
    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  revenueSelect.addEventListener('change', updateSimulator);
  planSelect.addEventListener('change', updateSimulator);
  updateSimulator();
}

function initializePromoPlaceholder() {
  const button = document.getElementById('promo-video-btn');
  if (!button) return;

  button.addEventListener('click', () => {
    showToast('El video promocional se podrá insertar aquí cuando el cliente lo entregue.');
  });
}

function initializeChat() {
  const toggle = document.getElementById('chat-toggle');
  const close = document.getElementById('chat-close');
  const box = document.getElementById('chat-box');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const body = document.getElementById('chat-body');
  if (!toggle || !close || !box || !form || !input || !body) return;

  toggle.addEventListener('click', () => {
    box.classList.toggle('open');
  });

  close.addEventListener('click', () => {
    box.classList.remove('open');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendChatMessage(body, text, 'sent');
    input.value = '';

    setTimeout(() => {
      appendChatMessage(
        body,
        'Gracias. Para continuar más rápido, usa el botón de WhatsApp o completa el pre-registro del curso.',
        'received'
      );
    }, 800);
  });
}

function appendChatMessage(container, text, type) {
  const message = document.createElement('p');
  message.className = `chat-message ${type}`;
  message.textContent = text;
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}

function initializeScrollAnimations() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  items.forEach((item) => observer.observe(item));
}

function showToast(text) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}
