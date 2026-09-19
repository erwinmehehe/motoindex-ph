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
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  };
}
