import json
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
source_path = os.path.join(script_dir, "courses.json")
dest_path = os.path.abspath(os.path.join(script_dir, "..", "courses.json"))

if os.path.exists(dest_path):
    with open(dest_path, "r", encoding="utf-8") as dest_file:
        existing_courses = json.load(dest_file)
else:
    existing_courses = []

with open(source_path, "r", encoding="utf-8") as source_file:
    new_courses = json.load(source_file)

combined_courses = existing_courses + new_courses

with open(dest_path, "w", encoding="utf-8") as dest_file:
    json.dump(combined_courses, dest_file, indent=2, ensure_ascii=False)

print(f"✅ Successfully appended {len(new_courses)} courses to {dest_path}")
