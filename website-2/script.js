const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const submenuToggles = document.querySelectorAll(".submenu-toggle");
const serviceSelect = document.querySelector("#service");
const form = document.querySelector("#service-form");
const status = document.querySelector("#form-status");

function closeSubmenus() {
  submenuToggles.forEach((toggle) => {
    toggle.closest(".has-submenu").classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

function closeMenu() {
  siteNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  closeSubmenus();
}

menuToggle.addEventListener("click", () => {
  const opening = !siteNav.classList.contains("is-open");
  siteNav.classList.toggle("is-open", opening);
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "Close menu" : "Open menu");
  if (!opening) closeSubmenus();
});

submenuToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const parent = toggle.closest(".has-submenu");
    const opening = !parent.classList.contains("is-open");
    closeSubmenus();
    parent.classList.toggle("is-open", opening);
    toggle.setAttribute("aria-expanded", String(opening));
  });
});

siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 1160) closeMenu();
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    serviceSelect.value = link.dataset.service;
  });
});

const heroPhoto = document.querySelector(".hero-photo");
const heroImage = heroPhoto.querySelector("img");
let heroParallaxFrame = null;

function updateHeroParallax() {
  heroParallaxFrame = null;
  const rect = heroPhoto.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
  const offset = Math.max(-100, Math.min(100, -rect.top * .28));
  heroImage.style.setProperty("--hero-parallax", `${offset.toFixed(1)}px`);
}

function scheduleHeroParallax() {
  if (heroParallaxFrame !== null) return;
  heroParallaxFrame = requestAnimationFrame(updateHeroParallax);
}

window.addEventListener("scroll", scheduleHeroParallax, { passive: true });
window.addEventListener("resize", scheduleHeroParallax);
window.addEventListener("load", scheduleHeroParallax);
scheduleHeroParallax();

const servicesStage = document.querySelector(".services-stage");
const serviceHub = servicesStage.querySelector(".orbit-hub");
const connectionSvg = servicesStage.querySelector(".service-connections");
const connections = Array.from(servicesStage.querySelectorAll(".service-connection")).map((group) => ({
  image: servicesStage.querySelector(`${group.dataset.target} img`),
  path: group.querySelector("path"),
  length: 0,
}));
let connectionsComplete = false;
let animationStarted = false;
let sequenceStart = null;
let currentProgress = connections.map(() => 0);
const connectionSpeed = 3;
const connectionDurationMs = 1800 / connectionSpeed;
const connectionStaggerMs = 1250 / connectionSpeed;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function drawConnections(progressByCard) {
  connections.forEach((connection, index) => {
    const lineProgress = progressByCard[index];
    connection.path.style.strokeDashoffset = String(connection.length * (1 - lineProgress));
  });
  if (progressByCard.every((progress) => progress >= 1)) {
    connectionsComplete = true;
    servicesStage.classList.add("is-complete");
  }
}

function layoutConnections() {
  const stageRect = servicesStage.getBoundingClientRect();
  const hubRect = serviceHub.getBoundingClientRect();
  const hubCenter = {
    x: hubRect.left + hubRect.width / 2 - stageRect.left,
    y: hubRect.top + hubRect.height / 2 - stageRect.top,
  };
  const plugRadius = hubRect.width / 2 - 12;
  connectionSvg.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);

  connections.forEach((connection) => {
    const imageRect = connection.image.getBoundingClientRect();
    const imageCenter = {
      x: imageRect.left + imageRect.width / 2 - stageRect.left,
      y: imageRect.top + imageRect.height / 2 - stageRect.top,
    };
    const dx = hubCenter.x - imageCenter.x;
    const dy = hubCenter.y - imageCenter.y;
    const distance = Math.hypot(dx, dy) || 1;
    const unitX = dx / distance;
    const unitY = dy / distance;
    const source = {
      x: imageCenter.x + unitX * (imageRect.width / 2 - 4),
      y: imageCenter.y + unitY * (imageRect.height / 2 - 4),
    };
    const target = {
      x: hubCenter.x - unitX * plugRadius,
      y: hubCenter.y - unitY * plugRadius,
    };
    const curve = (target.x - source.x) * .42;
    connection.path.setAttribute(
      "d",
      `M ${source.x} ${source.y} C ${source.x + curve} ${source.y}, ${target.x - curve} ${target.y}, ${target.x} ${target.y}`,
    );
    connection.length = connection.path.getTotalLength();
    connection.path.style.strokeDasharray = `${connection.length} ${connection.length}`;
  });

  drawConnections(currentProgress);
}

function runConnectionSequence(timestamp) {
  if (connectionsComplete) return;
  if (sequenceStart === null) sequenceStart = timestamp;
  const elapsed = timestamp - sequenceStart;
  currentProgress = connections.map((_, index) => {
    const progress = clamp((elapsed - index * connectionStaggerMs) / connectionDurationMs, 0, 1);
    return progress * progress * (3 - 2 * progress);
  });
  drawConnections(currentProgress);
  if (!connectionsComplete) requestAnimationFrame(runConnectionSequence);
}

function startConnectionSequence() {
  if (animationStarted) return;
  animationStarted = true;
  requestAnimationFrame(runConnectionSequence);
}

layoutConnections();
window.addEventListener("resize", layoutConnections);
window.addEventListener("load", layoutConnections);
if (window.ResizeObserver) new ResizeObserver(layoutConnections).observe(servicesStage);
if (window.IntersectionObserver) {
  const servicesObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.intersectionRatio >= .6)) {
      startConnectionSequence();
      servicesObserver.disconnect();
    }
  }, { threshold: .6, rootMargin: "0px 0px -5% 0px" });
  servicesObserver.observe(serviceHub);
} else {
  const checkServicesInView = () => {
    const rect = serviceHub.getBoundingClientRect();
    const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight * .95) - Math.max(rect.top, 0));
    if (visibleHeight / rect.height >= .6) {
      startConnectionSequence();
      window.removeEventListener("scroll", checkServicesInView);
    }
  };
  window.addEventListener("scroll", checkServicesInView, { passive: true });
  checkServicesInView();
}
document.querySelector("#year").textContent = new Date().getFullYear();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const smsConsent = document.querySelector("#sms-consent").checked;
  const body = [
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email")}`,
    `Service needed: ${data.get("service")}`,
    `SMS contact permission: ${smsConsent ? "Yes, for service request and appointment updates" : "No"}`,
    `Request draft prepared: ${new Date().toLocaleString()}`,
    "",
    "Details:",
    data.get("message") || "No additional details provided.",
  ].join("\n");

  const subject = encodeURIComponent("Service request from Breeze website-2 concept");
  window.location.href = `mailto:breezehc@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  status.textContent = "Your email app is opening. Please send the prepared message to complete your request. You can also call 615-523-9898.";
  status.hidden = false;
});
