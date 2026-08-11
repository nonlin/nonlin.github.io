import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders George Erfesoglou's portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>George Erfesoglou — Runtime Systems, Simulation &amp; Agentic QA<\/title>/i,
  );
  assert.match(html, /strange hardware/);
  assert.match(html, /Agents that can act/);
  assert.match(html, /MISSION \/ OUTCOME-04/);
  assert.match(html, /automated tests around the local VLM sidecar/);
  assert.match(html, /UI TREE → ACTION → ASSERTION/);
  assert.match(html, /Multi-million-dollar commissioning risk avoided/);
  assert.match(html, /control logic meets virtual equipment/);
  assert.match(html, /class="mobile-range" aria-label="At a glance"/);
  assert.match(html, /EXPERIENCE ACROSS/);
  assert.match(html, /Agentic tooling/);
  assert.match(html, /Runtime QA/);
  assert.match(html, /SDK to device/);
  assert.match(html, /Prototype to deployment/);
  assert.match(html, /Windows · macOS · Linux/);
  assert.doesNotMatch(
    html,
    /STACK SIGNAL|signal is live|stack-signal|Engine SDK → native layer → device/,
  );
  assert.doesNotMatch(html, /From scene understanding to controlled physical output/);
  assert.doesNotMatch(html, /vision-feature|vision-flow/);
  assert.match(html, /aria-label="Contact links"/);
  assert.match(html, /class="header-social header-playlist"/);
  assert.match(html, /class="mobile-playlist-link"/);
  assert.match(html, /Watch selected work on YouTube/);
  assert.match(html, /Work playlist/);
  assert.match(
    html,
    /youtube\.com\/watch\?v=uxg9X7YQ598(?:&|&amp;)list=PLkH17iOut64HeWTIJMsfctr0DD_tluakG/,
  );
  assert.match(html, /class="header-email" href="mailto:gerfeso@live.com"/);
  assert.match(html, /class="mobile-contact" href="mailto:gerfeso@live.com"/);
  assert.match(html, /Physical Boids/);
  assert.match(html, /Best in Show VR/);
  assert.match(html, /Virtual equipment/);
  assert.match(
    html,
    /oedigital\.com\/news\/460903-ensco-launches-continuous-tripping-technology/,
  );
  assert.match(html, /george-erfesoglou-resume-2026\.pdf/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});
