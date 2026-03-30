import type { Route } from "./+types/home";
import ImageView from "../ImageView";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Photo Dump Gallery" },
    { name: "description", content: "Just my little photo dump" },
  ];
}

export default function Home() {
  return <ImageView />;
}
