from flask import Flask, send_file, request, jsonify
from io import BytesIO
from db import engine
from sqlalchemy.orm import Session
from sqlalchemy import select

from models.User import User
from models.Album import Album
from models.Image import Image

app = Flask(__name__)


@app.route("/image")
def getImage():
    id = request.args.get("id")

    with Session(engine) as session:
        stmt = select(Image).where(Image.imageID == id)
        image = session.execute(stmt).scalars().first()

    if image is None:
        raise ValueError(f"Image with id {id} was not found.")

    b = BytesIO(image.image)
    return send_file(b, download_name="image.jpg", mimetype="image/jpg")


@app.route("/album")
def getAlbum():
    id = request.args.get("id")

    with Session(engine) as session:
        stmt = select(Album).where(Album.albumID == id)
        album = session.execute(stmt).scalars().first()

    if album is None:
        raise ValueError(f"Album with id {id} was not found.")

    return jsonify(album.toJson())


@app.route("/imagesInAlbum")
def getImagesInAlbum():
    id = request.args.get("id")

    with Session(engine) as session:
        stmt = select(Image).where(Image.albumID == id)
        all_images = session.execute(stmt).scalars().all()

    return jsonify([image.imageID for image in all_images])


@app.route("/allImages")
def getAllImages():
    with Session(engine) as session:
        stmt = select(Image)
        all_images = session.execute(stmt).scalars().all()

    return jsonify([image.imageID for image in all_images])
