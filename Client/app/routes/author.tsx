import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import AlbumView from "~/AlbumView";
import Navigation from "~/Navigation";

export default function Author() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [name, setName] = useState("Some Guy");
  let authorID = searchParams.get("id")

  useEffect(() => {
    fetch(`/api/albumsFromAuthor?id=${authorID}`)
      .then(response => response.json())
      .then(jsonData => {
        jsonData.map((id) => {
          fetch(`/api/albumsFromAuthor?id=${authorID}`)
            .then(response => response.json())
            .then(imageJsonData => {
              setData(imageJsonData);
            })
            .catch(error => console.error('Fetch failed:', error));
        })
      })
      .catch(error => console.error('Fetch failed:', error));
  }, []);

  fetch(`/api/userinfo?id=${authorID}`)
    .then(response => response.json())
    .then(jsonData => {
      setName(jsonData["name"])
    })
    .catch(error => console.error('Fetch failed:', error));

  return (
    <div>
      <Navigation />

      <div className="p-10">
        <h1 className="text-5xl font-bold">{name}</h1>
        <br />

        {data.map((id) => (
          <AlbumView id={id} key={id} />
        ))}
      </div>
    </div>
  )
}
