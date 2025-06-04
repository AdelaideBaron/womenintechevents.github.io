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

  // Filter events to only include future events
  const futureEvents = events.filter((event) => isFutureEvent(event.date));

  futureEvents.forEach((event) => {
    // Check if event has coordinates and add marker
    if (event.coordinates.latitude && event.coordinates.longitude) {
      const marker = L.marker([
        parseFloat(event.coordinates.latitude),
        parseFloat(event.coordinates.longitude),
      ])
        .addTo(map)
        .bindPopup(
          `<strong>${event.title}</strong><br>${event.date}<br>${event.location}, ${event.country}<br><a href="${event.link}" target="_blank">Event Details</a>`
        );
    }
  });
}
