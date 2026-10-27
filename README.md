# AUTOWERK

AUTOWERK is an automation engineering studio. We build automated systems that remove operational friction for modern businesses: workflow automation, custom integrations and AI agents that run themselves.

This repository is the studio's website, a dark, cinematic single-page site that shows what we build and how we work.

## What's on the site

- **Hero:** an interactive, physics-based workflow graph that reacts to the cursor.
- **What we build:** live micro-UIs for workflow automation, custom integrations and process optimization.
- **Case studies:** a page per project with the problem, outcomes, architecture diagrams and stack. The first is the Dental Agent, a WhatsApp AI agent that qualifies implant enquiries and books consultations.
- **Process:** a scroll-stacked Audit, Architect, Deploy walkthrough.
- **Contact:** a call-to-action to book a consultation.

## Stack

React 19, Vite, Tailwind CSS 3, GSAP (with ScrollTrigger), React Router and Lucide icons.

## Run locally

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run lint     # lint the source
```

## Adding a case study

Add an entry to `src/data/caseStudies.js`. It appears on the home page and gets its own page at `/case-studies/<slug>`. If it needs a diagram, add a component in `src/components/diagrams/` and register it in `src/components/CaseStudyPage.jsx`.
