import { useState, useEffect, useCallback } from 'react'
import { MapPin, Car, Bus, Eye, Volume2, Loader, FileText, Map, Download, AlertCircle, Maximize2, X, ZoomIn, ZoomOut, RotateCcw, BarChart2, ChevronDown } from 'lucide-react'

const API_BASE = 'https://automated-site-analysis-api.onrender.com'

const analysisTypes = [
    { id: 'walking',   label: 'Walking Accessibility',    icon: <MapPin size={15} />,   endpoint: '/walking',   desc: 'Isochrones, walkability scores & pedestrian network density across the site catchment area.' },
    { id: 'driving',   label: 'Driving Distance',         icon: <Car size={15} />,      endpoint: '/driving',   desc: 'Road connectivity, parking access & traffic corridor analysis for vehicular movement.' },
    { id: 'transport', label: 'Transport Network',        icon: <Bus size={15} />,      endpoint: '/transport', desc: 'Stop proximity, route density & multi-modal transit scoring for public connectivity.' },
    { id: 'context',   label: 'Context & Zoning',         icon: <Map size={15} />,      endpoint: '/context',   desc: 'Zoning, land use patterns & surrounding urban morphology of the neighbourhood.' },
    { id: 'view',      label: '360° View Analysis',       icon: <Eye size={15} />,      endpoint: '/view',      desc: 'Skyline exposure, sight lines & view quality index for amenity assessment.' },
    { id: 'noise',     label: 'Traffic Noise Model',      icon: <Volume2 size={15} />,  endpoint: '/noise',     desc: 'Ambient noise mapping, quiet zones & peak decibel analysis for acoustic comfort.' },
    { id: 'report',    label: 'Full Site Report',         icon: <FileText size={15} />, endpoint: '/report',    desc: 'Comprehensive site report combining all analysis layers into a single exportable document.' },
]

const dataTypes = [
    {
        id: 'LOT',
        label: 'LOT',
        description: 'Lot Number',
        placeholder: 'e.g. 1234, MK01-0123',
        examples: ['1234', 'MK01-0123', 'TPML 1234'],
    },
    {
        id: 'STT',
        label: 'STT',
        description: 'Street / Town / Territory',
        placeholder: 'e.g. 1234, 5678',
        examples: ['1234', '5678'],
    },
    {
        id: 'GLA',
        label: 'GLA',
        description: 'Government Land Assignment',
        placeholder: 'e.g. 4567',
        examples: ['4567'],
    },
    {
        id: 'LPP',
        label: 'LPP',
        description: 'Land Parcel Plan',
        placeholder: 'e.g. 5555, 12345',
        examples: ['5555', '12345'],
    },
    {
        id: 'UN',
        label: 'UN',
        description: 'Unique Number',
        placeholder: 'e.g. 123456, 789012',
        examples: ['123456', '789012'],
    },
    {
        id: 'BUILDINGCSUID',
        label: 'BUILDINGCSUID',
        description: 'Building Spatial Unique ID',
        placeholder: 'e.g. B123456789',
        examples: ['B123456789'],
    },
    {
        id: 'LOTCSUID',
        label: 'LOTCSUID',
        description: 'Lot Spatial Unique ID',
        placeholder: 'e.g. L123456789',
        examples: ['L123456789'],
    },
    {
        id: 'PRN',
        label: 'PRN',
        description: 'Property Reference Number',
        placeholder: 'e.g. 123456',
        examples: ['123456'],
    },
]

function FullViewModal({ imgUrl, onClose }) {
    const [zoom, setZoom] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const handleWheel = useCallback((e) => { e.preventDefault(); setZoom(p => Math.min(4, Math.max(0.5, p - e.deltaY * 0.001))) }, [])
    const handleMouseDown = (e) => { if (zoom > 1) { setDragging(true); setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y }) } }
    const handleMouseMove = (e) => { if (dragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }) }
    const handleMouseUp = () => setDragging(false)
    useEffect(() => { const h = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [onClose])
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', background: 'white', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>Full View</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {[{ icon: <ZoomOut size={13} />, fn: () => setZoom(z => Math.max(0.5, z - 0.25)) }, { icon: <ZoomIn size={13} />, fn: () => setZoom(z => Math.min(4, z + 0.25)) }, { icon: <RotateCcw size={13} />, fn: () => { setZoom(1); setPosition({ x: 0, y: 0 }) } }].map((b, i) => (
                        <button key={i} onClick={b.fn} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 5, padding: '5px', cursor: 'pointer', display: 'flex', color: '#6B7280' }}>{b.icon}</button>
                    ))}
                    <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{Math.round(zoom * 100)}%</span>
                    <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 5, padding: '5px 10px', cursor: 'pointer', color: '#DC2626', fontSize: 12, fontWeight: 600 }}><X size={12} /> Close</button>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default' }} onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                <img src={imgUrl} alt="Full view" draggable={false} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`, borderRadius: 8, boxShadow: '0 32px 80px rgba(0,0,0,0.5)', userSelect: 'none', transition: dragging ? 'none' : 'transform 0.1s' }} />
            </div>
        </div>
    )
}

export default function InteractiveMaps() {
    const [selected, setSelected] = useState('walking')
    const [dataType, setDataType] = useState('LOT')
    const [value, setValue] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [status, setStatus] = useState('idle')
    const [imgUrl, setImgUrl] = useState(null)
    const [pdfUrl, setPdfUrl] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [duration, setDuration] = useState(null)
    const [mounted, setMounted] = useState(false)
    const [fullView, setFullView] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    // Close dropdown on outside click
    useEffect(() => {
        if (!dropdownOpen) return
        const handler = () => setDropdownOpen(false)
        window.addEventListener('click', handler)
        return () => window.removeEventListener('click', handler)
    }, [dropdownOpen])

    const selectedType = analysisTypes.find(t => t.id === selected)
    const selectedDataType = dataTypes.find(d => d.id === dataType)

    const handleSelect = (id) => { setSelected(id); setStatus('idle'); setImgUrl(null); setPdfUrl(null); setErrorMsg(''); setDuration(null); setFullView(false) }

    const handleDataTypeSelect = (id) => {
        setDataType(id)
        setValue('')
        setDropdownOpen(false)
        setStatus('idle'); setImgUrl(null); setPdfUrl(null); setErrorMsg(''); setDuration(null)
    }

    const handleGenerate = async () => {
        if (!value.trim()) { setErrorMsg('Please enter a valid value.'); setStatus('error'); return }
        setStatus('loading'); setImgUrl(null); setPdfUrl(null); setErrorMsg(''); setDuration(null); setFullView(false)
        const t0 = Date.now()
        try {
            const res = await fetch(`${API_BASE}${selectedType.endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data_type: dataType, value: value.trim() })
            })
            setDuration(((Date.now() - t0) / 1000).toFixed(2))
            if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`)
            const ct = res.headers.get('content-type') || ''
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            if (ct.includes('application/pdf')) setPdfUrl(url)
            else setImgUrl(url)
            setStatus('done')
        } catch (err) {
            setDuration(((Date.now() - t0) / 1000).toFixed(2))
            setErrorMsg(err.message)
            setStatus('error')
        }
    }

    const handleDownload = () => {
        const url = pdfUrl || imgUrl; if (!url) return
        const a = document.createElement('a'); a.href = url
        a.download = pdfUrl ? `report_${dataType}_${value}.pdf` : `${selected}_${dataType}_${value}.png`; a.click()
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Inter', system-ui, sans-serif", color: '#111827', opacity: mounted ? 1 : 0, transition: 'opacity 0.3s' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                html, body { width: 100%; background: #fff; }
                input::placeholder { color: #9CA3AF; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
                .dt-dropdown-item:hover { background: #F3F4F6 !important; }
            `}</style>

            {fullView && imgUrl && <FullViewModal imgUrl={imgUrl} onClose={() => setFullView(false)} />}

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 64px' }}>

                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 12 }}>
                    Spatial Analysis Module
                </p>

                <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#111827', marginBottom: 10, lineHeight: 1.15 }}>
                    Geospatial Infrastructure Analytics Engine
                </h1>
                <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 36, lineHeight: 1.6, fontWeight: 400 }}>
                    Advanced geospatial computation framework integrating mobility networks, environmental simulation, zoning intelligence, and multi-criteria spatial modeling.
                </p>

                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

                    {/* LEFT CARD — Analysis Controls */}
                    <div style={{ width: 380, flexShrink: 0, border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Analysis Controls</p>
                        </div>

                        <div style={{ padding: '20px' }}>

                            {/* Data Type Selector */}
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Data Type</label>
                                <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => setDropdownOpen(o => !o)}
                                        style={{
                                            width: '100%', border: '1px solid #E5E7EB', borderRadius: 8,
                                            padding: '10px 36px 10px 14px', fontSize: 14, color: '#111827',
                                            background: '#fff', cursor: 'pointer', textAlign: 'left',
                                            fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
                                            ...(dropdownOpen ? { borderColor: '#6366F1', boxShadow: '0 0 0 3px rgba(99,102,241,0.1)' } : {})
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ display: 'inline-block', background: '#EEF2FF', color: '#6366F1', borderRadius: 5, padding: '2px 8px', fontSize: 12, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.04em' }}>{dataType}</span>
                                            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 400 }}>{selectedDataType?.description}</span>
                                        </div>
                                        <ChevronDown size={14} style={{ color: '#9CA3AF', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.15s', flexShrink: 0 }} />
                                    </button>

                                    {dropdownOpen && (
                                        <div style={{
                                            position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                                            background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
                                            boxShadow: '0 8px 30px rgba(0,0,0,0.1)', zIndex: 100, overflow: 'hidden',
                                            animation: 'fadeIn 0.15s ease'
                                        }}>
                                            {dataTypes.map(dt => (
                                                <button
                                                    key={dt.id}
                                                    className="dt-dropdown-item"
                                                    onClick={() => handleDataTypeSelect(dt.id)}
                                                    style={{
                                                        width: '100%', padding: '9px 14px', border: 'none',
                                                        background: dt.id === dataType ? '#EEF2FF' : '#fff',
                                                        cursor: 'pointer', textAlign: 'left', display: 'flex',
                                                        alignItems: 'center', gap: 10, transition: 'background 0.1s'
                                                    }}
                                                >
                                                    <span style={{ display: 'inline-block', minWidth: 100, background: dt.id === dataType ? '#E0E7FF' : '#F3F4F6', color: dt.id === dataType ? '#6366F1' : '#6B7280', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.04em' }}>{dt.label}</span>
                                                    <span style={{ fontSize: 12, color: dt.id === dataType ? '#4338CA' : '#6B7280', fontWeight: dt.id === dataType ? 500 : 400 }}>{dt.description}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Value Input */}
                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                                    Search Value
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#D1D5DB', pointerEvents: 'none' }} />
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                                        placeholder={selectedDataType?.placeholder || 'Enter value…'}
                                        style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 12px 10px 36px', fontSize: 14, color: '#111827', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', background: '#fff', fontWeight: 400 }}
                                        onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                                        onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Analysis Type */}
                            <div style={{ marginBottom: 28 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Analysis Type</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {analysisTypes.map(t => {
                                        const isActive = selected === t.id
                                        return (
                                            <button key={t.id} onClick={() => handleSelect(t.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 8, border: 'none', background: isActive ? '#EEF2FF' : 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.12s' }}
                                                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F9FAFB' }}
                                                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                                                <div style={{ width: 28, height: 28, borderRadius: 7, background: isActive ? '#E0E7FF' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#6366F1' : '#9CA3AF', flexShrink: 0, transition: 'all 0.12s' }}>
                                                    {t.icon}
                                                </div>
                                                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? '#4338CA' : '#374151', transition: 'all 0.12s' }}>{t.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Generate button */}
                            <button onClick={handleGenerate} disabled={status === 'loading'} style={{ width: '100%', padding: '12px 20px', borderRadius: 8, border: 'none', background: status === 'loading' ? '#C7D2FE' : '#6366F1', color: 'white', fontSize: 14, fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s', letterSpacing: '-0.01em' }}
                                onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.background = '#4F46E5' }}
                                onMouseLeave={e => { if (status !== 'loading') e.currentTarget.style.background = '#6366F1' }}>
                                {status === 'loading'
                                    ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</>
                                    : 'Generate Analysis'
                                }
                            </button>
                        </div>
                    </div>

                    {/* RIGHT CARD — Result Display */}
                    <div style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden', minHeight: 520 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Result Display</p>
                            {status === 'done' && duration && (
                                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{duration}s</span>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 460, padding: 32, position: 'relative' }}>

                            {status === 'idle' && (
                                <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#D1D5DB' }}>
                                        <BarChart2 size={24} />
                                    </div>
                                    <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Spatial Engine Idle</p>
                                    <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6 }}>Select a data type, enter a value, and choose an analysis type to begin.</p>
                                </div>
                            )}

                            {status === 'loading' && (
                                <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ position: 'relative', width: 48, height: 48, margin: '0 auto 20px' }}>
                                        <div style={{ position: 'absolute', inset: 0, border: '3px solid #E0E7FF', borderRadius: '50%' }} />
                                        <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTop: '3px solid #6366F1', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Processing Analysis</p>
                                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>Running {selectedType?.label} engine…</p>
                                </div>
                            )}

                            {status === 'error' && (
                                <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease', maxWidth: 440 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#EF4444' }}><AlertCircle size={22} /></div>
                                    <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 12 }}>Analysis Failed</p>
                                    <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 16px', marginBottom: 16, textAlign: 'left' }}>
                                        <p style={{ fontSize: 12, color: '#DC2626', fontFamily: 'monospace', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{errorMsg}</p>
                                    </div>
                                    <button onClick={() => setStatus('idle')} style={{ padding: '8px 18px', background: 'white', border: '1px solid #E5E7EB', borderRadius: 7, color: '#374151', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>Try Again</button>
                                </div>
                            )}

                            {status === 'done' && imgUrl && (
                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 10, animation: 'fadeIn 0.4s ease' }}>
                                    <div style={{ flex: 1, position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #F3F4F6', minHeight: 380 }}>
                                        <img src={imgUrl} alt="analysis result" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#FAFAFA' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                        <button onClick={() => setFullView(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, background: '#F3F4F6', border: '1px solid #E5E7EB', color: '#374151', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}><Maximize2 size={12} /> Full View</button>
                                        <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, background: '#6366F1', border: 'none', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}><Download size={12} /> Export PNG</button>
                                    </div>
                                </div>
                            )}

                            {status === 'done' && pdfUrl && (
                                <div style={{ textAlign: 'center', animation: 'fadeIn 0.4s ease' }}>
                                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
                                        <div style={{ width: 72, height: 72, borderRadius: 16, background: '#FDF2F8', border: '1px solid #FBCFE8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DB2777' }}><FileText size={30} /></div>
                                        <div style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 800 }}>✓</div>
                                    </div>
                                    <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Report Ready</p>
                                    <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 24 }}>Report for <strong style={{ color: '#6366F1', fontFamily: 'monospace' }}>{dataType}: {value}</strong> is ready.</p>
                                    <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 8, background: '#6366F1', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', margin: '0 auto' }}><Download size={15} /> Download PDF Report</button>
                                </div>
                            )}
                        </div>
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