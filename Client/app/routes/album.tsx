import type { Route } from "./+types/home";
import ImageView from "../ImageView";
import { useEffect, useState } from "react";
import AlbumView from "~/AlbumView";
import { useSearchParams } from "react-router";
import Navigation from "~/Navigation";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Photo Dump Gallery" },
    { name: "description", content: "Just my little photo dump" },
  ];
}

export default function Album() {
  const [data, setData] = useState([]);
  const [owns, setOwns] = useState(false);
  const [name, setName] = useState("");
  let [searchParams, setSearchParams] = useSearchParams();
  let id = searchParams.get("id")

  useEffect(() => {
    fetch(`/api/imagesInAlbum?id=${id}`)
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
      })
      .catch(error => console.error('Fetch failed:', error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`/api/album?id=${id}`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => response.json())
      .then(jsonData => {
        setName(jsonData.name);
        setOwns(jsonData.owns);
      })
      .catch(error => console.error('Fetch failed:', error));
  }, []);

  return (
    <div>
      <Navigation />
      {owns && <h1>You own this!</h1>}
      {data.map((id) => (
        <ImageView id={id} key={id} />
      ))}
    </div>
  )
}
