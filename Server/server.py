import sqlite3
from flask import Flask, send_file, request, jsonify
from io import BytesIO
from dataclasses import dataclass

app = Flask(__name__)


class ImageRow:
    def __init__(self, imageID=-1, note="", likes=0, dislikes=0, albumID=0, image=None):
        self.imageID = imageID
        self.note = note
        self.likes = likes
        self.dislikes = dislikes
        self.albumID = albumID
        self.image = image

    @staticmethod
    def getWithQuery(q: str):
        rows = []

        connection = sqlite3.connect("../Database/database.db")
        cursor = connection.execute(q)

        output = cursor.fetchall()
        for row in output:
            rows.append(ImageRow(row[0], row[1], row[2], row[3], row[4], row[5]))
            print(rows[-1].imageID)

        connection.close()
        return rows

    @staticmethod
    def getAllFromAlbum(albumID: int):
        return ImageRow.getWithQuery(f"SELECT * FROM Images WHERE albumID = {albumID}")

    @staticmethod
    def getAll(albumID: int):
        return ImageRow.getWithQuery(f"SELECT * FROM Images")

    @staticmethod
    def getAllFromID(imageID: int):
        return ImageRow.getWithQuery(f"SELECT * FROM Images WHERE imageID = {imageID}")[0]


@app.route("/image")
def getImage():
    id = request.args.get("id")
    b = BytesIO(ImageRow.getAllFromID(id).image)
    return send_file(b, download_name="image.jpg", mimetype="image/jpg")


@app.route("/allImages")
def getAllImages():
    rows = ImageRow.getAll(id)
    images = [row.imageID for row in rows]
    return jsonify(images)
