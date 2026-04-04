from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

DB_URL = "sqlite:///../Database/database.db"

engine = create_engine(DB_URL)


class Base(DeclarativeBase):
    pass
