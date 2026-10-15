import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE = BASE_DIR / "data" / "database" / "A63_League.db"

connection = sqlite3.connect(DATABASE)
connection.row_factory = sqlite3.Row

cursor = connection.cursor()

cursor.execute("""
    SELECT
        m.MatchID,
        m.Gameweek,
        m.TeamAID,
        m.TeamBID,
        home.TeamName AS homeTeam,
        away.TeamName AS awayTeam,
        m.TeamAGoals AS homeGoals,
        m.TeamBGoals AS awayGoals
    FROM Matches AS m
    JOIN Teams AS home
        ON m.TeamAID = home.TeamID
    JOIN Teams AS away
        ON m.TeamBID = away.TeamID
    ORDER BY m.MatchID
""")

matches = cursor.fetchall()

for match in matches:
    print(dict(match))

connection.close()