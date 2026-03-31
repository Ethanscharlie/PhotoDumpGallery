import type { Route } from "./+types/home";
import ImageView from "../ImageView";
import { useEffect, useState } from "react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Photo Dump Gallery" },
    { name: "description", content: "Just my little photo dump" },
  ];
}

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/allImages')
      .then(response => response.json())
      .then(jsonData => {
        setData(jsonData);
      })
      .catch(error => console.error('Fetch failed:', error));
  }, []);

  return (
    <div>
      {data.map((id) => (
        <ImageView id={id} key={id} />
      ))}
    </div>
  )
}
