import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputUrl = new URL("../out/", import.meta.url);

test("exports a complete GitHub Pages portfolio", async () => {
  const html = await readFile(new URL("index.html", outputUrl), "utf8");

  assert.match(
    html,
    /George Erfesoglou — Runtime Systems for Real-World Experiences/,
  );
  assert.match(html, /https:\/\/nonlin\.github\.io\/og\.png/);
  assert.match(html, /george-erfesoglou-resume-2026\.pdf/);
  assert.doesNotMatch(html, /Sign in required/);

  await Promise.all([
    access(new URL("og.png", outputUrl)),
    access(new URL("george-erfesoglou-resume-2026.pdf", outputUrl)),
    access(new URL("george-erfesoglou.webp", outputUrl)),
    access(new URL("omara-game.jpg", outputUrl)),
    access(new URL("physical-boids.jpg", outputUrl)),
  ]);
});
