export function posterFormat(posterType = "") {
  if (/half[ -]sheet/i.test(posterType)) return "Half sheet";
  if (/one[ -]sheet/i.test(posterType)) return "One sheet";
  if (/insert/i.test(posterType)) return "Insert";
  if (/lobby/i.test(posterType)) return "Lobby card";
  if (/30\s*[x×]\s*40/i.test(posterType)) return "30 × 40";
  return "Other formats";
}

export const money = (value) => new Intl.NumberFormat("en-US", {
  style: "currency", currency: "USD", maximumFractionDigits: 2,
}).format(value);

export function posterPrice(poster) {
  return poster.askingPrice != null
    ? { label: "Asking price", value: money(poster.askingPrice) }
    : poster.estimatedValue != null
      ? { label: "Estimated value", value: money(poster.estimatedValue) }
      : { label: "Price", value: "On request" };
}

export function mergeCatalog(seed, overrides) {
  const merged = new Map(seed.map((poster) => [poster.id, poster]));
  overrides.forEach((poster) => merged.set(poster.id, { ...merged.get(poster.id), ...poster }));
  return Array.from(merged.values());
}

export function posterImageUrl(source, width = 640) {
  if (!source) return "";
  try {
    const url = new URL(source);
    if (url.protocol !== "https:") return "";
    if (url.hostname !== "drive.google.com") return url.href;
    const id = url.pathname.match(/^\/file\/d\/([\w-]+)/)?.[1] || url.searchParams.get("id");
    if (!id || !/^[\w-]+$/.test(id)) return "";
    const thumbnail = new URL("https://drive.google.com/thumbnail");
    thumbnail.searchParams.set("id", id);
    thumbnail.searchParams.set("sz", `w${width}`);
    const resourceKey = url.searchParams.get("resourcekey");
    if (resourceKey) thumbnail.searchParams.set("resourcekey", resourceKey);
    return thumbnail.href;
  } catch {
    return "";
  }
}

const searchable = (value) => String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function filterPosters(posters, { search = "", decade = "", format = "", availability = "", sort = "title" } = {}) {
  const terms = searchable(search).trim().split(/\s+/).filter(Boolean);
  return posters.filter((poster) => {
    const text = searchable([poster.title, poster.catalogNumber, poster.id, poster.year, poster.posterType, poster.description].join(" "));
    return terms.every((term) => text.includes(term))
      && (!decade || (poster.year && Math.floor(poster.year / 10) * 10 === Number(decade)))
      && (!format || posterFormat(poster.posterType) === format)
      && (availability !== "in-stock" || poster.quantity > 0)
      && (availability !== "hidden" || !poster.active);
  }).sort((a, b) => {
    const title = a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
    if (sort === "title-desc") return -title;
    if (sort === "oldest") return (a.year ?? Infinity) - (b.year ?? Infinity) || title;
    if (sort === "newest") return (b.year ?? -Infinity) - (a.year ?? -Infinity) || title;
    const aPrice = a.askingPrice ?? a.estimatedValue;
    const bPrice = b.askingPrice ?? b.estimatedValue;
    if (sort === "price-low") return (aPrice ?? Infinity) - (bPrice ?? Infinity) || title;
    if (sort === "price-high") return (bPrice ?? -Infinity) - (aPrice ?? -Infinity) || title;
    return title;
  });
}

export function validateRequest({ customerName, phone, comments = "" }) {
  if (!customerName?.trim() || customerName.trim().length > 100) return "Enter your name (up to 100 characters).";
  const digits = (phone || "").replace(/\D/g, "");
  if (!/^[+0-9().\s-]+$/.test(phone || "") || digits.length < 7 || digits.length > 15 || phone.length > 40) return "Enter a valid phone number with 7–15 digits.";
  if (comments.length > 2000) return "Keep comments to 2,000 characters or fewer.";
  return "";
}
