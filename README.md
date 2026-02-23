<p>
  <img src="public/logo.png" width="140" align="left">
</p>

<h1 style="margin-top:0;">
ALKF – Integrated Geospatial Site Analysis Platform
</h1>

<hr>

# Executive Overview

**ALKF – Integrated Geospatial Site Analysis Platform** is a structured urban intelligence interface engineered to present professional-grade spatial feasibility analysis through a modular, scalable, and deployment-ready frontend architecture.

The platform is designed to provide a controlled, enterprise-level visualization system for:

- Urban Site Intelligence Presentation  
- Spatial Feasibility Assessment  
- Interactive Geospatial Mapping  
- Infrastructure Context Visualization  
- Architectural & Planning Dashboards  
- Structured API Orchestration Layer  
- Static Cloud Deployment Compatibility  

This system targets urban planners, architects, infrastructure consultants, research engineers, and development stakeholders requiring structured spatial presentation interfaces.

---

# Production Deployment

## Deployment Environment

- Hosting Provider: Render  
- Service Type: Static Site  
- Framework: Vite + React  
- Build Output Directory: dist  
- Node Version: 18+ recommended  

## Render Static Configuration

When deploying on Render, configure the following:

### Build Command:
```
npm install && npm run build
```

### Publish Directory:
```
dist
```

### Environment:
```
Static Site
```

No backend runtime or server process is required.

---

# Local Development Setup

## 1. Clone Repository

```
git clone https://github.com/YOUR_USERNAME/ALKF-Integrated-Geospatial-Site-Analysis-Platform.git
cd ALKF-Integrated-Geospatial-Site-Analysis-Platform
```

## 2. Install Dependencies

```
npm install
```

## 3. Run Development Server

```
npm run dev
```

Default local development server:

```
http://localhost:5173
```

---

# Production Build Process

## Generate Optimized Build

```
npm run build
```

This generates a production-optimized static build inside:

```
/dist
```

## Preview Production Build Locally

```
npm run preview
```

This simulates production behavior before deployment.

---

# Deployment Verification Checklist

Before pushing to production:

- All routes load without console errors  
- No hardcoded localhost URLs  
- No unused imports  
- Tailwind build purge verified  
- Images load correctly from public directory  
- React Router routes function correctly  

---

# React Router Static Hosting Configuration

Since this is a Single Page Application (SPA), route refresh must be handled correctly.

Create the following file:

```
public/_redirects
```

Add the following content:

```
/* /index.html 200
```

This ensures client-side routing works on refresh and direct URL access.

---

# Repository Structure

```
ALKF-Integrated-Geospatial-Site-Analysis-Platform/
│
├── public/
│   ├── logo.png
│   ├── logo1.PNG
│   ├── logo3.PNG
│   ├── map.png
│   ├── video1.MP4
│   └── video2.mp4
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
│   │   ├── RequestAPI.jsx
│   │   └── About.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── .gitignore
```

---

# Architecture Overview

## Application Flow

User Access  
→ React Application (Vite Runtime)  
→ Routing Layer  
→ Page Modules  
→ Request API Interface  
→ External Spatial Intelligence API  
→ Response Visualization Layer  
→ Rendered Map / Data Output  

---

# Core Modules

## Home  
Enterprise landing interface presenting platform positioning and system orientation.

## Platform Overview  
Structured explanation of spatial intelligence capabilities and infrastructure modelling orientation.

## Architecture  
Technical explanation of system layering, routing architecture, and deployment strategy.

## Interactive Maps  
Dedicated visualization environment for geospatial layer rendering and context overlays.

## Request API  
Frontend orchestration layer interacting with an external spatial intelligence service.

## About  
Professional positioning and design philosophy articulation.

---

# Technology Stack

| Layer | Technology |
|-------|------------|
| Build Tool | Vite |
| Framework | React |
| Routing | React Router |
| Styling | Tailwind CSS |
| Deployment | Render Static |
| Media | Native HTML5 |

---

# Environment Variables (If Required)

If connecting to an external API:

Create:

```
.env
```

Example:

```
VITE_API_URL=https://your-api-endpoint.com
```

Access in code using:

```
import.meta.env.VITE_API_URL
```

Never commit sensitive keys to GitHub.

---

# Testing & Validation Strategy

## Functional Testing

- Validate route navigation  
- Test API request submission  
- Confirm response rendering  
- Validate error handling UI  

## Performance Testing

- Run Lighthouse audit  
- Verify bundle size  
- Confirm Tailwind purge effectiveness  
- Check media optimization  

## Production Smoke Test

After deployment:

- Open root URL  
- Refresh sub-routes  
- Test interactive map rendering  
- Validate API request response  
- Check browser console for runtime errors  

---

# Performance Optimization Strategy

- Vite production bundling  
- Static asset compression  
- Tailwind purge optimization  
- Modular page isolation  
- Lazy-loading potential for future scalability  

---

# Implementation Status

| Phase | Description | Status |
|-------|------------|--------|
| Phase 1 | Core React Architecture | Completed |
| Phase 2 | Tailwind Integration | Completed |
| Phase 3 | Modular Routing | Completed |
| Phase 4 | Map Isolation Module | Completed |
| Phase 5 | API Interface | Completed |
| Phase 6 | UI Refinement | Completed |
| Phase 7 | Static Deployment | Completed |

---

# Troubleshooting Guide

## Build Fails on Render  
Ensure:  
- Build command is correct  
- Publish directory is set to dist  
- Node version is compatible  

## Blank Page After Deployment  
Check:  
- Browser console errors  
- Missing _redirects file  
- Incorrect asset paths  

## API Not Responding  
Verify:  
- Environment variable configuration  
- Correct API base URL  
- CORS permissions  

---

# Future Enhancements

- Authentication layer  
- Role-based access  
- Dynamic spatial layer toggling  
- Exportable PDF reports  
- Administrative dashboard  
- SaaS architecture adaptation  
- Micro-frontend expansion  

---

# License

Refer to LICENSE.md for licensing information.

---

© ALKF – Integrated Geospatial Intelligence Platform
