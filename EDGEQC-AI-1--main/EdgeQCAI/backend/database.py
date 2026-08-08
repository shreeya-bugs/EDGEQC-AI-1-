import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "edgeqc.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Inspections table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        machine_name TEXT NOT NULL,
        sku_code TEXT NOT NULL,
        result TEXT NOT NULL,
        defect_type TEXT,
        confidence REAL,
        severity TEXT
    )
    """)

    # Chat Memory History table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Machine Telematics table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS machine_telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        machine_name TEXT NOT NULL,
        temperature REAL,
        vibration REAL,
        throughput_ppm INTEGER,
        defect_rate REAL,
        status TEXT
    )
    """)

    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
