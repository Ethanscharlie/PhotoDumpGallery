import type { Route } from "./+types/home";
import ImageView from "../ImageView";
import { useEffect, useState } from "react";
import AlbumView from "~/AlbumView";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Photo Dump Gallery" },
    { name: "description", content: "Just my little photo dump" },
  ];
}

export default function Home() {
  return (
    <div>
      <AlbumView id={1} key={1} />
      <AlbumView id={2} key={2} />
      <AlbumView id={3} key={3} />
    </div>
  )
}
