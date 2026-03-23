import DXFViewer from '../components/DXFViewer'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
    MapPin, Layers, Eye, Volume2, Download, X, Plus,
    Trash2, Search, Loader, Upload, Activity,
    Box, Cpu, BarChart2, Sliders, ChevronDown, ChevronUp,
    FileDown, Check, AlertCircle, Zap, Map
} from 'lucide-react'

const MLP_API  = 'https://alkf-master-land-plan-api.onrender.com'
const SITE_API = 'https://automated-site-analysis-api.onrender.com'

const VIEW_COLORS = {
    SEA: '#06B6D4', HARBOR: '#0891B2', RESERVOIR: '#0284C7',
    MOUNTAIN: '#78716C', PARK: '#16A34A', GREEN: '#22C55E', CITY: '#EF4444',
}

function merc2ll(x, y) {
    const lng = (x / 20037508.34) * 180
    let lat = (y / 20037508.34) * 180
    lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2)
    return [lat, lng]
}

function noiseColor(db, thr = 65) {
    if (db >= thr)      return '#EF4444'
    if (db >= thr - 5)  return '#F97316'
    if (db >= thr - 15) return '#EAB308'
    return '#22C55E'
}

// ── Lease Plan Preview Modal ──────────────────────────────────
function LeasePlanPreviewModal({ leasePlan, onClose }) {
    const [blobUrl, setBlobUrl] = useState(null)
    const [loading, setLoading] = useState(true)

    const isPdf = leasePlan.mimeType === 'application/pdf'

    // Convert base64 → Blob URL on mount
    // Chrome blocks data: URLs in iframes; Blob URLs work everywhere
    useEffect(() => {
        try {
            const byteChars = atob(leasePlan.b64)
            const bytes = new Uint8Array(byteChars.length)
            for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i)
            const blob = new Blob([bytes], { type: leasePlan.mimeType })
            const url  = URL.createObjectURL(blob)
            setBlobUrl(url)
        } catch (e) {
            // Fallback: use original dataUrl for images
            setBlobUrl(leasePlan.dataUrl)
        }
        return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
    }, [leasePlan.b64])

    useEffect(() => {
        const h = e => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onClose])

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 600,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: 24,
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#fff', borderRadius: 16,
                    overflow: 'hidden',
                    width: isPdf ? 'min(92vw, 960px)' : 'auto',
                    maxWidth: '92vw', maxHeight: '92vh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.45)',
                    animation: 'modalIn 0.2s ease',
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px', borderBottom: '1px solid #F3F4F6',
                    background: '#FAFAFA', flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 9,
                            background: '#F0FDF4', border: '1px solid #BBF7D0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Check size={16} color="#16A34A" />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 1 }}>
                                {leasePlan.name}
                            </p>
                            <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                                {isPdf ? 'PDF document' : 'Image file'} · uploaded lease plan
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#F3F4F6', border: 'none', cursor: 'pointer',
                            color: '#6B7280', padding: 8, borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1, overflow: 'auto', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: isPdf ? 0 : 16, minHeight: 300,
                }}>
                    {/* Loading spinner shown until blobUrl is ready */}
                    {(!blobUrl || loading) && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                            <div style={{ position: 'relative', width: 40, height: 40 }}>
                                <div style={{ position: 'absolute', inset: 0, border: '3px solid #E0E7FF', borderRadius: '50%' }} />
                                <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTop: '3px solid #6366F1', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                            </div>
                            <p style={{ fontSize: 12, color: '#9CA3AF' }}>Loading preview…</p>
                        </div>
                    )}
                    {blobUrl && isPdf && (
                        <div style={{
                            display: loading ? 'none' : 'block',
                            width: '100%',
                            height: 'min(78vh, 960px)',
                            borderRadius: 8,
                            overflow: 'hidden',
                            background: '#fff',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                        }}>
                            <iframe
                                src={blobUrl + '#toolbar=0&navpanes=0&scrollbar=1&view=FitH&pagemode=none'}
                                title="Lease plan"
                                onLoad={() => setLoading(false)}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                    display: 'block',
                                    background: '#fff',
                                    colorScheme: 'light',
                                }}
                            />
                        </div>
                    )}
                    {blobUrl && !isPdf && (
                        <img
                            src={blobUrl}
                            alt="Lease plan"
                            onLoad={() => setLoading(false)}
                            style={{
                                display: loading ? 'none' : 'block',
                                maxWidth: '100%',
                                maxHeight: 'min(78vh, 960px)',
                                borderRadius: 8,
                                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                                objectFit: 'contain',
                            }}
                        />
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '10px 20px', borderTop: '1px solid #F3F4F6',
                    background: '#FAFAFA', display: 'flex',
                    justifyContent: 'flex-end', flexShrink: 0,
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 24px', borderRadius: 8, border: 'none',
                            background: '#6366F1', color: '#fff',
                            fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── Leaflet Map Preview ───────────────────────────────────────
function LeafletMapPreview({ lots }) {
    const mapRef    = useRef(null)
    const mapObjRef = useRef(null)
    const layerRef  = useRef(null)
    const markerRef = useRef(null)
    const lotsRef   = useRef(lots)
    lotsRef.current = lots

    useEffect(() => {
        let destroyed = false
        const drawForLots = async (lots_) => {
            if (destroyed || !mapObjRef.current || !window.L) return
            const L = window.L
            if (layerRef.current)  { layerRef.current.remove();  layerRef.current  = null }
            if (markerRef.current) { markerRef.current.remove(); markerRef.current = null }
            const firstLot = lots_[0]
            if (!firstLot?.lat || !firstLot?.lon) return
            markerRef.current = L.circleMarker([firstLot.lat, firstLot.lon], {
                radius: 10, color: '#4F46E5', weight: 2.5, fillColor: '#6366F1', fillOpacity: 0.45,
            }).addTo(mapObjRef.current)
            mapObjRef.current.setView([firstLot.lat, firstLot.lon], 18)
            try {
                const extents = lots_.filter(l => l.extent).map(l => l.extent)
                let url = `${SITE_API}/lot-boundary?lon=${firstLot.lon}&lat=${firstLot.lat}&data_type=${firstLot.data_type || 'LOT'}`
                if (extents.length > 1) url += `&extents=${encodeURIComponent(JSON.stringify(extents))}`
                const res = await fetch(url)
                if (!res.ok) throw new Error()
                const geoj = await res.json()
                if (destroyed || !mapObjRef.current) return
                if (markerRef.current) { markerRef.current.remove(); markerRef.current = null }
                layerRef.current = L.geoJSON(geoj, {
                    style: { color: '#4F46E5', weight: 2.5, fillColor: '#6366F1', fillOpacity: 0.25 }
                }).addTo(mapObjRef.current)
                const bounds = layerRef.current.getBounds()
                if (bounds.isValid()) mapObjRef.current.fitBounds(bounds, { padding: [50, 50] })
            } catch (e) {}
        }
        const initMap = () => {
            if (destroyed || !mapRef.current || mapObjRef.current) return
            const L = window.L
            mapObjRef.current = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true })
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO', maxZoom: 21
            }).addTo(mapObjRef.current)
            mapObjRef.current.setView([22.32, 114.17], 14)
            if (lotsRef.current?.length) drawForLots(lotsRef.current)
        }
        if (!document.getElementById('leaflet-css-mlp')) {
            const l = document.createElement('link'); l.id = 'leaflet-css-mlp'; l.rel = 'stylesheet'
            l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(l)
        }
        if (window.L) { initMap() }
        else {
            if (!document.getElementById('leaflet-js-mlp')) {
                const s = document.createElement('script'); s.id = 'leaflet-js-mlp'
                s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; document.head.appendChild(s)
            }
            const id = setInterval(() => { if (window.L) { clearInterval(id); initMap() } }, 80)
            return () => { clearInterval(id); destroyed = true; if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null } }
        }
        return () => { destroyed = true; if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null } }
    }, [])

    useEffect(() => {
        if (!mapObjRef.current || !window.L || !lots?.length) return
        const L = window.L
        if (layerRef.current)  { layerRef.current.remove();  layerRef.current  = null }
        if (markerRef.current) { markerRef.current.remove(); markerRef.current = null }
        const firstLot = lots[0]
        if (!firstLot?.lat || !firstLot?.lon) return
        markerRef.current = L.circleMarker([firstLot.lat, firstLot.lon], {
            radius: 10, color: '#4F46E5', weight: 2.5, fillColor: '#6366F1', fillOpacity: 0.45,
        }).addTo(mapObjRef.current)
        mapObjRef.current.setView([firstLot.lat, firstLot.lon], 18)
        ;(async () => {
            try {
                const extents = lots.filter(l => l.extent).map(l => l.extent)
                let url = `${SITE_API}/lot-boundary?lon=${firstLot.lon}&lat=${firstLot.lat}&data_type=${firstLot.data_type || 'LOT'}`
                if (extents.length > 1) url += `&extents=${encodeURIComponent(JSON.stringify(extents))}`
                const res = await fetch(url); if (!res.ok) throw new Error()
                const geoj = await res.json(); if (!mapObjRef.current) return
                if (markerRef.current) { markerRef.current.remove(); markerRef.current = null }
                layerRef.current = L.geoJSON(geoj, { style: { color: '#4F46E5', weight: 2.5, fillColor: '#6366F1', fillOpacity: 0.25 } }).addTo(mapObjRef.current)
                const bounds = layerRef.current.getBounds()
                if (bounds.isValid()) mapObjRef.current.fitBounds(bounds, { padding: [50, 50] })
            } catch (e) {}
        })()
    }, [lots])

    return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden', background: '#F3F4F6' }} />
}

// ── Create Site Modal ─────────────────────────────────────────
function CreateSiteModal({ onClose, onConfirm }) {
    const [tab, setTab]             = useState('lot')
    const [query, setQuery]         = useState('')
    const [results, setResults]     = useState([])
    const [searching, setSearching] = useState(false)
    const [resultCount, setResultCount] = useState(0)
    const [selectedLots, setSelectedLots] = useState([])
    const [mapReady, setMapReady]   = useState(false)
    const [proximityWarning, setProximityWarning] = useState('')
    const debRef = useRef(null)
    const lotsWithCoords = selectedLots.filter(l => l.lon != null && l.lat != null)

    useEffect(() => {
        const h = (e) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h)
    }, [onClose])

    useEffect(() => { const t = setTimeout(() => setMapReady(true), 80); return () => clearTimeout(t) }, [])

    useEffect(() => {
        clearTimeout(debRef.current); setResults([]); setResultCount(0)
        if (query.trim().length < 2) return
        debRef.current = setTimeout(async () => {
            setSearching(true)
            try {
                const res  = await fetch(`${SITE_API}/search?q=${encodeURIComponent(query.trim())}&limit=100`)
                const data = await res.json()
                const filtered = (data.results || []).filter(r => tab === 'lot' ? r.source === 'lot_search' : r.source === 'address_search')
                setResults(filtered); setResultCount(filtered.length)
            } catch { setResults([]) }
            finally { setSearching(false) }
        }, 300)
    }, [query, tab])

    const isAdded = (r) => selectedLots.some(l => l.lot_id === r.lot_id && l.ref_id === r.ref_id)

    const haversineM = (lat1, lon1, lat2, lon2) => {
        const R = 6371000, dLat = (lat2-lat1)*Math.PI/180, dLon = (lon2-lon1)*Math.PI/180
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    }

    const toggleLot = (r) => {
        setProximityWarning('')
        if (isAdded(r)) { setSelectedLots(p => p.filter(l => !(l.lot_id===r.lot_id && l.ref_id===r.ref_id))); return }
        if (selectedLots.length === 0) { setSelectedLots(p => [...p, r]); return }
        if (!r.lat || !r.lon) { setSelectedLots(p => [...p, r]); return }
        const minDist = Math.min(...selectedLots.filter(l => l.lat && l.lon).map(l => haversineM(r.lat, r.lon, l.lat, l.lon)))
        if (minDist > 150) { setProximityWarning(`${r.lot_id} is ${Math.round(minDist)}m away — max merge radius is 150m`); return }
        setSelectedLots(p => [...p, r])
    }

    const handleConfirm = () => {
        if (!selectedLots.length) return
        const primary = selectedLots[0], isMulti = selectedLots.length > 1
        onConfirm({
            name:      isMulti ? `${selectedLots.length} lots selected` : (primary.name || primary.lot_id),
            lot_id:    isMulti ? selectedLots.map(l => l.lot_id).join(', ') : primary.lot_id,
            address:   isMulti ? selectedLots.map(l => l.district || l.lot_id).join(' / ') : primary.address,
            district:  primary.district, data_type: primary.data_type, source: primary.source,
            lon: primary.lon, lat: primary.lat,
            lot_ids: isMulti ? selectedLots.map(l => l.lot_id) : [primary.lot_id],
            extents:  selectedLots.map(l => l.extent).filter(Boolean),
        })
    }

    return (
        <div onClick={e => e.target === e.currentTarget && onClose()}
            style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(15,15,15,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 980, boxShadow: '0 32px 100px rgba(0,0,0,0.22)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', animation: 'modalIn 0.22s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', borderBottom: '1px solid #F3F4F6' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Select Site</h2>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', cursor: 'pointer', color: '#6B7280', display: 'flex', padding: 6, borderRadius: 6 }}><X size={16} /></button>
                </div>
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
                    <div style={{ width: 340, flexShrink: 0, padding: '20px 22px', borderRight: '1px solid #F3F4F6', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
                        <div style={{ display: 'flex', borderRadius: 9, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                            {[{ id: 'lot', label: 'Lot Search' }, { id: 'address', label: 'Address Search' }].map((t, i) => (
                                <button key={t.id} onClick={() => { setTab(t.id); setQuery(''); setResults([]); setResultCount(0) }}
                                    style={{ flex: 1, padding: '9px 0', border: 'none', borderRight: i === 0 ? '1px solid #E5E7EB' : 'none', background: tab === t.id ? '#fff' : '#F9FAFB', color: tab === t.id ? '#6366F1' : '#6B7280', fontWeight: tab === t.id ? 700 : 500, fontSize: 13, cursor: 'pointer' }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                            {searching && <Loader size={12} style={{ position: 'absolute', right: 44, top: '50%', transform: 'translateY(-50%)', color: '#6366F1', animation: 'spin 1s linear infinite' }} />}
                            {resultCount > 0 && !searching && <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{resultCount}</span>}
                            <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
                                placeholder={tab === 'lot' ? 'IL 1657, STTL 467, NKIL…' : 'Building name or address…'}
                                style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 8, padding: '10px 38px 10px 32px', fontSize: 13, color: '#111827', outline: 'none', background: '#FAFAFA', boxSizing: 'border-box' }}
                                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
                                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.background = '#FAFAFA' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            {results.length > 0 && (
                                <div style={{ border: '1px solid #F3F4F6', borderRadius: 9, overflow: 'hidden' }}>
                                    <div style={{ padding: '7px 13px', background: '#FAFAFA', borderBottom: '1px solid #F3F4F6' }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Search Results</span>
                                    </div>
                                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                                        {results.map((r, i) => {
                                            const added = isAdded(r)
                                            return (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 13px', borderBottom: i < results.length - 1 ? '1px solid #F9FAFB' : 'none', background: added ? '#EEF2FF' : '#fff' }}>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 1 }}>
                                                            {r.name || r.lot_id}
                                                            {r.district && <span style={{ fontSize: 11, fontWeight: 400, color: '#6B7280', marginLeft: 5 }}>{r.district}</span>}
                                                        </p>
                                                        {r.ref_id && <p style={{ fontSize: 11, color: '#9CA3AF' }}>Ref ID: {r.ref_id}</p>}
                                                    </div>
                                                    <button onClick={() => toggleLot(r)}
                                                        style={{ marginLeft: 10, padding: '6px 14px', borderRadius: 6, border: 'none', background: added ? '#C7D2FE' : '#6366F1', color: added ? '#4338CA' : '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0, minWidth: 52 }}>
                                                        {added ? '✓' : <><Plus size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />Add</>}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            {query.trim().length < 2 && (
                                <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                                    <Search size={24} style={{ margin: '0 auto 10px', color: '#E5E7EB' }} />
                                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>Search by lot ID or address</p>
                                </div>
                            )}
                        </div>
                        {proximityWarning && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 8, padding: '10px 12px' }}>
                                <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                                <p style={{ fontSize: 11, color: '#EA580C', lineHeight: 1.5, flex: 1 }}>{proximityWarning}</p>
                                <button onClick={() => setProximityWarning('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FB923C', flexShrink: 0 }}><X size={12} /></button>
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #F3F4F6' }}>
                        <div style={{ padding: '14px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Site Preview</span>
                            {lotsWithCoords.length > 0 && <span style={{ fontSize: 11, color: '#6366F1', fontWeight: 600 }}>{lotsWithCoords.length} lot{lotsWithCoords.length > 1 ? 's' : ''} mapped</span>}
                        </div>
                        <div style={{ flex: 1, padding: 14, background: '#F9FAFB', minHeight: 0 }}>
                            {mapReady && lotsWithCoords.length > 0 ? (
                                <LeafletMapPreview lots={lotsWithCoords} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', minHeight: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', borderRadius: 10, border: '1.5px dashed #E5E7EB', color: '#9CA3AF', gap: 10 }}>
                                    <Map size={28} style={{ opacity: 0.3 }} />
                                    <p style={{ fontSize: 12 }}>Map preview will appear here once you add a lot</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ width: 260, flexShrink: 0, padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 14, background: '#FAFAFA' }}>
                        <div>
                            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2 }}>Your Site Preview</h3>
                            <p style={{ fontSize: 11, color: '#9CA3AF' }}>{selectedLots.length === 0 ? '0 lots selected.' : `${selectedLots.length} lot${selectedLots.length > 1 ? 's' : ''} selected.`}</p>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {selectedLots.length === 0 ? (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6', borderRadius: 10, border: '1.5px dashed #E5E7EB', padding: 24, minHeight: 160, textAlign: 'center', color: '#9CA3AF' }}>
                                    <MapPin size={28} style={{ opacity: 0.25, marginBottom: 8 }} />
                                    <p style={{ fontSize: 11 }}>Add lots from search</p>
                                </div>
                            ) : selectedLots.map((lot, i) => (
                                <div key={i} style={{ background: '#EEF2FF', border: '1.5px solid #C7D2FE', borderRadius: 9, padding: '10px 12px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 12, fontWeight: 700, color: '#3730A3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lot.name || lot.lot_id}</p>
                                        {lot.address && <p style={{ fontSize: 10, color: '#6366F1', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lot.address}</p>}
                                        {lot.district && <p style={{ fontSize: 10, color: '#818CF8', marginTop: 1 }}>{lot.district}</p>}
                                        {lot.ref_id && <p style={{ fontSize: 10, color: '#A5B4FC', marginTop: 1 }}>Ref: {lot.ref_id}</p>}
                                        <span style={{ display: 'inline-block', marginTop: 5, padding: '2px 7px', background: '#C7D2FE', borderRadius: 4, fontSize: 9, fontWeight: 700, color: '#4338CA', fontFamily: 'monospace' }}>
                                            {lot.source === 'lot_search' ? 'LOT' : 'ADDRESS'}
                                        </span>
                                    </div>
                                    <button onClick={() => setSelectedLots(p => p.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A5B4FC', padding: 2, flexShrink: 0 }}><Trash2 size={12} /></button>
                                </div>
                            ))}
                        </div>
                        {selectedLots.length > 1 && (
                            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '8px 12px' }}>
                                <p style={{ fontSize: 11, color: '#92400E', lineHeight: 1.5 }}><strong>Multi-lot mode:</strong> Lots will be merged into a single site polygon.</p>
                            </div>
                        )}
                        {selectedLots.length > 0 && (
                            <button onClick={() => setSelectedLots([])} style={{ width: '100%', padding: '7px', borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 12, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                <Trash2 size={11} /> Clear all
                            </button>
                        )}
                        <button onClick={handleConfirm} disabled={selectedLots.length === 0}
                            style={{ width: '100%', padding: '12px 16px', borderRadius: 9, border: 'none', background: selectedLots.length > 0 ? '#6366F1' : '#E5E7EB', color: selectedLots.length > 0 ? '#fff' : '#9CA3AF', fontSize: 13, fontWeight: 700, cursor: selectedLots.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            onMouseEnter={e => { if (selectedLots.length > 0) e.currentTarget.style.background = '#4F46E5' }}
                            onMouseLeave={e => { if (selectedLots.length > 0) e.currentTarget.style.background = '#6366F1' }}>
                            Run Boundary Analysis →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatGrid({ result, threshold }) {
    if (!result) return null
    const n = result.boundary.x.length
    const noisy = result.is_noisy.filter(Boolean).length
    const noiseVals = result.noise_db
    const mean = noiseVals.reduce((a, b) => a + b, 0) / noiseVals.length
    const counts = {}
    result.view_type.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
    const topView = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    const cards = [
        { label: 'Boundary Points', value: n.toLocaleString(), sub: '1m sampling interval' },
        { label: 'Noise Range', value: `${Math.min(...noiseVals).toFixed(1)}–${Math.max(...noiseVals).toFixed(1)}`, sub: `avg ${mean.toFixed(1)} dBA` },
        { label: 'Noisy Points', value: `${noisy} / ${n}`, sub: `${(noisy / n * 100).toFixed(0)}% above ${threshold} dB`, alert: noisy > 0 },
        { label: 'Dominant View', value: topView?.[0] || '—', sub: `${topView ? ((topView[1]/n)*100).toFixed(0) : 0}% of boundary` },
    ]
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden', background: '#E5E7EB' }}>
            {cards.map((c, i) => (
                <div key={i} style={{ background: '#fff', padding: '14px 18px' }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: c.alert ? '#DC2626' : '#111827', lineHeight: 1.1, fontVariantNumeric: 'tabular-nums' }}>{c.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginTop: 5 }}>{c.label}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{c.sub}</div>
                </div>
            ))}
        </div>
    )
}

function ViewBreakdown({ viewTypes }) {
    if (!viewTypes?.length) return null
    const counts = {}
    viewTypes.forEach(v => { counts[v] = (counts[v] || 0) + 1 })
    const total = viewTypes.length
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([type, count], i, arr) => {
                const pct = (count / total * 100).toFixed(1)
                return (
                    <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>{type}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 80, height: 3, background: '#F3F4F6', borderRadius: 2, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: '#374151', borderRadius: 2 }} />
                            </div>
                            <span style={{ fontSize: 11, color: '#6B7280', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function NoiseHistogram({ noiseDb, threshold }) {
    if (!noiseDb?.length) return null
    const min = Math.min(...noiseDb), max = Math.max(...noiseDb)
    const bins = 12, binW = ((max - min) || 1) / bins
    const bkts = Array(bins).fill(0)
    noiseDb.forEach(v => { const i = Math.min(Math.floor((v - min) / binW), bins - 1); bkts[i]++ })
    const maxB = Math.max(...bkts)
    const thrX = ((threshold - min) / (max - min || 1) * 100).toFixed(1)
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 48, position: 'relative' }}>
                {bkts.map((b, i) => {
                    const aboveThr = (min + (i+0.5)*binW) >= threshold
                    return <div key={i} style={{ flex: 1, background: aboveThr ? '#DC2626' : '#CBD5E1', borderRadius: '2px 2px 0 0', height: `${maxB ? (b/maxB*100) : 0}%`, minHeight: b > 0 ? 2 : 0 }} />
                })}
                {threshold >= min && threshold <= max && (
                    <div style={{ position: 'absolute', left: `${thrX}%`, top: 0, bottom: 0, width: 1, background: '#94A3B8', pointerEvents: 'none' }}>
                        <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: '#64748B', fontWeight: 700, whiteSpace: 'nowrap' }}>{threshold} dB</div>
                    </div>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, borderTop: '1px solid #F3F4F6', paddingTop: 4 }}>
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>{min.toFixed(1)}</span>
                <span style={{ fontSize: 10, color: '#9CA3AF' }}>{max.toFixed(1)} dBA</span>
            </div>
        </div>
    )
}

function NonBuildingPanel({ zones }) {
    if (!zones || !Object.keys(zones).length) return null
    return (
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '9px 14px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Non-Building Zones</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {Object.entries(zones).map(([key, zone], i, arr) => (
                    <div key={key} style={{ padding: '11px 14px', borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{zone.use || key}</p>
                        {zone.reference_clause && <p style={{ fontSize: 11, color: '#6B7280' }}>{zone.reference_clause}</p>}
                        <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>{(zone.coordinates?.x?.length || 0)} vertices · EPSG:3857</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function BoundaryMap({ result, viewMode, threshold }) {
    const mapRef = useRef(null), mapObjRef = useRef(null), layerRef = useRef(null), boundRef = useRef(null)
    const drawLayers = useCallback((map, L, res, mode, thr) => {
        if (layerRef.current) { layerRef.current.remove(); layerRef.current = null }
        if (boundRef.current) { boundRef.current.remove(); boundRef.current = null }
        if (!res?.boundary?.x?.length) return
        const xs = res.boundary.x, ys = res.boundary.y, n = xs.length
        const latlngs = xs.map((x, i) => merc2ll(x, ys[i]))
        boundRef.current = L.polyline(latlngs, { color: '#6366F1', weight: 1.5, opacity: 0.5, dashArray: '5 4' }).addTo(map)
        const grp = L.layerGroup().addTo(map); layerRef.current = grp
        for (let i = 0; i < n; i++) {
            const [lat, lng] = merc2ll(xs[i], ys[i])
            const color = mode === 'view' ? (VIEW_COLORS[res.view_type[i]] || '#94A3B8') : noiseColor(res.noise_db[i], thr)
            L.circleMarker([lat, lng], { radius: 4, color, fillColor: color, fillOpacity: 0.9, weight: 0 })
                .bindTooltip(mode === 'view' ? res.view_type[i] : `${res.noise_db[i]?.toFixed(1)} dB`, { permanent: false, direction: 'top', offset: [0,-4] }).addTo(grp)
        }
        if (res.non_building_areas) Object.entries(res.non_building_areas).forEach(([key, zone]) => {
            const zx = zone.coordinates?.x || [], zy = zone.coordinates?.y || []
            if (zx.length < 3) return
            L.polygon(zx.map((x, i) => merc2ll(x, zy[i])), { color: '#8B5CF6', fillColor: '#8B5CF6', fillOpacity: 0.18, weight: 2 }).bindTooltip(zone.use || key).addTo(grp)
        })
        const bounds = boundRef.current.getBounds()
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [32, 32] })
    }, [])
    useEffect(() => {
        let destroyed = false
        const init = () => {
            if (destroyed || !mapRef.current || mapObjRef.current) return
            const L = window.L
            mapObjRef.current = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true })
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { attribution: '© OpenStreetMap © CARTO', maxZoom: 21 }).addTo(mapObjRef.current)
            mapObjRef.current.setView([22.32, 114.17], 14)
        }
        if (!document.getElementById('leaflet-css-mlp')) { const l = document.createElement('link'); l.id = 'leaflet-css-mlp'; l.rel = 'stylesheet'; l.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(l) }
        if (window.L) { init() }
        else {
            if (!document.getElementById('leaflet-js-mlp')) { const s = document.createElement('script'); s.id = 'leaflet-js-mlp'; s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; document.head.appendChild(s) }
            const id = setInterval(() => { if (window.L) { clearInterval(id); init() } }, 80)
            return () => { clearInterval(id); destroyed = true; if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null } }
        }
        return () => { destroyed = true; if (mapObjRef.current) { mapObjRef.current.remove(); mapObjRef.current = null } }
    }, [])
    useEffect(() => { if (!mapObjRef.current || !window.L || !result) return; drawLayers(mapObjRef.current, window.L, result, viewMode, threshold) }, [result, viewMode, threshold, drawLayers])
    return <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 10, overflow: 'hidden', background: '#F8FAFC' }} />
}

function MapLegend({ mode, threshold }) {
    if (mode === 'view') return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 10px' }}>
            {Object.keys(VIEW_COLORS).map(k => (
                <span key={k} style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'monospace', letterSpacing: '0.02em' }}>{k}</span>
            ))}
        </div>
    )
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 12px' }}>
            {[`< ${threshold-15} dB`, `${threshold-15}–${threshold-5} dB`, `${threshold-5}–${threshold} dB`, `≥ ${threshold} dB`].map((label, i) => (
                <span key={label} style={{ fontSize: 10, color: i === 3 ? '#DC2626' : '#94A3B8' }}>{label}</span>
            ))}
        </div>
    )
}

function RawJsonPanel({ result }) {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    if (!result) return null
    const preview = { site_id: result.site_id, crs: result.crs, boundary_points: result.boundary.x.length, view_type_sample: result.view_type.slice(0, 5), noise_db_sample: result.noise_db.slice(0, 5).map(v => +v.toFixed(2)), is_noisy_sample: result.is_noisy.slice(0, 5), non_building_areas: result.non_building_areas ? Object.keys(result.non_building_areas) : null }
    const jsonStr = JSON.stringify(preview, null, 2) + '\n  … full arrays truncated for display'
    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(result, null, 2)).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    }
    return (
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '9px 14px', background: '#F8FAFC', borderBottom: open ? '1px solid #E5E7EB' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => setOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, fontFamily: 'inherit', flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Raw JSON Response</span>
                    <span style={{ color: '#9CA3AF', marginLeft: 4 }}>{open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>
                </button>
                <button onClick={handleCopy} style={{ padding: '4px 10px', borderRadius: 5, border: '1px solid #E5E7EB', background: copied ? '#F0FDF4' : '#fff', color: copied ? '#16A34A' : '#6B7280', fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    {copied ? <Check size={11} /> : null}
                    {copied ? 'Copied' : 'Copy JSON'}
                </button>
            </div>
            {open && (
                <div style={{ maxHeight: 280, overflowY: 'auto', overflowX: 'auto', background: '#FAFAFA' }}>
                    <pre style={{ margin: 0, padding: '14px 16px', fontSize: 11, color: '#374151', fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace", lineHeight: 1.7, whiteSpace: 'pre', minWidth: 'max-content' }}>
                        {jsonStr}
                    </pre>
                </div>
            )}
        </div>
    )
}

// ── Main page ─────────────────────────────────────────────────
export default function MasterLandPlan() {
    const [showModal, setShowModal]               = useState(false)
    const [site, setSite]                         = useState(null)
    const [threshold, setThreshold]               = useState(65)
    const [outputMode, setOutputMode]             = useState('analysis')
    const [viewMode, setViewMode]                 = useState('view')
    const [leasePlan, setLeasePlan]               = useState(null)
    const [nbJson, setNbJson]                     = useState('')
    const [nbJsonError, setNbJsonError]           = useState('')
    const [showNbEditor, setShowNbEditor]         = useState(false)
    const [loading, setLoading]                   = useState(false)
    const [progress, setProgress]                 = useState('')
    const [result, setResult]                     = useState(null)
    const [error, setError]                       = useState('')
    const [dxfReady, setDxfReady]                 = useState(false)
    const [dxfBlob, setDxfBlob]                   = useState(null)
    const [dxfText, setDxfText]                   = useState(null)
    const [showViewer, setShowViewer]             = useState(false)
    const [showLeasePreview, setShowLeasePreview] = useState(false)  // ← NEW
    const [mounted, setMounted]                   = useState(false)
    const fileRef = useRef(null)

    useEffect(() => { setMounted(true) }, [])

    const parseNbJson = () => {
        if (!nbJson.trim()) return null
        try { const parsed = JSON.parse(nbJson); setNbJsonError(''); return parsed }
        catch { setNbJsonError('Invalid JSON — check syntax'); return null }
    }

    const runAnalysis = async () => {
        if (!site) return
        setLoading(true); setError(''); setResult(null); setDxfReady(false); setDxfBlob(null); setDxfText(null)

        let nb = null
        if (leasePlan && nbJson.trim()) {
            nb = parseNbJson()
            if (!nb) { setLoading(false); return }
        }

        const body = {
            data_type:    site.source === 'lot_search' ? 'LOT' : 'ADDRESS',
            value:        site.lot_id || site.name,
            lon:          site.lon || null, lat: site.lat || null,
            lot_ids:      site.lot_ids?.length > 1 ? site.lot_ids : undefined,
            extents:      site.extents?.length ? site.extents : undefined,
            db_threshold: threshold,
            ...(nb && leasePlan ? { non_building_json: nb, lease_plan_b64: leasePlan.b64 } : {}),
        }
        try {
            if (outputMode === 'analysis') {
                setProgress('Resolving site boundary…')
                setTimeout(() => setProgress('Fetching OSM features…'), 5000)
                setTimeout(() => setProgress('Classifying view at boundary…'), 12000)
                setTimeout(() => setProgress('Building noise grid…'), 20000)
                const res = await fetch(`${MLP_API}/site-intelligence`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                if (!res.ok) { const e = await res.json(); throw new Error(e.error || `HTTP ${res.status}`) }
                setResult(await res.json())
            } else {
                setProgress('Generating DXF — this may take up to 60s…')
                const res = await fetch(`${MLP_API}/site-intelligence-dxf`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
                if (!res.ok) { const e = await res.json(); throw new Error(e.error || `HTTP ${res.status}`) }
                const blob = await res.blob()
                const text = await blob.text(); setDxfText(text)
                const cd = res.headers.get('Content-Disposition') || ''
                const fn = cd.match(/filename="(.+)"/)?.[1] || `${site.lot_id}_boundary.dxf`
                setDxfBlob({ blob, filename: fn }); setDxfReady(true)
            }
        } catch (e) { setError(e.message || 'Request failed') }
        finally { setLoading(false); setProgress('') }
    }

    const downloadDxf = () => {
        if (!dxfBlob) return
        const url = URL.createObjectURL(dxfBlob.blob)
        const a = document.createElement('a'); a.href = url; a.download = dxfBlob.filename; a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'Inter', system-ui, sans-serif", color: '#111827', opacity: mounted ? 1 : 0, transition: 'opacity 0.3s' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes fadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
                @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
                .mlp-hover:hover { opacity: 0.88 !important; }
            `}</style>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px 64px' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6366F1', marginBottom: 12 }}>Master Land Plan Module</p>
                <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#111827', marginBottom: 10, lineHeight: 1.15 }}>Boundary Intelligence Engine</h1>
                <p style={{ fontSize: 15, color: '#6B7280', marginBottom: 36, lineHeight: 1.6 }}>Per-metre boundary intelligence — view classification, noise sampling, and optional lease plan extraction for any Hong Kong lot.</p>

                <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    {/* LEFT PANEL */}
                    <div style={{ width: 380, flexShrink: 0, border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Analysis Controls</p>
                        </div>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Site */}
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Selected Site</label>
                                {site ? (
                                    <>
                                        <div style={{ border: '1.5px solid #C7D2FE', borderRadius: 9, padding: '12px 14px', background: '#EEF2FF', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 13, fontWeight: 700, color: '#4338CA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{site.name || site.lot_id}</p>
                                                <p style={{ fontSize: 11, color: '#6366F1', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{site.address || site.district}</p>
                                                {site.lot_ids?.length > 1 && <p style={{ fontSize: 10, color: '#818CF8', marginTop: 2 }}>{site.lot_ids.length} lots merged</p>}
                                            </div>
                                            <button onClick={() => { setSite(null); setResult(null); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366F1', flexShrink: 0, padding: 2 }}><X size={14} /></button>
                                        </div>
                                        <button onClick={() => setShowModal(true)} style={{ marginTop: 8, width: '100%', padding: '8px', borderRadius: 7, border: '1px solid #E5E7EB', background: '#fff', color: '#6B7280', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Change Site</button>
                                    </>
                                ) : (
                                    <button onClick={() => setShowModal(true)} style={{ width: '100%', padding: '12px 16px', borderRadius: 9, border: '1.5px dashed #6366F1', background: '#EEF2FF', color: '#6366F1', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#E0E7FF'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#EEF2FF'}>
                                        <Plus size={16} /> Select Site
                                    </button>
                                )}
                            </div>
                            {/* Output format */}
                            <div>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Output Format</label>
                                <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                                    {[{ id: 'analysis', label: 'JSON Analysis', icon: <BarChart2 size={12} /> }, { id: 'dxf', label: 'DXF Export', icon: <FileDown size={12} /> }].map((m, i) => (
                                        <button key={m.id} onClick={() => setOutputMode(m.id)}
                                            style={{ flex: 1, padding: '9px 4px', border: 'none', borderRight: i === 0 ? '1px solid #E5E7EB' : 'none', background: outputMode === m.id ? '#EEF2FF' : '#F9FAFB', color: outputMode === m.id ? '#6366F1' : '#6B7280', fontWeight: outputMode === m.id ? 700 : 500, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                            {m.icon} {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Noise threshold */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Noise Threshold</label>
                                    <span style={{ fontSize: 15, fontWeight: 800, color: threshold >= 70 ? '#EF4444' : threshold >= 60 ? '#F97316' : '#16A34A', fontFamily: 'monospace' }}>{threshold} dBA</span>
                                </div>
                                <input type="range" min={45} max={85} step={1} value={threshold} onChange={e => setThreshold(Number(e.target.value))} style={{ width: '100%', accentColor: '#6366F1', cursor: 'pointer' }} />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>45 dB quiet</span>
                                    <span style={{ fontSize: 10, color: '#9CA3AF' }}>85 dB noisy</span>
                                </div>
                            </div>
                            {/* Lease plan */}
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Lease Plan</label>
                                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>optional</span>
                                </div>
                                <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" style={{ display: 'none' }} onChange={e => {
                                    const file = e.target.files?.[0]; if (!file) return
                                    const reader = new FileReader()
                                    reader.onload = () => {
                                        const dataUrl = reader.result
                                        const mimeType = dataUrl.split(';')[0].split(':')[1] || 'image/png'
                                        setLeasePlan({ name: file.name, b64: dataUrl.split(',')[1], dataUrl, mimeType })
                                        setShowNbEditor(true)
                                    }
                                    reader.readAsDataURL(file)
                                }} />
                                {leasePlan ? (
                                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Check size={13} color="#16A34A" />
                                        {/* ── Clickable filename opens preview ── */}
                                        <span
                                            onClick={() => setShowLeasePreview(true)}
                                            title="Click to preview"
                                            style={{ fontSize: 12, color: '#166534', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 2 }}
                                        >
                                            {leasePlan.name}
                                        </span>
                                        {/* Eye button */}
                                        <button
                                            onClick={() => setShowLeasePreview(true)}
                                            title="Preview lease plan"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 2px', flexShrink: 0 }}
                                        >
                                            <Eye size={13} />
                                        </button>
                                        {/* Remove button */}
                                        <button onClick={() => { setLeasePlan(null); setShowNbEditor(false); setNbJson('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', flexShrink: 0 }}><X size={11} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => fileRef.current?.click()} style={{ width: '100%', padding: '9px', borderRadius: 7, border: '1.5px dashed #E5E7EB', background: '#FAFAFA', color: '#9CA3AF', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                                        <Upload size={12} /> Upload PDF or PNG
                                    </button>
                                )}
                                {showNbEditor && (
                                    <div style={{ marginTop: 10 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>non_building_json</span>
                                            <button onClick={() => setShowNbEditor(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>{showNbEditor ? <ChevronUp size={11} /> : <ChevronDown size={11} />}</button>
                                        </div>
                                        <textarea value={nbJson} onChange={e => setNbJson(e.target.value)} rows={5}
                                            placeholder={`{\n  "color_labels": {},\n  "non_building_areas": []\n}`}
                                            style={{ width: '100%', borderRadius: 7, border: `1.5px solid ${nbJsonError ? '#FCA5A5' : '#E5E7EB'}`, padding: '8px 10px', fontSize: 11, fontFamily: 'monospace', resize: 'vertical', outline: 'none', color: '#1E293B', background: '#FAFAFA', lineHeight: 1.5 }} />
                                        {nbJsonError && <p style={{ fontSize: 10, color: '#EF4444', marginTop: 3 }}>{nbJsonError}</p>}
                                    </div>
                                )}
                            </div>
                            {/* Run */}
                            <button onClick={runAnalysis} disabled={!site || loading}
                                style={{ width: '100%', padding: '12px 20px', borderRadius: 8, border: 'none', background: !site ? '#E5E7EB' : loading ? '#C7D2FE' : '#6366F1', color: !site ? '#9CA3AF' : 'white', fontSize: 14, fontWeight: 600, cursor: (!site || loading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s' }}
                                onMouseEnter={e => { if (site && !loading) e.currentTarget.style.background = '#4F46E5' }}
                                onMouseLeave={e => { if (site && !loading) e.currentTarget.style.background = '#6366F1' }}>
                                {loading ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analysing…</> : <><Zap size={14} /> Run Analysis</>}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 12, background: '#fff', overflow: 'hidden', minHeight: 520 }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>Result Display</p>
                        </div>
                        <div style={{ padding: 24 }}>
                            {!loading && !result && !dxfReady && !error && (
                                <div style={{ textAlign: 'center', padding: '48px 32px', animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#6366F1' }}><Layers size={24} /></div>
                                    <p style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Boundary Intelligence</p>
                                    <p style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.6, maxWidth: 360, margin: '0 auto 20px' }}>Select a site and run analysis to generate per-metre boundary intelligence — view classification, noise sampling, and optional lease plan extraction.</p>
                                    <button onClick={() => setShowModal(true)} style={{ padding: '10px 22px', borderRadius: 8, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                        <Plus size={14} /> Select Site
                                    </button>
                                </div>
                            )}
                            {loading && (
                                <div style={{ textAlign: 'center', padding: '48px 32px', animation: 'fadeIn 0.2s ease' }}>
                                    <div style={{ position: 'relative', width: 48, height: 48, margin: '0 auto 20px' }}>
                                        <div style={{ position: 'absolute', inset: 0, border: '3px solid #E0E7FF', borderRadius: '50%' }} />
                                        <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTop: '3px solid #6366F1', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                                    </div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{progress || 'Processing…'}</p>
                                    <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 16 }}>Resolving boundary, fetching OSM data, classifying views and noise. Takes 25–65 seconds.</p>
                                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                        {['Resolve', 'OSM Fetch', 'View Class.', 'Noise Grid', 'Output'].map((s, i) => (
                                            <div key={i} style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 99, background: '#EEF2FF', color: '#6366F1', animation: `pulse ${1 + i * 0.3}s ease infinite` }}>{s}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {error && (
                                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '16px', display: 'flex', gap: 12, alignItems: 'flex-start', animation: 'fadeIn 0.2s ease' }}>
                                    <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0, marginTop: 1 }} />
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#991B1B', marginBottom: 4 }}>Analysis failed</p>
                                        <p style={{ fontSize: 12, color: '#B91C1C', fontFamily: 'monospace', wordBreak: 'break-all' }}>{error}</p>
                                    </div>
                                    <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FCA5A5' }}><X size={14} /></button>
                                </div>
                            )}
                            {dxfReady && dxfBlob && (
                                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 10, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileDown size={22} color="#16A34A" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>DXF File Ready</p>
                                            <p style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>{dxfBlob.filename}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => setShowViewer(true)} className="mlp-hover" style={{ padding: '9px 18px', borderRadius: 7, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Layers size={13} /> Preview DXF
                                            </button>
                                            <button onClick={downloadDxf} className="mlp-hover" style={{ padding: '9px 18px', borderRadius: 7, border: 'none', background: '#16A34A', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Download size={13} /> Download
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: 16, border: '1px solid #E5E7EB', borderRadius: 9, overflow: 'hidden' }}>
                                        {[
                                            { label: 'Site Boundary',      value: 'Closed polyline at 1m intervals',             meta: 'EPSG:3857' },
                                            { label: 'View Classification', value: '8 sample points — CITY · PARK · SEA · HARBOR', meta: 'Per boundary segment' },
                                            { label: 'Noise Sampling',      value: 'dBA value at every point',                    meta: `Threshold: ${threshold} dBA` },
                                            { label: 'Non-Building Zones',  value: 'Lease plan polygon extraction',               meta: 'Optional · PDF or PNG' },
                                        ].map((row, i, arr) => (
                                            <div key={row.label} style={{ display: 'flex', alignItems: 'center', padding: '11px 16px', borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', width: 170, flexShrink: 0 }}>{row.label}</span>
                                                <span style={{ width: 1, height: 16, background: '#E5E7EB', flexShrink: 0, margin: '0 14px' }} />
                                                <span style={{ fontSize: 12, color: '#6B7280', flex: 1 }}>{row.value}</span>
                                                <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 12, flexShrink: 0 }}>{row.meta}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {result && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.3s ease' }}>
                                    <StatGrid result={result} threshold={threshold} />
                                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                        <div style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderBottom: '1px solid #F3F4F6' }}>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>Boundary Map</span>
                                                <div style={{ marginLeft: 'auto', display: 'flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                                                    {[{ id: 'view', label: 'View' }, { id: 'noise', label: 'Noise' }].map((m, i) => (
                                                        <button key={m.id} onClick={() => setViewMode(m.id)}
                                                            style={{ padding: '5px 12px', border: 'none', borderRight: i === 0 ? '1px solid #E5E7EB' : 'none', background: viewMode === m.id ? '#F1F5F9' : '#fff', color: viewMode === m.id ? '#111827' : '#94A3B8', fontSize: 11, fontWeight: viewMode === m.id ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
                                                            {m.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ height: 340 }}><BoundaryMap result={result} viewMode={viewMode} threshold={threshold} /></div>
                                            <div style={{ padding: '8px 14px 10px', borderTop: '1px solid #F3F4F6' }}><MapLegend mode={viewMode} threshold={threshold} /></div>
                                        </div>
                                        <div style={{ width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            <div style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px' }}>
                                                <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>View Types</p>
                                                <ViewBreakdown viewTypes={result.view_type} />
                                            </div>
                                            <div style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px' }}>
                                                <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Noise Distribution</p>
                                                <NoiseHistogram noiseDb={result.noise_db} threshold={threshold} />
                                            </div>
                                        </div>
                                    </div>
                                    {result.non_building_areas && <NonBuildingPanel zones={result.non_building_areas} />}
                                    <RawJsonPanel result={result} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <footer style={{ borderTop: '1px solid #E2E8F0', background: 'rgba(209,207,207,0.47)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 24px' }}>
                    <p style={{ fontSize: 12, color: '#475569', textAlign: 'center' }}>© 2026 ALKF. All rights reserved.</p>
                </div>
            </footer>

            {showModal && <CreateSiteModal onClose={() => setShowModal(false)} onConfirm={(s) => { setSite(s); setShowModal(false) }} />}
            {showViewer && dxfText && <DXFViewer dxfText={dxfText} filename={dxfBlob?.filename} onClose={() => setShowViewer(false)} />}
            {/* ── Lease plan preview modal ── */}
            {showLeasePreview && leasePlan && (
                <LeasePlanPreviewModal leasePlan={leasePlan} onClose={() => setShowLeasePreview(false)} />
            )}
        </div>
    )
}
