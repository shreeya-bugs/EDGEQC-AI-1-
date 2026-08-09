import json
import os
from contextlib import contextmanager
from decimal import Decimal
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import mysql.connector
from dotenv import load_dotenv
from mysql.connector import pooling

load_dotenv()

DB_NAME = os.getenv("MYSQL_DATABASE", "edgeqc_ai")
SCHEMA_PATH = Path(__file__).with_name("schema.sql")
_pool: Optional[pooling.MySQLConnectionPool] = None


def _server_config(include_database: bool = True) -> Dict[str, Any]:
    config: Dict[str, Any] = {
        "host": os.getenv("MYSQL_HOST", "localhost"),
        "port": int(os.getenv("MYSQL_PORT", "3306")),
        "user": os.getenv("MYSQL_USER", "root"),
        "password": os.getenv("MYSQL_PASSWORD", ""),
        "autocommit": False,
    }
    if include_database:
        config["database"] = DB_NAME
    return config


def _json_default(value: Any) -> Any:
    if isinstance(value, Decimal):
        return float(value)
    raise TypeError(f"{type(value).__name__} is not JSON serializable")


def init_db() -> None:
    """Create the MySQL database, tables, seed rows, and connection pool."""
    global _pool

    connection = mysql.connector.connect(**_server_config(include_database=False))
    cursor = connection.cursor()
    try:
        statements = [
            statement.strip()
            for statement in SCHEMA_PATH.read_text(encoding="utf-8-sig").split(";")
            if statement.strip()
        ]
        for statement in statements:
            cursor.execute(statement)
        connection.commit()
    finally:
        cursor.close()
        connection.close()

    _pool = pooling.MySQLConnectionPool(
        pool_name=os.getenv("MYSQL_POOL_NAME", "edgeqc_pool"),
        pool_size=int(os.getenv("MYSQL_POOL_SIZE", "5")),
        **_server_config(include_database=True),
    )


@contextmanager
def get_db_connection():
    global _pool
    if _pool is None:
        init_db()

    assert _pool is not None
    connection = _pool.get_connection()
    try:
        yield connection
    finally:
        connection.close()


def fetch_all(query: str, params: Optional[Iterable[Any]] = None) -> List[Dict[str, Any]]:
    with get_db_connection() as connection:
        cursor = connection.cursor(dictionary=True)
        try:
            cursor.execute(query, params or ())
            return cursor.fetchall()
        finally:
            cursor.close()


def execute(query: str, params: Optional[Iterable[Any]] = None) -> int:
    with get_db_connection() as connection:
        cursor = connection.cursor()
        try:
            cursor.execute(query, params or ())
            connection.commit()
            return cursor.lastrowid
        except Exception:
            connection.rollback()
            raise
        finally:
            cursor.close()


def insert_json_row(table: str, payload: Dict[str, Any]) -> int:
    columns = ", ".join(payload.keys())
    placeholders = ", ".join(["%s"] * len(payload))
    values = [
        json.dumps(value, default=_json_default) if isinstance(value, (dict, list)) else value
        for value in payload.values()
    ]
    return execute(f"INSERT INTO {table} ({columns}) VALUES ({placeholders})", values)

