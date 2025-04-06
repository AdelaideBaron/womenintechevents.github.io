import { events } from "./event_log.js";

function isPast(date, today) {
  return date < new Date(today.toDateString());
}

function isToday(date, today) {
  return date.toDateString() === today.toDateString();
}

function createDayDiv(date, today, label = "", events = []) {
  const dayDiv = document.createElement("div");
  dayDiv.classList.add("day");

  if (isPast(date, today)) dayDiv.classList.add("past");
  if (isToday(date, today)) dayDiv.classList.add("today");

  const monthName = date.toLocaleString("default", { month: "long" });
  const dayNum = date.getDate();

  if (label) {
    dayDiv.innerHTML = `<strong>${label}</strong><div class="date">${monthName} ${dayNum}</div>`;
  } else {
    dayDiv.innerHTML = `<div class="date">${dayNum}</div>`;
  }

  const dateStr =
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0");

  const matchingEvents = events.filter((event) => event.date === dateStr);
  matchingEvents.forEach((event) => {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card");
    eventCard.innerHTML = `
      <div class="event-title">${event.title}</div>
      <div class="event-time">${event.time} - ${event.finish_time}</div> <!-- Display Finish Time -->
    `;

    eventCard.addEventListener("click", () => {
      showEventModal(event);
    });

    dayDiv.appendChild(eventCard);
  });

  return dayDiv;
}

function showEventModal(event) {
  document.getElementById("modal-title").textContent = event.title;
  document.getElementById("modal-date").textContent = event.date;
  document.getElementById("modal-time").textContent = event.time;
  document.getElementById("modal-finish-time").textContent = event.finish_time;
  document.getElementById("modal-location").textContent = event.location;
  document.getElementById("modal-country").textContent = event.country;
  document.getElementById("modal-cost").textContent = event.cost;
  document.getElementById("modal-audience").textContent = event.audience;

  document.getElementById("modal-description").textContent = event.description;
  document.getElementById("modal-type").textContent = event.event_type;
  document.getElementById("event-modal").classList.remove("hidden");
  document.getElementById("modal-link").textContent = event.link;
}

export function renderMonthlyCalendar(year, month, options) {
  const {
    monthGrid,
    title,
    prevBtn,
    today,
    startYear,
    startMonth,
    events = [],
  } = options;

  monthGrid.innerHTML = "";
  const start = new Date(year, month, 1);
  const monthName = start.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  title.textContent = `${monthName} ${year} - Full Month View`;

  const monthDiff = (startYear - year) * 12 + (startMonth - month);
  prevBtn.disabled = monthDiff >= 3;

  let firstDay = start.getDay();
  if (firstDay === 0) firstDay = 7;

  for (let i = 1; i < firstDay; i++) {
    monthGrid.appendChild(document.createElement("div"));
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const thisDate = new Date(year, month, i);
    const dayDiv = createDayDiv(thisDate, today, "", events);
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

  function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear += 1;
    } else if (currentMonth < 0) {
      currentMonth = 11;
      currentYear -= 1;
    }
    render();
  }

  window.changeMonth = changeMonth;
  render();
}

export function setupWeekView() {
  const calendar = document.getElementById("calendar");
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const startOfWeek = new Date(today);
  const dayOffset = (today.getDay() + 6) % 7;
  startOfWeek.setDate(today.getDate() - dayOffset);

  renderWeekView(calendar, startOfWeek, today, dayNames, events);
}

function renderWeekView(container, startOfWeek, today, dayNames, events = []) {
  container.innerHTML = "";
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    const label = dayNames[dayDate.getDay()];
    const dayDiv = createDayDiv(dayDate, today, label, events);
    container.appendChild(dayDiv);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("event-modal");
  const closeBtn = document.getElementById("close-modal");

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
});

export function showModal(event) {
  document.getElementById("modal-title").textContent = event.title;
  document.getElementById("modal-date").textContent = event.date;
  document.getElementById("modal-time").textContent = event.time;
  document.getElementById("modal-finish-time").textContent = event.finish_time;
  document.getElementById("modal-location").textContent = event.location;
  document.getElementById("modal-country").textContent = event.country;
  document.getElementById("modal-cost").textContent = event.cost;
  document.getElementById("modal-audience").textContent = event.target_audience;
  document.getElementById("modal-description").textContent = event.description;
  document.getElementById("modal-type").textContent = event.event_type;

  const modalLink = document.getElementById("modal-link");
  modalLink.textContent = event.link;
  modalLink.setAttribute("href", event.link);

  document.getElementById("event-modal").classList.remove("hidden");

  document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("event-modal").classList.add("hidden");
  });
}

function loadTemplate() {
  fetch("header.html")
    .then((response) => response.text())
    .then((html) => (document.getElementById("header").innerHTML = html));

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

document.addEventListener("DOMContentLoaded", loadTemplate);
