import sqlite3
from pathlib import Path
import init_db

DB_PATH = Path(__file__).parent / "A63_League.db"


def reset_database():
    # delete old DB file
    if DB_PATH.exists():
        DB_PATH.unlink()
        print("Old database deleted.")

    # rebuild schema
    init_db.create_database()
    print("Database recreated successfully.")


if __name__ == "__main__":
    reset_database()