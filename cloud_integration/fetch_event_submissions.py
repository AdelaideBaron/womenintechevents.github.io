import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

# === CONFIG ===
SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1NholFea8vSgWmaqZVTF1fZS5ywZ9MxFQDGja_VeYfFM/edit#gid=1550371171"
OUTPUT_FILE = "events.json"

# === AUTH ===
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)

# === ACCESS SHEET ===
sheet = client.open_by_url(SPREADSHEET_URL).sheet1
rows = sheet.get_all_records()

# === TRANSFORM TO DESIRED FORMAT ===
def transform(row):
    # Normalize cost
    cost = row.get("Cost?", "").strip()
    if cost.lower() != "free" and cost != "":
        cost = row.get("If not free, how much?", cost)

    # Normalize women_focussed
    raw_women = row.get("Women Focussed?", "").strip().lower()
    women_focussed = "✅" if "yes" in raw_women or "true" in raw_women else "❌"

    return {
        "date": row.get("Date", "").strip(),
        "time": row.get("Start Time", "").strip(),
        "finish_time": row.get("Finish Time", "").strip(),
        "title": row.get("Event Title", "").strip(),
        "location": "Online" if "yes" in row.get("Online?", "").strip().lower() else "In-person",
        "country": row.get("Country (GB, USA, etc) - if any, state!", "").strip(),
        "coordinates": {
            "longitude": row.get("Longitude (essential for adding map view)", "").strip(),
            "latitude": row.get("Latitude (essential for adding map view)", "").strip(),
        },
        "cost": cost,
        "audience": row.get("Who is the event aimed at?", "").strip(),
        "description": row.get("Event Description", "").strip(),
        "event_type": row.get("Event Type", "").strip(),
        "link": row.get("Link to page/event", "#").strip(),
        "women_focussed": women_focussed,
    }

cleaned_data = [transform(row) for row in rows]

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(cleaned_data, f, indent=2, ensure_ascii=False)

print(f"✅ Exported {len(cleaned_data)} events to {OUTPUT_FILE}")
