import sqlite3
import csv
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

csv_path = BASE / "raw" / "matches.csv"
db_path = BASE / "database" / "A63_League.db"


def optional_int(value):
    if value is None or value.strip() == "":
        return None
    return int(value)


conn = sqlite3.connect(db_path)
conn.execute("PRAGMA foreign_keys = ON")
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
            optional_int(row["Gameweek"]),
            int(row["TeamAID"]),
            int(row["TeamBID"]),
            optional_int(row["TeamAGoals"]),
            optional_int(row["TeamBGoals"])
        ))

conn.commit()
conn.close()

print("Finished importing matches!")