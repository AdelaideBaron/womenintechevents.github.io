import { events } from "./event_log.js";

/* ---------------- Date Utilities ---------------- */

function isPast(date, today) {
  return date < new Date(today.toDateString());
}

function isToday(date, today) {
  return date.toDateString() === today.toDateString();
}

/* ---------------- Event Modal Handling ---------------- */

export function showModal(event) {
  document.getElementById("modal-title").textContent = event.title;
  document.getElementById("modal-date").textContent = event.date;
  document.getElementById("modal-time").textContent = event.time;
  document.getElementById("modal-finish-time").textContent = event.finish_time;
  document.getElementById("modal-location").textContent = event.location;
  document.getElementById("modal-country").textContent = event.country;
  document.getElementById("modal-women-focussed").textContent =
    event.women_focussed;
  document.getElementById("modal-cost").textContent = event.cost;
  document.getElementById("modal-audience").textContent = event.target_audience;
  document.getElementById("modal-description").textContent = event.description;
  document.getElementById("modal-type").textContent = event.event_type;

  const modalLink = document.getElementById("modal-link");
  const theLink = event.link;
  modalLink.innerHTML = `<a href="${theLink}" target="_blank">🔗 ${theLink}</a>`;

  document.getElementById("event-modal").classList.remove("hidden");
}

/* ---------------- Day Block Creation ---------------- */

function createDayDiv(date, today, label = "", eventsList = []) {
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");

  if (isPast(date, today)) dayDiv.classList.add("past");
  if (isToday(date, today)) dayDiv.classList.add("today");

  const monthName = date.toLocaleString("default", { month: "long" });
  const dayNum = date.getDate();

  dayDiv.innerHTML = label
    ? `<strong>${label}</strong><div class="date">${monthName} ${dayNum}</div>`
    : `<div class="date">${dayNum}</div>`;

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
  const matchingEvents = eventsList.filter((event) => event.date === dateStr);

  matchingEvents.forEach((event) => {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card");
    eventCard.innerHTML = `
      <div class="event-title">${event.title}</div>
      <div class="event-time">🕒 ${event.time} - ${event.finish_time}</div>
      <div class="event-location">📍 ${event.location}${
      event.country ? ", " + event.country : ""
    }</div>
    `;

    eventCard.addEventListener("click", () => showModal(event));
    dayDiv.appendChild(eventCard);
  });

  return dayDiv;
}

/* ---------------- Monthly View ---------------- */

export function renderMonthlyCalendar(year, month, options) {
  const {
    monthGrid,
    title,
    prevBtn,
    today,
    startYear,
    startMonth,
    events: eventList,
  } = options;

  monthGrid.innerHTML = "";
  const start = new Date(year, month, 1);
  const monthName = start.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  title.textContent = `${monthName} ${year}`.toUpperCase();

  const monthDiff = (startYear - year) * 12 + (startMonth - month);
  prevBtn.disabled = monthDiff >= 3;

  let firstDay = start.getDay();
  if (firstDay === 0) firstDay = 7;

  for (let i = 1; i < firstDay; i++) {
    monthGrid.appendChild(document.createElement("div"));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const thisDate = new Date(year, month, i);
    const dayDiv = createDayDiv(thisDate, today, "", eventList);
    monthGrid.appendChild(dayDiv);
  }
}

export function setupMonthlyView() {
  const monthGrid = document.getElementById("month-grid");
  const title = document.getElementById("month-title");
  const prevBtn = document.getElementById("prevBtn");

  const today = new Date();
  const startMonth = today.getMonth();
  const startYear = today.getFullYear();
  let currentMonth = startMonth;
  let currentYear = startYear;

  function render() {
    renderMonthlyCalendar(currentYear, currentMonth, {
      monthGrid,
      title,
      prevBtn,
      today,
      startMonth,
      startYear,
      events,
    });
  }

  window.changeMonth = function (delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear += 1;
    } else if (currentMonth < 0) {
      currentMonth = 11;
      currentYear -= 1;
    }
    render();
  };

  render();
}

/* ---------------- Week View ---------------- */

export function setupWeekView() {
  const calendar = document.getElementById("calendar");
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date();

  const startOfWeek = new Date(today);
  const dayOffset = (today.getDay() + 6) % 7;
  startOfWeek.setDate(today.getDate() - dayOffset);

  renderWeekView(calendar, startOfWeek, today, dayNames, events);
}

function renderWeekView(
  container,
  startOfWeek,
  today,
  dayNames,
  eventsList = []
) {
  container.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    const label = dayNames[dayDate.getDay()];
    const dayDiv = createDayDiv(dayDate, today, label, eventsList);
    container.appendChild(dayDiv);
  }
}

/* ---------------- Load Templates + Modal Close ---------------- */

function loadTemplate() {
  fetch("header.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("header").innerHTML = html;

      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";
      const navLinks = document.querySelectorAll("nav a");

      navLinks.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add("active");
        }
      });
    });

  fetch("modal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("modal-container").innerHTML = html;

      document
        .getElementById("close-modal")
        .addEventListener("click", function () {
          document.getElementById("event-modal").classList.add("hidden");
        });
    });
}

function closeEventModal() {
  document.getElementById("event-modal").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  loadTemplate();

  const modal = document.getElementById("event-modal");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeEventModal();
    }
  });
});
