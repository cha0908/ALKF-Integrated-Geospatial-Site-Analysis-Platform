import { useState, useEffect, useRef } from 'react'
import {
  Network, BarChart2, Database, Cpu, Target, Eye,
  Building2, MapPin, FlaskConical, Landmark, Briefcase,
  ArrowRight, Layers, Globe, Zap, Shield, GitBranch,
  Activity, Server, Code2, Box
} from 'lucide-react'
import Footer from '../components/Footer'

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, delay = 0, y = 18 }) {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : `translateY(${y}px)`,
      transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
    }}>
      {children}
    </div>
  )
}

function Counter({ to, suffix = '' }) {
  const [ref, visible] = useInView()
  const [val, setVal] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (!visible || started.current) return
    started.current = true
    const dur = 1600, steps = 60
    let cur = 0
    const t = setInterval(() => {
      cur += dur / steps
      setVal(Math.min(Math.round((cur / dur) * to), to))
      if (cur >= dur) clearInterval(t)
    }, dur / steps)
  }, [visible, to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

function Tag({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: '#2563EB',
      border: '1px solid rgba(37,99,235,0.18)',
      background: 'rgba(37,99,235,0.05)',
      padding: '4px 12px', borderRadius: 999, marginBottom: 14
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563EB', display: 'inline-block' }} />
      {children}
    </div>
  )
}

function Sep() {
  const [ref, v] = useInView()
  return (
    <div ref={ref} style={{
      margin: '60px 0', display: 'flex', alignItems: 'center', gap: 12,
      opacity: v ? 1 : 0, transition: 'opacity 0.8s ease'
    }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #E2E8F0 40%, #E2E8F0 60%, transparent)' }} />
      <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1' }} />
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, transparent, #E2E8F0 40%, #E2E8F0 60%, transparent)' }} />
    </div>
  )
}

function Card({ children, style = {} }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hov ? '#BFDBFE' : '#E8EDF4'}`,
        borderRadius: 14,
        transition: 'all 0.2s ease',
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov ? '0 10px 28px rgba(37,99,235,0.09)' : '0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const CAP = [
  { icon: Network,   color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', title: 'Advanced Graph Theory',               desc: 'NetworkX-powered routing algorithms, centrality analysis, graph-based connectivity modeling, and isochrone computation for pedestrian and vehicular systems.' },
  { icon: BarChart2, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', title: 'Spatial Econometrics',                desc: 'Gravity models, spatial autocorrelation, density estimation, and multi-criteria scoring frameworks for development evaluation.' },
  { icon: Database,  color: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD', title: 'High-Performance GIS Infrastructure', desc: 'GeoPandas, PostGIS, Shapely, and optimized GeoPackage datasets enabling high-throughput spatial queries and sub-second geometric operations.' },
  { icon: Cpu,       color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', title: 'Automated Reporting & Intelligence',  desc: 'Structured PDF reports, JSON outputs, heatmaps, isochrones, and map visualizations generated through automated rendering pipelines.' },
]

const AUDIENCE = [
  { icon: Building2,    label: 'Architecture Firms' },
  { icon: MapPin,       label: 'Urban Planning Consultancies' },
  { icon: Briefcase,    label: 'Real Estate Developers' },
  { icon: Network,      label: 'Infrastructure Engineers' },
  { icon: FlaskConical, label: 'Research Institutions' },
  { icon: Landmark,     label: 'Government Planning Departments' },
]

const PHIL = [
  'Dataset optimization',
  'CRS standardization',
  'Graph-based computation',
  'Environmental propagation modeling',
  'Modular analytical isolation',
  'Cloud-native deployment strategy',
]

const WORKFLOW = [
  { n: '01', icon: Globe,     title: 'Data Ingestion',       desc: 'Multi-source geospatial datasets ingested, validated, and projected into standardized CRS.' },
  { n: '02', icon: Layers,    title: 'Spatial Processing',   desc: 'Network graphs, zoning overlays, and environmental layers computed at sub-second latency.' },
  { n: '03', icon: Activity,  title: 'Intelligence Scoring', desc: 'Multi-criteria scoring engines evaluate walkability, density, noise, and regulatory compliance.' },
  { n: '04', icon: GitBranch, title: 'Output Generation',    desc: 'Structured PDF reports, heatmaps, isochrones, and JSON payloads rendered automatically.' },
]

const TECH = [
  { icon: Code2,    name: 'Python 3.11', cat: 'Runtime'   },
  { icon: Database, name: 'PostGIS',     cat: 'Spatial DB' },
  { icon: Layers,   name: 'GeoPandas',   cat: 'GIS'        },
  { icon: Network,  name: 'NetworkX',    cat: 'Graph'      },
  { icon: Zap,      name: 'FastAPI',     cat: 'API'        },
  { icon: Server,   name: 'OSMnx',       cat: 'Network'    },
  { icon: Box,      name: 'Shapely',     cat: 'Geometry'   },
  { icon: Shield,   name: 'Contextily',  cat: 'Basemaps'   },
]

const STATS = [
  { val: 2400000, suffix: '+',  label: 'Spatial Features',  sub: 'indexed across HK'  },
  { val: 140,     suffix: 'ms', label: 'Avg. Query Time',   sub: 'p95 latency'         },
  { val: 7,       suffix: '',   label: 'Analysis Modules',  sub: 'modular pipeline'    },
  { val: 99,      suffix: '%',  label: 'Uptime SLA',        sub: 'cloud-native infra'  },
]

export default function About() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div style={{
      background: '#FAFBFC',
      color: '#1E293B',
      fontFamily: "'Inter', system-ui, sans-serif",
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.3s',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Hero: same muted slate as Home (image 3) ── */
        .about-hero {
          background: linear-gradient(160deg, #2C3E55 0%, #3B4F6B 40%, #2C3E55 100%);
          position: relative;
          overflow: hidden;
          padding: 100px 32px 88px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        /* seamless fade into the page body */
        .about-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 64px;
          background: linear-gradient(to bottom, transparent, #FAFBFC);
          pointer-events: none;
        }

        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .stat-num { font-size: 26px; font-weight: 800; color: #F8FAFC; letter-spacing: -0.02em; }
        .stat-lbl { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 3px; letter-spacing: 0.03em; }

        .hover-row:hover  { background: #F0F7FF !important; border-color: #BFDBFE !important; transform: translateX(4px); }
        .hover-row        { transition: all 0.18s ease; }
        .tech-c:hover     { border-color: #BFDBFE !important; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,0.08) !important; }
        .tech-c           { transition: all 0.18s ease; }
        .arch-n:hover     { transform: scale(1.04); }
        .arch-n           { transition: transform 0.18s ease; cursor: default; }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes bounceY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
        @keyframes slidein { from{opacity:0;transform:translateX(10px)} to{opacity:1;transform:none} }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div className="about-hero">
        <div className="hero-grid" />

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            {/* label chip — matches Home's "ENTERPRISE URBAN INTELLIGENCE" style */}
            <p style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
              marginBottom: 18,
            }}>
              About ALKF+
            </p>

            <h1 style={{
              fontSize: 'clamp(36px,5.5vw,60px)',
              fontWeight: 900,
              lineHeight: 1.07,
              letterSpacing: '-0.03em',
              color: '#F8FAFC',
              marginBottom: 20,
            }}>
              Enterprise Urban{' '}
              <span style={{ color: '#60A5FA' }}>Intelligence</span>
            </h1>

            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.52)',
              lineHeight: 1.8,
              maxWidth: 540,
              marginBottom: 52,
            }}>
              ALKF+ is a geospatial intelligence platform engineered for architects, planners, developers, and researchers who require rigorous, data-driven site feasibility evaluation.
            </p>

            {/* stats — same compact strip as Home */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '24px 40px',
              paddingTop: 28,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
              {[
                ['7',       'Analysis Modules'],
                ['2.4M+',   'Network Nodes'],
                ['<140ms',  'API Response'],
                ['99%',     'Uptime SLA'],
              ].map(([v, l], i) => (
                <div key={i}>
                  <div className="stat-num">{v}</div>
                  <div className="stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 80px' }}>

        {/* Platform */}
        <Sep />
        <Reveal>
          <Tag>Platform</Tag>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 14 }}>What We Build</h2>
          <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.85, maxWidth: 720 }}>
            ALKF+ delivers an integrated spatial analytics infrastructure that transforms raw geospatial datasets into structured feasibility intelligence. The platform combines network analysis, environmental modeling, zoning overlays, and computational scoring systems into a unified urban decision-support framework.
          </p>
        </Reveal>

        {/* Mission + Vision */}
        <Sep />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {[
            { icon: Target, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', label: 'Our Mission', text: 'To standardize and automate urban site evaluation through computational geospatial systems — enabling faster feasibility assessment, transparent scoring methodologies, and scalable infrastructure for urban development strategy.' },
            { icon: Eye,    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', label: 'Our Vision',  text: 'To establish spatial intelligence as a foundational layer in urban planning and architectural design — where every development decision is supported by measurable walkability metrics, network connectivity analysis, environmental impact modeling, and regulatory validation.' },
          ].map((c, i) => {
            const Icon = c.icon
            return (
              <Reveal key={c.label} delay={i * 0.1}>
                <Card style={{ padding: 26, height: '100%' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    <Icon size={19} color={c.color} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>{c.label}</h3>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.8 }}>{c.text}</p>
                </Card>
              </Reveal>
            )
          })}
        </div>

        {/* Metrics */}
        <Sep />
        <Reveal>
          <Tag>Metrics</Tag>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20 }}>Key Platform Metrics</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))', gap: 12 }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <Card style={{ padding: '22px 20px' }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 5 }}>
                  <Counter to={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.sub}</div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Capabilities */}
        <Sep />
        <Reveal>
          <Tag>Capabilities</Tag>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20 }}>Technical Capabilities</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {CAP.map((c, i) => {
            const Icon = c.icon
            return (
              <Reveal key={c.title} delay={i * 0.07}>
                <Card style={{ padding: 24, height: '100%' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Icon size={18} color={c.color} />
                  </div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#0F172A', marginBottom: 9 }}>{c.title}</h3>
                  <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.75 }}>{c.desc}</p>
                </Card>
              </Reveal>
            )
          })}
        </div>

        {/* Workflow */}
        <Sep />
        <Reveal>
          <Tag>Workflow</Tag>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20 }}>Platform Workflow</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: 12 }}>
          {WORKFLOW.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={i} delay={i * 0.09}>
                <Card style={{ padding: 22 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} color="#2563EB" />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#CBD5E1', letterSpacing: '0.08em' }}>{s.n}</span>
                  </div>
                  <h3 style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A', marginBottom: 7 }}>{s.title}</h3>
                  <p style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.7 }}>{s.desc}</p>
                </Card>
              </Reveal>
            )
          })}
        </div>

        {/* Engineering Philosophy */}
        <Sep />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <Reveal>
            <Tag>Engineering</Tag>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 14 }}>Engineering Philosophy</h2>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.85, marginBottom: 10 }}>
              ALKF+ is architected as a modular geospatial microservice platform. Each analytical module operates independently while integrating seamlessly through a centralized API layer, ensuring maintainability, scalability, and deployment flexibility.
            </p>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>The system emphasizes:</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
              {PHIL.map((item, i) => (
                <div key={item} className="hover-row" style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  padding: '11px 14px', background: '#fff',
                  border: '1px solid #E8EDF4', borderRadius: 10,
                  opacity: 0,
                  animation: `slidein 0.45s ease ${0.08 + i * 0.07}s forwards`,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: '#334151' }}>{item}</span>
                  <ArrowRight size={13} color="#BFDBFE" style={{ marginLeft: 'auto' }} />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Tech Stack */}
        <Sep />
        <Reveal>
          <Tag>Technology</Tag>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20 }}>Technology Stack</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 10 }}>
          {TECH.map((t, i) => {
            const Icon = t.icon
            return (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className="tech-c" style={{ background: '#fff', border: '1px solid #E8EDF4', borderRadius: 12, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F1F5F9', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color="#475569" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0F172A' }}>{t.name}</div>
                    <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>{t.cat}</div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Designed For */}
        <Sep />
        <Reveal>
          <Tag>Clients</Tag>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20 }}>Designed For</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {AUDIENCE.map((a, i) => {
            const Icon = a.icon
            return (
              <Reveal key={a.label} delay={i * 0.06}>
                <div className="hover-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#fff', border: '1px solid #E8EDF4', borderRadius: 11 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={15} color="#2563EB" />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: '#334151' }}>{a.label}</span>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Architecture */}
        <Sep />
        <Reveal>
          <Tag>Architecture</Tag>
          <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20 }}>Platform Architecture</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div style={{ background: '#fff', border: '1px solid #E8EDF4', borderRadius: 16, padding: '36px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            {/* subtle inner grid */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(#F1F5F9 1px,transparent 1px),linear-gradient(90deg,#F1F5F9 1px,transparent 1px)', backgroundSize: '32px 32px', borderRadius: 10, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '12px 0' }}>
                {/* Input */}
                <div style={{ width: '100%', maxWidth: 460 }}>
                  <p style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Input Layer</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {['OSM Network','HK Gov GIS','Zoning OZP'].map(n => (
                      <div key={n} className="arch-n" style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 9, background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: 12, color: '#475569', fontWeight: 500 }}>{n}</div>
                    ))}
                  </div>
                </div>
                {/* Arrow */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'bounceY 2s ease-in-out infinite' }}>
                  <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom,#CBD5E1,#2563EB)' }} />
                  <div style={{ width: 6, height: 6, borderRight: '2px solid #2563EB', borderBottom: '2px solid #2563EB', transform: 'rotate(45deg)', marginTop: -3 }} />
                </div>
                {/* Engine */}
                <div style={{ width: '100%', maxWidth: 520 }}>
                  <p style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Processing Engine</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                    {['Walking','Driving','Context','Noise'].map(n => (
                      <div key={n} className="arch-n" style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 9, background: '#EFF6FF', border: '1px solid #BFDBFE', fontSize: 12, color: '#2563EB', fontWeight: 700 }}>{n}</div>
                    ))}
                  </div>
                </div>
                {/* Arrow */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'bounceY 2s ease-in-out infinite', animationDelay: '0.4s' }}>
                  <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom,#2563EB,#7C3AED)' }} />
                  <div style={{ width: 6, height: 6, borderRight: '2px solid #7C3AED', borderBottom: '2px solid #7C3AED', transform: 'rotate(45deg)', marginTop: -3 }} />
                </div>
                {/* Output */}
                <div style={{ width: '100%', maxWidth: 460 }}>
                  <p style={{ fontSize: 10, color: '#94A3B8', textAlign: 'center', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Output Layer</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {['PDF Reports','PNG Maps','JSON API'].map(n => (
                      <div key={n} className="arch-n" style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 9, background: '#F5F3FF', border: '1px solid #DDD6FE', fontSize: 12, color: '#7C3AED', fontWeight: 500 }}>{n}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Enterprise Statement */}
        <Sep />
        <Reveal>
          <div style={{
            background: '#fff',
            border: '1px solid #E8EDF4',
            borderLeft: '4px solid #2563EB',
            borderRadius: '0 14px 14px 0',
            padding: '36px 40px',
            boxShadow: '0 2px 12px rgba(37,99,235,0.06)',
          }}>
            <p style={{ fontSize: 'clamp(16px,2vw,20px)', fontWeight: 700, color: '#0F172A', lineHeight: 1.65, maxWidth: 620, marginBottom: 20 }}>
              ALKF+ is not a visualization tool — it is a computational geospatial intelligence infrastructure built for rigorous urban decision-making.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: '#EFF6FF', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={12} color="#2563EB" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ALKF+ Spatial Intelligence Platform</span>
            </div>
          </div>
        </Reveal>

      </div>

      <Footer />
    </div>
  )
}
