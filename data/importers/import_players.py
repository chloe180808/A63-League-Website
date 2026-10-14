import sqlite3
import csv
from pathlib import Path

def to_int(value):
    if value is None:
        return 0
    if value == "":
        return 0
    return int(value)

BASE = Path(__file__).resolve().parent.parent

csv_path = BASE / "raw" / "players.csv"
db_path = BASE / "database" / "A63_League.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

with open(csv_path, newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file, skipinitialspace=True)

    for row in reader:
        cursor.execute("""
        INSERT INTO Players
        (PlayerID, TeamID, FirstName, Surname)
        VALUES (?, ?, ?, ?)
        """, (
            int(row["PlayerID"]),
            int(row["TeamID"]),
            row["FirstName"],
            row["Surname"]
        ))

conn.commit()
conn.close()

print("Finished importing players!")