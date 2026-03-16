import { useState, useEffect, useRef } from 'react'
import { User, Layers, Cpu, BarChart2, FileText, Send, ChevronDown, ChevronRight, Check, Copy, MapPin, Car, Bus, Map, Eye, Volume2 } from 'lucide-react'
import Footer from '../components/Footer'

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ── Animated counter ────────────────────────────────────────────────────────
function Counter({ from, to, suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(from)
  const [ref, visible] = useInView()
  useEffect(() => {
    if (!visible) return
    const start = performance.now()
    const frame = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(from + (to - from) * ease))
      if (p < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [visible, from, to, duration])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ── Processing flow data ────────────────────────────────────────────────────
const flowSteps = [
  { icon: <User size={18}/>,      label: 'User Input',            color: '#1E40AF', tip: 'Site coordinates, Lot ID, and analysis type submitted via POST request' },
  { icon: <Layers size={18}/>,    label: 'Input Resolver',         color: '#1D4ED8', tip: 'Multi-format resolver normalises coordinates, validates lot boundaries, and enriches parameters' },
  { icon: <Send size={18}/>,      label: 'API Layer',              color: '#2563EB', tip: 'FastAPI routing with Pydantic validation, CORS, and rate-limiting middleware' },
  { icon: <Cpu size={18}/>,       label: 'Spatial Engine',         color: '#3B82F6', tip: 'OSMnx graph extraction, NetworkX routing, GeoPandas spatial joins on PostGIS datasets' },
  { icon: <BarChart2 size={18}/>, label: 'Analytical Modules',     color: '#60A5FA', tip: 'Parallel execution of walking, driving, transit, context, view, and noise engines' },
  { icon: <Layers size={18}/>,    label: 'Viz Pipeline',           color: '#93C5FD', tip: 'Matplotlib + contextily choropleth render, isochrone overlay, annotation layers' },
  { icon: <FileText size={18}/>,  label: 'PDF Generator',          color: '#BFDBFE', tip: 'ReportLab multi-page PDF with scored tables, map insets, and executive summary' },
  { icon: <Send size={18}/>,      label: 'Response Delivery',      color: '#DBEAFE', tip: 'Binary image stream or PDF blob returned with appropriate Content-Type headers' },
]

// ── Cloud flow data ─────────────────────────────────────────────────────────
const cloudNodes = ['Frontend', 'Render Cloud', 'FastAPI', 'Spatial Modules', 'Static Data', 'Cache', 'Response']

// ── Repo tree ───────────────────────────────────────────────────────────────
const repoTree = [
  { name: 'Automated-Site-Analysis-API/', type: 'root', children: [
    { name: 'app.py', type: 'file', ext: 'py' },
    { name: 'render.yaml', type: 'file', ext: 'yaml' },
    { name: 'requirements.txt', type: 'file', ext: 'txt' },
    { name: 'runtime.txt', type: 'file', ext: 'txt' },
    { name: 'data/', type: 'folder', children: [
      { name: 'BUILDINGS_FINAL.gpkg', type: 'file', ext: 'gpkg' },
      { name: 'ZONE_REDUCED.gpkg', type: 'file', ext: 'gpkg' },
    ]},
    { name: 'modules/', type: 'folder', children: [
      { name: 'walking.py', type: 'file', ext: 'py' },
      { name: 'driving.py', type: 'file', ext: 'py' },
      { name: 'transport.py', type: 'file', ext: 'py' },
      { name: 'context.py', type: 'file', ext: 'py' },
      { name: 'view.py', type: 'file', ext: 'py' },
      { name: 'noise.py', type: 'file', ext: 'py' },
    ]},
  ]},
]

// ── Modules ─────────────────────────────────────────────────────────────────
const modules = [
  { id: 'walking', icon: <MapPin size={18}/>, label: 'Walking Accessibility Analysis', color: '#0F7B55',
    details: ['OSMnx walk graph extraction from OpenStreetMap network', 'NetworkX shortest-path routing with Dijkstra weighting', 'Amenity point clustering via KD-tree proximity search', 'Service buffer generation at 400 m / 800 m / 1200 m radii'] },
  { id: 'driving', icon: <Car size={18}/>, label: 'Driving Distance Analysis', color: '#1B55CC',
    details: ['Drive network extraction with turn-restriction enforcement', 'Travel-time isochrone mapping at 5 / 10 / 15 minute thresholds', 'Betweenness centrality scoring for road corridor ranking', 'Parking node proximity and capacity estimation'] },
  { id: 'transport', icon: <Bus size={18}/>, label: 'Transportation Network Analysis', color: '#6B21A8',
    details: ['Bus stop and rail station proximity mapping', 'Transit node density grid interpolation', 'Route-level frequency and coverage scoring', 'Multi-modal connection index calculation'] },
  { id: 'context', icon: <Map size={18}/>, label: 'Context & Zoning Mapping', color: '#92400E',
    details: ['Zoning layer overlay with ZONE_REDUCED.gpkg', 'Amenity distribution heat-mapping across 14 categories', 'Green space and parkland proximity scoring', 'Urban density estimation from building footprints'] },
  { id: 'view', icon: <Eye size={18}/>, label: '360° View Classification Engine', color: '#0E7490',
    formula: true,
    details: ['Sector-based scoring across 36 × 10° radial slices', 'Sky-view factor computed from building height data', 'Visual obstruction mapping using line-of-sight rays'],
    formulaBlock: `Green Score = green_ratio
Water Score = water_ratio
City Score  = height_norm × density_norm
Open Score  = (1 − density_norm) × (1 − height_norm)` },
  { id: 'noise', icon: <Volume2 size={18}/>, label: 'Road Traffic Noise Model', color: '#9A3412',
    noiseFormula: true,
    details: ['Point-source attenuation across OSM road network', 'Road classification weighting (motorway → residential)', 'Receptor grid generation at 25 m spatial resolution', 'dB(A) contour rendering with colour-mapped legend'],
    noiseEq: 'L = L₀ − 20 log₁₀(r)' },
]

// ── API endpoints ────────────────────────────────────────────────────────────
const endpoints = [
  { method: 'POST', path: '/walking',   desc: 'Walk isochrone & amenity reach' },
  { method: 'POST', path: '/driving',   desc: 'Drive isochrone & road centrality' },
  { method: 'POST', path: '/transport', desc: 'Transit node proximity scoring' },
  { method: 'POST', path: '/context',   desc: 'Zoning & amenity distribution' },
  { method: 'POST', path: '/view',      desc: '360° sector view classification' },
  { method: 'POST', path: '/noise',     desc: 'Traffic noise attenuation model' },
  { method: 'POST', path: '/report',    desc: 'Full PDF feasibility report' },
]

// ── Timeline stages ──────────────────────────────────────────────────────────
const stages = [
  'Project scoping & data source evaluation',
  'OSM network graph extraction pipeline',
  'Walking accessibility module (OSMnx + NetworkX)',
  'Driving distance module with isochrone mapping',
  'Transit network analysis & scoring',
  'Context & zoning overlay integration',
  '360° view classification engine',
  'Road traffic noise attenuation model',
  'PDF report generation pipeline (ReportLab)',
  'API layer (FastAPI) + Pydantic validation',
  'Render cloud deployment & performance tuning',
]

// ── Significance bullets ─────────────────────────────────────────────────────
const significance = [
  'Advanced Geospatial Automation',
  'Urban Intelligence Modeling',
  'Network-Based Routing Systems',
  'Environmental Impact Simulation',
  'Sector-Based View Classification',
  'Modular API Architecture',
  'Cloud-Optimized GIS Deployment',
]

// ── Render.yaml code ─────────────────────────────────────────────────────────
const renderYaml = `services:
  - type: web
    name: automated-site-analysis-api
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app:app --host 0.0.0.0 --port \${PORT}
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
    autoDeploy: true`

// ── Tree node component ──────────────────────────────────────────────────────
function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(true)
  const isFolder = node.type === 'folder' || node.type === 'root'
  const extColor = { py: '#3B82F6', yaml: '#F59E0B', txt: '#6B7280', gpkg: '#10B981' }
  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 18 }}>
      <div onClick={() => isFolder && setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 6, cursor: isFolder ? 'pointer' : 'default', userSelect: 'none', transition: 'background 0.15s' }}
        onMouseEnter={e => { if (isFolder) e.currentTarget.style.background = '#F0F4FF' }}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
        {isFolder ? (open ? <ChevronDown size={13} color="#64748B"/> : <ChevronRight size={13} color="#64748B"/>) : <span style={{ width: 13 }}/>}
        <span style={{ fontSize: 13, fontFamily: 'monospace', color: isFolder ? '#1E293B' : (extColor[node.ext] || '#374151'), fontWeight: isFolder ? 600 : 400 }}>
          {node.name}
        </span>
      </div>
      {isFolder && open && (
        <div style={{ overflow: 'hidden', animation: 'expandDown 0.2s ease' }}>
          {node.children?.map(child => <TreeNode key={child.name} node={child} depth={depth + 1}/>)}
        </div>
      )}
    </div>
  )
}

// ── Cloud flow with animated dots ────────────────────────────────────────────
function CloudFlow() {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, minWidth: 700, padding: '24px 0' }}>
        {cloudNodes.map((node, i) => (
          <div key={node} style={{ display: 'flex', alignItems: 'center', flex: i < cloudNodes.length - 1 ? 1 : 0 }}>
            {/* Node */}
            <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: `all 0.5s ease ${i * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: `hsl(${220 + i * 8}, 70%, ${52 + i * 4}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.3)' }}/>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', textAlign: 'center', maxWidth: 72, lineHeight: 1.3 }}>{node}</span>
            </div>
            {/* Animated connector */}
            {i < cloudNodes.length - 1 && (
              <div style={{ flex: 1, height: 2, background: '#E2E8F0', position: 'relative', margin: '0 4px', marginBottom: 24 }}>
                <div style={{ position: 'absolute', top: -3, left: 0, width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', animation: visible ? `slideDot 2s ease-in-out ${i * 0.3}s infinite` : 'none' }}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 10 }}>{children}</p>
}

// ── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ children, sub }) {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} style={{ marginBottom: 40, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1E293B', letterSpacing: '-0.025em', marginBottom: 8 }}>{children}</h2>
      {sub && <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6 }}>{sub}</p>}
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function Architecture() {
  const [expandedModule, setExpandedModule] = useState(null)
  const [copiedEndpoint, setCopiedEndpoint] = useState(null)
  const [copiedYaml, setCopiedYaml] = useState(false)

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedEndpoint(key)
      setTimeout(() => setCopiedEndpoint(null), 1800)
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes expandDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDot { 0% { left: 0%; opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { left: calc(100% - 8px); opacity:0; } }
        @keyframes checkPop { 0% { transform:scale(0); } 60% { transform:scale(1.2); } 100% { transform:scale(1); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes arrowBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(4px); } }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 480, display: 'flex', alignItems: 'center' }}>

        {/* ── Background video ── */}
        {/*
          SWAP YOUR VIDEO SOURCE HERE
          ─────────────────────────────────────────────────────
          Local asset:   import heroVid from '../assets/hero.mp4'
                         then → src={heroVid}

          Public folder: src="/hero.mp4"

          Hosted URL:    src="https://example.com/hero.mp4"

          Multiple formats (best compatibility):
            <source src="/hero.mp4"  type="video/mp4" />
            <source src="/hero.webm" type="video/webm" />
          ─────────────────────────────────────────────────────
        */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        >
          <source src="/video2.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay — keeps text readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.75) 100%)', pointerEvents: 'none' }}/>

        {/* Subtle grid on top of video */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
          <defs>
            <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archGrid)"/>
        </svg>

        {/* Animated network lines on top of video */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }}>
          {[...Array(6)].map((_, i) => (
            <line key={i}
              x1={`${10 + i * 15}%`} y1="0%"
              x2={`${5  + i * 18}%`} y2="100%"
              stroke="white" strokeWidth="0.8"
              style={{ animation: `pulse ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}
            />
          ))}
        </svg>

        {/* Text content — sits above everything */}
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 32px 72px', position: 'relative', zIndex: 1, animation: 'fadeUp 0.7s ease' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: 16 }}>
            System Architecture
          </p>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: 20 }}>
            Automated Spatial<br/>Intelligence System
          </h1>
          <p style={{ fontSize: 17, color: '#CBD5E1', lineHeight: 1.75, maxWidth: 600 }}>
            End-to-end geospatial intelligence infrastructure powering automated urban feasibility modeling.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
            {['FastAPI', 'OSMnx', 'NetworkX', 'GeoPandas', 'Render Cloud'].map(tag => (
              <span key={tag} style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#CBD5E1', fontSize: 12, fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 32px 80px' }}>

        {/* ── SECTION 2: Processing Flow ─────────────────────────────────── */}
        <div style={{ marginBottom: 80 }}>
          <SectionLabel>End-to-End Pipeline</SectionLabel>
          <SectionHeading sub="Each request traverses a structured pipeline from raw input to formatted spatial output.">
            Processing Flow
          </SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {flowSteps.map((step, i) => {
              const [ref, visible] = useInView(0.1)
              return (
                <div key={step.label} ref={ref} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '100%', maxWidth: 560, background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.25s ease', cursor: 'default', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transitionDelay: `${i * 0.06}s` }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px rgba(37,99,235,0.12)`; e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'none' }}>
                    {/* Step number */}
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1D4ED8', flexShrink: 0 }}>{i + 1}</div>
                    {/* Icon */}
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${step.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, flexShrink: 0 }}>{step.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{step.label}</div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2, lineHeight: 1.5 }}>{step.tip}</div>
                    </div>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <div style={{ height: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                      <div style={{ width: 1.5, height: 10, background: '#CBD5E1' }}/>
                      <svg width="10" height="7" viewBox="0 0 10 7" fill="none" style={{ animation: 'arrowBounce 1.8s ease-in-out infinite' }}>
                        <path d="M5 7L0 0H10L5 7Z" fill="#94A3B8"/>
                      </svg>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── SECTION 3: Cloud Flow ──────────────────────────────────────── */}
        <div style={{ marginBottom: 80, background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, padding: '36px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <SectionLabel>Deployment</SectionLabel>
          <SectionHeading sub="Live data flow through the Render cloud execution environment.">
            Cloud Execution Flow
          </SectionHeading>
          <CloudFlow />
          <div style={{ display: 'flex', gap: 24, marginTop: 8, flexWrap: 'wrap' }}>
            {[{ label: 'Cold Start', value: '10–15s', color: '#F59E0B' }, { label: 'Cached', value: '<1s', color: '#10B981' }, { label: 'Avg Analysis', value: '3–8s', color: '#3B82F6' }].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }}/>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{m.label}: <strong style={{ color: '#1E293B' }}>{m.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        

        {/* ── SECTION 5: Module Breakdown ───────────────────────────────── */}
        <div style={{ marginBottom: 80 }}>
          <SectionLabel>Modules</SectionLabel>
          <SectionHeading sub="Click any module to inspect its technical implementation.">
            Module Breakdown
          </SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {modules.map(mod => {
              const isOpen = expandedModule === mod.id
              return (
                <div key={mod.id} style={{ background: 'white', border: `1px solid ${isOpen ? mod.color + '40' : '#E2E8F0'}`, borderRadius: 12, overflow: 'hidden', boxShadow: isOpen ? `0 4px 16px ${mod.color}18` : '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.25s ease' }}>
                  <button onClick={() => setExpandedModule(isOpen ? null : mod.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${mod.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: mod.color, flexShrink: 0 }}>{mod.icon}</div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', flex: 1 }}>{mod.label}</span>
                    <ChevronDown size={16} color="#94A3B8" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s' }}/>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', animation: 'expandDown 0.25s ease', borderTop: `1px solid ${mod.color}20` }}>
                      <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {mod.details.map(d => (
                          <div key={d} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: mod.color, marginTop: 7, flexShrink: 0 }}/>
                            <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{d}</p>
                          </div>
                        ))}
                        {mod.formulaBlock && (
                          <div style={{ marginTop: 12, background: '#0F172A', borderRadius: 10, padding: '16px 20px' }}>
                            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B', marginBottom: 10 }}>Scoring Formula</p>
                            <pre style={{ fontSize: 13, color: '#7DD3FC', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{mod.formulaBlock}</pre>
                          </div>
                        )}
                        {mod.noiseEq && (
                          <div style={{ marginTop: 12, background: '#0F172A', borderRadius: 10, padding: '16px 20px' }}>
                            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748B', marginBottom: 10 }}>Attenuation Equation</p>
                            <pre style={{ fontSize: 16, color: '#FCA5A5', fontFamily: "'JetBrains Mono', monospace', lineHeight: 1.8" }}>{mod.noiseEq}</pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>

      <footer className="border-t border-[#E2E8F0] bg-[#d1cfcf79]">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <p className="text-xs text-[#475569] text-center">
                        © 2026 ALKF. All rights reserved.
                    </p>
                </div>
            </footer>
    </div>
  )
}
