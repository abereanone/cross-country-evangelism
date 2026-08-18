#!/usr/bin/env node
// Generates sitemap.xml for crosscountryevangelism.com.
//
// Run it locally from the repo root and commit the result:
//     node tools/gen-sitemap.mjs
//
// Deliberately NOT wired to a Cloudflare Pages build command. This project has no build
// step, so a deploy is a plain file copy and cannot fail; adding a build command would
// introduce a new way for the live site to break. Running locally also guarantees full
// git history for lastmod.
//
// Re-run whenever a newsletter is added.

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative, sep } from "node:path";

const ORIGIN = "https://crosscountryevangelism.com";
const ROOT = process.cwd();
const OUT = join(ROOT, "sitemap.xml");

const SKIP_DIRS = new Set([".git", "node_modules", "tools", "images", "docs"]);

// 404.html must never be listed. newsletter.xml is the RSS feed, not a page.
const SKIP_FILES = new Set(["404.html"]);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.name.endsWith(".html")) {
      const rel = relative(ROOT, full).split(sep).join("/");
      if (SKIP_FILES.has(rel)) continue;
      out.push(rel);
    }
  }
  return out;
}

// index.html -> /  ·  newsletter.html -> /newsletter  ·  newsletters/2026-01.html -> /newsletters/2026-01
//
// Extensionless, NO trailing slash. Cloudflare Pages serves this site that way and
// 308-redirects the .html form to it, so listing .html URLs would put a redirect in the
// sitemap. Each page's <link rel="canonical"> must match these exactly or Search Console
// reports "Duplicate, submitted URL not selected as canonical".
function toUrl(rel) {
  if (rel === "index.html") return ORIGIN + "/";
  return ORIGIN + "/" + rel.slice(0, -".html".length);
}

// Real per-file commit date. A sitemap where every lastmod is identical to the run time
// gets discounted by Google, so never fall back to "now" for a tracked file.
function lastmod(rel) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", rel], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (out) return out;
  } catch {
    // git missing or not a repo; fall through to mtime
  }
  return statSync(join(ROOT, rel)).mtime.toISOString(); // uncommitted file
}

const xmlEscape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const pages = walk(ROOT).sort();
const seen = new Set();
const entries = [];

for (const rel of pages) {
  const url = toUrl(rel);
  if (seen.has(url)) throw new Error(`duplicate URL from ${rel}: ${url}`);
  seen.add(url);
  entries.push({ url, lastmod: lastmod(rel) });
}

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  entries
    .map((e) => `  <url>\n    <loc>${xmlEscape(e.url)}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>\n`)
    .join("") +
  `</urlset>\n`;

writeFileSync(OUT, xml);
console.log(`sitemap.xml: ${entries.length} URLs`);
for (const e of entries) console.log(`  ${e.url}`);
