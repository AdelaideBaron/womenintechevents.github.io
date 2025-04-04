// calendar.js

export function renderMonthlyCalendar(year, month, options) {
    const {
      monthGrid,
      title,
      prevBtn,
      today,
      startYear,
      startMonth
    } = options;
  
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
      const empty = document.createElement('div');
      monthGrid.appendChild(empty);
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      const thisDate = new Date(year, month, i);
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');
      dayDiv.textContent = i;
  
      if (thisDate < new Date(today.toDateString())) {
        dayDiv.classList.add('past');
      }
  
      if (
        thisDate.getDate() === today.getDate() &&
        thisDate.getMonth() === today.getMonth() &&
        thisDate.getFullYear() === today.getFullYear()
      ) {
        dayDiv.classList.add('today');
      }
  
      monthGrid.appendChild(dayDiv);
    }
  }
  
  // This handles full calendar setup, including changeMonth logic
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
        startYear
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
  
    // Expose changeMonth globally for button onclick
    window.changeMonth = changeMonth;
  
    // Initial render
    render();
  }

  // calendar.js

export function setupWeekView() {
    const calendar = document.getElementById('calendar');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
  
    const startOfWeek = new Date(today);
    const dayOffset = (today.getDay() + 6) % 7; // Make Monday = 0
    startOfWeek.setDate(today.getDate() - dayOffset);
  
    renderWeekView(calendar, startOfWeek, today, dayNames);
  }
  
  function renderWeekView(container, startOfWeek, today, dayNames) {
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
  
      const dayName = dayNames[dayDate.getDay()];
      const dayNum = dayDate.getDate();
      const monthName = dayDate.toLocaleString('default', { month: 'long' });
  
      const dayDiv = document.createElement('div');
      dayDiv.classList.add('day');
  
      if (dayDate < new Date(today.toDateString())) {
        dayDiv.classList.add('past');
      }
  
      if (dayDate.toDateString() === today.toDateString()) {
        dayDiv.classList.add('today');
      }
  
      dayDiv.innerHTML = `<strong>${dayName}</strong><div class="date">${monthName} ${dayNum}</div>`;
      container.appendChild(dayDiv);
    }
  }
  
  