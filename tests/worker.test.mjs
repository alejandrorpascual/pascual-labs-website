import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/index.ts";

const assetResponse = new Response("asset", { status: 200 });
const env = {
  ASSETS: {
    fetch: async () => assetResponse.clone(),
  },
  GIT_COMMIT_SHA: "abc123",
};

test("GET /health returns a non-cacheable, minimal JSON payload", async () => {
  const response = await worker.fetch(new Request("https://pascual-labs.com/health"), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.deepEqual(await response.json(), {
    status: "ok",
    service: "pascual-labs-website",
    commit: "abc123",
  });
});

test("HEAD /health returns the same headers without a body", async () => {
  const response = await worker.fetch(
    new Request("https://pascual-labs.com/health", { method: "HEAD" }),
    env,
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(await response.text(), "");
});

test("unsupported health methods return 405 and Allow", async () => {
  const response = await worker.fetch(
    new Request("https://pascual-labs.com/health", { method: "POST" }),
    env,
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "GET, HEAD");
});

test("www redirects permanently and preserves path and query", async () => {
  const response = await worker.fetch(
    new Request("https://www.pascual-labs.com/apps?ref=review"),
    env,
  );
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://pascual-labs.com/apps?ref=review");
});

test("normal requests fall through to the static asset binding", async () => {
  const response = await worker.fetch(new Request("https://pascual-labs.com/"), env);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "asset");
});

