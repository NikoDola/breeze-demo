const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('#site-nav');
const submenuToggles = [...document.querySelectorAll('.submenu-toggle')];
const mobileQuery = window.matchMedia('(max-width: 1050px)');

function closeSubmenus() {
  submenuToggles.forEach((button) => {
    button.setAttribute('aria-expanded', 'false');
    button.closest('.has-submenu').classList.remove('is-open');
  });
}

function setMenu(open) {
  siteNav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (!open) closeSubmenus();
}

function setSubmenu(button, open) {
  closeSubmenus();
  button.setAttribute('aria-expanded', String(open));
  button.closest('.has-submenu').classList.toggle('is-open', open);
}

menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
submenuToggles.forEach((button) => {
  const parent = button.closest('.has-submenu');
  button.addEventListener('click', () => setSubmenu(button, button.getAttribute('aria-expanded') !== 'true'));
  parent.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' && !mobileQuery.matches) setSubmenu(button, true);
  });
  parent.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' && !mobileQuery.matches && !parent.contains(document.activeElement)) setSubmenu(button, false);
  });
  parent.addEventListener('focusout', (event) => {
    if (!parent.contains(event.relatedTarget)) {
      parent.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }
  });
  parent.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' && event.target.closest('.nav-parent')) {
      event.preventDefault();
      setSubmenu(button, true);
      parent.querySelector('.submenu a').focus();
    }
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      event.preventDefault();
      event.stopPropagation();
      setSubmenu(button, false);
      button.focus();
    }
  });
});

header.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (event) => { if (!header.contains(event.target)) setMenu(false); });
document.addEventListener('keydown', (event) => {
  const menuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  if (event.key === 'Escape' && menuOpen) {
    setMenu(false);
    menuToggle.focus();
  }
  if (event.key === 'Tab' && menuOpen && mobileQuery.matches) {
    const controls = [...header.querySelectorAll('a, button')].filter((element) => element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
mobileQuery.addEventListener('change', () => setMenu(false));

const previewImage = document.querySelector('#service-preview-image');
const previewCaption = document.querySelector('#service-preview-caption');
const serviceRows = [...document.querySelectorAll('.service-row')];
let selectedImage = previewImage.getAttribute('src');
serviceRows.forEach((row) => {
  const preview = () => {
    if (window.matchMedia('(max-width: 760px)').matches) return;
    selectedImage = row.dataset.image;
    serviceRows.forEach((item) => item.classList.toggle('is-preview', item === row));
    const nextImage = new Image();
    nextImage.onload = () => {
      if (selectedImage !== row.dataset.image) return;
      previewImage.src = row.dataset.image;
      previewCaption.textContent = row.dataset.caption;
    };
    nextImage.src = row.dataset.image;
  };
  row.addEventListener('pointerenter', preview);
  row.addEventListener('focus', preview);
});

document.querySelector('#year').textContent = new Date().getFullYear();
const form = document.querySelector('#service-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(form);
  // Production: persist this consent record alongside the request on the server.
  // Add a server receipt timestamp; never infer consent from a phone number alone.
  const consent = {
    granted: document.querySelector('#sms-consent').checked,
    text: document.querySelector('#sms-consent-text').textContent.trim(),
    version: 'service-appointment-sms-v1',
    preparedAt: new Date().toISOString(),
    source: 'website-4/service-request',
    requestId: globalThis.crypto?.randomUUID?.() || `breeze-${Date.now()}`
  };
  const body = [
    `Name: ${fields.get('name')}`,
    `Phone: ${fields.get('phone')}`,
    `Email: ${fields.get('email')}`,
    `Service: ${fields.get('service')}`,
    `Address: ${fields.get('address') || 'Not provided'}`,
    `ZIP: ${fields.get('zip') || 'Not provided'}`,
    '', 'Details:', fields.get('message') || 'No additional details provided.', '',
    `SMS contact consent: ${consent.granted ? 'Yes' : 'No'}`,
    `Consent wording: ${consent.text}`,
    `Consent version: ${consent.version}`,
    `Request prepared (UTC): ${consent.preparedAt}`,
    `Request ID: ${consent.requestId}`,
    `Source: ${consent.source}`
  ].join('\n');
  const subject = encodeURIComponent('Breeze service request');
  window.location.href = `mailto:breezehc@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  const status = document.querySelector('#form-status');
  status.textContent = 'Your email app is opening with your request and SMS preference. Please send the email to complete your request. You can also call 615-523-9898.';
  status.hidden = false;
});
