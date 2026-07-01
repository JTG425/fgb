const CACHE_KEY = "theaterCache";
const CATEGORIES = ["Capitol", "Paramount", "Upcoming", "Slideshow"];

// Safely read the localStorage cache — a corrupt entry must never crash the app.
export const readCache = () => {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    localStorage.removeItem(CACHE_KEY);
    return {};
  }
};

export const fetchTheaterData = async () => {
  try {
    const cachedData = readCache();
    const response = await fetch(process.env.NEXT_PUBLIC_AWS_API_GATEWAY_URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const apiData = await response.json();
    const newData = {};
    CATEGORIES.forEach((category) => {
      const apiEntry = apiData[category] && apiData[category][0];
      if (!apiEntry) return;
      if (cachedData[category] && cachedData[category].eTag === apiEntry.eTag) {
        newData[category] = cachedData[category].data;
      } else {
        newData[category] = apiEntry.data;
        cachedData[category] = {
          data: apiEntry.data,
          eTag: apiEntry.eTag,
        };
      }
    });
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
    } catch {
      // Storage quota exceeded or unavailable — the app still works without the cache.
    }
    return {
      capShows: newData["Capitol"],
      parShows: newData["Paramount"],
      upcoming: newData["Upcoming"],
      slideshow: newData["Slideshow"],
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
