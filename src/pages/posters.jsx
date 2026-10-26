import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import usePosterCatalog from "../hooks/usePosterCatalog";
import { filterPosters, posterFormat, posterPrice } from "../lib/posters";
import PosterDetails from "../components/PosterDetails";
import PosterImage from "../components/PosterImage";
import "../pagestyles/posters.css";

const PAGE_SIZE = 24;

export default function Posters() {
  const { posters, status, reload } = usePosterCatalog();
  const [params, setParams] = useSearchParams();
  const search = params.get("q") || "";
  const decade = params.get("decade") || "";
  const format = params.get("format") || "";
  const availability = params.get("stock") || "";
  const sort = params.get("sort") || "title";
  const active = useMemo(() => posters.filter((poster) => poster.active), [posters]);
  const filtered = useMemo(() => filterPosters(active, { search, decade, format, availability, sort }), [active, search, decade, format, availability, sort]);
  const decades = useMemo(() => [...new Set(active.filter((p) => p.year).map((p) => Math.floor(p.year / 10) * 10))].sort(), [active]);
  const formats = useMemo(() => [...new Set(active.map((p) => posterFormat(p.posterType)))].sort(), [active]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.max(1, Math.min(pages, Math.floor(Number(params.get("page")) || 1)));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = active.find((poster) => poster.id === params.get("poster"));
  const change = (key, value, replace = true) => {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value); else next.delete(key);
      if (!["page", "poster"].includes(key)) next.delete("page");
      return next;
    }, { replace });
  };
  const changePage = (value) => {
    change("page", String(value), false);
    document.getElementById("poster-collection")?.scrollIntoView({ block: "start" });
  };
  return <div className="page-container site-page-container">
    <main id="main-content" className="content-page posters-page" tabIndex={-1}>
      <section className="page-hero poster-hero">
        <div className="page-hero-copy"><span className="section-eyebrow">From our collection to yours</span><h1>Posters</h1><p>Take home a piece of movie history. Explore the physical movie posters in our theater’s collection and find something worth putting on your wall.</p></div>
        <div className="page-hero-aside"><strong>A closer look at cinema</strong>Browse the collection, explore each poster’s story, and send us a purchase request. We’ll take it from there.</div>
      </section>
      <section className="page-section" id="poster-collection" aria-labelledby="collection-heading">
        <div className="page-section-heading"><div><span className="section-eyebrow">Discover the archive</span><h2 id="collection-heading">The collection</h2></div><p>Individual condition notes. Decades of film.<br />A little something for every movie lover.</p></div>
        <div className="poster-toolbar">
          <label className="poster-search"><FiSearch aria-hidden="true" /><span className="sr-only">Search posters</span><input type="search" placeholder="Search titles, years, catalog numbers…" value={search} onChange={(e) => change("q", e.target.value)} /></label>
          <div className="poster-filter-row">
            <label>Decade<select value={decade} onChange={(e) => change("decade", e.target.value)}><option value="">All decades</option>{decades.map((value) => <option key={value} value={value}>{value}s</option>)}</select></label>
            <label>Format<select value={format} onChange={(e) => change("format", e.target.value)}><option value="">All formats</option>{formats.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Availability<select value={availability} onChange={(e) => change("stock", e.target.value)}><option value="">All posters</option><option value="in-stock">In stock</option></select></label>
            <label>Sort by<select value={sort} onChange={(e) => change("sort", e.target.value)}><option value="title">Title: A–Z</option><option value="title-desc">Title: Z–A</option><option value="oldest">Release: oldest first</option><option value="newest">Release: newest first</option><option value="price-low">Price / value: low to high</option><option value="price-high">Price / value: high to low</option></select></label>
          </div>
        </div>
        {status === "loading" && <p className="shop-notice" role="status">Checking the latest availability…</p>}
        {status === "error" && <div className="shop-notice" role="status">Catalog updates are temporarily unavailable. You can browse the collection, but requests are paused. <button className="shop-text-button" onClick={reload}>Try again</button></div>}
        <div className="poster-results-bar"><p aria-live="polite">{filtered.length.toLocaleString()} {filtered.length === 1 ? "listing" : "listings"}{filtered.length > 0 && <span> · Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</span>}</p>{(search || decade || format || availability || sort !== "title") && <button className="shop-text-button" onClick={() => setParams({})}>Clear filters</button>}</div>
        {visible.length ? <div className="poster-grid">{visible.map((poster) => {
          const price = posterPrice(poster);
          return <article className="poster-card" key={poster.id}><button onClick={() => change("poster", poster.id, false)} className="poster-card-button" aria-label={`View ${poster.title}, ${poster.year || "year unknown"}, ${poster.id}`}>
            <div className="poster-card-art"><PosterImage imageUrl={poster.imageUrl} title={poster.title} /><span className={`poster-stock${poster.quantity === 0 ? " sold-out" : ""}`}>{poster.quantity > 0 ? `${poster.quantity} available` : "Out of stock"}</span><span className="poster-card-open" aria-hidden="true"><FiArrowUpRight /></span></div>
            <div className="poster-card-copy"><div className="poster-card-meta"><span>{poster.year || "Year unknown"}</span><span>{posterFormat(poster.posterType)}</span></div><h3>{poster.title}</h3><span className="poster-card-reference">{poster.id}</span><div className="poster-card-price"><strong>{price.value}</strong><span>{price.label}</span></div></div>
          </button></article>;
        })}</div> : <div className="shop-empty"><FiSearch aria-hidden="true" /><h3>No posters found</h3><p>Try a different title, year, or a broader set of filters.</p><button className="shop-button secondary" onClick={() => setParams({})}>Reset filters</button></div>}
        {pages > 1 && <nav className="poster-pagination" aria-label="Poster pages"><button className="shop-button secondary" disabled={page === 1} onClick={() => changePage(page - 1)}>Previous</button><span>Page {page} of {pages}</span><button className="shop-button secondary" disabled={page === pages} onClick={() => changePage(page + 1)}>Next</button></nav>}
        <p className="poster-collection-note">Values shown are per poster. Estimated values are catalog estimates; the theater will confirm the final selling price. Please review each listing’s photograph and condition notes.</p>
      </section>
      {selected && <PosterDetails key={selected.id} poster={selected} onClose={() => change("poster", "")} available={status === "ready"} />}
      {params.get("poster") && !selected && status !== "loading" && <div className="shop-notice" role="status">This listing is no longer available. <button className="shop-text-button" onClick={() => change("poster", "")}>Dismiss</button></div>}
    </main>
  </div>;
}
