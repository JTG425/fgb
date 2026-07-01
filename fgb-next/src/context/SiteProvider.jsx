"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchTheaterData, readCache } from "@/lib/fetchTheaterData";
import useSystemTheme from "@/lib/useSystemTheme";

export const SiteContext = createContext(null);

export const useSite = () => useContext(SiteContext);

export default function SiteProvider({ children }) {
  const [capShows, setCapShows] = useState(null);
  const [parShows, setParShows] = useState(null);
  const [slideshow, setSlideshow] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useSystemTheme();

  useEffect(() => {
    // Hydrate instantly from the localStorage cache, then revalidate
    // against the API (eTag-based) in the background.
    const cachedData = readCache();
    if (cachedData["Capitol"]) setCapShows(cachedData["Capitol"].data);
    if (cachedData["Paramount"]) setParShows(cachedData["Paramount"].data);
    if (cachedData["Upcoming"]) setUpcoming(cachedData["Upcoming"].data);
    if (cachedData["Slideshow"]) setSlideshow(cachedData["Slideshow"].data);
    if (
      cachedData["Capitol"] &&
      cachedData["Paramount"] &&
      cachedData["Upcoming"] &&
      cachedData["Slideshow"]
    ) {
      setLoading(false);
    }

    const loadData = async () => {
      const fetchedData = await fetchTheaterData();
      if (fetchedData) {
        setCapShows(fetchedData.capShows);
        setParShows(fetchedData.parShows);
        setSlideshow(fetchedData.slideshow);
        setUpcoming(fetchedData.upcoming);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <SiteContext.Provider
      value={{
        capShows,
        parShows,
        upcoming,
        slideshow,
        loading,
        theme,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
}
