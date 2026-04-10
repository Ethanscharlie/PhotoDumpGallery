from flask import Flask, send_file, request, jsonify
from io import BytesIO
from db import engine
from sqlalchemy.orm import Session
from sqlalchemy import select

from models.User import User
from models.Album import Album
from models.Image import Image
import jwt
import datetime

app = Flask(__name__)

JWT_KEY = "feiwofbtrbrtigro"


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


def generateWebToken(userID: int, username: str) -> str:
    payload = {
        "user_id": userID,
        "username": username,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=5),
    }

    return jwt.encode(payload, JWT_KEY, algorithm="HS256")


@app.route("/login", methods=["POST"])
def login():
    print("Got login request")
    data = request.get_json()
    username = data["username"]
    password = data["password"]

    with Session(engine) as session:
        stmt = select(User).where(User.name == username)
        user = session.execute(stmt).scalars().first()

    if user and user.password == password:
        token = generateWebToken(user.userID, username)
        return jsonify({"message": "Login successful", "token": token}), 200

    return jsonify({"message": "Invalid username or password"}), 401


@app.route("/checkToken", methods=["GET"])
def checkToken():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        print("Missing auth header")
        return jsonify({"valid": False, "message": "Missing Authorization header"}), 401

    try:
        token = auth_header.split(" ")[1]
        decoded = jwt.decode(token, JWT_KEY, algorithms=["HS256"])
        return jsonify({"valid": True, "user_id": decoded["user_id"]}), 200

    except jwt.ExpiredSignatureError:
        print("Token expired")
        return jsonify({"valid": False, "message": "Token expired"}), 401

    except jwt.InvalidTokenError:
        print("Invalid token")
        return jsonify({"valid": False, "message": "Invalid token"}), 401
