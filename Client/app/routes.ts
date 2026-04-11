import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("album", "routes/album.tsx"),
  route("upload", "routes/upload.tsx"),
  route("author", "routes/author.tsx")
] satisfies RouteConfig;
