import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const seed = fileURLToPath(new URL("../server/db.seed.json", import.meta.url));
const target = fileURLToPath(new URL("../server/db.json", import.meta.url));
const reset = process.argv.includes("--reset");

if (reset || !existsSync(target)) {
  copyFileSync(seed, target);
  console.log(reset ? "server/db.json reset to seed data" : "server/db.json created from seed data");
}
