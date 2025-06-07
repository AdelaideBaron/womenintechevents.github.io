import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

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
    return {
        "title": row.get("Course Title", ""),
        "provider": row.get("Provider", ""),
        "region_available": row.get("Regions Available", "None Specified"),
        "starts": row.get("Start Date", ""),
        "start_date_flexible": row.get("Start Date Flexible", ""),
        "target_audience": row.get("Target Audience", ""),
        "delivery_method": row.get("Delivery Method", ""),
        "description": row.get("Description", ""),
        "duration": row.get("Duration", ""),
        "cost": row.get("Cost", ""),
        "timeline": row.get("Timeline", ""),
        "pace": row.get("Pace", ""),
        "women_focused": row.get("Women Focused", ""),
        "tags": [tag.strip() for tag in row.get("Tags", "").split(",") if tag.strip()],
        "link": row.get("Link", "#")
    }

cleaned_data = [transform(row) for row in rows]

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(cleaned_data, f, indent=2, ensure_ascii=False)

print(f"✅ Exported {len(cleaned_data)} courses to {OUTPUT_FILE}")
