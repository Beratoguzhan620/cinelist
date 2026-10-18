// Records the README walkthrough (tests/e2e/output/walkthrough.webm) on a phone-sized viewport.
import { mkdirSync, renameSync } from "node:fs";
import { chromium } from "playwright";

const APP = process.env.APP_URL ?? "http://localhost:8090";
const OUT = new URL("./output/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const viewport = { width: 390, height: 844 };
const context = await browser.newContext({ viewport, recordVideo: { dir: OUT, size: viewport } });
const page = await context.newPage();
const pause = (ms) => page.waitForTimeout(ms);

await page.goto(APP);
await page.getByText("Esaretin Bedeli").first().waitFor();
await pause(1400);
await page.mouse.wheel(0, 700);
await pause(900);
await page.mouse.wheel(0, -700);
await pause(700);

await page.getByLabel("Film adı ara", { exact: true }).pressSequentially("kış", { delay: 140 });
await pause(1200);
await page.getByLabel("Aramayı temizle").click();
await pause(600);

await page.getByRole("button", { name: "Bilim kurgu", exact: true }).click();
await pause(1200);
await page.getByRole("button", { name: "Liste görünümü" }).click();
await pause(1300);
await page.getByRole("button", { name: "Afiş görünümü" }).click();
await page.getByRole("button", { name: "Tümü" }).click();
await pause(700);

await page.getByText("Yıldızlararası").first().click();
await page.getByText("Özet").waitFor();
await pause(1800);
await page.mouse.wheel(0, 500);
await pause(1000);

await page.getByRole("button", { name: "Düzenle" }).click();
await page.getByLabel("Puan", { exact: true }).waitFor();
await pause(900);
await page.getByLabel("Puan", { exact: true }).fill("");
await page.getByLabel("Puan", { exact: true }).pressSequentially("9,1", { delay: 160 });
await pause(500);
await page.getByRole("button", { name: "Değişiklikleri kaydet" }).click();
await page.getByText("Değişiklikler kaydedildi.").waitFor();
await pause(2000);

const video = page.video();
await context.close();
renameSync(await video.path(), `${OUT}walkthrough.webm`);
await browser.close();
console.log("recorded walkthrough.webm");
