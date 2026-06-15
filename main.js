/* ==========================================================================
   INTERACTIVE JAVASCRIPT: ACCOUNTANT PRO SERVICES PROTOTYPE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initializeNavbarScroll();
  initializeMobileMenu();
  initializeQuoteCalculator();
  initializeLeadCaptureForms();
  initializeLiveChatSimulator();
  initializeGhlCalendar();
  initializeScrollAnimations();
  initializeServiceModals();
  initializeVideoPlayer();
});

/* ==========================================================================
   NAVBAR SCROLL BEHAVIOR
   ========================================================================== */
function initializeNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, header');

  window.addEventListener('scroll', () => {
    // Background scroll styling
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link on scroll
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
function initializeMobileMenu() {
  const toggleBtn = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link, .nav-cta-btn');

  toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('open');
    const isOpen = menu.classList.contains('open');
    toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ==========================================================================
   INTERACTIVE QUOTE CALCULATOR WITH BREAKDOWN
   ========================================================================== */
function initializeQuoteCalculator() {
  const entityRadios = document.querySelectorAll('input[name="entity-type"]');
  const transactionRange = document.getElementById('transaction-range');
  const transactionCount = document.getElementById('transaction-count');
  const payrollCheck = document.getElementById('calc-payroll');
  const salesTaxCheck = document.getElementById('calc-sales-tax');
  const priceOutput = document.getElementById('price-output');

  // Breakdown fields
  const breakdownEntity = document.getElementById('breakdown-entity');
  const breakdownTx = document.getElementById('breakdown-tx');
  const breakdownPayroll = document.getElementById('breakdown-payroll');
  const breakdownSales = document.getElementById('breakdown-sales');

  // Action buttons
  const btnSaveQuote = document.getElementById('btn-save-quote');
  const btnShareWhatsapp = document.getElementById('btn-share-whatsapp');

  // Base prices per entity
  const basePrices = {
    llc: 150,
    scorp: 250,
    ccorp: 300
  };

  const entityLabels = {
    llc: 'LLC (Unipersonal)',
    scorp: 'S-Corp / LLC Multi',
    ccorp: 'C-Corporación'
  };

  // Transaction multiplication factor
  const transactionMultipliers = {
    1: 1.0,  // 1-50 transactions
    2: 1.4,  // 51-150 transactions
    3: 1.8,  // 151-300 transactions
    4: 2.5   // 300+ transactions
  };

  const transactionRangesText = {
    1: '1-50',
    2: '51-150',
    3: '151-300',
    4: '300+'
  };

  function calculateQuote() {
    // Get active entity type
    let activeEntity = 'llc';
    entityRadios.forEach(radio => {
      if (radio.checked) activeEntity = radio.value;
    });

    const basePrice = basePrices[activeEntity];
    
    // Get transaction value multiplier
    const rangeVal = parseInt(transactionRange.value);
    transactionCount.textContent = transactionRangesText[rangeVal];
    const multiplier = transactionMultipliers[rangeVal];

    let total = basePrice * multiplier;

    // Additional modules
    if (payrollCheck.checked) {
      total += 75; // Payroll service flat module
    }
    if (salesTaxCheck.checked) {
      total += 50; // Sales Tax filing flat module
    }

    // Update breakdown UI
    if (breakdownEntity) breakdownEntity.textContent = entityLabels[activeEntity];
    if (breakdownTx) breakdownTx.textContent = transactionRangesText[rangeVal];
    if (breakdownPayroll) breakdownPayroll.textContent = payrollCheck.checked ? 'Incluido (+$75)' : 'No Incluido';
    if (breakdownSales) breakdownSales.textContent = salesTaxCheck.checked ? 'Incluido (+$50)' : 'No Incluido';

    // Dynamic ticking display effect
    animatePriceDisplay(Math.round(total));
  }

  let animationInterval;
  function animatePriceDisplay(targetPrice) {
    clearInterval(animationInterval);
    const currentPrice = parseInt(priceOutput.textContent) || 0;
    if (currentPrice === targetPrice) return;

    let step = currentPrice < targetPrice ? 5 : -5;
    let current = currentPrice;

    animationInterval = setInterval(() => {
      current += step;
      if ((step > 0 && current >= targetPrice) || (step < 0 && current <= targetPrice)) {
        current = targetPrice;
        clearInterval(animationInterval);
      }
      priceOutput.textContent = current;
    }, 15);
  }

  // Bind Events
  entityRadios.forEach(radio => radio.addEventListener('change', calculateQuote));
  transactionRange.addEventListener('input', calculateQuote);
  payrollCheck.addEventListener('change', calculateQuote);
  salesTaxCheck.addEventListener('change', calculateQuote);

  // Action handlers
  if (btnSaveQuote) {
    btnSaveQuote.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnShareWhatsapp) {
    btnShareWhatsapp.addEventListener('click', () => {
      let activeEntity = 'llc';
      entityRadios.forEach(radio => { if (radio.checked) activeEntity = radio.value; });
      const rangeVal = parseInt(transactionRange.value);
      const payroll = payrollCheck.checked ? 'Sí' : 'No';
      const sales = salesTaxCheck.checked ? 'Sí' : 'No';
      const total = priceOutput.textContent;
      
      const text = `Hola Isabel, realicé una cotización de mis servicios en tu web:\n` +
                   `- Estructura: ${entityLabels[activeEntity]}\n` +
                   `- Transacciones mensuales: ${transactionRangesText[rangeVal]}\n` +
                   `- Procesamiento de Nómina: ${payroll}\n` +
                   `- Impuestos de Venta: ${sales}\n` +
                   `Total estimado: $${total}/mes. ¿Podemos programar una llamada de evaluación?`;
      
      window.open(`https://wa.me/16892311658?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  // Run initial calculation
  calculateQuote();
}

/* ==========================================================================
   LEAD CAPTURE FORMS (GHL CRM SIMULATOR)
   ========================================================================== */
function initializeLeadCaptureForms() {
  const forms = [
    { id: 'hero-lead-form', type: 'Consulta Inicial Hero' },
    { id: 'calc-lead-form', type: 'Consulta con Cotización Asegurada' },
    { id: 'lead-magnet-form', type: 'Descarga de Curso Gratis de Crédito' },
    { id: 'referral-form', type: 'Programa de Referidos' }
  ];

  forms.forEach(formConfig => {
    const formElement = document.getElementById(formConfig.id);
    if (!formElement) return;

    formElement.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Capture details
      let detailsText = `Tipo: ${formConfig.type}\n`;
      const inputs = formElement.querySelectorAll('input');
      inputs.forEach(input => {
        if (input.placeholder) {
          detailsText += `${input.placeholder}: ${input.value}\n`;
        } else if (input.id) {
          detailsText += `${input.id}: ${input.value}\n`;
        }
      });

      // Show stylized alert representing CRM injection
      showCrmNotification(formConfig.type, inputs[0]?.value || 'Prospecto');
      formElement.reset();

      // Special action for Lead Magnet: Open video modal automatically
      if (formConfig.id === 'lead-magnet-form') {
        const videoModal = document.getElementById('modal-video-magnet');
        if (videoModal) {
          videoModal.classList.add('open');
          document.body.style.overflow = 'hidden';
        }
      }

      // Reset calculator quote display if it's the calculator form
      if (formConfig.id === 'calc-lead-form') {
        const priceOutput = document.getElementById('price-output');
        if (priceOutput) priceOutput.textContent = '150';
      }
    });
  });
}

function showCrmNotification(type, name) {
  // Create HTML container for GHL simulation toast
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%) translateY(100px)';
  toast.style.background = '#0d2c54';
  toast.style.border = '2px solid #d4af37';
  toast.style.borderRadius = '12px';
  toast.style.padding = '20px';
  toast.style.color = '#ffffff';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.3)';
  toast.style.zIndex = '99999';
  toast.style.minWidth = '320px';
  toast.style.maxWidth = '450px';
  toast.style.transition = 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
  toast.style.fontFamily = "'Outfit', sans-serif";

  toast.innerHTML = `
    <div style="display: flex; gap: 15px; align-items: center;">
      <div style="font-size: 26px; color: #d4af37;"><i class="fa-solid fa-cloud-arrow-up"></i></div>
      <div>
        <h4 style="margin: 0; font-size: 16px; color: #ffffff;">¡Simulación GHL CRM Exitosa!</h4>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #ccd6f6;">Lead <strong>${name}</strong> ingresado en pipeline de: <br><em>${type}</em>.</p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #2ec4b6;"><i class="fa-solid fa-circle-check"></i> Workflows automáticos activados.</p>
      </div>
    </div>
  `;

  document.body.appendChild(toast);

  // Trigger animation in
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 100);

  // Trigger animation out and remove
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(150px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 500);
  }, 6000);
}

/* ==========================================================================
   GO HIGH LEVEL LIVE CHAT WIDGET SIMULATOR
   ========================================================================== */
function initializeLiveChatSimulator() {
  const chatBtn = document.getElementById('ghl-chat-btn');
  const chatClose = document.getElementById('chat-close');
  const chatBox = document.getElementById('ghl-chat-box');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatBody = document.getElementById('chat-body');

  chatBtn.addEventListener('click', () => {
    chatBox.classList.toggle('open');
  });

  chatClose.addEventListener('click', () => {
    chatBox.classList.remove('open');
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userMsgText = chatInput.value.trim();
    if (!userMsgText) return;

    // 1. Add user message to UI
    appendChatMessage('sent', userMsgText);
    chatInput.value = '';

    // Scroll chat body to bottom
    chatBody.scrollTop = chatBody.scrollHeight;

    // 2. Simulate typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-msg received';
    typingIndicator.id = 'typing-indicator';
    typingIndicator.innerHTML = '<span style="color: #8892b0; font-style: italic;"><i class="fa-solid fa-ellipsis fa-bounce"></i> Isabel está escribiendo...</span>';
    setTimeout(() => {
      chatBody.appendChild(typingIndicator);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);

    // 3. Add automated professional response after 2 seconds
    setTimeout(() => {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) indicator.remove();

      const automatedResponse = `¡Hola! He recibido tu consulta: "${userMsgText}". En un momento te responderé de forma personalizada vía WhatsApp o llamada telefónica al número que tienes registrado en este navegador. ¡Hablamos en un segundo!`;
      appendChatMessage('received', automatedResponse);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 2200);
  });
}

function appendChatMessage(sender, text) {
  const chatBody = document.getElementById('chat-body');
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;
  msgDiv.innerHTML = `<p>${text}</p>`;
  chatBody.appendChild(msgDiv);
}

/* ==========================================================================
   DYNAMIC GO HIGH LEVEL BOOKING CALENDAR (REAL DATES)
   ========================================================================== */
function initializeGhlCalendar() {
  const calendarDaysContainer = document.getElementById('calendar-days');
  const selectedDateText = document.getElementById('selected-date-text');
  const timeSlotsContainer = document.getElementById('time-slots-container');
  const slotButtons = document.querySelectorAll('.slot-btn');
  const confirmBookingBtn = document.getElementById('confirm-booking-btn');
  const calendarMonthText = document.querySelector('.calendar-month');

  const now = new Date();
  let currentMonth = now.getMonth(); // 0-11
  let currentYear = now.getFullYear();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  function renderCalendar(month, year) {
    if (calendarMonthText) {
      calendarMonthText.textContent = `${monthNames[month]} ${year}`;
    }

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Day of week offset (0 = Sunday, 1 = Monday, etc.)
    // We adjust it so Sunday is index 0
    let dayOfWeek = firstDay.getDay();

    // Total days in month
    const totalDays = new Date(year, month + 1, 0).getDate();
    const daysLayout = [];

    // Generate offsets (inactive slots)
    for (let i = 0; i < dayOfWeek; i++) {
      daysLayout.push('<span class="inactive"></span>');
    }

    // Generate active days
    const today = now.getDate();
    const isCurrentMonthYear = now.getMonth() === month && now.getFullYear() === year;

    for (let d = 1; d <= totalDays; d++) {
      const thisDate = new Date(year, month, d);
      const dayIndex = thisDate.getDay();
      const isWeekend = dayIndex === 0 || dayIndex === 6; // Sunday = 0, Saturday = 6
      const isPast = isCurrentMonthYear && d < today;

      if (isPast || isWeekend) {
        daysLayout.push(`<span class="inactive">${d}</span>`);
      } else {
        daysLayout.push(`<span class="available" data-day="${d}" data-month="${month}" data-year="${year}">${d}</span>`);
      }
    }

    calendarDaysContainer.innerHTML = daysLayout.join('');
  }

  renderCalendar(currentMonth, currentYear);

  // Month navigation
  const prevBtn = document.querySelector('.calendar-nav-buttons button:first-child');
  const nextBtn = document.querySelector('.calendar-nav-buttons button:last-child');

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Prevent scrolling past the current month
      const minMonth = now.getMonth();
      const minYear = now.getFullYear();
      if (currentYear > minYear || (currentYear === minYear && currentMonth > minMonth)) {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
        timeSlotsContainer.style.display = 'none';
        confirmBookingBtn.style.display = 'none';
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar(currentMonth, currentYear);
      timeSlotsContainer.style.display = 'none';
      confirmBookingBtn.style.display = 'none';
    });
  }

  // Day Selection Event
  calendarDaysContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (!target.classList.contains('available')) return;

    // Deselect other days
    const activeDay = calendarDaysContainer.querySelector('.selected');
    if (activeDay) activeDay.classList.remove('selected');

    // Select this day
    target.classList.add('selected');
    
    // Update labels and reveal time slots
    const day = target.getAttribute('data-day');
    const month = parseInt(target.getAttribute('data-month'));
    const year = target.getAttribute('data-year');
    
    selectedDateText.textContent = `${day} de ${monthNames[month]}, ${year}`;
    timeSlotsContainer.style.display = 'block';
    confirmBookingBtn.style.display = 'none';

    // Deselect active time slots
    slotButtons.forEach(btn => btn.classList.remove('active'));
  });

  // Time Slot Selection Event
  slotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      slotButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      confirmBookingBtn.style.display = 'block';
    });
  });

  // Booking Confirmation Event
  confirmBookingBtn.addEventListener('click', () => {
    const activeDay = calendarDaysContainer.querySelector('.selected');
    const activeSlot = timeSlotsContainer.querySelector('.slot-btn.active');
    if (!activeDay || !activeSlot) return;

    const day = activeDay.getAttribute('data-day');
    const month = parseInt(activeDay.getAttribute('data-month'));
    const year = activeDay.getAttribute('data-year');
    const slot = activeSlot.textContent;

    showCrmNotification(
      'Cita Agendada en Calendario GHL',
      `Asesoría para el ${day} de ${monthNames[month]}, ${year} a las ${slot}`
    );

    // Reset calendar selection state
    activeDay.classList.remove('selected');
    slotButtons.forEach(b => b.classList.remove('active'));
    timeSlotsContainer.style.display = 'none';
    confirmBookingBtn.style.display = 'none';
  });
}

/* ==========================================================================
   VIEWPORT SCROLL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initializeScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Animates once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    elements.forEach(el => el.classList.add('revealed'));
  }
}

/* ==========================================================================
   SERVICE DETAILS MODALS SYSTEM
   ========================================================================== */
function initializeServiceModals() {
  const openButtons = document.querySelectorAll('.open-service-modal');
  const closeButtons = document.querySelectorAll('.modal-close-btn');
  const actionCloseButtons = document.querySelectorAll('.close-modal-action-btn');
  const overlays = document.querySelectorAll('.modal-overlay');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service');
      const targetModal = document.getElementById(`modal-${service}`);
      if (targetModal) {
        targetModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Disable background scroll
      }
    });
  });

  function closeAllModals() {
    overlays.forEach(overlay => {
      overlay.classList.remove('open');
    });
    document.body.style.overflow = ''; // Restore scroll
  }

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  actionCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        setTimeout(() => {
          const targetEl = document.querySelector(href);
          if (targetEl) {
            window.scrollTo({
              top: targetEl.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }, 400);
      }
    });
  });

  // Close when clicking overlay backdrop
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAllModals();
      }
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

/* ==========================================================================
   INTERACTIVE VIDEO COURSE PLAYER (MOCK DATA)
   ========================================================================== */
function initializeVideoPlayer() {
  const playOverlayBtn = document.getElementById('video-play-btn');
  const playCtrlBtn = document.getElementById('video-control-play');
  const loadingIndicator = document.getElementById('video-loading');
  const progressBar = document.getElementById('video-progress-bar');
  const progressContainer = document.getElementById('video-progress-container');
  const timeText = document.getElementById('video-time');
  const indexItems = document.querySelectorAll('.video-index-item');
  const currentTitle = document.getElementById('current-video-title');

  let isPlaying = false;
  let duration = 525; // Default: 8:45 in seconds
  let currentTime = 0;
  let playInterval;

  function updateTimeDisplay() {
    const curM = Math.floor(currentTime / 60).toString().padStart(2, '0');
    const curS = Math.floor(currentTime % 60).toString().padStart(2, '0');
    const durM = Math.floor(duration / 60).toString().padStart(2, '0');
    const durS = Math.floor(duration % 60).toString().padStart(2, '0');
    timeText.textContent = `${curM}:${curS} / ${durM}:${durS}`;
  }

  function playVideo() {
    isPlaying = true;
    playOverlayBtn.style.display = 'none';
    playCtrlBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    
    playInterval = setInterval(() => {
      if (currentTime < duration) {
        currentTime += 1;
        const percent = (currentTime / duration) * 100;
        progressBar.style.width = `${percent}%`;
        updateTimeDisplay();
      } else {
        pauseVideo();
        currentTime = 0;
        progressBar.style.width = '0%';
        updateTimeDisplay();
        playOverlayBtn.style.display = 'flex';
      }
    }, 1000);
  }

  function pauseVideo() {
    isPlaying = false;
    clearInterval(playInterval);
    playCtrlBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }

  function togglePlay() {
    if (isPlaying) {
      pauseVideo();
    } else {
      loadingIndicator.style.display = 'flex';
      playOverlayBtn.style.display = 'none';
      setTimeout(() => {
        loadingIndicator.style.display = 'none';
        playVideo();
      }, 800);
    }
  }

  if (playOverlayBtn) playOverlayBtn.addEventListener('click', togglePlay);
  if (playCtrlBtn) playCtrlBtn.addEventListener('click', togglePlay);

  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percent = clickX / width;
      currentTime = Math.floor(percent * duration);
      progressBar.style.width = `${percent * 100}%`;
      updateTimeDisplay();
    });
  }

  indexItems.forEach(item => {
    item.addEventListener('click', () => {
      indexItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const title = item.getAttribute('data-title');
      const timeStr = item.getAttribute('data-duration');
      const parts = timeStr.split(':');
      duration = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      currentTime = 0;
      isPlaying = false;
      clearInterval(playInterval);

      currentTitle.textContent = title;
      progressBar.style.width = '0%';
      updateTimeDisplay();
      playOverlayBtn.style.display = 'flex';
      playCtrlBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });
  });
}
