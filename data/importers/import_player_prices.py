import sqlite3
import csv
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent

db_path = BASE / "database" / "A63_League.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

for i in range(0, 104):
    cursor.execute(""" INSERT INTO FantasyPlayerPrices (PlayerID) VALUES (?) """, (i,))

conn.commit()
conn.close()

print("Finished importing player prices!")