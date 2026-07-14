(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  function initMenu() {
    const button = document.querySelector('[data-menu]');
    const nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) return;

    const close = () => {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Otwórz menu');
      nav.hidden = true;
      document.body.style.overflow = '';
    };

    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(opening));
      button.setAttribute('aria-label', opening ? 'Zamknij menu' : 'Otwórz menu');
      nav.hidden = !opening;
      document.body.style.overflow = opening ? 'hidden' : '';
      if (opening) nav.querySelector('a')?.focus();
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !nav.hidden) {
        close();
        button.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1180 && !nav.hidden) close();
    });
  }

  function initProgress() {
    const progress = document.querySelector('[data-progress]');
    if (!progress) return;
    let queued = false;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      queued = false;
    };

    window.addEventListener('scroll', () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  function animateElement(element, type = 'up', delay = 0) {
    if (reducedMotion || !element.animate) return;
    const variants = {
      up: [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }],
      left: [{ opacity: 0, transform: 'translateX(-42px)' }, { opacity: 1, transform: 'translateX(0)' }],
      right: [{ opacity: 0, transform: 'translateX(42px)' }, { opacity: 1, transform: 'translateX(0)' }],
      clip: [
        { opacity: 0.75, clipPath: 'inset(0 0 100% 0)', transform: 'scale(1.015)' },
        { opacity: 1, clipPath: 'inset(0 0 0% 0)', transform: 'scale(1)' },
      ],
    };

    element.animate(variants[type] || variants.up, {
      duration: type === 'clip' ? 950 : 720,
      delay,
      easing: 'cubic-bezier(.22,.8,.25,1)',
      fill: 'both',
    });
  }

  function initReveals() {
    const elements = [...document.querySelectorAll('[data-reveal]')];
    const groups = [...document.querySelectorAll('[data-reveal-group]')];
    if (reducedMotion || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        animateElement(element, element.dataset.reveal || 'up');
        observer.unobserve(element);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

    elements.forEach((element) => observer.observe(element));

    const groupObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        [...entry.target.children].forEach((child, index) => animateElement(child, 'up', index * 80));
        groupObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    groups.forEach((group) => groupObserver.observe(group));

    const heroLead = document.querySelector('[data-hero-lead]');
    if (heroLead) [...heroLead.children].forEach((child, index) => animateElement(child, 'up', index * 90));
    const heroTrust = document.querySelector('[data-hero-trust]');
    if (heroTrust) animateElement(heroTrust, 'up', 360);
  }

  function initParallax() {
    if (reducedMotion) return;
    const images = [...document.querySelectorAll('[data-parallax], [data-hero-image]')];
    if (!images.length) return;
    let queued = false;

    const update = () => {
      images.forEach((image) => {
        const parent = image.parentElement;
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        const centerDelta = rect.top + rect.height / 2 - window.innerHeight / 2;
        const travel = clamp(-centerDelta * 0.045, -36, 36);
        const scale = image.hasAttribute('data-hero-image') ? 1.045 : 1.055;
        image.style.transform = `translate3d(0, ${travel}px, 0) scale(${scale})`;
      });
      queued = false;
    };

    const request = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    request();
  }

  function initStatement() {
    const section = document.querySelector('[data-statement]');
    if (!section || reducedMotion) return;
    const words = [...section.querySelectorAll('[data-statement-word]')];
    const lines = [...section.querySelectorAll('[data-statement-line]')];
    const phases = [...section.querySelectorAll('[data-statement-phase]')];
    const current = section.querySelector('[data-statement-current]');
    const bar = section.querySelector('[data-statement-progress]');
    let queued = false;

    const setStatic = () => {
      words.forEach((word) => {
        word.style.opacity = '1';
        word.style.filter = 'none';
        word.style.transform = 'none';
      });
      lines.forEach((line) => line.classList.add('active'));
      if (bar) bar.style.transform = 'scaleX(1)';
    };

    const update = () => {
      if (window.innerWidth <= 850) {
        setStatic();
        queued = false;
        return;
      }

      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = clamp(-rect.top / Math.max(scrollable, 1), 0, 1);
      const phaseIndex = Math.min(phases.length - 1, Math.floor(progress * phases.length));

      words.forEach((word, index) => {
        const local = clamp(progress * (words.length + 2) - index, 0, 1);
        word.style.opacity = String(0.14 + local * 0.86);
        word.style.filter = `blur(${(1 - local) * 4}px)`;
        word.style.transform = `translateY(${(1 - local) * 12}px)`;
      });

      phases.forEach((phase, index) => phase.classList.toggle('active', index === phaseIndex));
      lines.forEach((line, index) => line.classList.toggle('active', index <= phaseIndex));
      if (current) current.textContent = String(phaseIndex + 1).padStart(2, '0');
      if (bar) bar.style.transform = `scaleX(${progress})`;
      queued = false;
    };

    const request = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    request();
  }

  function initServiceTabs() {
    const dataNode = document.querySelector('[data-services]');
    const panel = document.querySelector('[data-service-panel]');
    const tabs = [...document.querySelectorAll('[data-service-tab]')];
    if (!dataNode || !panel || !tabs.length) return;

    let services = [];
    try {
      services = JSON.parse(dataNode.textContent || '[]');
    } catch (error) {
      console.warn('Nie udało się odczytać danych oferty.', error);
      return;
    }

    const render = (index, focus = false) => {
      const service = services[index];
      const activeTab = tabs[index];
      if (!service || !activeTab) return;

      tabs.forEach((tab, tabIndex) => {
        const active = tabIndex === index;
        tab.classList.toggle('active', active);
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });

      const image = panel.querySelector('[data-service-image]');
      image.src = service.image;
      image.alt = service.alt;
      panel.querySelector('[data-service-title]').textContent = service.title;
      panel.querySelector('[data-service-subtitle]').textContent = service.subtitle;
      panel.querySelector('[data-service-description]').textContent = service.description;
      panel.querySelector('[data-service-points]').innerHTML = service.points.map((point) => `<li>${point}</li>`).join('');
      const selectButton = panel.querySelector('[data-select-service]');
      selectButton.dataset.serviceValue = service.title;
      panel.setAttribute('aria-labelledby', activeTab.id);

      if (!reducedMotion && panel.animate) {
        panel.animate(
          [{ opacity: 0.35, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 360, easing: 'cubic-bezier(.22,.8,.25,1)' },
        );
      }
      if (focus) activeTab.focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => render(index));
      tab.addEventListener('keydown', (event) => {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        render(next, true);
      });
    });
  }

  function showWizardStep(step, selectedType = '') {
    const wizard = document.querySelector('[data-wizard]');
    if (!wizard) return;
    const first = wizard.querySelector('[data-step="1"]');
    const second = wizard.querySelector('[data-step="2"]');
    const typeInput = wizard.querySelector('[name="type"]');
    if (selectedType && typeInput) typeInput.value = selectedType;
    first.hidden = step !== 1;
    second.hidden = step !== 2;
    if (step === 2) second.querySelector('input:not([type="hidden"])')?.focus({ preventScroll: true });
  }

  function validateForm(form) {
    const name = form.elements.name;
    const phone = form.elements.phone;
    const consent = form.elements.consent;
    const errors = {};

    if (name.value.trim().length < 2) errors.name = 'Wpisz co najmniej 2 znaki.';
    const digits = phone.value.replace(/\D/g, '');
    if (digits.length < 9 || digits.length > 15) errors.phone = 'Wpisz poprawny numer telefonu.';
    if (!consent.checked) errors.consent = 'Zgoda jest wymagana, aby wysłać formularz.';

    ['name', 'phone', 'consent'].forEach((field) => {
      const input = form.elements[field];
      const output = form.querySelector(`[data-error-for="${field}"]`);
      const message = errors[field] || '';
      if (output) output.textContent = message;
      if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
    });

    return Object.keys(errors).length === 0;
  }

  function buildFallbackMessage(formData) {
    return `Dzień dobry, proszę o kontakt. Ubezpieczenie: ${formData.get('type')}. Imię: ${formData.get('name')}. Telefon: ${formData.get('phone')}. Informacje: ${formData.get('message') || 'brak'}.`;
  }

  async function fallbackContact(formData, status) {
    const message = buildFallbackMessage(formData);
    if (mobileDevice) {
      window.location.href = `sms:+48789315400?body=${encodeURIComponent(message)}`;
      status.textContent = 'Otwieramy przygotowaną wiadomość SMS.';
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      status.textContent = 'Automatyczna wysyłka jest chwilowo niedostępna. Treść zgłoszenia została skopiowana — zadzwoń pod 789 315 400 lub wyślij ją w wybranym komunikatorze.';
    } catch {
      status.textContent = 'Automatyczna wysyłka jest chwilowo niedostępna. Zadzwoń pod 789 315 400.';
    }
    status.classList.add('is-error');
  }

  function initWizard() {
    const wizard = document.querySelector('[data-wizard]');
    const form = wizard?.querySelector('[data-contact-form]');
    const status = wizard?.querySelector('[data-status]');
    if (!wizard || !form || !status) return;

    wizard.querySelectorAll('[data-type]').forEach((button) => {
      button.addEventListener('click', () => showWizardStep(2, button.dataset.type || ''));
    });
    wizard.querySelector('[data-back]')?.addEventListener('click', () => showWizardStep(1));

    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-select-service]');
      if (!button) return;
      showWizardStep(2, button.dataset.serviceValue || '');
      document.querySelector('#kontakt')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      status.hidden = true;
      status.classList.remove('is-error');
      if (!validateForm(form)) return;

      const submit = form.querySelector('[data-submit]');
      const formData = new FormData(form);
      submit.disabled = true;
      submit.querySelector('span').textContent = 'Wysyłanie…';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.fromEntries(formData.entries())),
        });

        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        status.textContent = 'Dziękujemy. Zgłoszenie zostało wysłane — skontaktujemy się z Tobą możliwie szybko.';
        status.hidden = false;
        form.reset();
      } catch (error) {
        console.info('Formularz użył trybu awaryjnego.', error);
        status.hidden = false;
        await fallbackContact(formData, status);
      } finally {
        submit.disabled = false;
        submit.querySelector('span').textContent = 'Wyślij prośbę o kontakt';
      }
    });
  }

  function initFaq() {
    document.querySelectorAll('[data-faq]').forEach((button) => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        button.setAttribute('aria-expanded', String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
  }

  function initCounters() {
    const counters = [...document.querySelectorAll('[data-counter]')];
    if (!counters.length) return;

    const run = (element) => {
      const target = Number(element.dataset.counter);
      const suffix = element.dataset.counterSuffix || '';
      if (reducedMotion) {
        element.textContent = `${target}${suffix}`;
        return;
      }
      const started = performance.now();
      const duration = 1200;
      const frame = (now) => {
        const progress = clamp((now - started) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => observer.observe(counter));
  }

  function mapFallback(wrapper) {
    const directions = wrapper.dataset.directions || '#';
    wrapper.innerHTML = `<div class="leaflet-map-fallback"><strong>Mapa jest chwilowo niedostępna.</strong><a href="${directions}" target="_blank" rel="noreferrer">Otwórz lokalizację w Google Maps ↗</a></div>`;
  }

  function createMap(wrapper) {
    if (wrapper.dataset.initialized === 'true') return;
    wrapper.dataset.initialized = 'true';
    const lat = Number(wrapper.dataset.lat);
    const lng = Number(wrapper.dataset.lng);
    if (!window.L || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      mapFallback(wrapper);
      return;
    }

    const node = document.createElement('div');
    node.className = 'leaflet-map';
    node.setAttribute('role', 'application');
    node.setAttribute('aria-label', wrapper.getAttribute('aria-label') || 'Mapa biura');
    wrapper.appendChild(node);

    try {
      const map = window.L.map(node, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
        tap: true,
        zoomControl: true,
      });
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);
      const marker = window.L.circleMarker([lat, lng], {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#dc2430',
        fillOpacity: 1,
      }).addTo(map);
      marker.bindPopup(`<strong>Zimmermann — ${wrapper.dataset.city}</strong><br>${wrapper.dataset.address}`).openPopup();
      setTimeout(() => map.invalidateSize(), 120);
    } catch (error) {
      console.warn('Nie udało się uruchomić mapy.', error);
      mapFallback(wrapper);
    }
  }

  function initMaps() {
    const maps = [...document.querySelectorAll('[data-map]')];
    if (!maps.length) return;
    const startMaps = () => {
      if (!('IntersectionObserver' in window)) {
        maps.forEach(createMap);
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          createMap(entry.target);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '300px 0px' });
      maps.forEach((map) => observer.observe(map));
    };

    if (window.L) startMaps();
    else {
      let attempts = 0;
      const timer = window.setInterval(() => {
        attempts += 1;
        if (window.L) {
          clearInterval(timer);
          startMaps();
        } else if (attempts >= 40) {
          clearInterval(timer);
          maps.forEach(mapFallback);
        }
      }, 125);
    }
  }

  initMenu();
  initProgress();
  initReveals();
  initParallax();
  initStatement();
  initServiceTabs();
  initWizard();
  initFaq();
  initCounters();
  initMaps();
})();
