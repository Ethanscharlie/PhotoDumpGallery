from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db import Base
from db import engine
from models.Image import Image


class Album(Base):
    __tablename__ = "Albums"

    albumID: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String, nullable=False)

    author: Mapped[int] = mapped_column(Integer, ForeignKey("Users.userID"), nullable=False)

    user = relationship("User", back_populates="albums")
    images = relationship("Image", back_populates="album")

    def toJson(self):
        d = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        with Session(engine) as session:
            stmt = select(Image).where(Image.albumID == self.albumID)
            thumbnail = session.execute(stmt).scalars().first()

        if thumbnail is None:
            raise ValueError(f"Thumbnail with id {id} was not found.")

        d["thumbnailID"] = thumbnail.imageID

        return d
