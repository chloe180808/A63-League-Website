import sqlite3
import csv
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

csv_path = BASE / "raw" / "teams.csv"
db_path = BASE / "database" / "A63_League.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

with open(csv_path, newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file, skipinitialspace=True)

    for row in reader:
        cursor.execute("""
        INSERT INTO Teams
        (TeamID, TeamName)
        VALUES (?, ?)
        """, (
            int(row["TeamID"]),
            row["TeamName"]
        ))

conn.commit()
conn.close()

print("Finished importing teams!")