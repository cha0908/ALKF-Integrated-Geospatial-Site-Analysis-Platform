<p>
  <img src="public/logo.png" width="140" align="left">
</p>

<h1 style="margin-top:0;">
ALKF – Integrated Geospatial Site Analysis Platform
</h1>

<hr>

# Executive Overview

**ALKF – Integrated Geospatial Site Analysis Platform** is a production-ready geospatial visualization interface engineered to present automated urban feasibility analysis in a structured, scalable, and enterprise-grade environment.

The platform acts as a controlled frontend orchestration layer for advanced spatial intelligence systems, delivering high-quality interactive visual outputs for professional planning workflows.

### Core Capabilities

- Structured Urban Site Intelligence Presentation  
- Automated Spatial Feasibility Visualization  
- Interactive Geospatial Mapping Interface  
- Infrastructure Context & Density Visualization  
- Modular API Orchestration Layer  
- Cloud-Optimized Static Deployment  
- SPA-Based Professional Dashboard Architecture  

This platform is designed for:

- Urban Planners  
- Architects  
- Infrastructure Consultants  
- Real Estate Analysts  
- GIS Researchers  
- Development Stakeholders  

---

# Production Deployment

## Deployment Environment

- Hosting Provider: **Render**
- Service Type: **Static Site**
- Build Framework: **Vite + React**
- Styling System: **Tailwind CSS**
- Output Directory: **dist**
- Node Version: **18+ Recommended**

This platform is optimized for static hosting and does not require a backend runtime.

---

## Render Static Configuration

### Build Command

```
npm install && npm run build
```

### Publish Directory

```
dist
```

### Environment Type

```
Static Site
```

No server process is required.

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

Local Development URL:

```
http://localhost:5173
```

Hot reload is enabled by default via Vite.

---

# Production Build Process

## Generate Optimized Production Build

```
npm run build
```

Build artifacts are generated inside:

```
/dist
```

This build is:

- Minified
- Tree-shaken
- Optimized for static hosting
- Tailwind-purged

---

## Preview Production Build Locally

```
npm run preview
```

This simulates production routing behavior before deployment.

---

# Deployment Verification Checklist

Before pushing to production:

- All SPA routes load without console errors  
- No hardcoded localhost endpoints  
- Environment variables configured properly  
- Assets correctly served from public directory  
- No unused component imports  
- Lighthouse performance above acceptable threshold  
- React Router navigation works on refresh  

---

# React Router Configuration for Static Hosting

Since this is a Single Page Application (SPA), client-side routing must be preserved on refresh.

Create:

```
public/_redirects
```

Add:

```
/* /index.html 200
```

This ensures direct URL access and refresh do not break routing.

---

# Repository Structure

```
ALKF-Integrated-Geospatial-Site-Analysis-Platform/
│
├── public/
│   ├── logo.png
│   ├── map.png
│   ├── video1.mp4
│   └── video2.mp4
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Layout.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Platform.jsx
│   │   ├── Architecture.jsx
│   │   ├── InteractiveMaps.jsx
│   │   ├── RequestAPI.jsx
│   │   └── About.jsx
│   │
│   ├── hooks/
│   ├── services/
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

---

# Architecture Overview

## Frontend Application Flow

User Access  
→ React Application (Vite Runtime)  
→ Router Layer (React Router)  
→ Modular Page Components  
→ API Service Layer  
→ External Spatial Intelligence API  
→ Response Handling  
→ Map / Visualization Rendering  

---

# Core Modules

## Home  
Enterprise landing interface introducing platform positioning and analytical capabilities.

## Platform  
Overview of spatial intelligence modules and architectural structure.

## Architecture  
Technical explanation of frontend routing, orchestration design, and deployment strategy.

## Interactive Maps  
Dedicated geospatial visualization interface rendering analytical outputs.

## Request API  
Frontend orchestration module enabling controlled API request submission and response handling.

## About  
Professional positioning, mission statement, and system design philosophy.

---

# Technology Stack

| Layer | Technology |
|-------|------------|
| Build Tool | Vite |
| Framework | React |
| Routing | React Router |
| Styling | Tailwind CSS |
| Deployment | Render Static |
| Visualization | HTML5 / Canvas / Embedded Map Engine |

---

# Environment Variable Configuration

If connecting to a backend API:

Create:

```
.env
```

Example:

```
VITE_API_BASE_URL=https://your-production-api.com
```

Access within application:

```
import.meta.env.VITE_API_BASE_URL
```

Important:
- Never commit `.env` to version control  
- Use `.env.production` for deployment environments  

---

# Testing & Validation Strategy

## Functional Testing

- Route transition validation  
- API request-response cycle testing  
- Error boundary handling  
- Mobile responsiveness verification  

## Performance Testing

- Lighthouse Audit  
- Bundle size inspection  
- Lazy-load validation  
- Asset compression verification  

## Production Smoke Testing

After deployment:

- Open root URL  
- Test deep-link routing  
- Refresh multiple routes  
- Trigger API call  
- Inspect console for runtime errors  
- Validate map rendering stability  

---

# Performance Optimization Strategy

- Production tree-shaking via Vite  
- Tailwind CSS purge optimization  
- Static asset compression  
- Component-level modularization  
- Deferred loading of heavy visualization modules  
- Controlled API request batching  

---

# Implementation Status

| Phase | Description | Status |
|-------|------------|--------|
| Phase 1 | Core React Architecture | Completed |
| Phase 2 | Tailwind Integration | Completed |
| Phase 3 | Modular Routing | Completed |
| Phase 4 | Map Visualization Isolation | Completed |
| Phase 5 | API Orchestration Layer | Completed |
| Phase 6 | UI System Refinement | Completed |
| Phase 7 | Static Deployment (Render) | Completed |

---

# Troubleshooting Guide

## Build Failure on Render

Verify:
- Node version compatibility  
- Correct build command  
- Correct publish directory  
- No missing dependencies  

---

## Blank Page After Deployment

Check:
- Console errors  
- Missing `_redirects` file  
- Incorrect base path configuration  
- Asset path resolution  

---

## API Request Failure

Verify:
- Environment variable configuration  
- Production API endpoint accessibility  
- CORS policy settings  

---

# Future Enhancements

- Authentication & Role-Based Access  
- Multi-project workspace  
- Dynamic spatial layer toggling  
- Exportable PDF reports  
- Enterprise SaaS packaging  
- Dark/Light theme switching  
- Micro-frontend expansion strategy  

---

# License

Refer to `LICENSE.md` for licensing details.

---

© ALKF – Integrated Geospatial Intelligence Platform
