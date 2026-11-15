#!/usr/bin/env node
// Upload a rendered asset to the private "marketing" bucket through the asset-upload Edge Function.
// Usage: node marketing/upload.mjs <local file> <storage path items/<uuid>/<name>>
// The key is never in files: in Claude cloud sessions the network proxy injects the saved
// "WiyMood upload key" into the x-wiymood-secret header. Elsewhere set WIYMOOD_UPLOAD_SECRET.
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1; re-run once with it so the proxy (and its key) is used.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, ["--no-warnings", ...process.argv.slice(1)], {
    stdio: "inherit", env: { ...process.env, NODE_USE_ENV_PROXY: "1" },
  });
  process.exit(r.status ?? 1);
}

const [file, path] = process.argv.slice(2);
const secret = process.env.WIYMOOD_UPLOAD_SECRET || "proxy-injected"; // placeholder: the proxy overwrites this header
if (!file || !path) {
  console.error("usage: node marketing/upload.mjs <file> <items/<uuid>/<name>>");
  process.exit(1);
}
const contentType = /\.mp4$/i.test(file) ? "video/mp4" : /\.jpe?g$/i.test(file) ? "image/jpeg" : /\.pdf$/i.test(file) ? "application/pdf" : "image/png";
const res = await fetch("https://yvhbmwlbffyuowxjcafy.supabase.co/functions/v1/asset-upload", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-wiymood-secret": secret },
  body: JSON.stringify({ path, contentType, base64: readFileSync(file).toString("base64") }),
});
const text = await res.text();
console.log(res.status, text);
process.exit(res.ok ? 0 : 1);
