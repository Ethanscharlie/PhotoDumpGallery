import React, { useState, type ChangeEventHandler } from "react";
import Navigation from "~/Navigation";

export default function Upload() {
  const [albumName, setAlbumName] = useState("SomeAlbumName");
  const [images, setImages] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    if (e.target.files == null) return;
    setImages(Array.from(e.target.files));
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

      <form onSubmit={handleSubmit} method="POST" className="p-8">
        <input
          type="file"
          multiple
          accept="image/*"
          className="block w-full text-sm text-gray-500 
             file:mr-4 file:py-2 file:px-4
             file:rounded-lg file:border-0
             file:text-sm file:font-semibold
             file:bg-blue-50 file:text-blue-700
             hover:file:bg-blue-100"
          onChange={handleFileChange}
        />

        <input type="text" className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />

        <button className="text-white text-center bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white" type="submit">Upload</button>
      </form>

      {images.map((img, index) => (
        <div
          key={index}
          className="relative p-3 w-100"
        >
          <img
            src={URL.createObjectURL(img)}
            alt="preview"
            className="w-full h-full object-cover rounded"
          />
          <button
            className="absolute top-0 bg-red-500 text-white w-10 h-10 text-5xl font-bold rounded hover:bg-red-800"
            onClick={
              () => {
                const filteredImages = [...images.slice(0, index), ...images.slice(index + 1)];
                setImages(filteredImages)
              }
            }
          >-</button>
        </div>
      ))}
    </div>
  )
}
