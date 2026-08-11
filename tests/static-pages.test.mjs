import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const outputUrl = new URL("../out/", import.meta.url);

test("exports a complete GitHub Pages portfolio", async () => {
  const html = await readFile(new URL("index.html", outputUrl), "utf8");

  assert.match(
    html,
    /George Erfesoglou — Runtime Systems, Simulation &amp; Agentic QA/,
  );
  assert.match(html, /https:\/\/nonlin\.github\.io\/og\.png/);
  assert.match(html, /Agents that can act/);
  assert.match(html, /CONTINUE \/ DONE \/ BLOCKED/);
  assert.match(html, /aria-label="Contact links"/);
  assert.match(html, /class="header-email" href="mailto:gerfeso@live.com"/);
  assert.match(html, /george-erfesoglou-resume-2026\.pdf/);
  assert.match(html, /Move the risk/);
  assert.match(html, /Multi-million-dollar commissioning risk avoided/);
  assert.match(html, /EXPERIENCE ACROSS/);
  assert.match(html, /Agentic tooling \+ runtime QA/);
  assert.match(html, /Windows · macOS · Linux/);
  assert.doesNotMatch(html, /STACK SIGNAL|signal is live|stack-signal/);
  assert.doesNotMatch(html, /From scene understanding to controlled physical output/);
  assert.doesNotMatch(html, /vision-feature|vision-flow/);
  assert.match(
    html,
    /oedigital\.com\/news\/460903-ensco-launches-continuous-tripping-technology/,
  );
  assert.doesNotMatch(html, /Sign in required/);

  await Promise.all([
    access(new URL("og.png", outputUrl)),
    access(new URL("george-erfesoglou-resume-2026.pdf", outputUrl)),
    access(new URL("george-erfesoglou.webp", outputUrl)),
    access(new URL("omara-game.jpg", outputUrl)),
    access(new URL("physical-boids.jpg", outputUrl)),
  ]);
});
