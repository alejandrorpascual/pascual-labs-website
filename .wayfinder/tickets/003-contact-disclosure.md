---
title: Specify the one-page content and visual treatment
labels:
  - wayfinder:grilling
parent: ../map.md
status: closed
assignee: codex
blocked_by:
  - 001-company-narrative.md
  - 002-public-evidence.md
---

## Question

What exact section order, concise copy, app descriptions, visual treatment, accessibility baseline, and footer should the one-page enrollment site use, with `alejandro@pascual-labs.com` as the contact and no public street address?

## Resolution

### Design read

Reading this as a compact greenfield studio landing page for Apple reviewers and future app users, with a clean editorial language and an asymmetric sans-serif layout with restrained motion.

- `DESIGN_VARIANCE: 6`
- `MOTION_INTENSITY: 3`
- `VISUAL_DENSITY: 3`
- Use native layout and styling rather than a heavyweight component system.

### Page structure and copy

1. **Header**
   - Text wordmark: `Pascual Code Labs`
   - One link: `Contact`, anchored to the contact section

2. **Studio introduction**
   - Headline: `Thoughtful apps for everyday life.`
   - Body: `Pascual Code Labs is an independent software studio building thoughtful apps for everyday habits, discovery, and decision-making.`
   - Primary link: `View the apps`

3. **Apps in development**
   - Section heading: `Apps in development`
   - Every product must be visibly presented as in development. Do not show completion percentages, launch dates, store links, customers, usage numbers, or other unsupported claims.
   - **Walk Blocker:** `An iOS app that helps people achieve their step goals by linking access to selected apps with intentional walking.`
   - **Macro Chef:** `An iOS app that estimates calories and macros for recipes saved from the web, then helps adjust them to match your nutrition goals.`
   - **Colofon:** `An app that helps readers organize their reading backlog, choose what to read next, and steadily finish the books and articles they have saved.`
   - **Music discovery app:** `An app that helps listeners track albums they want to explore and save recommendations from creators they follow.`
   - **Game discovery app:** `An app that helps players find and decide what to play next.`

4. **Company and contact**
   - Heading: `About Pascual Code Labs`
   - Body: `Pascual Code Labs LLC is a Florida software company focused on creating useful, considered consumer applications.`
   - Contact link: `alejandro@pascual-labs.com`
   - Do not publish the street address in this release.

5. **Legal footer**
   - `© 2026 Pascual Code Labs LLC. All rights reserved.`

### Visual treatment

- Greenfield, clean editorial studio direction.
- Use a cool off-white surface, charcoal text, and one restrained cobalt accent. Avoid the generic beige and brass creative-studio palette, AI-purple gradients, glassmorphism, and dark-tech styling.
- Use a modern sans-serif display and body family, preferably Geist or a similarly restrained self-hosted typeface. Do not use a decorative serif.
- Left-align the hero and use intentional asymmetric whitespace. The headline must remain at most two lines and the hero must fit within the initial viewport.
- Present the five products in an asymmetric five-cell grid with an exact five-cell count. Do not use five identical cards or a generic three-column feature row.
- Use one consistent soft radius system for media and product containers. Buttons or text links may use a pill treatment only if that rule is consistent.
- Real application screenshots are deferred. During implementation, create two or three restrained editorial images that are clearly decorative and cannot be mistaken for product interfaces. Do not generate fake screenshots or interface mockups.
- Keep motion limited to hover, focus, and a subtle initial reveal. Every transition must disappear when reduced motion is requested.
- Respect the system light or dark preference with one coherent token system. Do not invert individual sections.

### Responsive and accessibility baseline

- Semantic landmarks and heading order, keyboard-accessible links, visible focus states, descriptive image alternatives, and WCAG AA color contrast.
- No form, analytics, tracking, cookies, or data collection in the enrollment-first release.
- Collapse the product grid to one column below 768 px with comfortable 16 px minimum side padding.
- Keep navigation on one line and at most 80 px tall.
- Avoid layout shifts by reserving image dimensions and loading the hero visual efficiently.
- Target LCP below 2.5 seconds, INP below 200 ms, and CLS below 0.1.
