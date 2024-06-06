import { getProperties, getUrl, downloadData } from "aws-amplify/storage";
import { Cache } from "aws-amplify/utils";

const cacheExpiration = new Date().getTime() + 1000 * 60 * 60 * 24; // 24 hours
const config = Cache.configure();
const newCache = Cache.createInstance({
  ...config,
  keyPrefix: "cache-",
});

export const fetchData = async (path) => {
  const cacheKey = `cache-${path}`;
  const existingCache = newCache.getAllKeys();
  if (existingCache.includes(cacheKey)) {
    const cachedData = newCache.getItem(cacheKey);
    return cachedData;
  } else {
    try {
      const file = await downloadData({
        path: path,
        CacheControl: "no-cache",
      }).result;
      const json = await file.body.text();
      const parsedData = JSON.parse(json);
      newCache.setItem(cacheKey, parsedData, cacheExpiration);
      return JSON.parse(json);
    } catch (error) {
      console.log("Error : ", error);
    }
  }
};
