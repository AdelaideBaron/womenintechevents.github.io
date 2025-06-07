import json
import os
import re

script_dir = os.path.dirname(os.path.abspath(__file__))
new_events_path = os.path.join(script_dir, "events.json")
event_log_path = os.path.abspath(os.path.join(script_dir, "..", "js", "event_log.js"))

with open(new_events_path, "r", encoding="utf-8") as f:
    new_events = json.load(f)

with open(event_log_path, "r", encoding="utf-8") as f:
    js_content = f.read()

match = re.search(r"export const events = \[\n(.*)\n\];", js_content, re.DOTALL)
if not match:
    raise ValueError("Could not find events array in JS file.")

current_array_content = match.group(1).strip()

def to_js_object(obj):
    return json.dumps(obj, indent=2, ensure_ascii=False).replace('"', '"').replace("true", "true").replace("false", "false")

new_events_js = ",\n  ".join([to_js_object(event) for event in new_events])

updated_array_content = current_array_content + ",\n  " + new_events_js
updated_js_content = f"export const events = [\n  {updated_array_content}\n];"

with open(event_log_path, "w", encoding="utf-8") as f:
    f.write(updated_js_content)

print(f"✅ Successfully appended {len(new_events)} events to {event_log_path}")
