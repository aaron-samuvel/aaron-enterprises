# Aaron Enterprises — Industrial Spare Parts & Solutions

<p align="center">
  <img src="public/aaron-enterprises-logo.png" alt="Aaron Enterprises logo" width="120" />
</p>

**Live site:** https://aaron-samuvel.github.io/aaron-enterprises/

A fast, business-focused catalog website for an industrial machine spare parts company — product discovery, transparent GST pricing, wishlist/cart flows and bulk enquiry tools.

## Tech stack

| Layer | Technology |
|---|---|
| UI | React 19 + TypeScript 5 |
| Build | Vite 7 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Icons | lucide-react |

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server
npm run build     # typecheck + production build
npm run preview   # preview the production build locally
```

## Project structure

```
├── index.html              # Entry HTML (favicon + meta tags)
├── public/                 # Static assets (logo, favicons)
├── src/
│   ├── main.tsx            # React bootstrap
│   ├── App.tsx             # Layout: header, hero, sections, footer
│   ├── commerce.tsx        # Catalog, cart, wishlist, checkout pages
│   ├── pass3.tsx           # Admin panel, dashboards, invoices, support chat
│   ├── data.ts             # Product & category data
│   ├── routing.ts          # Base-path aware routing helpers (GitHub Pages)
│   └── styles.css          # Global styles
└── .github/workflows/      # CI + GitHub Pages deployment
```

## Deployment

- **Deploy:** pushes to `main` automatically build and publish to **GitHub Pages** (`.github/workflows/pages.yml`).
- **CI:** every pull request is typechecked and built before merge (`.github/workflows/ci.yml`).
- **Dependencies:** Dependabot opens weekly update PRs (`.github/dependabot.yml`).

## Roadmap

Tracked in [Issues](https://github.com/aaron-samuvel/aaron-enterprises/issues):

1. Add real business contact details
2. Add real product & category photos
3. Improve SEO meta tags & social sharing
