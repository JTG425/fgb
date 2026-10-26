"""Convert the supplied catalog to website data, including public image links."""
import csv
import json
import sys
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit


def image_url(value):
    value = value.strip()
    parsed = urlsplit(value)
    return value if parsed.scheme == "https" and parsed.netloc else ""


def import_catalog(source):
    posters = []
    ids = Counter()
    with open(source, encoding="utf-8-sig", newline="") as stream:
        for row in csv.DictReader(stream):
            title = row.get("Movie Title", "").strip()
            if not title:
                continue  # Ignore the spreadsheet's empty/total rows.
            source_id = row["ƒ"].strip()
            ids[source_id] += 1
            listing_id = source_id if ids[source_id] == 1 else f"{source_id}-{ids[source_id]}"
            posters.append({
                "id": listing_id,
                "catalogNumber": source_id,
                "title": title,
                "year": int(row["Release Year"]) if row["Release Year"].strip() else None,
                "posterType": row["Poster Type"].strip(),
                "size": row["Size"].strip(),
                "imageUrl": image_url(row["Poster Image URL"]),
                "condition": row["Condition"].strip(),
                "estimatedValue": float(row["Estimated Value"].replace("$", "").replace(",", "")),
                "askingPrice": None,
                "quantity": int(row["Quantity"]),
                "storageLocation": row["Location"].strip(),
                "provenance": row["Provenance / History"].strip(),
                "description": row["Comments"].strip(),
                "dateAcquired": row["Date Acquired"].strip(),
                "active": True,
            })
    assert len({p["id"] for p in posters}) == len(posters)
    target = Path(__file__).resolve().parents[1] / "src/data/poster-catalog.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(posters, ensure_ascii=False, indent=2) + "\n")
    print(f"Imported {len(posters)} listings / {sum(p['quantity'] for p in posters)} posters.")


if __name__ == "__main__":
    import_catalog(sys.argv[1])
