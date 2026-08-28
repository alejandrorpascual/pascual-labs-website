const baseUrl = process.env.SITE_URL ?? "https://pascual-labs.com";
const expectedOrigin = new URL(baseUrl).origin;
const isProduction = expectedOrigin === "https://pascual-labs.com";

async function retry(check, attempts = 24) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await check();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 5_000));
    }
  }
  throw lastError;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await retry(async () => {
  const health = await fetch(`${expectedOrigin}/health`, { redirect: "manual" });
  assert(health.status === 200, `Health returned ${health.status}`);
  assert(health.headers.get("cache-control") === "no-store", "Health is not no-store");
  assert(health.headers.get("content-type")?.startsWith("application/json"), "Health is not JSON");
  const payload = await health.json();
  assert(payload.status === "ok", "Health payload is not ok");
});

await retry(async () => {
  const homepage = await fetch(`${expectedOrigin}/`);
  const homepageText = await homepage.text();
  assert(homepage.status === 200, `Homepage returned ${homepage.status}`);
  assert(homepageText.includes("Pascual Code Labs LLC"), "Homepage is missing company identity");
  assert(homepageText.includes("alejandro@pascual-labs.com"), "Homepage is missing company email");
});

if (isProduction) {
  await retry(async () => {
    const www = await fetch("https://www.pascual-labs.com/verification?source=ci", { redirect: "manual" });
    assert(www.status === 308, `www returned ${www.status}, expected 308`);
    assert(www.headers.get("location") === `${expectedOrigin}/verification?source=ci`, "www redirect did not preserve path and query");
  });
}

await retry(async () => {
  const missing = await fetch(`${expectedOrigin}/definitely-not-a-real-page`);
  assert(missing.status === 404, `Missing path returned ${missing.status}, expected 404`);
});

console.log(`${isProduction ? "Production" : "Staging"} health, homepage, and 404 checks passed.`);
