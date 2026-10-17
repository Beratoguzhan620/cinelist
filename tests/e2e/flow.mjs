// End-to-end check of the web build against json-server. Saves screenshots to tests/e2e/output.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const APP = process.env.APP_URL ?? "http://localhost:8090";
const OUT = new URL("./output/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const failures = [];
const step = async (name, fn) => {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (error) {
    failures.push(name);
    console.log(`FAIL ${name}\n     ${String(error.message).split("\n")[0]}`);
  }
};

async function newPage(viewport) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  page.on("pageerror", (error) => failures.push(`page error: ${error.message}`));
  return page;
}

async function noHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 1) throw new Error(`page overflows horizontally by ${overflow}px`);
}

const shot = (page, name) => page.screenshot({ path: `${OUT}${name}.png` });
const cards = (page) => page.locator('a[href^="/films/"]');

// Desktop
const page = await newPage({ width: 1440, height: 900 });

await step("home lists 20 films", async () => {
  await page.goto(APP);
  await page.getByText("Esaretin Bedeli").first().waitFor();
  const count = await cards(page).count();
  if (count !== 20) throw new Error(`expected 20 cards, got ${count}`);
  await noHorizontalOverflow(page);
  await shot(page, "desktop-home");
});

await step("search is Turkish-aware", async () => {
  await page.getByLabel("Film adı ara", { exact: true }).fill("KIŞ");
  await page.getByText("20 filmden 1 tanesi").waitFor();
  await shot(page, "desktop-search");
});

await step("empty search shows a way back", async () => {
  await page.getByLabel("Film adı ara", { exact: true }).fill("zzzz");
  await page.getByText("Eşleşen film yok").waitFor();
  await shot(page, "desktop-search-empty");
  await page.getByRole("button", { name: "Filtreleri temizle" }).click();
  await page.getByText("20 film", { exact: true }).waitFor();
});

await step("genre filter", async () => {
  await page.getByRole("button", { name: "Komedi", exact: true }).click();
  await page.getByText("20 filmden 2 tanesi").waitFor();
  await shot(page, "desktop-genre");
  await page.getByRole("button", { name: "Tümü" }).click();
});

await step("sort by rating", async () => {
  await page.getByRole("button", { name: /^Sıralama/ }).click();
  await page.getByRole("radio", { name: /Puan/ }).click();
  const first = await cards(page).first().innerText();
  if (!first.includes("Esaretin Bedeli")) throw new Error(`first card is ${first}`);
});

await step("list view", async () => {
  await page.getByRole("button", { name: "Liste görünümü" }).click();
  await page.waitForTimeout(300);
  await shot(page, "desktop-list");
  await page.getByRole("button", { name: "Afiş görünümü" }).click();
});

await step("form validation", async () => {
  await page.getByRole("button", { name: "Film ekle" }).click();
  await page.getByLabel("Film adı", { exact: true }).waitFor();
  await page.getByRole("button", { name: "Filmi ekle" }).click();
  await page.getByText("Film adı zorunlu.").waitFor();
  await page.getByText("Bir tür seç.").waitFor();
  await shot(page, "desktop-form-errors");
  await page.getByLabel("Film adı", { exact: true }).fill("Uzak");
  await page.getByText("Film adı zorunlu.").waitFor({ state: "detached" });
});

await step("add a film", async () => {
  await page.getByLabel("Yıl", { exact: true }).fill("2002");
  await page.getByLabel("Süre (dakika)", { exact: true }).fill("110");
  await page.getByRole("button", { name: "Dram", exact: true }).click();
  await page.getByLabel("Puan", { exact: true }).fill("8,1");
  await page.getByLabel("Açıklama", { exact: true }).fill("İstanbul'da iş arayan genç Yusuf, fotoğrafçı akrabası Mahmut'un evine yerleşir.");
  await shot(page, "desktop-form-filled");
  await page.getByRole("button", { name: "Filmi ekle" }).click();
  await page.getByText("arşive eklendi").waitFor();
  await page.getByText("/ 10 puan").waitFor();
  await shot(page, "desktop-detail-new");
});

await step("edit updates the detail immediately", async () => {
  await page.getByRole("button", { name: "Düzenle" }).click();
  await page.getByLabel("Puan", { exact: true }).fill("8,4");
  await page.getByRole("button", { name: "Değişiklikleri kaydet" }).click();
  await page.getByText("8,4", { exact: true }).filter({ visible: true }).first().waitFor();
  await page.getByText("Değişiklikler kaydedildi.").waitFor();
});

await step("delete asks first and removes the film", async () => {
  await page.getByRole("button", { name: "Sil" }).click();
  await page.getByText("Film silinsin mi?").waitFor();
  await shot(page, "desktop-delete-confirm");
  await page.getByRole("button", { name: "Sil" }).last().click();
  await page.getByText('"Uzak" silindi.').waitFor();
  if ((await page.getByText("Uzak", { exact: true }).count()) > 0) throw new Error("film still listed");
});

await step("seed film detail", async () => {
  await page.goto(`${APP}/films/9`);
  await page.getByText("Özet").waitFor();
  await page.waitForTimeout(400);
  await shot(page, "desktop-detail");
});

await step("unknown film shows not found", async () => {
  await page.goto(`${APP}/films/does-not-exist`);
  await page.getByText("Film bulunamadı").waitFor();
});

await page.close();

// Mobile
const mobile = await newPage({ width: 390, height: 844 });
await step("mobile screens", async () => {
  await mobile.goto(APP);
  await mobile.getByText("Esaretin Bedeli").first().waitFor();
  await mobile.waitForTimeout(400);
  await noHorizontalOverflow(mobile);
  await shot(mobile, "mobile-home");
  await mobile.getByRole("button", { name: "Liste görünümü" }).click();
  await mobile.waitForTimeout(300);
  await shot(mobile, "mobile-list");
  await mobile.getByRole("button", { name: "Afiş görünümü" }).click();
  await mobile.goto(`${APP}/films/9`);
  await mobile.getByText("Özet").waitFor();
  await mobile.waitForTimeout(400);
  await noHorizontalOverflow(mobile);
  await shot(mobile, "mobile-detail");
  await mobile.goto(`${APP}/films/new`);
  await mobile.getByLabel("Film adı", { exact: true }).waitFor();
  await noHorizontalOverflow(mobile);
  await shot(mobile, "mobile-form");
});

await browser.close();

if (failures.length > 0) {
  console.log(`\n${failures.length} failure(s)`);
  process.exit(1);
}
console.log("\nall steps passed");
