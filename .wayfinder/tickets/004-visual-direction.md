---
title: Choose hosting and specify the safe launch handoff
labels:
  - wayfinder:grilling
parent: ../map.md
status: closed
assignee: codex
blocked_by:
  - 003-contact-disclosure.md
---

## Question

Which simple implementation stack and preferably free hosting platform should be used, and what deployment, Cloudflare root/`www` DNS, mail-record protection, HTTPS, responsive, accessibility, and content checks must the implementation handoff require?

## Resolution

### Architecture

- Build a framework-free static site with semantic HTML, modern CSS, and minimal browser JavaScript. React and a client-side router are unnecessary for this one-page site.
- Serve the static files as Cloudflare Worker static assets.
- Add a small TypeScript Worker entry point for canonical-host redirects and the health endpoint, then fall through to the `ASSETS` binding for normal files.
- Keep all website content deployable on Cloudflare's free Workers tier unless actual usage later requires a paid plan.
- Use Wrangler configuration with `main`, an assets directory and binding, and `run_worker_first` scoped to `/health` so static files remain on the optimized asset path.
- Do not use single-page-application fallback routing. The site has no client-side routes; unknown paths should return a real 404 response.

### Domains and DNS

- Use `https://pascual-labs.com` as the canonical website origin.
- Attach both `pascual-labs.com` and `www.pascual-labs.com` to the same Worker as Cloudflare Custom Domains.
- Permanently redirect every `www` request to the same path and query on the canonical origin. Prefer status 308 so the HTTP method is preserved.
- Let Cloudflare provision the website host records and TLS certificates through Custom Domains. Do not manually replace unrelated DNS records.
- Before the first domain attachment, export or read back the current Cloudflare DNS record set. After attachment, verify that all Google MX, SPF, DKIM, verification, and other TXT records are byte-for-byte unchanged.
- Never use Namecheap to manage website host records while Cloudflare remains authoritative.

### GitHub Actions deployment

- Create a Git repository with `main` as the production branch and connect it to GitHub before enabling deployment.
- On pull requests, install dependencies and run formatting, static validation, link checks, and automated tests without publishing a public preview.
- On pushes to `main`, rerun validation and deploy using `cloudflare/wrangler-action@v3`.
- Also allow a manual production run with `workflow_dispatch`.
- Store `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets. Never commit them or expose them to pull requests from forks.
- Use a scoped Cloudflare API token, not the Global API Key. Grant only the account and zone permissions Wrangler needs for Workers scripts and custom-domain routing. Avoid broad DNS edit permission; perform one-time domain setup separately if narrower deployment credentials cannot manage it.
- Pin third-party GitHub Actions to reviewed immutable commit SHAs during implementation, while documenting the upstream major version for maintainability.
- Use GitHub Actions concurrency so a newer `main` deployment supersedes an older in-progress deployment and only one production deployment runs at a time.

### Health endpoint

- `GET https://pascual-labs.com/health` returns HTTP 200 with `Content-Type: application/json; charset=utf-8` and `Cache-Control: no-store`.
- The response contains only non-sensitive fields such as `status: "ok"`, `service: "pascual-labs-website"`, and the deployed Git commit SHA when available.
- Support `HEAD /health` with the same status and headers and no response body.
- Other methods return 405 with an `Allow: GET, HEAD` header.
- Do not expose environment variables, account identifiers, dependency versions, internal errors, or Cloudflare credentials.
- Requests to `www.pascual-labs.com/health` follow the canonical-host redirect rather than becoming a second independent health resource.

### Post-deployment verification

The production workflow must fail if any of these checks fail after deployment:

1. `https://pascual-labs.com/health` returns 200, JSON, `status: "ok"`, and a no-store cache policy.
2. `https://pascual-labs.com/` returns 200 over valid HTTPS and contains `Pascual Code Labs LLC` plus `alejandro@pascual-labs.com`.
3. `https://www.pascual-labs.com/` returns a permanent redirect whose `Location` is the canonical HTTPS origin.
4. A representative missing path returns 404 rather than the homepage.
5. The deployed page has the approved five app entries, visibly identifies them as in development, and contains no unsupported launch or traction claims.
6. Responsive checks pass at narrow mobile, tablet, laptop, and wide desktop sizes.
7. Automated accessibility checks find no critical violations; keyboard navigation, visible focus, heading order, alt text, contrast, reduced motion, and system color-scheme behavior are manually confirmed.
8. A production Lighthouse run meets the agreed targets: LCP below 2.5 seconds, INP below 200 ms, and CLS below 0.1.
9. Cloudflare DNS read-back confirms the existing Google Workspace MX and TXT records are unchanged.

### Rollback

- Keep Cloudflare Worker versions available for immediate rollback to the last known-good deployment.
- Keep redeploying a known-good Git commit as the source-controlled fallback.
- After any rollback, rerun the same health, homepage, canonical redirect, 404, HTTPS, and mail-DNS verification checks.

### Documentation basis

- Cloudflare Workers GitHub Actions: <https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>
- Cloudflare static assets: <https://developers.cloudflare.com/workers/static-assets/>
- Cloudflare asset routing: <https://developers.cloudflare.com/workers/static-assets/routing/>
- Cloudflare Custom Domains: <https://developers.cloudflare.com/workers/configuration/routing/custom-domains/>
