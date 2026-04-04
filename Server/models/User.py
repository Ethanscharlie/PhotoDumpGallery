from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base


class User(Base):
    __tablename__ = "Users"

    userID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, unique=True)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String, nullable=False)

    albums = relationship("Album", back_populates="user")
