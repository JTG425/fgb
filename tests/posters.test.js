import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { filterPosters, mergeCatalog, posterFormat, posterImageUrl, posterPrice, validateRequest } from "../src/lib/posters.js";

const catalog = JSON.parse(readFileSync(new URL("../src/data/poster-catalog.json", import.meta.url)));

test("imports every stocked listing and preserves duplicate inventory numbers as distinct listings", () => {
  assert.equal(catalog.length, 1032);
  assert.equal(new Set(catalog.map((p) => p.id)).size, 1032);
  assert.equal(catalog.reduce((total, p) => total + p.quantity, 0), 1492);
  for (const id of ["MOV-0004", "MOV-0375", "MOV-0545", "MOV-0720"]) {
    assert.equal(catalog.filter((p) => p.catalogNumber === id).length, 2);
    assert.ok(catalog.some((p) => p.id === `${id}-2`));
  }
  assert.equal(catalog.filter((p) => p.year === null).length, 13);
  assert.ok(catalog.every((p) => p.askingPrice === null));
  assert.equal(catalog.filter((p) => posterImageUrl(p.imageUrl)).length, 1030);
  assert.deepEqual(catalog.filter((p) => !p.imageUrl).map((p) => p.id), ["MOV-0541", "MOV-0802"]);
});

test("turns public Drive sharing links into embeddable images and rejects unusable sources", () => {
  assert.equal(posterImageUrl("https://drive.google.com/file/d/poster-123/view?usp=sharing", 1200), "https://drive.google.com/thumbnail?id=poster-123&sz=w1200");
  assert.equal(posterImageUrl("https://drive.google.com/open?id=poster-123&resourcekey=key"), "https://drive.google.com/thumbnail?id=poster-123&sz=w640&resourcekey=key");
  assert.equal(posterImageUrl("https://example.com/poster.jpg"), "https://example.com/poster.jpg");
  for (const source of ["", "MOV-0099_Claires Knee.jpg", "javascript:alert(1)", "https://drive.google.com/drive/folders/folder-123"]) assert.equal(posterImageUrl(source), "");
});

test("searches title, catalog number, year, and descriptive terms together", () => {
  assert.equal(filterPosters(catalog, { search: "  BLUE velvet  " }).some((p) => p.title === "Blue Velvet"), true);
  assert.equal(filterPosters(catalog, { search: "MOV-0004" }).length, 2);
  assert.ok(filterPosters(catalog, { search: "1983" }).some((p) => p.title === "The Big Chill"));
  assert.equal(filterPosters(catalog, { search: "nothing-matches-this-title" }).length, 0);
});

test("combines decade, format and stock filters", () => {
  const result = filterPosters(catalog, { decade: "1980", format: "One sheet", availability: "in-stock" });
  assert.ok(result.length > 0);
  assert.ok(result.every((p) => p.year >= 1980 && p.year < 1990 && posterFormat(p.posterType) === "One sheet" && p.quantity > 0));
});

test("sorts missing years/values last, retains zero prices, and uses asking prices when set", () => {
  const items = [{ id: "1", title: "A", year: null, estimatedValue: null }, { id: "2", title: "B", year: 1980, estimatedValue: 50, askingPrice: 0 }, { id: "3", title: "C", year: 1970, estimatedValue: 10 }];
  assert.deepEqual(filterPosters(items, { sort: "oldest" }).map((p) => p.id), ["3", "2", "1"]);
  assert.deepEqual(filterPosters(items, { sort: "newest" }).map((p) => p.id), ["2", "3", "1"]);
  assert.deepEqual(filterPosters(items, { sort: "price-low" }).map((p) => p.id), ["2", "3", "1"]);
  assert.deepEqual(filterPosters(items, { sort: "price-high" }).map((p) => p.id), ["3", "2", "1"]);
  assert.deepEqual(posterPrice(items[1]), { label: "Asking price", value: "$0.00" });
});

test("saved inventory replaces the baseline, including hidden or sold-out listings", () => {
  const override = { ...catalog[0], active: false, quantity: 0 };
  const added = { ...catalog[1], id: "new-poster" };
  const merged = mergeCatalog(catalog, [override, added]);
  assert.equal(merged.length, 1033);
  assert.equal(merged.find((p) => p.id === override.id).active, false);
  assert.equal(merged.find((p) => p.id === override.id).quantity, 0);
  const { imageUrl, ...legacyOverride } = override;
  assert.equal(mergeCatalog(catalog, [legacyOverride]).find((p) => p.id === override.id).imageUrl, imageUrl);
});

test("rejects empty names, invalid phones, and oversized comments before submission", () => {
  const good = { customerName: "Test Collector", phone: "+1 (802) 555-0100", comments: "Condition question" };
  assert.equal(validateRequest(good), "");
  for (const changed of [{ customerName: "   " }, { phone: "123" }, { phone: "802CALLNOW" }, { phone: "1".repeat(16) }, { comments: "x".repeat(2001) }]) {
    assert.ok(validateRequest({ ...good, ...changed }));
  }
});

test("public request schema provides no read/update/delete/subscription API", () => {
  const schema = readFileSync(new URL("../amplify/data/schema.graphql", import.meta.url), "utf8");
  assert.match(schema, /type PosterRequest\s+@model\(subscriptions: null, queries: null, mutations: \{ create: "createPosterRequest", update: null, delete: null \}\)/);
  const validation = readFileSync(new URL("../amplify/data/resolvers/Mutation.createPosterRequest.preAuth.1.req.vtl", import.meta.url), "utf8");
  assert.match(validation, /put\("status", "NEW"\)/);
  assert.match(validation, /nowISO8601/);
});
