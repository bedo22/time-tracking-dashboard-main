const timeframeLabels = {
  daily: "Yesterday",
  weekly: "Last Week",
  monthly: "Last Month",
};

let dashboardData = [];
let currentTimeframe = "weekly";

const cardsContainer = document.querySelector("#activity-cards");
const navContainer = document.querySelector(".profile-card__nav");

async function init() {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      throw new Error(`Failed to fetch data.json: ${response.status}`);
    }

    dashboardData = await response.json();
    renderCards();
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    cardsContainer.textContent = "Unable to load dashboard data.";
  }
}

function renderCards() {
  const previousLabel = timeframeLabels[currentTimeframe];

  cardsContainer.innerHTML = dashboardData
    .map(({ title, timeframes }) => {
      const slug = title.toLowerCase().replace(" ", "-");
      const { current, previous } = timeframes[currentTimeframe];

      return `
        <article class="activity-card activity-card--${slug}" data-category="${slug}">
          <div class="activity-card__body">
            <div class="activity-card__header">
              <h3 class="activity-card__title">${title}</h3>
              <button class="activity-card__menu" type="button">
                <span class="visually-hidden">View ${title} options</span>
              </button>
            </div>
            <div class="activity-card__stats">
              <p class="activity-card__current">${current}${current === 1 ? "hr" : "hrs"}</p>
              <p class="activity-card__previous">${previousLabel} - ${previous}${previous === 1 ? "hr" : "hrs"}</p>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function updateCards() {
  const previousLabel = timeframeLabels[currentTimeframe];

  dashboardData.forEach(({ title, timeframes }) => {
    const slug = title.toLowerCase().replace(" ", "-");
    const card = cardsContainer.querySelector(`[data-category="${slug}"]`);

    if (!card) return;

    const { current, previous } = timeframes[currentTimeframe];

    card.querySelector(".activity-card__current").textContent =
      `${current}${current === 1 ? "hr" : "hrs"}`;

    card.querySelector(".activity-card__previous").textContent =
      `${previousLabel} - ${previous}${previous === 1 ? "hr" : "hrs"}`;
  });
}

navContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".timeframe-button");

  if (!button || !navContainer.contains(button)) return;

  const selectedTimeframe = button.dataset.timeframe;

  if (!selectedTimeframe || selectedTimeframe === currentTimeframe) return;

  currentTimeframe = selectedTimeframe;

  navContainer.querySelectorAll(".timeframe-button").forEach((navButton) => {
    const isActive = navButton === button;
    navButton.classList.toggle("is-active", isActive);
    navButton.setAttribute("aria-pressed", String(isActive));
  });

  updateCards();
});

init();
