"use client";

import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useSite } from "@/context/SiteProvider";

// One reusable map — the Vite app duplicated this component per theater.
export default function TheaterMap({ longitude, latitude }) {
  const key = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  const { theme } = useSite();

  return (
    <Map
      mapboxAccessToken={key}
      initialViewState={{
        longitude,
        latitude,
        zoom: 14,
      }}
      style={{ width: "400px", height: "400px" }}
      mapStyle={`mapbox://styles/mapbox/${theme}-v11`}
    >
      <Marker latitude={latitude} longitude={longitude} />
    </Map>
  );
}
