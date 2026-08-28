import { expect, test } from "@playwright/test";

test("health endpoint is minimal and non-cacheable", async ({ request }) => {
  const response = await request.get("/health");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toBe("application/json; charset=utf-8");
  expect(response.headers()["cache-control"]).toBe("no-store");
  expect(await response.json()).toMatchObject({
    status: "ok",
    service: "pascual-labs-website",
  });
});

test("health rejects unsupported methods", async ({ request }) => {
  const response = await request.post("/health");
  expect(response.status()).toBe(405);
  expect(response.headers().allow).toBe("GET, HEAD");
});

test("unknown paths return a real 404", async ({ request }) => {
  const response = await request.get("/definitely-not-a-real-page");
  expect(response.status()).toBe(404);
});

