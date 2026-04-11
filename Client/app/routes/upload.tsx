import React, { useState, type ChangeEventHandler } from "react";
import Navigation from "~/Navigation";

export default function Upload() {
  const [albumName, setAlbumName] = useState("SomeAlbumName");
  const [images, setImages] = useState<FileList>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    if (e.target.files == null) return;
    setImages(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images == null) return;

    var data = new FormData()
    for (const file of images) {
      data.append("images", file);
    }

    try {
      const response = await fetch(`/api/upload?name=${albumName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data,
      });

      if (response.ok) {
        console.log("Successful")
        window.location.reload();
      } else {
        console.log("Failed")
      }
    } catch (error) {
      console.error('Error:', error);
      console.log("Failed, server error")
    }
  };

  return (
    <div>
      <Navigation />

      <form onSubmit={handleSubmit} method="POST">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
        />

        <button className="text-white text-center bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white" type="submit">Upload</button>
      </form>
    </div>
  )
}
