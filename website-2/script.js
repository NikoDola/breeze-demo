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
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  closeSubmenus();
}

menuToggle.addEventListener("click", () => {
  const opening = !siteNav.classList.contains("is-open");
  siteNav.classList.toggle("is-open", opening);
  document.body.classList.toggle("menu-open", opening);
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

const seasonCards = Array.from(document.querySelectorAll(".season-card"));
let seasonParallaxFrame = null;

function updateSeasonParallax() {
  seasonParallaxFrame = null;

  seasonCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const cardCenter = rect.top + rect.height / 2;
    const travelToCenter = (viewportCenter + rect.height / 2) / 2;
    const lineProgress = clamp(1 - Math.abs(cardCenter - viewportCenter) / travelToCenter, 0, 1);
    card.style.setProperty("--season-line-progress", lineProgress.toFixed(3));

    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

    const offset = Math.max(-160, Math.min(160, (viewportCenter - cardCenter) * .35));
    const background = card.querySelector(".season-card-background-image");
    background.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.6)`;
  });
}

function scheduleSeasonParallax() {
  if (seasonParallaxFrame !== null) return;
  seasonParallaxFrame = requestAnimationFrame(updateSeasonParallax);
}

window.addEventListener("scroll", scheduleSeasonParallax, { passive: true });
window.addEventListener("resize", scheduleSeasonParallax);
window.addEventListener("load", scheduleSeasonParallax);
scheduleSeasonParallax();

const servicesStage = document.querySelector(".services-stage");
const serviceHub = servicesStage.querySelector(".orbit-hub");
const connectionSvg = servicesStage.querySelector(".service-connections");
const orangeConnectionTargets = new Set([".orbit-heating", ".orbit-repairs", ".orbit-water"]);
const connections = Array.from(servicesStage.querySelectorAll(".service-connection")).map((group) => ({
  image: servicesStage.querySelector(`${group.dataset.target} img`),
  path: group.querySelector("path"),
  sequenceGroup: orangeConnectionTargets.has(group.dataset.target) ? 0 : 1,
  length: 0,
}));
let connectionsComplete = false;
let animationStarted = false;
let sequenceStart = null;
let currentProgress = connections.map(() => 0);
const connectionDurationMs = 420;
const connectionGroupGapMs = 90;

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
  currentProgress = connections.map((connection) => {
    const groupDelay = connection.sequenceGroup * (connectionDurationMs + connectionGroupGapMs);
    const progress = clamp((elapsed - groupDelay) / connectionDurationMs, 0, 1);
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

const reviewsSection = document.querySelector(".reviews-section");
const reviewsWindow = reviewsSection.querySelector(".reviews-window");
const reviewsTrack = reviewsSection.querySelector(".reviews-track");
const reviewsSet = reviewsTrack.querySelector(".reviews-set");
// Full customer reviews from breezehc.com/reviews/. Only the moving card previews are shortened.
const reviewEntries = [
  {
    name: "David and Deborah Marks",
    text: "The whole team at Breeze was very considerate and helpful while putting in our system. Wish there were more companies like this one.",
  },
  {
    name: "Glenn Hughes",
    text: "I am very satisfied with Breeze Heating and Cooling. From the initial consultation to final clearance, they were truly professional. All systems available for my size home were offered and I was not pressured to select one unit over another. Installation began on time and was completed sooner than I expected. It was a pleasure to do business with this company.",
  },
  {
    name: "Mr. and Mrs Johnson",
    text: "Very great job installing; very knowledgable and work was done in timely manner. Very happy with results from new unit. The cost on electric bills decreased almost 40%. Thank you for your help!!",
  },
  {
    name: "Mary Jane Perkins",
    text: "I’m very happy with the system. Also with the contractors that installed at my house. They were nice and friendly. They even removed their shoes to walk in my home. I congratulate their professionalism and sensitivities.",
  },
  {
    name: "Michael Jennings",
    text: "Highly professional. Kam was outstanding. Thank to all Breeze family who did a great pre and post-installation, survey and inspection on the new system.",
  },
  {
    name: "Charlie Smith",
    text: "From the initial consultation to the completion on installation and post inspection, every phase was completed with much professionalism. So far, we are absolutely, unquestionably satisfied with our new system. Plus, the quietness can’t be beat. A complete 5-star service and product.",
  },
  {
    name: "Sunny Whitehurst",
    text: "Happy with room temperature. They did a good job! Also, air filtration system. Someone we know was happy with the system. If someone needs a new system, I’ll recommend Breeze Heating and Cooling. Thank you!",
  },
  {
    name: "Nancy Fessler",
    text: "All of your personnel seem knowledgeable about their jobs. The entire crew was awesome!",
  },
  {
    name: "Jack Stewardt",
    text: "Very highly qualified and professional personnel throughout the dealings with the preparation and installation of the unit. I have nothing but complete praise for the entire crew.",
  },
  {
    name: "Robin Rose",
    text: "We were very pleased and satisfied with the whole process of purchasing a unit for our home – both with the product and Breeze’s Heating & Cooling installation. We look forward to enjoying many years of quality air and saving on our energy bills.",
  },
  {
    name: "John and Michele Tarrillio",
    text: "Simply the best HVAC Company that I dealt with in the last 20 years. I’ve owned several homes, and never dealt with anyone so honest, knowledgeable, and proficient from start to finish. Without a doubt will continue to use Breeze.",
  },
  {
    name: "Bettye Stanley",
    text: "Kam was referred by a friend that spoke highly of him and his service. The ac had stopped cooling in my duplex and when I phoned to set up an appointment, he said he would be here in 20 minutes. He came, discovered coolant leak, removed the frozen ice, filled with freon and ac was cooling when he left. Price was below what other companies would have charged. Kam was personable, efficient, informative and truly cares about his customers.\n\nI will highly recommend him and Breeze heating and cooling to my friends.",
  },
  {
    name: "Jerome Braden",
    text: "Recently my HVAC went out. In a desperate attempt to get it fixed as soon as possible i quickly scanned through company info online and chose Breeze Heating and Cooling. I was not expecting the best service i just crossed my fingers and hoped that i would not be ripped off and that i would be treated fairly. To my surprise after dealing with Kam, who completed my service and is also the owner, i ended up with the best customer service experience i have ever had. He was fast, friendly and courteous.\n\nHe never once tried to talk me into buying a new unit. He mentioned that would only be a last resort. He also taught me a few things in the process. In the end i also ended up spending way less than i was expecting. Prior to starting my career with the Federal Government and the Veteran’s Administration i worked for a private sector company that won the J.D. Power award for best customer service 6 years running up through the year i left.\n\nThe service i received from Kam and Breeze Heating and cooling is the kind of service that wins those awards. He will be the only one servicing my HVAC for as long as i own my home.",
  },
  {
    name: "Lana Pargh",
    text: "We have been using Breeze for 3 years and will not use anyone else. Kam is sweet, kind, and very professional. He always comes through for us. We own 6 rental properties and he takes care of all of them. I don’t ever have to worry about anything when he is on the job. My husband and I use him exclusively. I am very confident that you will have an amazing experience. Please consider Kam with Breeze next time you need help. He will save the day! 🙂",
  },
  {
    name: "Darron Osborne",
    text: "This is a great company. I’m always looking for that local company that is not trying to take advantage of me, and can still compete with the big guys on their quality. This is one of them. They saved me $1300 dollars. The big guys can’t touch their pricing and honesty. They went out of their way on getting my business, negotiating, and installation. It’s nice to find a company like this in today’s world. They normally aren’t open Saturday’s but made an exception since my AC was completely out.\n\nI will recommend them to everyone I know who needs HVAC service, and I will use them from NOW ON!",
  },
];

function previewReview(text) {
  const characters = Array.from(text);
  if (characters.length <= 100) return text;
  const first99 = characters.slice(0, 99).join("");
  return `${first99.replace(/\s+\S*$/, "").trimEnd() || first99}…`;
}

reviewEntries.forEach((review, index) => {
  const card = document.createElement("article");
  card.className = "review-card";
  const name = document.createElement("h3");
  name.className = "review-card-name";
  name.textContent = review.name;
  const quote = document.createElement("blockquote");
  quote.className = "review-card-quote";
  const text = document.createElement("p");
  text.id = `review-text-${index}`;
  text.textContent = previewReview(review.text);
  quote.append(text);
  card.append(name, quote);
  if (Array.from(review.text).length > 100) {
    const more = document.createElement("button");
    more.className = "review-more";
    more.type = "button";
    more.textContent = "Read more";
    more.setAttribute("aria-expanded", "false");
    more.setAttribute("aria-controls", text.id);
    card.append(more);
  }
  card.review = review;
  reviewsSet.append(card);
});

reviewsSet.prepend(reviewsSet.lastElementChild);
reviewsSection.classList.add("is-ready");
const mobileReviews = window.matchMedia("(max-width: 620px)");
let reviewStep = 0;
let reviewSpeed = 0;
let reviewOffset = 0;
let reviewLastFrame = null;
let hoveredReview = false;
let expandedReview = null;

function setReviewOffset(offset) {
  reviewOffset = offset;
  reviewsTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
}

function measureReviews() {
  reviewStep = reviewsSet.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(reviewsSet).gap);
  reviewSpeed = reviewStep * reviewEntries.length / (parseFloat(getComputedStyle(reviewsSection).getPropertyValue("--reviews-duration")) * 1000);
  if (expandedReview && mobileReviews.matches) {
    centerReview(expandedReview);
  } else {
    setReviewOffset(-reviewStep);
  }
}

function currentReviewOffset() {
  return new DOMMatrixReadOnly(getComputedStyle(reviewsTrack).transform).m41;
}

function centerReview(card) {
  const cardRect = card.getBoundingClientRect();
  const windowRect = reviewsWindow.getBoundingClientRect();
  const targetOffset = currentReviewOffset() + (windowRect.left + windowRect.width / 2) - (cardRect.left + cardRect.width / 2);
  reviewsTrack.classList.add("is-centering");
  reviewsTrack.getBoundingClientRect();
  setReviewOffset(targetOffset);
}

function normalizeReviewOffset() {
  while (reviewOffset >= 0) {
    reviewsSet.prepend(reviewsSet.lastElementChild);
    reviewOffset -= reviewStep;
  }
  while (reviewOffset < -reviewStep) {
    reviewsSet.append(reviewsSet.firstElementChild);
    reviewOffset += reviewStep;
  }
  setReviewOffset(reviewOffset);
}

function collapseReview(card) {
  setReviewOffset(currentReviewOffset());
  reviewsTrack.classList.remove("is-centering");
  card.classList.remove("is-expanded");
  card.querySelector(".review-card-quote p").textContent = previewReview(card.review.text);
  const button = card.querySelector(".review-more");
  button.textContent = "Read more";
  button.setAttribute("aria-expanded", "false");
  expandedReview = null;
  normalizeReviewOffset();
}

reviewsSet.addEventListener("click", (event) => {
  const button = event.target.closest(".review-more");
  if (!button) return;
  const card = button.closest(".review-card");
  if (expandedReview === card) {
    collapseReview(card);
    return;
  }
  if (expandedReview) collapseReview(expandedReview);
  expandedReview = card;
  card.classList.add("is-expanded");
  card.querySelector(".review-card-quote p").textContent = card.review.text;
  button.textContent = mobileReviews.matches ? "Read less and continue with other cards" : "Read less";
  button.setAttribute("aria-expanded", "true");
  if (mobileReviews.matches) centerReview(card);
});

reviewsSet.addEventListener("pointerover", (event) => {
  if (event.pointerType === "mouse" && event.target.closest(".review-card")) hoveredReview = true;
});
reviewsWindow.addEventListener("pointerleave", () => { hoveredReview = false; });

function moveReviews(timestamp) {
  const elapsed = reviewLastFrame === null ? 0 : Math.min(timestamp - reviewLastFrame, 64);
  reviewLastFrame = timestamp;
  if (!expandedReview && !hoveredReview && !document.hidden) {
    reviewOffset += reviewSpeed * elapsed;
    if (reviewOffset >= 0) {
      reviewsSet.prepend(reviewsSet.lastElementChild);
      reviewOffset -= reviewStep;
    }
    setReviewOffset(reviewOffset);
  }
  requestAnimationFrame(moveReviews);
}

measureReviews();
window.addEventListener("resize", measureReviews);
requestAnimationFrame(moveReviews);

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
