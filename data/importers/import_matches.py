import sqlite3
import csv
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

csv_path = BASE / "raw" / "matches.csv"
db_path = BASE / "database" / "A63_League.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

with open(csv_path, newline="", encoding="utf-8") as file:
    reader = csv.DictReader(file, skipinitialspace=True)

    for row in reader:
        cursor.execute("""
        INSERT INTO Matches
        (MatchID, Gameweek, TeamAID, TeamBID, TeamAGoals, TeamBGoals)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            int(row["MatchID"]),
            int(row["Gameweek"]),
            row["TeamAID"],
            row["TeamBID"],
            row["TeamAGoals"],
            row["TeamBGoals"]
        ))

conn.commit()
conn.close()

print("Finished importing matches!")