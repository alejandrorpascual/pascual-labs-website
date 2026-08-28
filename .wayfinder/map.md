---
title: Define the public Pascual Code Labs website
labels:
  - wayfinder:map
status: closed
---

## Destination

An implementation-ready specification for a compact, credible one-page website at `pascual-labs.com` that truthfully represents Pascual Code Labs LLC and satisfies Apple's organization-enrollment website requirement without pretending the company's apps are finished.

## Notes

- Domain: `pascual-labs.com`.
- Legal entity: Pascual Code Labs LLC, Florida document L25000050797, formed 2025-01-29.
- Company email: `alejandro@pascual-labs.com`.
- Enrollment-first release: one polished page, not a full studio portfolio or brand program.
- Apple requires the organization website to be public, functional, associated with the organization, and more substantial than minimal content or a registrar placeholder: <https://developer.apple.com/help/account/membership/program-enrollment/>.
- Use Wayfinder for every session on this map. Grilling tickets require the human to speak for the business; the agent must not invent answers.
- Planning only: implementation, deployment, DNS mutation, D-U-N-S work, and Apple enrollment are not authorized by this map.
- Prefer a no-cost hosting tier unless the human explicitly approves a cost.
- Any future DNS plan must preserve all existing Google Workspace MX and TXT records. Cloudflare is authoritative; Namecheap is not the website DNS control plane.
- Required page substance: legal company identity, a short truthful studio description, five apps clearly marked as in development, the domain-based work email, and a basic legal footer.

## Decisions so far

- [Define the company narrative and intended audience](tickets/001-company-narrative.md) — Present Pascual Code Labs as an independent studio building thoughtful apps for everyday habits, discovery, and decision-making.
- [Choose permissible public portfolio evidence](tickets/002-public-evidence.md) — Reference five real apps as works in development, without completion percentages, traction claims, or claims that they are available.
- [Specify the one-page content and visual treatment](tickets/003-contact-disclosure.md) — Use a clean editorial one-page layout with approved product copy, restrained decorative imagery, accessible system-aware theming, company contact, and no public street address.
- [Choose hosting and specify the safe launch handoff](tickets/004-visual-direction.md) — Deploy a framework-free site and health Worker to Cloudflare from validated `main` pushes, with canonical-domain redirects, least-privilege credentials, post-deploy checks, rollback, and mail-DNS safeguards.

## Not yet specified

<!-- No unresolved fog; remaining questions are represented by open child tickets. -->

## Out of scope

- Building, testing, deploying, or connecting the website; those belong to the implementation session that receives the resolved specification.
- Changing DNS records or any Google Workspace mail records while planning.
- D-U-N-S lookup or request and Apple Developer Program enrollment.
- Fabricating products, clients, testimonials, partnerships, metrics, or portfolio evidence to make the company appear more established.
- A full brand identity, logo program, elaborate motion system, separate case-study pages, testimonials, analytics, lead-capture forms, and publishing the business street address in the enrollment-first release.
