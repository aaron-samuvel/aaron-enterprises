# Rudra Automation — Machine Tools

A responsive product and company website for Rudra Automation, a machine tool company in Coimbatore, India. The site presents the Turret Capstan, Auto Turret Capstan and SGS Single Spindle Automat ranges, their published technical tables, optional accessories, regional associates, company brochure and contact locations.

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Project structure

```
├── index.html                 # Page metadata and title
├── public/rudra/              # Rudra logo, machine photos, icon and brochure
└── src/
    ├── App.tsx                # Company site and product specification views
    ├── main.tsx               # React entry point
    ├── rudra-data.json        # Structured content transcribed from the archive
    └── styles.css             # Responsive layout and styling
```

The Aaron Enterprises GST archive supplied with the project identifies a separate registered address. The website labels that address separately from Rudra Automation’s Coimbatore address and does not display GST identifiers or filing information.

## Deployment

The existing GitHub Pages workflow deploys pushes to `main`. Use `npm run build` before publishing changes.
