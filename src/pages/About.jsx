import { useState, useEffect, useRef } from 'react'
import { Network, BarChart2, Database, Cpu, Target, Eye, Building2, MapPin, Users, FlaskConical, Landmark, Briefcase, ArrowRight, Globe, Layers, Zap } from 'lucide-react'
import Footer from '../components/Footer'

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

// ── Reveal wrapper ──────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const [ref, visible] = useInView()
  const transforms = { up: 'translateY(30px)', down: 'translateY(-20px)', left: 'translateX(-30px)', right: 'translateX(30px)' }
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : (transforms[direction] || transforms.up),
      transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    }}>
      {children}
    </div>
  )
}

// ── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [ref, visible] = useInView(0.3)
  const started = useRef(false)
  useEffect(() => {
    if (!visible || started.current) return
    started.current = true
    const start = performance.now()
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(ease * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [visible, end, duration])
  return <span ref={ref}>{count}{suffix}</span>
}

// ── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children, light = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 24, height: 2, background: light ? 'rgba(96,165,250,0.8)' : '#2563EB', borderRadius: 2 }} />
      <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: light ? 'rgba(147,197,253,0.9)' : '#2563EB' }}>
        {children}
      </p>
    </div>
  )
}

// ── Data ────────────────────────────────────────────────────────────────────
const stats = [
  { value: 6, suffix: '+', label: 'Analysis Modules' },
  { value: 99, suffix: '%', label: 'Uptime SLA' },
  { value: 50, suffix: 'ms', label: 'Avg Query Time' },
  { value: 12, suffix: '+', label: 'Data Layers' },
]

const capabilities = [
  { icon: <Network size={22} />, title: 'Advanced Graph Theory', desc: 'NetworkX-powered routing algorithms, centrality analysis, graph-based connectivity modeling, and isochrone computation for pedestrian and vehicular systems.', accent: '#3B82F6' },
  { icon: <BarChart2 size={22} />, title: 'Spatial Econometrics', desc: 'Gravity models, spatial autocorrelation, density estimation, and multi-criteria scoring frameworks for development evaluation.', accent: '#6366F1' },
  { icon: <Database size={22} />, title: 'High-Performance GIS', desc: 'GeoPandas, PostGIS, Shapely, and optimized GeoPackage datasets enabling high-throughput spatial queries and sub-second geometric operations.', accent: '#0EA5E9' },
  { icon: <Cpu size={22} />, title: 'Automated Intelligence Outputs', desc: 'Structured PDF reports, JSON outputs, heatmaps, isochrones, and map visualizations generated through automated rendering pipelines.', accent: '#8B5CF6' },
  { icon: <Globe size={22} />, title: 'Multi-Source Data Fusion', desc: 'OpenStreetMap, government cadastral data, satellite imagery, and real-time transit feeds unified into a coherent spatial knowledge graph.', accent: '#10B981' },
  { icon: <Layers size={22} />, title: 'Zoning Intelligence', desc: 'Regulatory overlay parsing, land-use classification, setback rules, and development constraint mapping for compliance-aware feasibility.', accent: '#F59E0B' },
]

const audience = [
  { icon: <Building2 size={18} />, label: 'Architecture Firms' },
  { icon: <MapPin size={18} />, label: 'Urban Planning Consultancies' },
  { icon: <Briefcase size={18} />, label: 'Real Estate Developers' },
  { icon: <Network size={18} />, label: 'Infrastructure Engineers' },
  { icon: <FlaskConical size={18} />, label: 'Research Institutions' },
  { icon: <Landmark size={18} />, label: 'Government Departments' },
]

const philosophy = [
  { text: 'Dataset optimization & indexing', icon: <Zap size={13} /> },
  { text: 'CRS standardization across layers', icon: <Zap size={13} /> },
  { text: 'Graph-based spatial computation', icon: <Zap size={13} /> },
  { text: 'Environmental propagation modeling', icon: <Zap size={13} /> },
  { text: 'Modular analytical isolation', icon: <Zap size={13} /> },
  { text: 'Cloud-native deployment strategy', icon: <Zap size={13} /> },
]

// ── Main Component ───────────────────────────────────────────────────────────
export default function About() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div style={{ background: '#F8FAFC', fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1E293B', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Fraunces:opsz,wght@9..144,300;9..144,700;9..144,900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; background: #F8FAFC; }

        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes spin-rev  { to { transform: rotate(-360deg); } }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(1.8);opacity:0} }
        @keyframes grid-drift { 0%{transform:translate(0,0)} 100%{transform:translate(40px,40px)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes line-grow { from{width:0} to{width:100%} }
        @keyframes blob-1 { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
        @keyframes blob-2 { 0%,100%{border-radius:40% 60% 60% 40%/60% 40% 60% 40%} 50%{border-radius:60% 40% 40% 60%/40% 60% 40% 60%} }

        .cap-card:hover .cap-glow { opacity: 1 !important; }
        .cap-card:hover .cap-icon-wrap { transform: scale(1.08); }
        .cap-card:hover { border-color: transparent !important; box-shadow: 0 20px 60px rgba(37,99,235,0.12) !important; transform: translateY(-4px) !important; }

        .stat-block:hover .stat-number { background-size: 200% auto; animation: shimmer 1.5s linear infinite; }

        .aud-card:hover { border-color: #93C5FD !important; box-shadow: 0 8px 30px rgba(37,99,235,0.1) !important; transform: translateY(-3px) scale(1.02) !important; }
        .aud-card:hover .aud-icon { background: linear-gradient(135deg,#2563EB,#6366F1) !important; color: white !important; }

        .phil-item:hover { border-color: #93C5FD !important; background: linear-gradient(90deg, #EFF6FF, #F0F9FF) !important; padding-left: 20px !important; }
        .phil-item { transition: all 0.25s ease !important; }

        .hero-grid { animation: grid-drift 20s linear infinite; }
      `}</style>

      {/* ══════════════════════════════════════════════════════
          HERO — Dark Cinematic
      ══════════════════════════════════════════════════════ */}
      <div style={{ position: 'relative', background: '#0A0F1E', overflow: 'hidden', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>

        {/* Animated grid background */}
        <div className="hero-grid" style={{
          position: 'absolute', inset: '-40px', opacity: 0.07,
          backgroundImage: 'linear-gradient(rgba(96,165,250,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Radial glow — follows mouse loosely */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.25,
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37,99,235,0.3), transparent 60%)`,
          transition: 'background 0.1s',
          pointerEvents: 'none',
        }} />

        {/* Morphing blobs */}
        <div style={{ position: 'absolute', top: '8%', right: '8%', width: 340, height: 340, background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)', animation: 'blob-1 12s ease-in-out infinite', borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '4%', width: 260, height: 260, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', animation: 'blob-2 15s ease-in-out infinite', borderRadius: '40% 60% 60% 40%/60% 40% 60% 40%' }} />

        {/* Floating orbit rings */}
        <div style={{ position: 'absolute', top: 60, right: 80, width: 220, height: 220, animation: 'spin-slow 30s linear infinite', opacity: 0.15 }}>
          <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(96,165,250,0.6)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 30, border: '1px dashed rgba(96,165,250,0.4)', borderRadius: '50%', animation: 'spin-rev 20s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 60, border: '1px solid rgba(96,165,250,0.3)', borderRadius: '50%' }} />
          {/* Orbit dot */}
          <div style={{ position: 'absolute', top: 10, left: '50%', width: 6, height: 6, borderRadius: '50%', background: '#60A5FA', transform: 'translateX(-50%)', boxShadow: '0 0 10px #60A5FA' }} />
        </div>

        {/* Hero content */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '120px 40px 80px', position: 'relative', zIndex: 2 }}>
          <Reveal delay={0}>
            <SectionLabel light>About the Platform</SectionLabel>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontSize: 'clamp(42px, 6vw, 72px)',
              fontWeight: 900,
              color: '#F1F5F9',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              marginBottom: 28,
              maxWidth: 720,
            }}>
              Enterprise Urban<br />
              <span style={{
                background: 'linear-gradient(135deg, #60A5FA 0%, #818CF8 50%, #34D399 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Intelligence</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p style={{ fontSize: 17, color: 'rgba(148,163,184,0.95)', lineHeight: 1.85, maxWidth: 580, fontWeight: 400, marginBottom: 40 }}>
              ALKF+ is a geospatial intelligence platform engineered for architects, planners, developers, and researchers who require rigorous, data-driven site feasibility evaluation.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {['Geospatial Analysis', 'Network Modeling', 'Environmental Simulation', 'Zoning Intelligence'].map((tag, i) => (
                <span key={i} style={{
                  fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em',
                  padding: '6px 14px', borderRadius: 20,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(203,213,225,0.9)',
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(transparent, #F8FAFC)', pointerEvents: 'none' }} />
      </div>

      {/* ══════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════ */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="stat-block" style={{
                padding: '36px 24px',
                borderRight: i < stats.length - 1 ? '1px solid #E2E8F0' : 'none',
                textAlign: 'center',
                cursor: 'default',
              }}>
                <div className="stat-number" style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: 42,
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #1E3A8A, #2563EB, #6366F1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  marginBottom: 8,
                  backgroundSize: '100% auto',
                }}>
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          PAGE BODY
      ══════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '96px 40px 100px' }}>

        {/* ── What We Build ── */}
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', marginBottom: 100 }}>
            <div>
              <SectionLabel>Platform</SectionLabel>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 20 }}>
                What We Build
              </h2>
              <p style={{ fontSize: 15.5, color: '#475569', lineHeight: 1.9 }}>
                ALKF+ delivers an integrated spatial analytics infrastructure that transforms raw geospatial datasets into structured feasibility intelligence. The platform combines network analysis, environmental modeling, zoning overlays, and computational scoring systems into a unified urban decision-support framework.
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              {/* Abstract architecture graphic */}
              <div style={{ position: 'relative', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: 220, height: 220, border: '1px solid #BFDBFE', borderRadius: '50%', animation: 'spin-slow 40s linear infinite' }} />
                <div style={{ position: 'absolute', width: 160, height: 160, border: '1px dashed #93C5FD', borderRadius: '50%', animation: 'spin-rev 25s linear infinite' }} />
                <div style={{ position: 'absolute', width: 100, height: 100, border: '1px solid #60A5FA', borderRadius: '50%', animation: 'spin-slow 18s linear infinite' }} />
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #1E3A8A, #6366F1)', boxShadow: '0 0 30px rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Globe size={22} />
                </div>
                {/* Satellite dots */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    width: 8, height: 8, borderRadius: '50%',
                    background: i % 2 === 0 ? '#3B82F6' : '#6366F1',
                    boxShadow: `0 0 8px ${i % 2 === 0 ? '#3B82F6' : '#6366F1'}`,
                    top: `calc(50% + ${110 * Math.sin((deg * Math.PI) / 180)}px - 4px)`,
                    left: `calc(50% + ${110 * Math.cos((deg * Math.PI) / 180)}px - 4px)`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── Mission + Vision ── */}
        <Reveal>
          <div style={{ marginBottom: 16 }}>
            <SectionLabel>Purpose</SectionLabel>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 96 }}>
          {[
            { icon: <Target size={22} />, label: 'Our Mission', gradient: 'linear-gradient(135deg,#1E3A8A 0%,#2563EB 100%)', text: 'To standardize and automate urban site evaluation through computational geospatial systems — enabling faster feasibility assessment, transparent scoring methodologies, and scalable infrastructure for urban development strategy.', delay: 0 },
            { icon: <Eye size={22} />, label: 'Our Vision', gradient: 'linear-gradient(135deg,#312E81 0%,#6366F1 100%)', text: 'To establish spatial intelligence as a foundational layer in urban planning and architectural design — where every development decision is supported by measurable walkability metrics, network connectivity analysis, environmental impact modeling, and regulatory validation.', delay: 0.1 },
          ].map(c => (
            <Reveal key={c.label} delay={c.delay}>
              <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'white', border: '1px solid #E2E8F0', borderRadius: 20,
                padding: '36px', height: '100%',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(37,99,235,0.12)'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.transform = 'none' }}>
                {/* Corner accent */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, background: c.gradient, opacity: 0.06, borderRadius: '0 20px 0 100%' }} />
                <div style={{ width: 48, height: 48, borderRadius: 14, background: c.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: 22, boxShadow: '0 8px 24px rgba(37,99,235,0.25)' }}>
                  {c.icon}
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>{c.label}</h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.85 }}>{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Technical Capabilities ── */}
        <Reveal>
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>Capabilities</SectionLabel>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em' }}>Technical Capabilities</h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 96 }}>
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07}>
              <div className="cap-card" style={{
                position: 'relative', overflow: 'hidden',
                background: 'white', border: '1px solid #E2E8F0', borderRadius: 18,
                padding: '28px', height: '100%', cursor: 'default',
                transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              }}>
                {/* Hover glow */}
                <div className="cap-glow" style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 30% 30%, ${c.accent}15, transparent 70%)`, opacity: 0, transition: 'opacity 0.3s' }} />
                {/* Top accent line */}
                <div style={{ position: 'absolute', top: 0, left: 28, right: 28, height: 2, background: `linear-gradient(90deg, transparent, ${c.accent}, transparent)`, borderRadius: 1 }} />

                <div className="cap-icon-wrap" style={{ width: 44, height: 44, borderRadius: 12, background: `${c.accent}15`, border: `1px solid ${c.accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.accent, marginBottom: 18, transition: 'transform 0.25s ease' }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 10, lineHeight: 1.4 }}>{c.title}</h3>
                <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.8, position: 'relative', zIndex: 1 }}>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Engineering Philosophy ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start', marginBottom: 96 }}>
          <Reveal direction="left">
            <SectionLabel>Engineering</SectionLabel>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20, lineHeight: 1.2 }}>
              Engineering<br />Philosophy
            </h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.9, marginBottom: 16 }}>
              ALKF+ is architected as a modular geospatial microservice platform. Each analytical module operates independently while integrating seamlessly through a centralized API layer, ensuring maintainability, scalability, and deployment flexibility.
            </p>
            <p style={{ fontSize: 13.5, color: '#64748B', lineHeight: 1.7, fontFamily: "'DM Mono', monospace", background: '#F1F5F9', padding: '14px 18px', borderRadius: 10, borderLeft: '3px solid #3B82F6' }}>
              {"{ modular: true, cloud_native: true, api_first: true }"}
            </p>
          </Reveal>

          <Reveal direction="right" delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8 }}>
              {philosophy.map((item, i) => (
                <div className="phil-item" key={item.text} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 16px', background: 'white',
                  border: '1px solid #E2E8F0', borderRadius: 10,
                  opacity: 0, animation: `fadeSlide 0.5s ease ${0.15 + i * 0.08}s forwards`,
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: '#334155' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateX(16px); }
            to   { opacity: 1; transform: none; }
          }
        `}</style>

        {/* ── Who It Serves ── */}
        <Reveal>
          <div style={{ marginBottom: 36 }}>
            <SectionLabel>Clients</SectionLabel>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 38, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em' }}>Designed For</h2>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12, marginBottom: 96 }}>
          {audience.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.07}>
              <div className="aud-card" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px', background: 'white',
                border: '1px solid #E2E8F0', borderRadius: 14,
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)', cursor: 'default',
              }}>
                <div className="aud-icon" style={{ width: 40, height: 40, borderRadius: 11, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0, transition: 'all 0.25s ease' }}>
                  {a.icon}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>{a.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Enterprise Statement ── */}
        <Reveal>
          <div style={{ position: 'relative', overflow: 'hidden', background: '#0A0F1E', borderRadius: 24, padding: '56px 60px' }}>
            {/* Background grid */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'linear-gradient(rgba(96,165,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,1) 1px, transparent 1px)', backgroundSize: '32px 32px', borderRadius: 24 }} />
            {/* Glow */}
            <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, background: 'radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: -40, left: 20, width: 200, height: 200, background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 2, background: 'linear-gradient(90deg, #60A5FA, #818CF8)', borderRadius: 2 }} />
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(147,197,253,0.8)', fontFamily: "'DM Mono', monospace" }}>ALKF+ Statement</span>
              </div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 700, color: '#F1F5F9', lineHeight: 1.6, letterSpacing: '-0.015em', maxWidth: 680, marginBottom: 32 }}>
                ALKF+ is not a visualization tool — it is a computational geospatial intelligence infrastructure built for rigorous urban decision-making.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60A5FA' }}>
                  <Globe size={16} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(148,163,184,0.9)', letterSpacing: '0.04em' }}>ALKF+ Spatial Intelligence Platform</span>
              </div>
            </div>
          </div>
        </Reveal>

      </div>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  )
}