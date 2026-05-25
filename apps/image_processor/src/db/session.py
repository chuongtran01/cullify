from collections.abc import Generator
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker


def normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)

    return database_url


def create_engine_for_url(database_url: str) -> Engine:
    return create_engine(
        normalize_database_url(database_url),
        pool_pre_ping=True,
    )


def create_session_factory(database_url: str) -> sessionmaker[Session]:
    return sessionmaker(
        bind=create_engine_for_url(database_url),
        autocommit=False,
        autoflush=False,
    )


@contextmanager
def session_scope(session_factory: sessionmaker[Session]) -> Generator[Session, None, None]:
    session = session_factory()

    try:
        yield session
    finally:
        session.close()
