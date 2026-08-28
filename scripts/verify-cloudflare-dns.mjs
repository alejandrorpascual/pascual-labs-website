import { readFile, writeFile } from "node:fs/promises";

const [mode, snapshotPath] = process.argv.slice(2);
const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const zoneName = process.env.CLOUDFLARE_ZONE_NAME ?? "pascual-labs.com";

if (!apiToken || !accountId) {
  throw new Error("CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required");
}

if (!snapshotPath || !["snapshot", "compare"].includes(mode)) {
  throw new Error("Usage: node scripts/verify-cloudflare-dns.mjs <snapshot|compare> <snapshot-file>");
}

async function cloudflare(path) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    headers: { Authorization: `Bearer ${apiToken}` },
  });
  const payload = await response.json();

  if (!response.ok || !payload.success) {
    const messages = [...(payload.errors ?? []), ...(payload.messages ?? [])]
      .map(({ code, message }) => `${code ?? "Cloudflare"}: ${message}`)
      .join("; ");
    throw new Error(messages || `Cloudflare API returned ${response.status}`);
  }

  return payload;
}

async function findZoneId() {
  const query = new URLSearchParams({
    name: zoneName,
    "account.id": accountId,
    status: "active",
  });
  const payload = await cloudflare(`/zones?${query}`);

  if (payload.result.length !== 1) {
    throw new Error(`Expected one active ${zoneName} zone, found ${payload.result.length}`);
  }

  return payload.result[0].id;
}

async function readProtectedRecords(zoneId) {
  const records = [];
  let page = 1;
  let totalPages = 1;

  do {
    const query = new URLSearchParams({ page: String(page), per_page: "5000" });
    const payload = await cloudflare(`/zones/${zoneId}/dns_records?${query}`);
    records.push(...payload.result);
    totalPages = payload.result_info?.total_pages ?? 1;
    page += 1;
  } while (page <= totalPages);

  return records
    .filter(({ type }) => type === "MX" || type === "TXT")
    .map(({ type, name, content, priority, ttl, proxied }) => ({
      type,
      name,
      content,
      priority: priority ?? null,
      ttl,
      proxied: proxied ?? false,
    }))
    .sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
}

const zoneId = await findZoneId();
const currentRecords = await readProtectedRecords(zoneId);

if (currentRecords.length === 0) {
  throw new Error("No MX or TXT records were returned; refusing to continue");
}

if (mode === "snapshot") {
  await writeFile(snapshotPath, `${JSON.stringify(currentRecords, null, 2)}\n`, { mode: 0o600 });
  console.log(`Captured ${currentRecords.length} protected MX/TXT records before deployment.`);
} else {
  const expectedRecords = JSON.parse(await readFile(snapshotPath, "utf8"));
  if (JSON.stringify(currentRecords) !== JSON.stringify(expectedRecords)) {
    throw new Error("Cloudflare MX/TXT records changed during deployment");
  }
  console.log(`Verified ${currentRecords.length} protected MX/TXT records are unchanged.`);
}

