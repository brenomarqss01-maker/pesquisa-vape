import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = await readFile(resolve(root, "dist/server/index.js"), "utf8");
const manifest = JSON.parse(await readFile(resolve(root, "dist/.openai/hosting.json"), "utf8"));
assert.equal(manifest.d1, "DB");
assert.ok(!source.includes("__HERO_IMAGE_DATA__"), "hero image must be embedded");
const moduleUrl = `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const worker = await import(moduleUrl);
assert.equal(typeof worker.default?.fetch, "function");
const response = await worker.default.fetch(new Request("https://example.test/"), {});
assert.equal(response.status, 200);
const html = await response.text();
assert.match(html, /Pesquisa sobre Vape e Pod/);
assert.match(html, /data:image\/jpeg;base64,/);
const clientScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(clientScript, "client script must exist");
new Function(clientScript);

const saved = [];
const env = {
  DB: {
    prepare(sql) {
      return {
        bind(...values) {
          return { async run() { saved.push(values); return { success: true }; } };
        },
        async all() { return { results: [] }; },
      };
    },
  },
};
const surveyResponse = await worker.default.fetch(new Request("https://example.test/api/responses", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ course: "Enfermagem", period: 4, contact: "Sim", frequency: "Às vezes", firstUseAge: "Nunca usei", firstReason: "Não se aplica — nunca usei", lessHarmful: "Não", knowsSubstances: "Algumas" }),
}), env);
assert.equal(surveyResponse.status, 201);
assert.equal(saved.length, 1);
const loginResponse = await worker.default.fetch(new Request("https://example.test/api/management/login", { method: "POST", body: JSON.stringify({ password: "1290" }) }), env);
assert.equal(loginResponse.status, 200);
const cookie = loginResponse.headers.get("set-cookie").split(";")[0];
const statsResponse = await worker.default.fetch(new Request("https://example.test/api/management/stats", { headers: { cookie } }), env);
assert.equal(statsResponse.status, 200);
console.log("Worker validado: interface, formulário, autenticação e banco prontos.");
