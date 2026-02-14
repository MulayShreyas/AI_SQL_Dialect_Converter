"""
Database connection and session management for PostgreSQL
"""
import os
from contextlib import contextmanager
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "database": os.getenv("DB_NAME", "postgres"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "root")
}


def get_connection():
    """Create a new database connection"""
    return psycopg2.connect(**DATABASE_CONFIG, cursor_factory=RealDictCursor)


@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_database():
    """Verify database connection - tables already exist"""
    # Just test the connection, tables are already created
    with get_db() as conn:
        cursor = conn.cursor()
        # Verify connection by running a simple query
        cursor.execute("SELECT 1")
        print("Database connection verified successfully!")
