import { useState, useEffect, useRef } from 'react'
import {
  User, Layers, Cpu, BarChart2, FileText, Send, ChevronDown, ChevronRight,
  Check, Copy, MapPin, Car, Bus, Map, Eye, Volume2,
  Activity, Box, FileDown, Zap, GitBranch
} from 'lucide-react'
import Footer from '../components/Footer'

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
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
      const p    = Math.min((now - start) / duration, 1)
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
  { icon: <User size={18}/>,      label: 'User Input',        color: '#1E40AF', tip: 'Site coordinates, Lot ID, and analysis type submitted via POST request' },
  { icon: <Layers size={18}/>,    label: 'Input Resolver',    color: '#1D4ED8', tip: 'Multi-format resolver normalises coordinates, validates lot boundaries, and enriches parameters' },
  { icon: <Send size={18}/>,      label: 'API Layer',         color: '#2563EB', tip: 'FastAPI routing with Pydantic validation, CORS, and rate-limiting middleware' },
  { icon: <Cpu size={18}/>,       label: 'Spatial Engine',    color: '#3B82F6', tip: 'OSMnx graph extraction, NetworkX routing, GeoPandas spatial joins on PostGIS datasets' },
  { icon: <BarChart2 size={18}/>, label: 'Analytical Modules',color: '#60A5FA', tip: 'Parallel execution of walking, driving, transit, context, view, and noise engines' },
  { icon: <Layers size={18}/>,    label: 'Viz Pipeline',      color: '#93C5FD', tip: 'Matplotlib + contextily choropleth render, isochrone overlay, annotation layers' },
  { icon: <FileText size={18}/>,  label: 'PDF Generator',     color: '#BFDBFE', tip: 'ReportLab multi-page PDF with scored tables, map insets, and executive summary' },
  { icon: <Send size={18}/>,      label: 'Response Delivery', color: '#DBEAFE', tip: 'Binary image stream or PDF blob returned with appropriate Content-Type headers' },
]

// ── MLP pipeline data ───────────────────────────────────────────────────────
const mlpFlowSteps = [
  { icon: <User size={18}/>,      label: 'Site Input',           color: '#1E40AF', tip: 'LOT id, ADDRESS, CSUID, or raw coordinates submitted as JSON payload' },
  { icon: <MapPin size={18}/>,    label: 'Boundary Resolver',    color: '#2563EB', tip: 'Resolves identifier to WGS84 coordinates, fetches official parcel boundary from registry' },
  { icon: <GitBranch size={18}/>, label: 'Boundary Densification',color: '#3B82F6', tip: 'Shapely interpolation at 1m interval — generates N points along full parcel perimeter' },
  { icon: <Eye size={18}/>,       label: 'OSM Feature Fetch',    color: '#60A5FA', tip: 'Concurrent ThreadPoolExecutor fetch of buildings, parks, water from OSMnx (3 threads, 30s socket timeout)' },
  { icon: <Cpu size={18}/>,       label: 'View Classification',  color: '#0E7490', tip: 'Per-point sector scoring across 18 × 20° slices using BUILDINGS_FINAL.gpkg height data' },
  { icon: <Volume2 size={18}/>,   label: 'Noise Grid Build',     color: '#9A3412', tip: '25m receptor grid with road-weighted attenuation L = L₀ − 20·log₁₀(r), fallback to point-source model' },
  { icon: <Activity size={18}/>,  label: 'Threshold Evaluation', color: '#6B21A8', tip: 'Boolean is_noisy[] array evaluated against db_threshold (default 65.0 dBA) per boundary point' },
  { icon: <Box size={18}/>,       label: 'Lease Plan Extraction',color: '#0F7B55', tip: 'Optional: OpenCV HSV colour segmentation of uploaded PDF/PNG to extract non-building zone polygons' },
  { icon: <FileDown size={18}/>,  label: 'Output Delivery',      color: '#DBEAFE', tip: 'JSON arrays (boundary, view_type, noise_db, is_noisy) or DXF R2010 CAD file streamed as binary' },
]

// ── Cloud flow data ─────────────────────────────────────────────────────────
const cloudNodes = ['Frontend', 'Render Cloud', 'FastAPI', 'Spatial Modules', 'Static Data', 'Cache', 'Response']

// ── Repo trees ──────────────────────────────────────────────────────────────
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

const mlpRepoTree = [
  { name: 'alkf-master-land-plan/', type: 'root', children: [
    { name: 'app.py', type: 'file', ext: 'py' },
    { name: 'render.yaml', type: 'file', ext: 'yaml' },
    { name: 'requirements.txt', type: 'file', ext: 'txt' },
    { name: 'runtime.txt', type: 'file', ext: 'txt' },
    { name: 'data/', type: 'folder', children: [
      { name: 'BUILDINGS_FINAL.gpkg', type: 'file', ext: 'gpkg' },
    ]},
    { name: 'modules/', type: 'folder', children: [
      { name: 'resolver.py', type: 'file', ext: 'py' },
      { name: 'spatial_intelligence.py', type: 'file', ext: 'py' },
      { name: 'view.py', type: 'file', ext: 'py' },
      { name: 'noise.py', type: 'file', ext: 'py' },
      { name: 'dxf_export.py', type: 'file', ext: 'py' },
      { name: 'lease_plan_parser.py', type: 'file', ext: 'py' },
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
    formulaBlock: `Green Score = green_ratio\nWater Score = water_ratio\nCity Score  = height_norm × density_norm\nOpen Score  = (1 − density_norm) × (1 − height_norm)` },
  { id: 'noise', icon: <Volume2 size={18}/>, label: 'Road Traffic Noise Model', color: '#9A3412',
    noiseFormula: true,
    details: ['Point-source attenuation across OSM road network', 'Road classification weighting (motorway → residential)', 'Receptor grid generation at 25 m spatial resolution', 'dB(A) contour rendering with colour-mapped legend'],
    noiseEq: 'L = L₀ − 20 log₁₀(r)' },
]

// ── MLP endpoints ────────────────────────────────────────────────────────────
const mlpEndpoints = [
  { method: 'GET',  path: '/',                      desc: 'Health check — service status' },
  { method: 'POST', path: '/site-intelligence',     desc: 'Full boundary JSON: view_type[], noise_db[], is_noisy[]' },
  { method: 'POST', path: '/site-intelligence-dxf', desc: 'DXF R2010 CAD export with 5 annotated layers' },
]

// ── MLP DXF layers ──────────────────────────────────────────────────────────
const dxfLayers = [
  { name: 'SITE_BOUNDARY', color: '#E2E8F0', desc: 'Closed LWPOLYLINE — all 1m boundary points' },
  { name: 'VIEW_POINTS',   color: '#22C55E', desc: 'Point + label every 5m — view type classification' },
  { name: 'NOISE_POINTS',  color: '#06B6D4', desc: 'Point + dBA value every 5m — colour-coded' },
  { name: 'NON_BUILDING',  color: '#8B5CF6', desc: 'Closed polygons for lease plan zones (optional)' },
  { name: 'LABELS',        color: '#EAB308', desc: 'All text annotations and title block' },
]

// ── API endpoints (site analysis) ────────────────────────────────────────────
const endpoints = [
  { method: 'POST', path: '/walking',   desc: 'Walk isochrone & amenity reach' },
  { method: 'POST', path: '/driving',   desc: 'Drive isochrone & road centrality' },
  { method: 'POST', path: '/transport', desc: 'Transit node proximity scoring' },
  { method: 'POST', path: '/context',   desc: 'Zoning & amenity distribution' },
  { method: 'POST', path: '/view',      desc: '360° sector view classification' },
  { method: 'POST', path: '/noise',     desc: 'Traffic noise attenuation model' },
  { method: 'POST', path: '/report',    desc: 'Full PDF feasibility report' },
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
      <div
        onClick={() => isFolder && setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 6, cursor: isFolder ? 'pointer' : 'default', userSelect: 'none', transition: 'background 0.15s' }}
        onMouseEnter={e => { if (isFolder) e.currentTarget.style.background = '#F0F4FF' }}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {isFolder
          ? (open ? <ChevronDown size={13} color="#64748B"/> : <ChevronRight size={13} color="#64748B"/>)
          : <span style={{ width: 13 }}/>
        }
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
            <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: `all 0.5s ease ${i * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: `hsl(${220 + i * 8}, 70%, ${52 + i * 4}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.3)' }}/>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151', textAlign: 'center', maxWidth: 72, lineHeight: 1.3 }}>{node}</span>
            </div>
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
function SectionLabel({ children, color = '#2563EB' }) {
  return <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color, marginBottom: 10 }}>{children}</p>
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

// ── FIX: FlowStep extracted as named component so useInView is not called
//         inside a .map() callback — resolves the Rules of Hooks violation ──
function FlowStep({ step, index, total }) {
  const [ref, visible] = useInView(0.1)
  return (
    <div ref={ref} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{ width: '100%', maxWidth: 560, background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.25s ease', cursor: 'default', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transitionDelay: `${index * 0.06}s` }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.12)'; e.currentTarget.style.borderColor = '#93C5FD'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'none' }}
      >
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#1D4ED8', flexShrink: 0 }}>{index + 1}</div>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: `${step.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, flexShrink: 0 }}>{step.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{step.label}</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2, lineHeight: 1.5 }}>{step.tip}</div>
        </div>
      </div>
      {index < total - 1 && (
        <div style={{ height: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <div style={{ width: 1.5, height: 10, background: '#CBD5E1' }}/>
          <svg width="10" height="7" viewBox="0 0 10 7" fill="none" style={{ animation: 'arrowBounce 1.8s ease-in-out infinite' }}>
            <path d="M5 7L0 0H10L5 7Z" fill="#94A3B8"/>
          </svg>
        </div>
      )}
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function Architecture() {
  const [expandedModule, setExpandedModule]   = useState(null)
  const [expandedMlpStep, setExpandedMlpStep] = useState(null)
  const [copiedEndpoint, setCopiedEndpoint]   = useState(null)
  const [copiedYaml, setCopiedYaml]           = useState(false)

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
        @keyframes expandDown  { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDot    { 0% { left:0%; opacity:0; } 10% { opacity:1; } 90% { opacity:1; } 100% { left:calc(100% - 8px); opacity:0; } }
        @keyframes checkPop    { 0% { transform:scale(0); } 60% { transform:scale(1.2); } 100% { transform:scale(1); } }
        @keyframes fadeUp      { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse       { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes arrowBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(4px); } }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 480, display: 'flex', alignItems: 'center' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
          <source src="/video2.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.75) 100%)', pointerEvents: 'none' }}/>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
          <defs>
            <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archGrid)"/>
        </svg>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }}>
          {[...Array(6)].map((_, i) => (
            <line key={i} x1={`${10 + i * 15}%`} y1="0%" x2={`${5 + i * 18}%`} y2="100%"
              stroke="white" strokeWidth="0.8"
              style={{ animation: `pulse ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}
            />
          ))}
        </svg>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '80px 32px 72px', position: 'relative', zIndex: 1, animation: 'fadeUp 0.7s ease' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#93C5FD', marginBottom: 16 }}>System Architecture</p>
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: 20 }}>
            Automated Spatial<br/>Intelligence System
          </h1>
          <p style={{ fontSize: 17, color: '#CBD5E1', lineHeight: 1.75, maxWidth: 600 }}>
            End-to-end geospatial intelligence infrastructure powering automated urban feasibility modeling and boundary intelligence analysis.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}>
            {['FastAPI', 'OSMnx', 'NetworkX', 'GeoPandas', 'ReportLab', 'Render Cloud'].map(tag => (
              <span key={tag} style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#CBD5E1', fontSize: 12, fontWeight: 500 }}>{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAGE CONTENT ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 32px 80px' }}>

        {/* ── SECTION: Site Analysis — Processing Flow ───────────────────── */}
        <div style={{ marginBottom: 80 }}>
          <SectionLabel>End-to-End Pipeline</SectionLabel>
          <SectionHeading sub="Each request traverses a structured pipeline from raw input to formatted spatial output.">
            Processing Flow
          </SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            {flowSteps.map((step, i) => (
              <FlowStep key={step.label} step={step} index={i} total={flowSteps.length} />
            ))}
          </div>
        </div>

        {/* ── SECTION: Cloud Flow ────────────────────────────────────────── */}
        <div style={{ marginBottom: 80, background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, padding: '36px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <SectionLabel>Deployment</SectionLabel>
          <SectionHeading sub="Live data flow through the Render cloud execution environment.">
            Cloud Execution Flow
          </SectionHeading>
          <CloudFlow />
          <div style={{ display: 'flex', gap: 24, marginTop: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Cold Start', value: '10–15s', color: '#F59E0B' },
              { label: 'Cached',     value: '<1s',    color: '#10B981' },
              { label: 'Avg Analysis', value: '3–8s', color: '#3B82F6' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }}/>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{m.label}: <strong style={{ color: '#1E293B' }}>{m.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            SECTION: Master Land Plan API — Boundary Intelligence Engine
        ══════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 80 }}>

          {/* Header band */}
          <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: 16, padding: '28px 32px', marginBottom: 32, position: 'relative', overflow: 'hidden' }}>
            {/* subtle grid */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
              <defs>
                <pattern id="mlpGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mlpGrid)"/>
            </svg>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(37,99,235,0.3)', border: '1px solid rgba(96,165,250,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={16} color="#93C5FD"/>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#93C5FD' }}>Master Land Plan API</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 8 }}>Boundary Intelligence Engine</h2>
              <p style={{ fontSize: 14, color: '#94A3B8', lineHeight: 1.7, maxWidth: 620 }}>
                A dedicated FastAPI service that converts any parcel identifier into a per-metre boundary dataset — classifying view type and noise level at every point along the site perimeter, with optional DXF CAD export and lease plan zone extraction.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                {['OSMnx', 'Shapely', 'GeoPandas', 'ezdxf', 'OpenCV', 'EPSG:3857'].map(t => (
                  <span key={t} style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#CBD5E1', fontSize: 11, fontWeight: 500 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Two-column: pipeline + repo tree */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

            {/* MLP pipeline */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '22px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Analysis Pipeline</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mlpFlowSteps.map((step, i) => (
                  <div key={step.label}>
                    <button
                      onClick={() => setExpandedMlpStep(expandedMlpStep === i ? null : i)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, background: expandedMlpStep === i ? '#EFF6FF' : 'transparent', border: expandedMlpStep === i ? '1px solid #BFDBFE' : '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                      onMouseEnter={e => { if (expandedMlpStep !== i) e.currentTarget.style.background = '#F8FAFC' }}
                      onMouseLeave={e => { if (expandedMlpStep !== i) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${step.color}18`, border: `1px solid ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: step.color, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: `${step.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.color, flexShrink: 0 }}>{step.icon}</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', flex: 1 }}>{step.label}</span>
                      <ChevronDown size={12} color="#94A3B8" style={{ transform: expandedMlpStep === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}/>
                    </button>
                    {expandedMlpStep === i && (
                      <div style={{ margin: '2px 10px 4px 54px', padding: '8px 10px', background: '#F0F7FF', borderRadius: 7, borderLeft: `2px solid ${step.color}`, animation: 'expandDown 0.2s ease' }}>
                        <p style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>{step.tip}</p>
                      </div>
                    )}
                    {i < mlpFlowSteps.length - 1 && (
                      <div style={{ marginLeft: 29, width: 1.5, height: 6, background: expandedMlpStep === i ? step.color + '40' : '#E2E8F0' }}/>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Repo tree + key constants */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '22px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Repository Structure</div>
                {mlpRepoTree.map(node => <TreeNode key={node.name} node={node}/>)}
              </div>

              {/* Key constants card */}
              <div style={{ background: '#0F172A', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: 12 }}>Key Constants</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[
                    { k: '_VIEW_FETCH_RADIUS', v: '300 m',    desc: 'OSMnx fetch radius' },
                    { k: '_VIEW_RADIUS_M',     v: '200 m',    desc: 'Per-point analysis radius' },
                    { k: '_SECTOR_SIZE',       v: '20°',      desc: 'View sector width' },
                    { k: 'db_threshold',       v: '65.0 dBA', desc: 'Default noise threshold' },
                    { k: 'sampling_interval',  v: '1 m',      desc: 'Boundary point density' },
                  ].map(row => (
                    <div key={row.k} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#7DD3FC', minWidth: 170 }}>{row.k}</span>
                      <span style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#34D399', minWidth: 64 }}>{row.v}</span>
                      <span style={{ fontSize: 10, color: '#475569' }}>{row.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Endpoints + DXF layers row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

            {/* MLP Endpoints */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '22px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>API Endpoints</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {mlpEndpoints.map((ep, i) => (
                  <div key={ep.path} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#F8FAFC', borderRadius: 9, border: '1px solid #F1F5F9' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: ep.method === 'GET' ? '#D1FAE5' : '#DBEAFE', color: ep.method === 'GET' ? '#065F46' : '#1D4ED8', flexShrink: 0, marginTop: 1 }}>{ep.method}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#1E293B', fontWeight: 600 }}>{ep.path}</div>
                      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2, lineHeight: 1.4 }}>{ep.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: '10px 12px', background: '#F0F9FF', borderRadius: 9, border: '1px solid #BAE6FD' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#0369A1', marginBottom: 4 }}>Response Arrays</div>
                <div style={{ fontSize: 10.5, fontFamily: 'monospace', color: '#374151', lineHeight: 1.8 }}>
                  boundary.x[] · boundary.y[]<br/>
                  view_type[] · noise_db[] · is_noisy[]<br/>
                  <span style={{ color: '#9CA3AF' }}>all same length = perimeter_metres</span>
                </div>
              </div>
            </div>

            {/* DXF layers */}
            <div style={{ background: '#0F172A', borderRadius: 14, padding: '22px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
                <FileDown size={13} color="#93C5FD"/>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#E2E8F0' }}>DXF Export Layer Structure</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {dxfLayers.map((l, i) => (
                  <div key={l.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, marginTop: 2 }}/>
                    <div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: '#F1F5F9' }}>{l.name}</div>
                      <div style={{ fontSize: 10.5, color: '#64748B', marginTop: 1 }}>{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #1E293B' }}>
                <div style={{ fontSize: 10, color: '#475569', lineHeight: 1.7 }}>
                  Format: DXF R2010 · ASCII-safe strings<br/>
                  Label stride: every 5m · Scaled offsets<br/>
                  File size: ~22 KB (39-pt lot)
                </div>
              </div>
            </div>
          </div>

          {/* View types + performance strip */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* View type classification */}
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '22px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>View Type Classification</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { type: 'SEA',       color: '#06B6D4', desc: 'Open sea — OSM natural:sea tag' },
                  { type: 'HARBOR',    color: '#0891B2', desc: 'Harbour — leisure:marina proximity' },
                  { type: 'RESERVOIR', color: '#0284C7', desc: 'Reservoir — OSM landuse:reservoir' },
                  { type: 'MOUNTAIN',  color: '#78716C', desc: 'Natural highland — natural:peak' },
                  { type: 'PARK',      color: '#16A34A', desc: 'Park or open green space' },
                  { type: 'GREEN',     color: '#22C55E', desc: 'Vegetation / low-density boundary' },
                  { type: 'CITY',      color: '#EF4444', desc: 'Urban context — building density' },
                ].map(v => (
                  <div key={v.type} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: v.color, flexShrink: 0 }}/>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#1E293B', minWidth: 80 }}>{v.type}</span>
                    <span style={{ fontSize: 10.5, color: '#6B7280' }}>{v.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: '10px 12px', background: '#0F172A', borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Attenuation Equation</div>
                <pre style={{ fontSize: 14, color: '#FCA5A5', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>L = L₀ − 20·log₁₀(r)</pre>
              </div>
            </div>

            {/* Performance + test results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '22px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 14 }}>Performance Benchmarks</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { stage: 'OSM Feature Fetch',   time: '~4.6s',  bar: 25, color: '#3B82F6' },
                    { stage: 'View Classification', time: '~2.2s',  bar: 12, color: '#0E7490' },
                    { stage: 'Noise Grid Build',    time: '~18.4s', bar: 100, color: '#9A3412' },
                    { stage: 'Total (warm)',        time: '~27s',   bar: 60, color: '#2563EB' },
                    { stage: 'Total (cold start)',  time: '~60s',   bar: 100, color: '#F59E0B' },
                    { stage: 'Cache hit',           time: '<1s',    bar: 3,  color: '#10B981' },
                  ].map(r => (
                    <div key={r.stage}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 10.5, color: '#374151' }}>{r.stage}</span>
                        <span style={{ fontSize: 10.5, fontFamily: 'monospace', fontWeight: 700, color: '#1E293B' }}>{r.time}</span>
                      </div>
                      <div style={{ height: 4, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${r.bar}%`, background: r.color, borderRadius: 99, transition: 'width 0.6s ease' }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Check size={13} color="#16A34A"/>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#166534' }}>Test Suite — 14 / 14 passing</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    'LOT JSON response', 'LOT DXF export (21.6 KB)', 'ADDRESS resolver',
                    'Custom dB threshold', 'Array length consistency', 'EPSG:3857 coordinate sanity',
                    'View type validation', 'Noise value bounds', 'Cache verification',
                    'Error: ADDRESS without coords', 'Error: invalid LOT → 500',
                    'Non-building JSON', 'Extended + lease plan',
                  ].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16A34A', flexShrink: 0 }}/>
                      <span style={{ fontSize: 10.5, color: '#166534' }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION: Module Breakdown ───────────────────────────────────── */}
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
                            {/* FIX: was "'JetBrains Mono', monospace', lineHeight: 1.8" — stray quote corrupted lineHeight */}
                            <pre style={{ fontSize: 16, color: '#FCA5A5', fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>{mod.noiseEq}</pre>
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
          <p className="text-xs text-[#475569] text-center">© 2026 ALKF. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
