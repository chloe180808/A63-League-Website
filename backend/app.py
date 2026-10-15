
from flask import Flask, jsonify, send_from_directory
from pathlib import Path
import sqlite3

app = Flask(__name__)

# Locate the project root
BASE_DIR = Path(__file__).resolve().parent.parent

# Reuse the database created by init_db.py
DATABASE = BASE_DIR / "data" / "database" / "A63_League.db"

@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/fixtures")
def fixtures():
    return send_from_directory(BASE_DIR, "fixtures.html")

@app.route("/fantasy")
def table():
    return send_from_directory(BASE_DIR, "fantasy.html")

@app.route("/more")
def teams():
    return send_from_directory(BASE_DIR, "more.html")

@app.route("/js/<path:filename>")
def serve_js(filename):
    return send_from_directory(BASE_DIR / "js", filename)


@app.route("/styles/<path:filename>")
def serve_styles(filename):
    return send_from_directory(BASE_DIR / "styles", filename)

def get_connection():
    connection = sqlite3.connect(
        f"{DATABASE.as_uri()}?mode=ro",
        uri=True
    )
    connection.row_factory = sqlite3.Row
    return connection


@app.route("/api/teams")
def get_teams():
    connection = get_connection()

    try:
        rows = connection.execute(
            "SELECT TeamID, TeamName FROM Teams ORDER BY TeamID"
        ).fetchall()

        teams = [dict(row) for row in rows]

        return jsonify(teams)

    finally:
        connection.close()


@app.route("/api/matches")
def get_matches():
    connection = get_connection()

    try:
        rows = connection.execute("""
            SELECT
                m.MatchID AS id,
                m.Gameweek AS gameweek,
                home.TeamName AS homeTeam,
                away.TeamName AS awayTeam,
                m.TeamAGoals AS homeGoals,
                m.TeamBGoals AS awayGoals
            FROM Matches AS m
            JOIN Teams AS home
                ON m.TeamAID = home.TeamID
            JOIN Teams AS away
                ON m.TeamBID = away.TeamID
            ORDER BY m.Gameweek, m.MatchID
        """).fetchall()

        return jsonify([dict(row) for row in rows])

    finally:
        connection.close()
