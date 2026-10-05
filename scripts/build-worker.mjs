import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const source = await readFile(resolve(root, "worker/index.js"), "utf8");
const image = await readFile(resolve(root, "public/capa-vape.jpeg"));
const built = source.replace("__HERO_IMAGE_DATA__", `data:image/jpeg;base64,${image.toString("base64")}`);

await rm(dist, { recursive: true, force: true });
await mkdir(resolve(dist, "server"), { recursive: true });
await mkdir(resolve(dist, ".openai"), { recursive: true });
await writeFile(resolve(dist, "server/index.js"), built);
await cp(resolve(root, ".openai/hosting.json"), resolve(dist, ".openai/hosting.json"));
await cp(resolve(root, "drizzle"), resolve(dist, "drizzle"), { recursive: true });
console.log(`Built ${dist}`);
