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

  return (
    <div>
      <Navigation />
      {data.map((id) => (
        <ImageView id={id} key={id} />
      ))}
    </div>
  )
}
