const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const serviceSelect = document.querySelector("#service");
const form = document.querySelector("#service-form");
const status = document.querySelector("#form-status");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  siteNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    serviceSelect.value = link.dataset.service;
  });
});

document.querySelector("#year").textContent = new Date().getFullYear();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const smsConsent = document.querySelector("#sms-consent").checked;
  const body = [
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email")}`,
    `Service: ${data.get("service")}`,
    `SMS contact permission: ${smsConsent ? "Yes, for service request and appointment updates" : "No"}`,
    `Request draft prepared: ${new Date().toLocaleString()}`,
    "",
    "Details:",
    data.get("message") || "No additional details provided.",
  ].join("\n");

  const subject = encodeURIComponent("Service request from Breeze landing page");
  window.location.href = `mailto:breezehc@gmail.com?subject=${subject}&body=${encodeURIComponent(body)}`;
  status.textContent = "Your email app is opening. Please send the prepared message to complete your request. You can also call 615-523-9898.";
  status.hidden = false;
});
