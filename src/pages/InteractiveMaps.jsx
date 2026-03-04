import { useState, useEffect, useCallback, useRef } from 'react'
import { MapPin, Car, Bus, Eye, Volume2, Loader, FileText, Map, Download, AlertCircle, Maximize2, X, ZoomIn, ZoomOut, RotateCcw, BarChart2, Search, Plus } from 'lucide-react'

const API_BASE = 'https://automated-site-analysis-api.onrender.com'

const analysisTypes = [
    { id: 'walking',   label: 'Walking Accessibility',  icon: <MapPin size={15} />,   endpoint: '/walking' },
    { id: 'driving',   label: 'Driving Distance',       icon: <Car size={15} />,      endpoint: '/driving' },
    { id: 'transport', label: 'Transport Network',      icon: <Bus size={15} />,      endpoint: '/transport' },
    { id: 'context',   label: 'Context & Zoning',       icon: <Map size={15} />,      endpoint: '/context' },
    { id: 'view',      label: '360° View Analysis',     icon: <Eye size={15} />,      endpoint: '/view' },
    { id: 'noise',     label: 'Traffic Noise Model',    icon: <Volume2 size={15} />,  endpoint: '/noise' },
    { id: 'report',    label: 'Full Site Report',       icon: <FileText size={15} />, endpoint: '/report' },
]

// ── Full View Modal ───────────────────────────────────────────
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

// ── Create Site Modal ─────────────────────────────────────────
function CreateSiteModal({ onClose, onConfirm }) {
    const [tab, setTab]                 = useState('lot')
    const [query, setQuery]             = useState('')
    const [results, setResults]         = useState([])
    const [searching, setSearching]     = useState(false)
    const [resultCount, setResultCount] = useState(0)
    const [selectedLot, setSelectedLot] = useState(null)
    const debounceRef                   = useRef(null)

    useEffect(() => {
        const h = (e) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onClose])

    useEffect(() => {
        clearTimeout(debounceRef.current)
        setResults([])
        setResultCount(0)
        if (query.trim().length < 2) return
        debounceRef.current = setTimeout(async () => {
            setSearching(true)
            try {
                const res  = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query.trim())}&limit=100`)
                const data = await res.json()
                const filtered = (data.results || []).filter(r =>
                    tab === 'lot' ? r.source === 'lot_search' : r.source === 'address_search'
                )
                setResults(filtered)
                setResultCount(filtered.length)
            } catch {
                setResults([])
            } finally {
                setSearching(false)
            }
        }, 300)
    }, [query, tab])

    const handleTabSwitch = (t) => { setTab(t); setQuery(''); setResults([]); setResultCount(0) }

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(15,15,15,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 880, boxShadow: '0 32px 100px rgba(0,0,0,0.22)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '88vh', animation: 'modalIn 0.22s ease' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px', borderBottom: '1px solid #F3F4F6' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Create your Site</h2>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 6, borderRadius: 6 }}><X size={16} /></button>
                </div>

                {/* Body */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* LEFT — Search */}
                    <div style={{ flex: 1, padding: '24px 28px', borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: 16 }}>

                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: 0, borderRadius: 9, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                            {[{ id: 'lot', label: 'Lot Search' }, { id: 'address', label: 'Address Search' }].map((t, i) => (
                                <button key={t.id} onClick={() => handleTabSwitch(t.id)} style={{
                                    flex: 1, padding: '10px 0', border: 'none',
                                    borderRight: i === 0 ? '1px solid #E5E7EB' : 'none',
                                    background: tab === t.id ? '#fff' : '#F9FAFB',
                                    color: tab === t.id ? '#6366F1' : '#6B7280',
                                    fontWeight: tab === t.id ? 700 : 500,
                                    fontSize: 14, cursor: 'pointer', transition: 'all 0.12s',
                                }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                            {searching && <Loader size={13} style={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', color: '#6366F1', animation: 'spin 1s linear infinite' }} />}
                            {resultCount > 0 && !searching && (
                                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#9CA3AF', fontWeight: 600, pointerEvents: 'none' }}>
                                    {resultCount} results
                                </span>
                            )}
                            <input
                                autoFocus
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder={tab === 'lot' ? 'e.g. IL 1657, STTL 467, NKIL…' : 'e.g. The Lily, 129 Repulse Bay Road…'}
                                style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 9, padding: '11px 110px 11px 38px', fontSize: 14, color: '#111827', outline: 'none', background: '#FAFAFA', transition: 'all 0.15s' }}
                                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA' }}
                            />
                        </div>

                        {/* Results */}
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {results.length > 0 && (
                                <div style={{ border: '1px solid #F3F4F6', borderRadius: 10, overflow: 'hidden' }}>
                                    <div style={{ padding: '9px 16px', background: '#FAFAFA', borderBottom: '1px solid #F3F4F6' }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>Search Results</span>
                                    </div>
                                    <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                        {results.map((r, i) => {
                                            const isAdded = selectedLot?.ref_id === r.ref_id && selectedLot?.lot_id === r.lot_id
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderBottom: i < results.length - 1 ? '1px solid #F9FAFB' : 'none', background: isAdded ? '#EEF2FF' : '#fff', transition: 'background 0.1s' }}>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
                                                            {r.name || r.lot_id}
                                                            {r.district && <span style={{ fontSize: 12, fontWeight: 400, color: '#6B7280', marginLeft: 6 }}>{r.district}</span>}
                                                        </p>
                                                        {r.ref_id && <p style={{ fontSize: 12, color: '#9CA3AF' }}>Ref ID: {r.ref_id}</p>}
                                                        {r.source === 'address_search' && r.address && <p style={{ fontSize: 12, color: '#9CA3AF' }}>{r.address}</p>}
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedLot(isAdded ? null : r)}
                                                        style={{ marginLeft: 14, padding: '8px 20px', borderRadius: 7, border: 'none', background: isAdded ? '#C7D2FE' : '#6366F1', color: isAdded ? '#4338CA' : '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s', minWidth: 60 }}
                                                    >
                                                        {isAdded ? '✓' : 'Add'}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {query.trim().length >= 2 && !searching && results.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                                    <Search size={28} style={{ margin: '0 auto 12px', opacity: 0.35 }} />
                                    <p style={{ fontSize: 13 }}>No results found for "<strong>{query}</strong>"</p>
                                </div>
                            )}

                            {query.trim().length < 2 && (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <Search size={28} style={{ margin: '0 auto 12px', color: '#E5E7EB' }} />
                                    <p style={{ fontSize: 13, color: '#9CA3AF' }}>
                                        {tab === 'lot' ? 'Search by lot ID — try STTL, IL, NKIL, DD…' : 'Search by building name or street address'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT — Preview */}
                    <div style={{ width: 290, padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 16, background: '#FAFAFA' }}>
                        <div>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>Your Site Preview</h3>
                            <p style={{ fontSize: 12, color: '#9CA3AF' }}>{selectedLot ? '1 lot selected.' : '0 lots selected.'}</p>
                        </div>

                        {/* Preview card */}
                        <div style={{ flex: 1, borderRadius: 12, background: selectedLot ? '#EEF2FF' : '#F3F4F6', border: `1.5px solid ${selectedLot ? '#C7D2FE' : '#E5E7EB'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, padding: 18, transition: 'all 0.2s' }}>
                            {selectedLot ? (
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                                        <div style={{ width: 38, height: 38, borderRadius: 9, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <MapPin size={18} color="#fff" />
                                        </div>
                                        <button onClick={() => setSelectedLot(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A5B4FC', padding: 2 }}><X size={14} /></button>
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 5, wordBreak: 'break-word' }}>{selectedLot.name || selectedLot.lot_id}</p>
                                    {selectedLot.address && <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, wordBreak: 'break-word' }}>{selectedLot.address}</p>}
                                    {selectedLot.district && <p style={{ fontSize: 11, color: '#9CA3AF' }}>{selectedLot.district}</p>}
                                    {selectedLot.ref_id && <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Ref: {selectedLot.ref_id}</p>}
                                    <div style={{ marginTop: 12, display: 'inline-block', padding: '3px 9px', background: '#C7D2FE', borderRadius: 5 }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: '#4338CA', fontFamily: 'monospace' }}>
                                            {selectedLot.source === 'lot_search' ? 'LOT' : 'ADDRESS'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                                    <MapPin size={32} style={{ margin: '0 auto 10px', opacity: 0.25 }} />
                                    <p style={{ fontSize: 12 }}>Select your site to view preview</p>
                                </div>
                            )}
                        </div>

                        {/* Calculate button */}
                        <button
                            onClick={() => selectedLot && onConfirm(selectedLot)}
                            disabled={!selectedLot}
                            style={{ width: '100%', padding: '13px 16px', borderRadius: 9, border: 'none', background: selectedLot ? '#6366F1' : '#E5E7EB', color: selectedLot ? '#fff' : '#9CA3AF', fontSize: 14, fontWeight: 700, cursor: selectedLot ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}
                            onMouseEnter={e => { if (selectedLot) e.currentTarget.style.background = '#4F46E5' }}
                            onMouseLeave={e => { if (selectedLot) e.currentTarget.style.background = '#6366F1' }}
                        >
                            Calculate Development Potential →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────
export default function InteractiveMaps() {
    const [selected, setSelected]       = useState('walking')
    const [status, setStatus]           = useState('idle')
    const [imgUrl, setImgUrl]           = useState(null)
    const [pdfUrl, setPdfUrl]           = useState(null)
    const [errorMsg, setErrorMsg]       = useState('')
    const [duration, setDuration]       = useState(null)
    const [mounted, setMounted]         = useState(false)
    const [fullView, setFullView]       = useState(false)
    const [showModal, setShowModal]     = useState(false)
    const [selectedLot, setSelectedLot] = useState(null)

    useEffect(() => { setMounted(true) }, [])

    const selectedType = analysisTypes.find(t => t.id === selected)

    const handleConfirmSite = (lot) => {
        setSelectedLot(lot)
        setShowModal(false)
        setStatus('idle'); setImgUrl(null); setPdfUrl(null); setErrorMsg(''); setDuration(null)
    }

    const handleSelect = (id) => {
        setSelected(id)
        setStatus('idle'); setImgUrl(null); setPdfUrl(null); setErrorMsg(''); setDuration(null); setFullView(false)
    }

    const handleGenerate = async () => {
        if (!selectedLot) { setErrorMsg('Please select a site first.'); setStatus('error'); return }
        setStatus('loading'); setImgUrl(null); setPdfUrl(null); setErrorMsg(''); setDuration(null); setFullView(false)
        const t0 = Date.now()
        try {
            const body = {
                data_type: selectedLot.data_type,
                value:     selectedLot.lot_id,
                ...(selectedLot.lon != null && { lon: selectedLot.lon }),
                ...(selectedLot.lat != null && { lat: selectedLot.lat }),
            }
            const res  = await fetch(`${API_BASE}${selectedType.endpoint}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            setDuration(((Date.now() - t0) / 1000).toFixed(2))
            if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`)
            const ct   = res.headers.get('content-type') || ''
            const blob = await res.blob()
            const url  = URL.createObjectURL(blob)
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
        a.download = pdfUrl ? `report_${selectedLot?.lot_id}.pdf` : `${selected}_${selectedLot?.lot_id}.png`
        a.click()
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Inter', system-ui, sans-serif", color: '#111827', opacity: mounted ? 1 : 0, transition: 'opacity 0.3s' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes fadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
                .analysis-btn:hover { background: #F9FAFB !important; }
            `}</style>

            {fullView && imgUrl && <FullViewModal imgUrl={imgUrl} onClose={() => setFullView(false)} />}
            {showModal && <CreateSiteModal onClose={() => setShowModal(false)} onConfirm={handleConfirmSite} />}

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 64px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 12 }}>Spatial Analysis Module</p>
                <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#111827', marginBottom: 10, lineHeight: 1.15 }}>Geospatial Infrastructure Analytics Engine</h1>
                <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 36, lineHeight: 1.6 }}>Advanced geospatial computation framework integrating mobility networks, environmental simulation, zoning intelligence, and multi-criteria spatial modeling.</p>

                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

                    {/* LEFT */}
                    <div style={{ width: 380, flexShrink: 0, border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Analysis Controls</p>
                        </div>
                        <div style={{ padding: '20px' }}>

                            {/* Site */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Selected Site</label>
                                {selectedLot ? (
                                    <>
                                        <div style={{ border: '1.5px solid #C7D2FE', borderRadius: 9, padding: '12px 14px', background: '#EEF2FF', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: '#4338CA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedLot.name || selectedLot.lot_id}</p>
                                                <p style={{ fontSize: 11, color: '#6366F1', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedLot.address || selectedLot.district}</p>
                                            </div>
                                            <button onClick={() => { setSelectedLot(null); setStatus('idle'); setImgUrl(null); setPdfUrl(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366F1', flexShrink: 0, padding: 2 }}><X size={14} /></button>
                                        </div>
                                        <button onClick={() => setShowModal(true)} style={{ marginTop: 8, width: '100%', padding: '8px', borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Change Site</button>
                                    </>
                                ) : (
                                    <button onClick={() => setShowModal(true)} style={{ width: '100%', padding: '12px 16px', borderRadius: 9, border: '1.5px dashed #6366F1', background: '#EEF2FF', color: '#6366F1', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}>
                                        <Plus size={16} /> Create your Site
                                    </button>
                                )}
                            </div>

                            {/* Analysis type */}
                            <div style={{ marginBottom: 28 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Analysis Type</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    {analysisTypes.map(t => {
                                        const isActive = selected === t.id
                                        return (
                                            <button key={t.id} className="analysis-btn" onClick={() => handleSelect(t.id)}
                                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 8, border: 'none', background: isActive ? '#EEF2FF' : 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'background 0.12s' }}>
                                                <div style={{ width: 28, height: 28, borderRadius: 7, background: isActive ? '#E0E7FF' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#6366F1' : '#9CA3AF', flexShrink: 0 }}>{t.icon}</div>
                                                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: isActive ? '#4338CA' : '#374151' }}>{t.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Generate */}
                            <button onClick={handleGenerate} disabled={status === 'loading' || !selectedLot}
                                style={{ width: '100%', padding: '12px 20px', borderRadius: 8, border: 'none', background: !selectedLot ? '#E5E7EB' : status === 'loading' ? '#C7D2FE' : '#6366F1', color: !selectedLot ? '#9CA3AF' : 'white', fontSize: 14, fontWeight: 600, cursor: (!selectedLot || status === 'loading') ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
                                onMouseEnter={e => { if (selectedLot && status !== 'loading') e.currentTarget.style.background = '#4F46E5' }}
                                onMouseLeave={e => { if (selectedLot && status !== 'loading') e.currentTarget.style.background = '#6366F1' }}>
                                {status === 'loading' ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</> : 'Generate Analysis'}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden', minHeight: 520 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Result Display</p>
                            {status === 'done' && duration && <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{duration}s</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 460, padding: 32 }}>

                            {status === 'idle' && (
                                <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#D1D5DB' }}><BarChart2 size={24} /></div>
                                    <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Spatial Engine Idle</p>
                                    <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, marginBottom: 20 }}>
                                        {selectedLot ? `Ready: ${selectedLot.name || selectedLot.lot_id}. Choose analysis type and click Generate.` : 'Click "Create your Site" to search for a lot or address.'}
                                    </p>
                                    {!selectedLot && (
                                        <button onClick={() => setShowModal(true)} style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                            <Plus size={14} /> Create your Site
                                        </button>
                                    )}
                                </div>
                            )}

                            {status === 'loading' && (
                                <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ position: 'relative', width: 48, height: 48, margin: '0 auto 20px' }}>
                                        <div style={{ position: 'absolute', inset: 0, border: '3px solid #E0E7FF', borderRadius: '50%' }} />
                                        <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTop: '3px solid #6366F1', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Processing Analysis</p>
                                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>Running {selectedType?.label} for {selectedLot?.name || selectedLot?.lot_id}…</p>
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
                                    <div style={{ flex: 1, borderRadius: 8, overflow: 'hidden', border: '1px solid #F3F4F6', minHeight: 380 }}>
                                        <img src={imgUrl} alt="result" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#FAFAFA' }} />
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
                                        <div style={{ width: 72, height: 72, borderRadius: 16, background: '#EEF2FF', border: '1px solid #C7D2FE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}><FileText size={30} /></div>
                                        <div style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 800 }}>✓</div>
                                    </div>
                                    <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Report Ready</p>
                                    <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 24 }}>Report for <strong style={{ color: '#6366F1', fontFamily: 'monospace' }}>{selectedLot?.name || selectedLot?.lot_id}</strong> is ready.</p>
                                    <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 8, background: '#6366F1', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', margin: '0 auto' }}><Download size={15} /> Download PDF Report</button>
                                </div>
                            )}
                        </div>
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
