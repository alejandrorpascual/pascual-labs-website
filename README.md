# Pascual Code Labs website

Framework-free, one-page company website for `pascual-labs.com`, implemented from the completed Wayfinder map in [`.wayfinder/map.md`](.wayfinder/map.md).

## Local development

Requires Node.js 24 or newer.

```sh
npm install
npm run dev
```

Wrangler serves the static assets and Worker locally. The page is available at the URL printed by Wrangler; `/health` exercises the Worker health handler.

Install Chromium once before the first local E2E run:

```sh
npx playwright install chromium
npm run test:e2e
```

## Validation

```sh
npm run validate
```

This builds the site, type-checks the Worker, runs endpoint tests, verifies approved content and the exact five-product structure, and performs a Wrangler deployment dry run. It does not deploy.

The Playwright suite separately exercises the page in desktop and mobile Chromium, scans WCAG A/AA accessibility, checks navigation and images, and verifies health and 404 behavior.

## Branch and environment flow

```text
feature branch → PR to dev → dev → staging
dev            → PR to main → main → production
```

- Pull requests into `dev` or `main` run every local validation and E2E test without receiving deployment secrets.
- A passing push to `dev` deploys the same commit to `https://dev.pascual-labs.com`, then runs live endpoint and Chromium smoke tests.
- A passing push to `main` deploys the same commit to `https://pascual-labs.com`, then verifies health, content, the `www` redirect, a real 404, and live Chromium behavior.
- Failed E2E runs retain Playwright traces, screenshots, video, and the HTML report for seven days.
- Concurrency cancels stale runs on the same branch so an older commit cannot deploy after a newer one.
- Deployments require the repository variable `DEPLOYMENTS_ENABLED=true`. Keep it `false` until both GitHub Environments contain valid Cloudflare credentials.
- Each deployment snapshots every Cloudflare MX/TXT record before publishing and verifies the same normalized record set afterward. Missing DNS-read access or any mail-record change fails the workflow.

Protect both branches in GitHub. Require the `Validate and E2E` check and pull requests; disallow direct pushes to `main`. Promote staging through a `dev` → `main` pull request rather than merging unrelated changes directly into production.

## Production handoff

The workflow in `.github/workflows/pipeline.yml` validates pull requests, deploys `dev` to staging, and deploys `main` to production. Before enabling it:

1. Create the GitHub repository with `main` as its production branch.
2. Create GitHub Environments named `staging` and `production`. Add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as environment secrets in both. The values may be the same least-privilege credentials, but environment scoping prevents pull requests from accessing them. Never use a Global API Key.
3. Set the repository variable `DEPLOYMENTS_ENABLED` to `true` only after both environments are configured.
4. Export the full Cloudflare DNS record set. Record every Google Workspace MX and TXT value before attaching either Custom Domain.
5. Review the `dev.pascual-labs.com`, `pascual-labs.com`, and `www.pascual-labs.com` Custom Domain changes in Cloudflare. Do not edit website DNS at Namecheap while Cloudflare remains authoritative.
6. After the first deployment, confirm that all pre-existing MX, SPF, DKIM, verification, and other TXT records are byte-for-byte unchanged.
7. Manually confirm keyboard navigation, focus visibility, heading order, contrast, reduced motion, light/dark appearance, and responsive layouts. Run production Lighthouse and require LCP under 2.5 seconds, INP under 200 ms, and CLS under 0.1.

The workflow automatically checks production health, homepage identity/contact, the permanent `www` redirect, and a real 404 after deployment.

## Rollback

Use Cloudflare Worker version rollback for the fastest recovery, or redeploy the last known-good Git commit. After rollback, rerun the same health, homepage, redirect, 404, HTTPS, and mail-DNS checks.

No analytics, forms, tracking, cookies, or data collection are included.
