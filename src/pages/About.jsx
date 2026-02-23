import { useState, useEffect, useRef } from 'react'
import { Network, BarChart2, Database, Cpu, Target, Eye, Building2, MapPin, Users, FlaskConical, Landmark, Briefcase } from 'lucide-react'
import Footer from '../components/Footer'

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
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
function Reveal({ children, delay = 0, direction = 'up' }) {
  const [ref, visible] = useInView()
  const transforms = { up: 'translateY(22px)', left: 'translateX(-20px)', right: 'translateX(20px)' }
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : (transforms[direction] || transforms.up),
      transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
    }}>
      {children}
    </div>
  )
}

// ── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: '#E8EDF4', margin: '72px 0' }} />
}

// ── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 10 }}>
      {children}
    </p>
  )
}

// ── Capability cards (expandable) ────────────────────────────────────────────
const capabilities = [
  {
    icon: <Network size={20} />,
    title: 'Advanced Graph Theory',
    desc: 'NetworkX-powered routing algorithms, centrality analysis, graph-based connectivity modeling, and isochrone computation for pedestrian and vehicular systems.',
  },
  {
    icon: <BarChart2 size={20} />,
    title: 'Spatial Econometrics',
    desc: 'Gravity models, spatial autocorrelation, density estimation, and multi-criteria scoring frameworks for development evaluation.',
  },
  {
    icon: <Database size={20} />,
    title: 'High-Performance GIS Infrastructure',
    desc: 'GeoPandas, PostGIS, Shapely, and optimized GeoPackage datasets enabling high-throughput spatial queries and sub-second geometric operations.',
  },
  {
    icon: <Cpu size={20} />,
    title: 'Automated Reporting & Intelligence Outputs',
    desc: 'Structured PDF reports, JSON outputs, heatmaps, isochrones, and map visualizations generated through automated rendering pipelines.',
  },
]

// ── Who it serves ────────────────────────────────────────────────────────────
const audience = [
  { icon: <Building2 size={18} />,  label: 'Architecture Firms' },
  { icon: <MapPin size={18} />,     label: 'Urban Planning Consultancies' },
  { icon: <Briefcase size={18} />,  label: 'Real Estate Developers' },
  { icon: <Network size={18} />,    label: 'Infrastructure Engineers' },
  { icon: <FlaskConical size={18}/>, label: 'Research Institutions' },
  { icon: <Landmark size={18} />,   label: 'Government Planning Departments' },
]

// ── Engineering philosophy bullets ───────────────────────────────────────────
const philosophy = [
  'Dataset optimization',
  'CRS standardization',
  'Graph-based computation',
  'Environmental propagation modeling',
  'Modular analytical isolation',
  'Cloud-native deployment strategy',
]

export default function About() {
  return (
    <div style={{ background: '#FAFBFC', fontFamily: "'Inter', system-ui, sans-serif", color: '#1E293B' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; background: #FAFBFC; }
      `}</style>

      {/* ── HERO HEADER ───────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8EDF4' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 32px 64px' }}>
          <Reveal>
            <SectionLabel>About</SectionLabel>
            <h1 style={{ fontSize: 44, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20, maxWidth: 640 }}>
              Enterprise Urban Intelligence
            </h1>
            <p style={{ fontSize: 17, color: '#4B5563', lineHeight: 1.8, maxWidth: 620, fontWeight: 400 }}>
              ALKF+ is a geospatial intelligence platform engineered for architects, planners, developers, and researchers who require rigorous, data-driven site feasibility evaluation.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── PAGE BODY ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 32px 80px' }}>

        {/* ── SECTION 1: Platform Overview ──────────────────────────────── */}
        <Reveal>
          <SectionLabel>Platform</SectionLabel>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20 }}>What We Build</h2>
          <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.85, maxWidth: 740 }}>
            ALKF+ delivers an integrated spatial analytics infrastructure that transforms raw geospatial datasets into structured feasibility intelligence. The platform combines network analysis, environmental modeling, zoning overlays, and computational scoring systems into a unified urban decision-support framework.
          </p>
        </Reveal>

        <Divider />

        {/* ── SECTION 2 & 3: Mission + Vision ──────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {[
            {
              icon: <Target size={22} />,
              label: 'Our Mission',
              delay: 0,
              text: 'To standardize and automate urban site evaluation through computational geospatial systems — enabling faster feasibility assessment, transparent scoring methodologies, and scalable infrastructure for urban development strategy.',
            },
            {
              icon: <Eye size={22} />,
              label: 'Our Vision',
              delay: 0.1,
              text: 'To establish spatial intelligence as a foundational layer in urban planning and architectural design — where every development decision is supported by measurable walkability metrics, network connectivity analysis, environmental impact modeling, and regulatory validation.',
            },
          ].map(c => (
            <Reveal key={c.label} delay={c.delay}>
              <div style={{ background: 'white', border: '1px solid #E8EDF4', borderRadius: 14, padding: '28px', height: '100%', transition: 'box-shadow 0.2s ease, border-color 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.08)'; e.currentTarget.style.borderColor = '#BFDBFE' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E8EDF4' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', marginBottom: 20 }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>{c.label}</h3>
                <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.8 }}>{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Divider />

        {/* ── SECTION 4: Technical Capabilities ────────────────────────── */}
        <Reveal>
          <SectionLabel>Capabilities</SectionLabel>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 32 }}>Technical Capabilities</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div style={{ background: 'white', border: '1px solid #E8EDF4', borderRadius: 14, padding: '24px', transition: 'all 0.2s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,99,235,0.08)'; e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E8EDF4'; e.currentTarget.style.transform = 'none' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', marginBottom: 16 }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>{c.title}</h3>
                <p style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.75 }}>{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Divider />

        {/* ── SECTION 5: Engineering Philosophy ────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <Reveal direction="left">
            <SectionLabel>Engineering</SectionLabel>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 20 }}>Engineering Philosophy</h2>
            <p style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.85, marginBottom: 20 }}>
              ALKF+ is architected as a modular geospatial microservice platform. Each analytical module operates independently while integrating seamlessly through a centralized API layer, ensuring maintainability, scalability, and deployment flexibility.
            </p>
            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>The system emphasizes:</p>
          </Reveal>
          <Reveal direction="right" delay={0.1}>
            <div style={{ paddingTop: 56, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {philosophy.map((item, i) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'white', border: '1px solid #E8EDF4', borderRadius: 10, transition: 'all 0.2s ease', opacity: 0, animation: `fadeSlide 0.5s ease ${0.1 + i * 0.07}s forwards` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.background = '#F8FBFF' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EDF4'; e.currentTarget.style.background = 'white' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: '#374151' }}>{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <style>{`
          @keyframes fadeSlide {
            from { opacity: 0; transform: translateX(12px); }
            to   { opacity: 1; transform: none; }
          }
        `}</style>

        <Divider />

        {/* ── SECTION 6: Who It Serves ──────────────────────────────────── */}
        <Reveal>
          <SectionLabel>Clients</SectionLabel>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em', marginBottom: 32 }}>Designed For</h2>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {audience.map((a, i) => (
            <Reveal key={a.label} delay={i * 0.07}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'white', border: '1px solid #E8EDF4', borderRadius: 10, transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#BFDBFE'; e.currentTarget.style.boxShadow = '0 3px 12px rgba(37,99,235,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EDF4'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0 }}>
                  {a.icon}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 500, color: '#1E293B', lineHeight: 1.4 }}>{a.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Divider />

        {/* ── SECTION 7: Enterprise Statement ──────────────────────────── */}
        <Reveal>
          <div style={{ background: 'white', border: '1px solid #E8EDF4', borderLeft: '4px solid #1E3A8A', borderRadius: '0 14px 14px 0', padding: '40px 48px' }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', lineHeight: 1.65, letterSpacing: '-0.015em', maxWidth: 680 }}>
              ALKF+ is not a visualization tool — it is a computational geospatial intelligence infrastructure built for rigorous urban decision-making.
            </p>
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B', letterSpacing: '0.02em' }}>ALKF+ Spatial Intelligence Platform</span>
            </div>
          </div>
        </Reveal>

      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}
