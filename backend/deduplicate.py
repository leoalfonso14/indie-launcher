import json
import os

def deduplicate_streamers():
    data_path = "backend/streamer_data.json"
    if not os.path.exists(data_path):
        print("Data file not found.")
        return

    with open(data_path, "r") as f:
        data = json.load(f)

    for genre, streamers in data.items():
        unique_streamers = {}
        for s in streamers:
            key = (s["name"].strip().lower(), s["platform"])
            if key not in unique_streamers:
                unique_streamers[key] = s
            else:
                # Merge logic: keep the one with better data
                existing = unique_streamers[key]
                
                # Score: +1 for real email, +1 for real discord, +1 for real twitter
                def get_score(item):
                    score = 0
                    if item.get("email") and item["email"] not in ["Discovery Pending", "Unknown"]: score += 1
                    if item.get("discord") and item["discord"] not in ["Discovery Pending", "Unknown"]: score += 1
                    if item.get("twitter") and item["twitter"] not in ["Discovery Pending", "Unknown"]: score += 1
                    return score
                
                if get_score(s) > get_score(existing):
                    unique_streamers[key] = s
                elif get_score(s) == get_score(existing):
                    # Tie-break by reason length
                    if len(s.get("reason", "")) > len(existing.get("reason", "")):
                        unique_streamers[key] = s

        data[genre] = list(unique_streamers.values())

    with open(data_path, "w") as f:
        json.dump(data, f, indent=4)
    print("Deduplication complete.")

if __name__ == "__main__":
    deduplicate_streamers()
