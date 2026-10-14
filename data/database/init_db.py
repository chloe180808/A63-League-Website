import sqlite3
from pathlib import Path

import schema

DATABASE = Path(__file__).parent / "A63_League.db"

def create_database():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")

    cursor.execute(schema.TEAMS_TABLE)
    cursor.execute(schema.PLAYERS_TABLE)
    cursor.execute(schema.MATCHES_TABLE)
    cursor.execute(schema.PLAYER_MATCH_STATS_TABLE)
    cursor.execute(schema.USERS_TABLE)
    cursor.execute(schema.FANTASY_TEAMS_TABLE)
    cursor.execute(schema.FANTASY_TEAM_PLAYERS_TABLE)
    cursor.execute(schema.FANTASY_PLAYER_PRICES_TABLE)
    cursor.execute(schema.GAMEWEEKS_TABLE)

    conn.commit()
    conn.close()

    print("Database created successfully.")

if __name__ == "__main__":
    create_database()