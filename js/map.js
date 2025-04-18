import { events } from "./event_log.js";

function isFutureEvent(eventDate) {
  const today = new Date();
  const eventDateObj = new Date(eventDate);
  today.setHours(0, 0, 0, 0);
  eventDateObj.setHours(0, 0, 0, 0);
  return eventDateObj >= today;
}

export function initMap() {
  const map = L.map("map").setView([20, 0], 2); // World view

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
  }).addTo(map);

  const futureEvents = events.filter((event) => isFutureEvent(event.date));

  futureEvents.forEach((event) => {
    if (event.latitude && event.longitude) {
      const marker = L.marker([event.latitude, event.longitude]).addTo(map);
      marker.bindPopup(
        `<strong>${event.title}</strong><br>${event.date}<br>${event.location}, ${event.country}`
      );
    }
  });
}
