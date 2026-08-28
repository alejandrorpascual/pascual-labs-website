# Pascual Code Labs Website

This context defines the public company website being created to support Pascual Code Labs LLC's Apple Developer Program organization enrollment.

## Language

**Enrollment-first website**:
The compact public company site that establishes Pascual Code Labs LLC's identity, current app work, and domain-based contact details for organization verification.
_Avoid_: Placeholder, temporary page, full portfolio

**App in development**:
A real Pascual Code Labs product that may be described publicly but is not presented as launched, downloadable, or commercially proven.
_Avoid_: Released app, available app, portfolio case study

**Canonical domain**:
`pascual-labs.com`, the authoritative public address for the website. The `www` hostname exists only to redirect visitors here.
_Avoid_: Root domain, primary URL

**Health endpoint**:
The public `/health` resource on the canonical domain that confirms the deployed website service is responding. It does not, by itself, prove that the homepage content is correct.
_Avoid_: Status page, uptime guarantee

**Production deployment**:
The website version automatically published from the `main` branch after validation succeeds.
_Avoid_: Preview, build, release candidate

**Mail DNS records**:
The existing Cloudflare MX and TXT records that provide Google Workspace delivery and authentication for `pascual-labs.com` and must remain unchanged by website deployment.
_Avoid_: Website DNS, host records

