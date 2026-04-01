import { useEffect, useState } from "react";

export default function AlbumView({ id = 1 }) {
  const [albumID, setAlbumID] = useState(0);
  const [name, setName] = useState("");
  const [authorID, setAuthorID] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  let albumUrl = `/album?id=${id}`

  useEffect(() => {
    fetch(`/api/album?id=${id}`)
      .then(response => response.json())
      .then(jsonData => {
        setAlbumID(jsonData.albumID);
        setName(jsonData.name);
        setAuthorID(jsonData.authorID);
        setThumbnailUrl(`http://localhost:5000/image?id=${jsonData.thumbnailID}`);
      })
      .catch(error => console.error('Fetch failed:', error));
  }, []);

  return (
    <div>
      <a href={albumUrl}>
        <img className="ImageViewImage" src={thumbnailUrl} />
        <p>{id}</p>
        <p>{name}</p>
      </a>
    </div>
  );
}
