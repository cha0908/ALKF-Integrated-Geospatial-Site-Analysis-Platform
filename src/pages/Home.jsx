import { Link } from 'react-router-dom'
import { ArrowRight, Map, Network, BarChart2 } from 'lucide-react'

// Dashboard mockup
function DashboardMockup() {
    return (
      <div className="relative w-full max-w-[600px] mx-auto">
        <div className="rounded-2xl bg-white shadow-[0_32px_80px_rgba(37,99,235,0.18)] border border-[#E2E8F0] overflow-hidden">
          
          {/* Mac top bar */}
          <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 px-4 py-2.5">
            <span className="w-3 h-3 rounded-full bg-[#FCA5A5]" />
            <span className="w-3 h-3 rounded-full bg-[#FCD34D]" />
            <span className="w-3 h-3 rounded-full bg-[#6EE7B7]" />
          </div>
  
          {/* Space wrapper */}
          <div className="p-2 bg-[#F8FAFC]">
            <img
              src="/map.png"
              alt="Dashboard Preview"
              className="w-full rounded-xl shadow-md"
            />
          </div>
  
        </div>
      </div>
    )
  }

// ── NEW: Dashboard + Text side-by-side section ──────────────────────────────
function DashboardSection() {
    return (
        <section className="py-20 px-6 bg-[#f8f8f8]">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* LEFT: Dotted border box containing DashboardMockup */}
                <div
                    className="flex-1 w-full flex items-center justify-center rounded-2xl p-6 transition-all duration-300"
                    style={{
                        background: 'rgba(239,246,255,0.5)',
                        minHeight: '340px',
                        boxShadow: '0 4px 24px rgba(37,99,235,0.06)',
                        cursor: 'default',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)'
                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(37,99,235,0.15)'
                        e.currentTarget.style.background = 'rgba(219,234,254,0.55)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 24px rgba(37,99,235,0.06)'
                        e.currentTarget.style.background = 'rgba(239,246,255,0.5)'
                    }}
                >
                    <DashboardMockup />
                </div>

                {/* RIGHT: Text content */}
                <div className="flex-1 flex flex-col gap-6">
                    
                    <h2 className="text-3xl font-extrabold text-[#1E293B] leading-tight tracking-tight">
                    Advance-Grade Spatial Intelligence Engine                
                    </h2>
                    <p className="text-[#4B5563] leading-relaxed text-base text-justify">
                        Designed for architecture and urban planning workflows, the system automates parcel-based feasibility analysis through advanced GIS processing, regulatory integration, and real-time data orchestration. Leveraging spatial graph analytics, geometric modeling, and layered regulatory datasets, it performs contextual overlays, accessibility computation, environmental modeling, and constraint validation within a single automated pipeline.

The result is a scalable spatial intelligence environment that supports high-density urban evaluation, reduces cross-platform dependency, and streamlines early-stage development decision-making.
                    </p>
            
                </div>
            </div>
        </section>
    )
}

const techStack = ['FastAPI', 'Render', 'OpenStreetMap', 'PostGIS', 'NetworkX', 'Shapely']
const marqueeItems = [...techStack, ...techStack, ...techStack]

const features = [
    { icon: <Network size={20} />, title: 'Parcel & Registry Integration', desc: 'Direct integration with official land parcel identifiers, CSUID systems, and regulatory datasets for validated spatial referencing.' },
    { icon: <BarChart2 size={20} />, title: 'Regulatory & Environmental Analysis', desc: 'Automated zoning validation, height assessment, and environmental modeling to assess development constraints.' },
    { icon: <Map size={20} />, title: 'Decision-Ready Reporting', desc: 'Structured visualization and automated report generation for architecture and planning teams.' },
]

export default function Home() {
    return (
        <div>
            {/* ── Hero ──────────────────────────────────────────── */}
            <section className="relative py-20 px-6 overflow-hidden">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ zIndex: 0 }}
                >
                    <source src="/video1.MP4" type="video/mp4" />
                </video>
                <div
                    className="absolute inset-0"
                    style={{
                        zIndex: 1,
                        background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.75) 100%)',
                    }}
                />
                <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12" style={{ zIndex: 2 }}>
                    <div className="flex-1 flex flex-col gap-6">
                        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#ffffff]">Enterprise Urban Intelligence</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#ffffffbd] tracking-tight">
                        Integrated Geospatial {' '}
                            <span className="text-[#ffffffbd]">Site Analysis Platform</span>
                        </h1>
                        <p className="text-base text-[#ece6e6] max-w-md leading-relaxed">
                        Delivering contextual, regulatory, and environmental insights to support strategic urban design.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/About"
                                className="inline-flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 rounded-lg font-semibold text-sm transition-all shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:-translate-y-px">
                                Explore More <ArrowRight size={15} />
                            </Link>
                            <Link to="/maps"
                                className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] text-[#1E293B] hover:border-[#2563EB] hover:text-[#2563EB] px-5 py-3 rounded-lg font-semibold text-sm transition-all">
                                <Map size={15} /> Site Analysis
                            </Link>
                        </div>
                    </div>
                    <div className="flex-1 w-full" />
                </div>
            </section>

            
            {/* ── Dashboard + Text (NEW) ───────────────────────────── */}
            <DashboardSection />

            {/* ── Features ─────────────────────────────────────── */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-4 mb-12">
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2563EB]">End-to-End Spatial Analysis</p>
                    <h2 className="text-3xl font-extrabold text-[#1E293B] tracking-tight">Everything you need to analyze urban sites</h2>
                    <p className="text-[#4B5563] max-w-xl">From raw geospatial data to actionable feasibility scores in minutes.</p>
                </div>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                    {features.map((f) => (
                        <div key={f.title} className="bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                                {f.icon}
                            </div>
                            <h3 className="font-bold text-[#1E293B] text-base">{f.title}</h3>
                            <p className="text-sm text-[#4B5563] leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
            {/* ── Tech Stack — Horizontal Marquee ─────────────────── */}
            <section className="py-14 bg-white border-y border-[#fefeff]">
                <div className="flex flex-col items-center gap-8">
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#94A3B8]">
                    Spatially Engineered on Modern GIS Frameworks
                    </p>
                    <div className="relative overflow-hidden w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: 'max-content',
                                animation: 'marquee-scroll 28s linear infinite',
                            }}
                        >
                            {marqueeItems.map((tech, i) => (
                                <span
                                    key={i}
                                    style={{
                                        padding: '0 3rem',
                                        fontSize: '0.9375rem',
                                        fontWeight: 600,
                                        color: '#94A3B8',
                                        whiteSpace: 'nowrap',
                                        userSelect: 'none',
                                        letterSpacing: '0.01em',
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes marquee-scroll {
                        0%   { transform: translateX(0); }
                        100% { transform: translateX(calc(-100% / 3)); }
                    }
                `}</style>
                
            </section>
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