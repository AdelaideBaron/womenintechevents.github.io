// calendar.js

// --- Shared Helpers ---
function isPast(date, today) {
    return date < new Date(today.toDateString());
  }
  
  function isToday(date, today) {
    return date.toDateString() === today.toDateString();
  }
  
  function createDayDiv(date, today, label = '') {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
  
    if (isPast(date, today)) dayDiv.classList.add('past');
    if (isToday(date, today)) dayDiv.classList.add('today');
  
    if (label) {
      const monthName = date.toLocaleString('default', { month: 'long' });
      const dayNum = date.getDate();
      dayDiv.innerHTML = `<strong>${label}</strong><div class="date">${monthName} ${dayNum}</div>`;
    } else {
      dayDiv.textContent = date.getDate();
    }
  
    return dayDiv;
  }
  
  // --- Monthly View ---
  export function renderMonthlyCalendar(year, month, options) {
    const { monthGrid, title, prevBtn, today, startYear, startMonth } = options;
  
    monthGrid.innerHTML = '';
    const start = new Date(year, month, 1);
    const monthName = start.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    title.textContent = `${monthName} ${year} - Full Month View`;
  
    const monthDiff = (startYear - year) * 12 + (startMonth - month);
    prevBtn.disabled = monthDiff >= 3;
  
    let firstDay = start.getDay();
    if (firstDay === 0) firstDay = 7;
  
    for (let i = 1; i < firstDay; i++) {
      monthGrid.appendChild(document.createElement('div'));
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const thisDate = new Date(year, month, i);
      const dayDiv = createDayDiv(thisDate, today);
      monthGrid.appendChild(dayDiv);
    }
  }
  
  export function setupMonthlyView() {
    const monthGrid = document.getElementById('month-grid');
    const title = document.getElementById('month-title');
    const prevBtn = document.getElementById('prevBtn');
  
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
  
  // --- Weekly View ---
  export function setupWeekView() {
    const calendar = document.getElementById('calendar');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
  
    const startOfWeek = new Date(today);
    const dayOffset = (today.getDay() + 6) % 7;
    startOfWeek.setDate(today.getDate() - dayOffset);
  
    renderWeekView(calendar, startOfWeek, today, dayNames);
  }
  
  function renderWeekView(container, startOfWeek, today, dayNames) {
    container.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(FstartOfWeek.getDate() + i);
      const label = dayNames[dayDate.getDay()];
      const dayDiv = createDayDiv(dayDate, today, label);
      container.appendChild(dayDiv);
    }
  }
  