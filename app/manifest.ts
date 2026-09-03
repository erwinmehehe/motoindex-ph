import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MotoIndex PH",
    short_name: "MotoIndex",
    description: "Motorcycle prices, specs, gear and ownership information for the Philippines.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbfbf8",
    theme_color: "#101317",
    icons: [{ src: "/brand/motoindex-mark.svg", sizes: "any", type: "image/svg+xml" }]
  };
}
