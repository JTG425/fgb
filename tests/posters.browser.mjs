// Run against a local Vite server. All AWS traffic is intercepted with fixtures;
// this test never submits a request or changes inventory in a live AWS account.
import { createRequire } from "node:module";
import { readFile, mkdir } from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:5173";
const output = process.env.TEST_OUTPUT_DIR || "/tmp/fgb-posters-tests";
const catalog = JSON.parse(await readFile(new URL("../src/data/poster-catalog.json", import.meta.url)));
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || "chrome" });
const context = await browser.newContext({ viewport: { width: 1440, height: 1080 }, colorScheme: "light", reducedMotion: "reduce" });
const state = { overrides: [], requests: [], failCatalog: false, failSubmit: false, listPages: 0 };
const unexpected = [];
const errors = [];
await context.route("**/*", async (route) => {
  const request = route.request();
  const url = request.url();
  if (url.startsWith(baseURL)) return route.continue();
  // Optional live image check; AWS requests are still intercepted below.
  if (process.env.TEST_PUBLIC_IMAGES === "1" && (new URL(url).hostname === "drive.google.com" || new URL(url).hostname.endsWith(".googleusercontent.com"))) return route.continue();
  const json = (data) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(data), headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*" } });
  if (url.includes("cognito-identity.")) {
    const target = request.headers()["x-amz-target"] || "";
    if (target.endsWith("GetId")) return json({ IdentityId: "us-east-1:00000000-0000-4000-8000-000000000001" });
    return json({ IdentityId: "us-east-1:00000000-0000-4000-8000-000000000001", Credentials: { AccessKeyId: "TESTACCESSKEY00000000", SecretKey: "fixture-secret-never-used-outside-this-test", SessionToken: "fixture-token", Expiration: Math.floor(Date.now() / 1000) + 3600 } });
  }
  if (url.includes("appsync-api.")) {
    const payload = request.postDataJSON();
    if (payload.query.includes("listPosterListings")) {
      state.listPages++;
      if (state.failCatalog) return json({ errors: [{ message: "Fixture service unavailable" }] });
      const second = payload.variables.nextToken;
      return json({ data: { listPosterListings: { items: second ? state.overrides.slice(1) : state.overrides.slice(0, 1), nextToken: !second && state.overrides.length > 1 ? "fixture-next-page" : null } } });
    }
    if (payload.query.includes("createPosterRequest")) {
      if (state.failSubmit) return json({ errors: [{ message: "Fixture failed write" }] });
      state.requests.push(payload.variables.input);
      return json({ data: { createPosterRequest: { id: payload.variables.input.id } } });
    }
    unexpected.push(payload.query);
    return json({ errors: [{ message: "Unexpected test operation" }] });
  }
  if (url.includes("execute-api.")) return json(Object.fromEntries(["Capitol", "Paramount", "Upcoming", "Slideshow"].map((name) => [name, [{ eTag: "test", data: [] }]])));
  return route.abort();
});
const page = await context.newPage();
page.setDefaultTimeout(10000);
page.on("pageerror", (error) => errors.push(error.message));
const waitReady = () => page.getByText("Checking the latest availability…").waitFor({ state: "hidden" });
try {
  await page.goto(`${baseURL}/posters`);
  await page.getByRole("heading", { name: "Posters", exact: true }).waitFor();
  await waitReady();
  assert.match(await page.locator(".poster-results-bar").innerText(), /1,032 listings/);
  assert.equal(await page.locator(".poster-card").count(), 24);
  if (process.env.TEST_PUBLIC_IMAGES === "1") {
    await page.waitForFunction(() => [...document.querySelectorAll(".poster-card-art img")].slice(0, 4).every(img => img.complete && img.naturalWidth > 0 && !img.src.includes("poster-placeholder")));
  }
  await page.screenshot({ path: `${output}/posters-desktop.png`, fullPage: false });
  console.log("Desktop catalog rendered.");
  const ratio = await page.locator(".poster-card-art img").first().evaluate((img) => img.width / img.height);
  assert.ok(Math.abs(ratio - 9 / 16) < .01);

  await page.getByRole("button", { name: "Next", exact: true }).click();
  assert.match(page.url(), /page=2/);
  await page.getByLabel("Search posters", { exact: true }).fill("MOV-0004");
  assert.equal(await page.locator(".poster-card").count(), 2);
  assert.ok(!new URL(page.url()).searchParams.has("page"));
  await page.getByRole("button", { name: /^View Running Brave,/ }).click();
  console.log("Search and detail dialog opened.");
  await page.getByRole("dialog").waitFor();
  await page.getByLabel("Your name", { exact: true }).fill("Test Collector");
  await page.getByLabel("Phone number", { exact: true }).fill("123");
  await page.getByRole("button", { name: "Send purchase request" }).click();
  assert.match(await page.getByRole("alert").innerText(), /valid phone number/);
  assert.equal(state.requests.length, 0);
  await page.getByLabel("Phone number", { exact: true }).fill("(802) 555-0100");
  await page.getByLabel("Comments", { exact: false }).fill("Please confirm the condition before collection.");
  state.failSubmit = true;
  await page.getByRole("button", { name: "Send purchase request" }).click();
  await page.getByText("We couldn’t confirm your request.", { exact: false }).waitFor();
  assert.equal(await page.getByLabel("Your name", { exact: true }).inputValue(), "Test Collector");
  state.failSubmit = false;
  await page.locator(".poster-request form").evaluate((form) => { form.requestSubmit(); form.requestSubmit(); });
  await page.getByRole("heading", { name: "Request received" }).waitFor();
  assert.equal(state.requests.length, 1);
  assert.equal(state.requests[0].posterId, "MOV-0004");
  assert.equal(state.requests[0].customerName, "Test Collector");
  assert.equal(state.requests[0].status, "NEW");
  console.log("Form failure/retry and submission verified.");
  await page.getByRole("button", { name: "Back to the collection" }).click();
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page.getByRole("button", { name: /^View Running Brave,/ }).click();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")), "View Running Brave, 1983, MOV-0004");

  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.getByRole("combobox", { name: "Decade" }).selectOption("1980");
  await page.getByRole("combobox", { name: "Format" }).selectOption("Half sheet");
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("price-high");
  assert.ok(await page.locator(".poster-card").count() > 0);
  await page.getByLabel("Search posters", { exact: true }).fill("no-result-xyz-123");
  await page.getByRole("heading", { name: "No posters found" }).waitFor();
  await page.getByRole("button", { name: "Reset filters" }).click();

  state.overrides = [{ ...catalog[0], quantity: 0 }, { ...catalog[1], active: false }];
  console.log("Filters verified; checking stock overrides.");
  await page.reload(); await waitReady();
  await page.getByLabel("Search posters", { exact: true }).fill("MOV-0001");
  await page.locator(".poster-card-button").click();
  await page.getByText("This poster is currently out of stock.").waitFor();
  assert.equal(await page.getByRole("button", { name: "Send purchase request" }).count(), 0);
  await page.keyboard.press("Escape");
  await page.getByLabel("Search posters", { exact: true }).fill("MOV-0002");
  assert.equal(await page.locator(".poster-card").count(), 0);

  state.overrides = []; state.failCatalog = true;
  console.log("Stock overrides verified; checking outages.");
  await page.goto(`${baseURL}/posters?poster=MOV-0004`);
  await page.getByText("Purchase requests are temporarily unavailable.", { exact: false }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Send purchase request" }).isDisabled(), true);
  await page.keyboard.press("Escape");
  state.failCatalog = false;
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await waitReady();

  for (const colorScheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/posters`); await waitReady();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Posters", exact: true }).waitFor();
    await page.getByRole("button", { name: "Close navigation menu" }).click();
    await page.getByRole("navigation", { name: "Mobile navigation" }).waitFor({ state: "hidden" });
    await page.screenshot({ path: `${output}/posters-mobile-${colorScheme}.png` });
    await page.locator(".poster-card-button").first().click();
    assert.equal(await page.getByRole("dialog").evaluate((dialog) => dialog.scrollWidth > dialog.clientWidth), false);
    await page.screenshot({ path: `${output}/poster-detail-mobile-${colorScheme}.png` });
    await page.keyboard.press("Escape");
  }
  for (const width of [320, 676, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (width > 675) {
      const fits = await page.locator(".nav-container").evaluate((header) => {
        const last = header.querySelector(".nav-buttons-container > div:last-child").getBoundingClientRect();
        return last.right <= header.getBoundingClientRect().right;
      });
      assert.ok(fits, `Navigation must fit at ${width}px`);
    }
  }
  await page.goto(`${baseURL}/admin`);
  await page.waitForURL(`${baseURL}/`);
  assert.equal(await page.getByRole("heading", { name: "Theater admin" }).count(), 0);
  assert.deepEqual(unexpected, []);
  assert.deepEqual(errors, []);
  console.log("PASS: catalog, pagination, filters, details, validation, failed-submit recovery, duplicate-submit guard, saved inventory overrides, service failure/retry, mobile light/dark, focus restoration, and disabled admin route.");
  console.log(`Screenshots: ${output}`);
} catch (error) {
  await page.screenshot({ path: `${output}/failure.png` });
  console.error((await page.locator("body").innerText()).slice(-2500));
  throw error;
} finally { await browser.close(); }
