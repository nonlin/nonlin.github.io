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
    /<title>George Erfesoglou — Agentic Systems, Runtime QA &amp; Real-World Software<\/title>/i,
  );
  assert.match(html, /strange hardware/);
  assert.match(html, /Agents that can act/);
  assert.match(html, /MISSION \/ OUTCOME-04/);
  assert.match(html, /75 automated tests/);
  assert.match(html, /UI TREE → ACTION → ASSERTION/);
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
