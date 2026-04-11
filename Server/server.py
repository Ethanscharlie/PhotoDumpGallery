from flask import Flask, send_file, request, jsonify, g
from io import BytesIO
from db import engine
from sqlalchemy.orm import Session
from sqlalchemy import select

from models.User import User
from models.Album import Album
from models.Image import Image
import jwt
import datetime
from functools import wraps


app = Flask(__name__)

JWT_KEY = "feiwofbtrbrtigro"


def requireAuth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({"message": "Missing Authorization header"}), 401

        try:
            token = auth_header.split(" ")[1]
            decoded = jwt.decode(token, JWT_KEY, algorithms=["HS256"])

            g.user_id = decoded["user_id"]

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401

        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        return f(*args, **kwargs)

    return decorated


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


@app.route("/albumsFromAuthor")
def getAlbumsFromAuthor():
    id = request.args.get("id")

    with Session(engine) as session:
        stmt = select(Album).where(Album.author == id)
        all_albums = session.execute(stmt).scalars().all()

    return jsonify([album.albumID for album in all_albums])


@app.route("/userinfo")
def getUserInfo():
    id = request.args.get("id")

    with Session(engine) as session:
        stmt = select(User).where(User.userID == id)
        user = session.execute(stmt).scalars().first()

    return jsonify({"name": user.name})


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
@requireAuth
def checkToken():
    return jsonify({"valid": True, "user_id": g.user_id}), 200


@app.route("/upload", methods=["POST"])
@requireAuth
def upload():
    print("Got upload request")
    albumName = request.args.get("name")

    files = request.files.getlist("images")

    if len(files) <= 0:
        print("Upload Error: No files uploaded")
        return jsonify({"error": "No files uploaded"}), 400

    filteredFiles = [file for file in files if file.filename != "" if file.mimetype == "image/jpeg"]
    if len(filteredFiles) <= 0:
        print("Upload Error: No valid files uploaded")
        return jsonify({"error": "No files valid"}), 400

    newAlbum = Album(name=albumName, author=g.user_id)
    with Session(engine) as session:
        session.add(newAlbum)
        session.commit()
        session.refresh(newAlbum)

    print(newAlbum)

    for file in filteredFiles:
        newImage = Image(albumID=newAlbum.albumID, image=file.read(), likes=0, dislikes=0)
        with Session(engine) as session:
            session.add(newImage)
            session.commit()

    return jsonify({"message": "Files uploaded successfully"})
