<p>
  <img src="public/logo3.PNG" width="140" align="left">
</p>

<h1 style="margin-top:0;">
ALKF+ — Automated Spatial Intelligence System
</h1>

<hr>

> Modular geospatial intelligence platform for automated urban feasibility assessment and boundary intelligence analysis. Converts raw geographic lot data, addresses, and coordinates into structured analytical maps, PDF reports, and CAD exports via cloud-deployed APIs.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [System Architecture](#system-architecture)
3. [Pages & Modules](#pages--modules)
4. [API Services](#api-services)
5. [Repository Structure](#repository-structure)
6. [Deployment](#deployment)
7. [Routing Configuration](#routing-configuration)
8. [Performance & Optimization](#performance--optimization)
9. [Troubleshooting](#troubleshooting)
10. [Implementation Status](#implementation-status)
11. [Future Enhancements](#future-enhancements)

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- Git

### Installation

```bash
git clone https://github.com/Sudharsanselvaraj/ALKF-Integrated-Geospatial-Site-Analysis-Platform.git
cd ALKF-Integrated-Geospatial-Site-Analysis-Platform
npm install
npm run dev
```

Local development URL: `http://localhost:5173`

### Production Build

```bash
npm run build      # outputs to /dist
npm run preview    # simulate production routing locally
```

---

## System Architecture

```
User Request
    │
    ▼
React SPA (Vite + React Router)
    │
    ├── /                  → Home.jsx
    ├── /maps              → InteractiveMaps.jsx   → Site Analysis API
    ├── /master-land-plan  → MasterLandPlan.jsx    → Boundary Intelligence API
    ├── /architecture      → Architecture.jsx
    ├── /about             → About.jsx
    ├── /request-api       → RequestAPI.jsx
    └── /platform          → Platform.jsx
```

### Frontend Application Flow

```
User Access
  → Vite Runtime (React SPA)
  → React Router (client-side routing)
  → Page Component
  → API Service Layer
      ├── Site Analysis API  →  PNG maps / PDF report
      └── Boundary Intel API →  JSON arrays / DXF CAD file
  → Response Rendering
```

---

## Pages & Modules

### Home
Enterprise landing interface. Introduces platform positioning, core capabilities, and tech stack marquee. Features video hero, dashboard mockup, and feature cards.

### Site Analysis — `/maps`
Interactive analysis dashboard. Search lots by ID or address (with multi-lot merge support), select analysis type, and generate PNG maps or a full PDF report.

**Analysis types:**

| Analysis | Output |
|---|---|
| Walking Accessibility (5 / 15 min) | PNG isochrone map |
| Driving Distance | PNG drive-time rings + MTR routing |
| Transport Network | PNG transit accessibility |
| Context & Zoning | PNG land-use overlay |
| 360° View Analysis | PNG sector classification |
| Traffic Noise Model | PNG noise heatmap |
| Full Site Report | Multi-page PDF |

### Master Land Plan — `/master-land-plan`
Boundary Intelligence Engine interface. Converts any parcel identifier into a per-metre boundary dataset with view classification and noise level at every point.

**Inputs:**
- Lot selector (search by ID or address, multi-lot merge supported)
- Noise threshold slider (45–85 dB, default 65 dB)
- Output format toggle — JSON Analysis vs DXF Export
- Optional lease plan upload (PDF / PNG → non-building zone extraction)

**Outputs — JSON mode:**
- Summary stats (boundary points, noise range, noisy %, dominant view)
- Leaflet boundary map with per-point colour coding (View mode / Noise mode)
- View type breakdown bar chart
- Noise distribution histogram with threshold marker
- Non-building zones panel (when lease plan provided)

**Outputs — DXF mode:**
- Binary DXF R2010 file download
- 5 annotated layers: `SITE_BOUNDARY`, `VIEW_POINTS`, `NOISE_POINTS`, `NON_BUILDING`, `LABELS`

### Architecture — `/architecture`
Technical documentation page covering both API pipelines, cloud deployment flow, module breakdowns, and the Boundary Intelligence Engine spec including DXF layer structure, view type classification, and performance benchmarks.

**Design:** Industrial blueprint aesthetic — deep navy base, amber accents, JetBrains Mono data font.

### About — `/about`
Platform positioning, mission, engineering philosophy, capabilities, tech stack, and workflow.

### Request API — `/request-api`
API access request form collecting name, organisation, role, and intended use case.

### Platform — `/platform`
Four-stage pipeline overview: Network Extraction → Graph Modeling → Scoring Engine → Visualization Output.

---

## API Services

### Site Analysis API

Provides 7 spatial analysis endpoints returning PNG maps or PDF reports.

**Endpoints:**

| Method | Path | Returns |
|---|---|---|
| GET | `/` | Health check |
| POST | `/walking` | PNG — walk isochrone |
| POST | `/driving` | PNG — drive-time rings |
| POST | `/transport` | PNG — transit network |
| POST | `/context` | PNG — zoning context |
| POST | `/view` | PNG — 360° view |
| POST | `/noise` | PNG — noise heatmap |
| POST | `/report` | PDF — full report |
| GET | `/search` | Lot / address search |
| GET | `/lot-boundary` | Parcel boundary GeoJSON |

**Request model:**

```json
{
  "data_type": "LOT",
  "value": "IL 1657",
  "lon": null,
  "lat": null,
  "lot_ids": [],
  "extents": []
}
```

### Boundary Intelligence API

Converts parcel identifiers into per-metre boundary datasets.

**Endpoints:**

| Method | Path | Returns |
|---|---|---|
| GET | `/` | Health check |
| POST | `/site-intelligence` | JSON boundary arrays |
| POST | `/site-intelligence-dxf` | DXF R2010 binary |

**JSON response arrays** (all same length = perimeter in metres):

```
boundary.x[]   EPSG:3857 eastings
boundary.y[]   EPSG:3857 northings
view_type[]    "SEA" | "HARBOR" | "RESERVOIR" | "MOUNTAIN" | "PARK" | "GREEN" | "CITY"
noise_db[]     float dBA per point
is_noisy[]     bool — noise_db[i] >= db_threshold
```

> **Note:** All coordinates are EPSG:3857 (Web Mercator). The frontend converts to WGS84 for Leaflet rendering using the Mercator inverse formula.

---

## Repository Structure

```
ALKF-Integrated-Geospatial-Site-Analysis-Platform/
│
├── public/
│   ├── logo3.PNG
│   ├── map.png
│   ├── video1.MP4
│   ├── video2.mp4
│   └── _redirects              ← required for SPA routing on Render
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Platform.jsx
│   │   ├── Architecture.jsx
│   │   ├── InteractiveMaps.jsx
│   │   ├── MasterLandPlan.jsx  ← Boundary Intelligence Engine UI
│   │   ├── About.jsx
│   │   └── RequestAPI.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

> ⚠️ **Case-sensitive filenames:** The file must be named `MasterLandPlan.jsx` (capital L, capital P). Linux filesystems on Render are case-sensitive — incorrect casing causes a build failure even if it works locally on Windows.

---

## Deployment

### Render — Static Site

| Setting | Value |
|---|---|
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Node version | 18+ |
| Service type | Static Site |
| Auto-deploy | On push to `main` |

No server process required.

### Deployment Checklist

Before pushing to production:

- [ ] `public/_redirects` exists with `/* /index.html 200`
- [ ] All page filenames match their import paths exactly (case-sensitive)
- [ ] No hardcoded `localhost` URLs in any component
- [ ] `MasterLandPlan.jsx` is in `src/pages/` with correct capitalisation
- [ ] `App.jsx` imports `./pages/MasterLandPlan` (exact case)
- [ ] All 7 routes registered in `App.jsx`
- [ ] Nav links in `Navbar.jsx` match route paths

---

## Routing Configuration

This is a Single Page Application. Direct URL access and browser refresh require a redirect rule.

**`public/_redirects`** (create if missing):

```
/* /index.html 200
```

**`src/App.jsx` routes:**

```jsx
<Route path="/"                 element={<Home />} />
<Route path="/platform"         element={<Platform />} />
<Route path="/maps"             element={<InteractiveMaps />} />
<Route path="/master-land-plan" element={<MasterLandPlan />} />
<Route path="/architecture"     element={<Architecture />} />
<Route path="/about"            element={<About />} />
<Route path="/request-api"      element={<RequestAPI />} />
```

---

## Performance & Optimization

- Production tree-shaking via Vite
- Tailwind CSS purge — unused classes stripped at build time
- Leaflet loaded from CDN (deferred) — not bundled into the JS chunk
- Shared API dataset fetched once and reused across read-only map renders
- In-memory result caching in both APIs keyed by `MD5(data_type + value)`
- Static assets (video, images) served from `/public` without processing

---

## Troubleshooting

### Build fails — `Could not resolve "./pages/X"`

File casing mismatch between the import path and the actual filename on disk.

```bash
# Rename with git to force the change on case-insensitive systems
git mv src/pages/Masterlandplan.jsx src/pages/MasterLandPlan.jsx
git commit -m "fix: correct file casing for MasterLandPlan"
git push
```

### Blank page after deployment

1. Confirm `public/_redirects` exists with `/* /index.html 200`
2. Check browser console for module resolution errors
3. Verify all asset paths are relative, not absolute `/src/...`

### API request failure

- Confirm CORS is enabled on the backend (`allow_origins=["*"]`)
- `ADDRESS` type requires `lon` and `lat` pre-resolved from `/search`
- Render free tier cold start takes 10–15s on first request — retry once

### Leaflet map not rendering

Leaflet is loaded from CDN on first use. If the map container appears empty, check that `leaflet@1.9.4` CSS and JS loaded in the browser Network tab. Also verify the map container has a non-zero `height` set.

---

## Implementation Status

| Phase | Description | Status |
|---|---|---|
| 1 | Core React architecture + Vite + Tailwind | ✅ |
| 2 | Modular routing — React Router v6 | ✅ |
| 3 | Site Analysis module `/maps` | ✅ |
| 4 | Multi-lot site selector with proximity guard | ✅ |
| 5 | Lot boundary Leaflet preview | ✅ |
| 6 | Master Land Plan module `/master-land-plan` | ✅ |
| 7 | Architecture page — blueprint redesign + MLP section | ✅ |
| 8 | About, RequestAPI, Home, Platform pages | ✅ |
| 9 | Static deployment on Render | ✅ |
| 10 | SPA `_redirects` routing | ✅ |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Build Tool | Vite 5 |
| Framework | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Map Rendering | Leaflet 1.9.4 (CDN) |
| Fonts | Syne + JetBrains Mono (Architecture page) |
| Deployment | Render Static Site |
| CI/CD | GitHub → Render auto-deploy |

---

## Future Enhancements

- Authentication and role-based access control
- Batch multi-lot processing endpoint
- In-browser DXF viewer (no download required)
- Dark / light theme toggle
- Exportable comparison reports across multiple lots
- True drive-time isochrones (network-based, not circular rings)
- Mobile-responsive layout for field use
- Walking / cycling mode for the driving analysis module

---

© 2026 ALKF. All rights reserved.
