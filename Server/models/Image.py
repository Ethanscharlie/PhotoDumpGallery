from sqlalchemy import Integer, String, LargeBinary, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base


class Image(Base):
    __tablename__ = "Images"

    imageID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True, unique=True)
    note: Mapped[str] = mapped_column(String, nullable=True)
    likes: Mapped[int] = mapped_column(Integer, nullable=False)
    dislikes: Mapped[int] = mapped_column(Integer, nullable=False)

    albumID: Mapped[int] = mapped_column(Integer, ForeignKey("Albums.albumID"), nullable=True)

    image: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)

    album = relationship("Album", back_populates="images")
