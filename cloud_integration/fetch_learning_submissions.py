import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import re

# === CONFIG ===
SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1qdfL8io8TUwUQGbJ6nnL86XZ2juXiNKYDbA2HmpWNWs/edit?resourcekey=&gid=499928473#gid=499928473"
OUTPUT_FILE = "courses.json"  # todo update this path

# === AUTH ===
scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name("credentials.json", scope)
client = gspread.authorize(creds)

# === ACCESS SHEET ===
sheet = client.open_by_url(SPREADSHEET_URL).sheet1
rows = sheet.get_all_records()

# === TRANSFORM TO DESIRED FORMAT ===
def transform(row):
    # Compose cost:
    cost = row.get("Cost?", "").strip()
    if cost.lower() != "free" and cost != "":
        cost = row.get("If not free, how much?", cost)

    # Compose region_available from
    region = row.get("Country (GB, USA, etc) - if any, state!", "").strip()
    region_available = region if region else "none specified"

    return {
        "title": row.get("Course Title", "").strip(),
        "duration": row.get("Duration", "").strip(),
        "description": row.get("Description", "").strip(),
        "starts": row.get("Start Date", "").strip(),
        "start_date_flexible": row.get("Is the start date flexible?", "").strip(),
        "timeline": row.get("Timeline", "").strip(),
        "delivery_method": row.get("Delivery Method", "").strip(),
        "pace": row.get("Pace", "").strip(),
        "cost": cost,
        "provider": row.get("Provider", "").strip(),
        "coordinates": {
            "longitude": row.get("Longitude (essential for adding map view)", "").strip(),
            "latitude": row.get("Latitude (essential for adding map view)", "").strip(),
        },
        "link": row.get("Link to Course", "#").strip(),
        "target_audience": row.get("Target Audience", "").strip(),
        "women_focused": row.get("Women Focussed", "Open to all").strip(),
        "tags": (
    ["#" + tag.strip() for tag in row.get("Tags", "").split(",") if tag.strip()]
    + ["#" + tag for tag in re.split(r"[,\s]+", row.get("Additional Tags", "").strip()) if tag]
),
        "region_available": region_available
    }

cleaned_data = [transform(row) for row in rows]

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(cleaned_data, f, indent=2, ensure_ascii=False)

print(f"✅ Exported {len(cleaned_data)} courses to {OUTPUT_FILE}")
