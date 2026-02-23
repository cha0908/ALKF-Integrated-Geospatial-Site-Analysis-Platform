import { useState, useEffect, useRef } from 'react'
import { CheckCircle, ArrowRight, Shield, FileText, Code2, BookOpen, Headphones, FlaskConical } from 'lucide-react'
import Footer from '../components/Footer'

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
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
  }, [threshold])
  return [ref, visible]
}

function Reveal({ children, delay = 0, direction = 'up' }) {
  const [ref, visible] = useInView()
  const transforms = {
    up: 'translateY(18px)',
    left: 'translateX(-14px)',
    right: 'translateX(14px)',
    none: 'none',
  }
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : transforms[direction],
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// ── Fade-in on mount ────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay * 1000); return () => clearTimeout(t) }, [delay])
  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(14px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
      {children}
    </div>
  )
}

const benefits = [
  { icon: <Code2 size={15} />, text: 'Full RESTful API access to all analytical modules' },
  { icon: <FileText size={15} />, text: 'Structured JSON and cartographic image outputs' },
  { icon: <FileText size={15} />, text: 'PDF report generation endpoints' },
  { icon: <FlaskConical size={15} />, text: 'Sandbox environment for pre-production testing' },
  { icon: <BookOpen size={15} />, text: 'Technical documentation and schema reference' },
  { icon: <Headphones size={15} />, text: 'Dedicated onboarding and integration support' },
]

export default function RequestAPI() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', organization: '', role: '', useCase: '' })
  const [focused, setFocused] = useState(null)

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
        <FadeIn delay={0}>
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, padding: '56px 48px', maxWidth: 440, width: '100%', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#2563EB' }}>
              <CheckCircle size={26} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 12 }}>Request Received</p>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 16, letterSpacing: '-0.02em' }}>Access Request Submitted</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.75 }}>
              Your request has been logged for technical review. A member of our infrastructure team will respond to{' '}
              <strong style={{ color: '#1E293B' }}>{form.email}</strong> within 2–3 business days.
            </p>
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #F1F5F9' }}>
              <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: "'IBM Plex Mono', monospace" }}>REF: ALKF-API-{Date.now().toString(36).toUpperCase()}</p>
            </div>
          </div>
        </FadeIn>
      </div>
    )
  }

  const fieldStyle = (id) => ({
    width: '100%',
    border: `1px solid ${focused === id ? '#2563EB' : '#E2E8F0'}`,
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
    color: '#0F172A',
    background: focused === id ? '#FAFCFF' : 'white',
    outline: 'none',
    transition: 'border-color 0.18s, background 0.18s',
    fontFamily: "'IBM Plex Sans', sans-serif",
  })

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: '#374151',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 7,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: #94A3B8 !important; }
        textarea { resize: none; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '64px 32px 56px' }}>
          <FadeIn delay={0}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 14 }}>API Access</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 style={{ fontSize: 42, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18, maxWidth: 580 }}>
              Request Enterprise<br />API Access
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.75, maxWidth: 600, fontWeight: 400 }}>
              Submit an access request to integrate the ALKF+ Spatial Intelligence Engine into your analytical workflows.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 32px 96px' }}>

        {/* ── FORM + SIDEBAR ──────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>

          {/* ── LEFT: FORM ──────────────────────────────────────────────── */}
          <FadeIn delay={0.15}>
            <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '36px 36px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 6 }}>Form</p>
              <h2 style={{ fontSize: 19, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: 28 }}>API Access Request</h2>

              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle} htmlFor="name">Full Name</label>
                    <input
                      id="name" name="name" type="text" placeholder="Dr. Arun Mehta"
                      value={form.name} onChange={handleChange} required
                      onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                      style={fieldStyle('name')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="email">Work Email</label>
                    <input
                      id="email" name="email" type="email" placeholder="name@organization.com"
                      value={form.email} onChange={handleChange} required
                      onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                      style={fieldStyle('email')}
                    />
                  </div>
                </div>

                {/* Organization + Role row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={labelStyle} htmlFor="organization">Organization</label>
                    <input
                      id="organization" name="organization" type="text" placeholder="Urban Development Authority"
                      value={form.organization} onChange={handleChange} required
                      onFocus={() => setFocused('organization')} onBlur={() => setFocused(null)}
                      style={fieldStyle('organization')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="role">Role / Position</label>
                    <input
                      id="role" name="role" type="text" placeholder="GIS Analyst / Research Lead"
                      value={form.role} onChange={handleChange} required
                      onFocus={() => setFocused('role')} onBlur={() => setFocused(null)}
                      style={fieldStyle('role')}
                    />
                  </div>
                </div>

                {/* Use Case */}
                <div>
                  <label style={labelStyle} htmlFor="useCase">Intended Use Case</label>
                  <textarea
                    id="useCase" name="useCase" rows={5}
                    placeholder="Describe your intended integration, expected request volume, and analytical scope."
                    value={form.useCase} onChange={handleChange} required
                    onFocus={() => setFocused('useCase')} onBlur={() => setFocused(null)}
                    style={{ ...fieldStyle('useCase'), lineHeight: 1.65 }}
                  />
                </div>

                {/* Submit */}
                <SubmitButton />
              </form>
            </div>
          </FadeIn>

          {/* ── RIGHT: SIDEBAR ──────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Benefits card */}
            <FadeIn delay={0.22}>
              <BenefitsCard />
            </FadeIn>

            {/* Support card */}
            <FadeIn delay={0.3}>
              <SupportCard />
            </FadeIn>

            {/* Compliance badge */}
            <FadeIn delay={0.37}>
              <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 12, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A', flexShrink: 0 }}>
                  <Shield size={15} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>Compliance Validated</p>
                  <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>All access provisioned following technical review and infrastructure compliance checks.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ── ACCESS GOVERNANCE SECTION ──────────────────────────────── */}
        <div style={{ marginTop: 64 }}>
          <Reveal delay={0.05}>
            <div style={{ height: 1, background: '#E2E8F0', marginBottom: 64 }} />
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 56, alignItems: 'start' }}>
            <Reveal delay={0}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 12 }}>Governance</p>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.025em', lineHeight: 1.2 }}>Access Governance</h2>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.85, fontWeight: 400 }}>
                ALKF+ API access is provisioned following technical review and compliance validation. Each request is evaluated against intended use scope, expected query volume, and integration architecture. Usage is continuously monitored to ensure system stability, performance integrity, and equitable infrastructure allocation across all provisioned accounts.
              </p>
            </Reveal>
          </div>

          {/* Governance pillars */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 36 }}>
            {[
              { label: 'Technical Review', desc: 'Each request undergoes evaluation by the infrastructure team prior to provisioning.' },
              { label: 'Usage Monitoring', desc: 'API activity is tracked to maintain system performance and equitable access allocation.' },
              { label: 'Compliance Validation', desc: 'Access is subject to ongoing compliance verification and periodic access review.' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={0.06 * i}>
                <GovernancePillar label={item.label} desc={item.desc} />
              </Reveal>
            ))}
          </div>
        </div>

      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  )
}

// ── Submit button with hover ─────────────────────────────────────────────────
function SubmitButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      type="submit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#1D4ED8' : '#2563EB',
        color: 'white',
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontWeight: 600,
        fontSize: 14,
        padding: '12px 24px',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        boxShadow: hovered ? '0 6px 20px rgba(37,99,235,0.28)' : '0 2px 8px rgba(37,99,235,0.18)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        transition: 'all 0.18s ease',
        letterSpacing: '0.01em',
      }}
    >
      Submit Access Request
      <ArrowRight size={15} />
    </button>
  )
}

// ── Benefits card ────────────────────────────────────────────────────────────
function BenefitsCard() {
  const [hovered, setHovered] = useState(null)
  return (
    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '28px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 6 }}>Entitlements</p>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 22, letterSpacing: '-0.01em' }}>Included with API Access</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {benefits.map((item, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 7,
              background: hovered === i ? '#F8FAFC' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB', flexShrink: 0, marginTop: 1 }}>
              {item.icon}
            </div>
            <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, paddingTop: 6 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Support card ─────────────────────────────────────────────────────────────
function SupportCard() {
  const [emailHovered, setEmailHovered] = useState(false)
  return (
    <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 14, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 6 }}>Contact</p>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 10, letterSpacing: '-0.01em' }}>Enterprise Support</h3>
      <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.7, marginBottom: 14 }}>
        For institutional partnerships or bulk access inquiries, contact our technical team directly.
      </p>
      <a
        href="mailto:info@alkf.io"
        onMouseEnter={() => setEmailHovered(true)}
        onMouseLeave={() => setEmailHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          fontWeight: 600,
          color: emailHovered ? '#1D4ED8' : '#2563EB',
          textDecoration: 'none',
          fontFamily: "'IBM Plex Mono', monospace",
          transition: 'color 0.15s',
        }}
      >
        info@alkf.io
        <ArrowRight size={12} />
      </a>
    </div>
  )
}

// ── Governance pillar card ───────────────────────────────────────────────────
function GovernancePillar({ label, desc }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        border: `1px solid ${hovered ? '#BFDBFE' : '#E2E8F0'}`,
        borderRadius: 10,
        padding: '22px 22px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hovered ? '0 4px 16px rgba(37,99,235,0.06)' : '0 1px 3px rgba(0,0,0,0.03)',
        cursor: 'default',
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2563EB', marginBottom: 14 }} />
      <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 8, letterSpacing: '-0.01em' }}>{label}</p>
      <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65 }}>{desc}</p>
    </div>
  )
}
