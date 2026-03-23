import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Layers, ZoomIn, ZoomOut, Move, Ruler, Eye, EyeOff, RotateCcw, Home } from 'lucide-react'

const LAYER_STYLES = {
    SITE_BOUNDARY: { color: '#111827', lineWidth: 1.8, dash: [],    fill: null,      label: 'Boundary',  dot: null },
    VIEW_POINTS:   { color: '#16A34A', lineWidth: 1,   dash: [],    fill: null,      label: 'View pts',  dot: '#16A34A' },
    NOISE_POINTS:  { color: '#0284C7', lineWidth: 1,   dash: [],    fill: null,      label: 'Noise pts', dot: '#0284C7' },
    NON_BUILDING:  { color: '#7C3AED', lineWidth: 1.5, dash: [6,3], fill: '#EDE9FE', label: 'Non-bldg',  dot: null },
    LABELS:        { color: '#92400E', lineWidth: 1,   dash: [],    fill: null,      label: 'Labels',    dot: null },
    DEFAULT:       { color: '#475569', lineWidth: 1,   dash: [],    fill: null,      label: 'Other',     dot: null },
}

function parseDXF(text) {
    const lines = text.split(/\r?\n/)
    const out = []; let i = 0
    while (i < lines.length) {
        if (lines[i]?.trim() !== '0') { i++; continue }
        const type = lines[i+1]?.trim()?.toUpperCase()
        if (!type) { i += 2; continue }
        i += 2
        const pairs = []
        while (i < lines.length) {
            const c = parseInt(lines[i]?.trim()), v = lines[i+1]?.trim()
            if (isNaN(c) || v === undefined) { i++; continue }
            if (c === 0) break
            pairs.push([c, v]); i += 2
        }
        const g  = code => pairs.find(([c]) => c === code)?.[1]
        const ga = code => pairs.filter(([c]) => c === code).map(([,v]) => v)
        const layer = (g(8) || 'DEFAULT').toUpperCase()

        if (type === 'LINE')
            out.push({ type:'LINE', layer, x1:+g(10)||0, y1:+g(20)||0, x2:+g(11)||0, y2:+g(21)||0 })
        else if (type === 'LWPOLYLINE') {
            const xs = ga(10).map(Number), ys = ga(20).map(Number)
            if (xs.length) out.push({ type:'LWPOLYLINE', layer, xs, ys, closed:(+(g(70)||0)&1)===1 })
        } else if (type === 'POLYLINE')
            out.push({ type:'POLYLINE', layer, xs:[], ys:[], closed:(+(g(70)||0)&1)===1, _open:true })
        else if (type === 'VERTEX') {
            const pl = [...out].reverse().find(e => e._open)
            if (pl) { pl.xs.push(+g(10)||0); pl.ys.push(+g(20)||0) }
        } else if (type === 'SEQEND') {
            const pl = [...out].reverse().find(e => e._open); if (pl) pl._open = false
        } else if (type === 'SPLINE') {
            const xs = ga(10).map(Number), ys = ga(20).map(Number)
            if (xs.length) out.push({ type:'SPLINE', layer, xs, ys, closed:false })
        } else if (type === 'CIRCLE')
            out.push({ type:'CIRCLE', layer, cx:+g(10)||0, cy:+g(20)||0, r:+g(40)||2 })
        else if (type === 'ARC')
            out.push({ type:'ARC', layer, cx:+g(10)||0, cy:+g(20)||0, r:+g(40)||2, sa:+g(50)||0, ea:+g(51)||360 })
        else if (type === 'POINT')
            out.push({ type:'POINT', layer, x:+g(10)||0, y:+g(20)||0 })
        else if (type === 'TEXT' || type === 'MTEXT') {
            const raw = (g(1)||'').replace(/\\P/g,' ').replace(/\\[a-zA-Z][^;]*;/g,'').replace(/[{}]/g,'').trim()
            if (raw) out.push({ type:'TEXT', layer, x:+g(10)||0, y:+g(20)||0, text:raw, h:+g(40)||1.5 })
        }
    }
    return out
}

// Title block detection — pipe-separated metadata line or ALKF/LAND PLAN heading
function isTitleBlockText(text) {
    if (!text) return false
    // Long pipe-separated line = metadata row
    if (text.includes('|') && text.length > 20) return true
    // Heading line
    if (/MASTER\s*LAND\s*PLAN|ALKF\s*MASTER|LAND\s*PLAN\s*-/i.test(text)) return true
    // Standalone metadata fields that appear as separate TEXT entities
    if (/^CRS\s*:|^Sampling\s*:|^Noise\s*threshold|^Boundary\s*pts/i.test(text)) return true
    return false
}

function buildRenderList(raw) {
    const points     = raw.filter(e => e.type === 'POINT')
    const allTexts   = raw.filter(e => e.type === 'TEXT')
    const geometry   = raw.filter(e => e.type !== 'POINT' && e.type !== 'TEXT')

    // Separate title block texts (HTML panel only) from annotation texts (point labels)
    const titleTexts     = allTexts.filter(t => isTitleBlockText(t.text))
    const annotationTexts = allTexts.filter(t => !isTitleBlockText(t.text))

    if (!points.length) {
        return { drawList: [...geometry], titleTexts }
    }

    const pxs = points.map(p => p.x), pys = points.map(p => p.y)
    const pMinX = Math.min(...pxs), pMaxX = Math.max(...pxs)
    const pMinY = Math.min(...pys), pMaxY = Math.max(...pys)
    const margin = Math.max(pMaxX - pMinX, pMaxY - pMinY) * 0.25

    // Match annotation texts to their nearest POINT — these become point labels
    // drawn inline on canvas next to the dot, NOT as standalone TEXT entities
    const nearTexts = annotationTexts.filter(t =>
        t.x >= pMinX - margin && t.x <= pMaxX + margin &&
        t.y >= pMinY - margin && t.y <= pMaxY + margin
    )

    const textWithDist = nearTexts.map((tx, ti) => {
        let bestPt = null, bestD = Infinity
        points.forEach(pt => {
            const d = Math.hypot(tx.x - pt.x, tx.y - pt.y)
            if (d < bestD) { bestD = d; bestPt = pt }
        })
        return { tx, ti, pt: bestPt, d: bestD }
    }).sort((a, b) => a.d - b.d)

    const ptLabels = new Map(points.map(pt => [pt, []]))
    const usedTexts = new Set()

    textWithDist.forEach(({ tx, ti, pt }) => {
        if (usedTexts.has(ti) || !pt) return
        const labels = ptLabels.get(pt) || []
        if (labels.length < 3) {
            labels.push(tx.text)
            ptLabels.set(pt, labels)
            usedTexts.add(ti)
        }
    })

    // POINT entities get their labels array; TEXT entities are NEVER added to drawList
    const renderedPoints = points.map(pt => ({
        ...pt,
        labels: ptLabels.get(pt) || []
    }))

    return { drawList: [...geometry, ...renderedPoints], titleTexts }
}

function computeGeomExtents(drawList) {
    let minX=Infinity, minY=Infinity, maxX=-Infinity, maxY=-Infinity
    const ex = (x, y) => {
        if (!isFinite(x) || !isFinite(y)) return
        if (x<minX) minX=x; if (x>maxX) maxX=x
        if (y<minY) minY=y; if (y>maxY) maxY=y
    }
    drawList.forEach(e => {
        if (e.type === 'TEXT') return
        if (e.type === 'LINE')   { ex(e.x1,e.y1); ex(e.x2,e.y2) }
        else if (e.xs?.length)   { e.xs.forEach((x,i) => ex(x, e.ys[i])) }
        else if (e.type === 'CIRCLE' || e.type === 'ARC') { ex(e.cx-e.r,e.cy-e.r); ex(e.cx+e.r,e.cy+e.r) }
        else if (e.type === 'POINT') { ex(e.x, e.y) }
    })
    if (!isFinite(minX)) return { minX:0, minY:0, maxX:100, maxY:100, w:100, h:100 }
    return { minX, minY, maxX, maxY, w: maxX-minX, h: maxY-minY }
}

export default function DXFViewer({ dxfText, filename, onClose }) {
    const canvasRef    = useRef(null)
    const containerRef = useRef(null)

    const [drawList,   setDrawList]   = useState([])
    const [titleTexts, setTitleTexts] = useState([])
    const [extents,    setExtents]    = useState(null)
    const [layers,     setLayers]     = useState({})
    const [transform,  setTransform]  = useState({ scale:1, ox:0, oy:0 })
    const [tool,       setTool]       = useState('pan')
    const [measurePts, setMeasurePts] = useState([])
    const [dragging,   setDragging]   = useState(false)
    const [dragStart,  setDragStart]  = useState({x:0,y:0})
    const [hoverPos,   setHoverPos]   = useState(null)
    const [sidebarOpen,setSidebarOpen]= useState(true)
    const [ready,      setReady]      = useState(false)

    const trRef  = useRef(transform)
    const dlRef  = useRef([])
    const lyrRef = useRef({})
    const extRef = useRef(null)
    trRef.current  = transform
    dlRef.current  = drawList
    lyrRef.current = layers
    extRef.current = extents

    useEffect(() => {
        if (!dxfText) return
        const raw = parseDXF(dxfText)
        const { drawList: dl, titleTexts: tt } = buildRenderList(raw)
        const ext = computeGeomExtents(dl)
        const lmap = {}
        ;[...dl, ...tt].forEach(e => {
            const k = e.layer || 'DEFAULT'
            if (!lmap[k]) lmap[k] = { visible:true, style: LAYER_STYLES[k]||LAYER_STYLES.DEFAULT, count:0 }
            lmap[k].count++
        })
        setDrawList(dl); setTitleTexts(tt); setExtents(ext); setLayers(lmap)
    }, [dxfText])

    useEffect(() => {
        const cont = containerRef.current, c = canvasRef.current
        if (!cont || !c) return
        const resize = () => { const r = cont.getBoundingClientRect(); c.width=r.width; c.height=r.height }
        resize()
        const ro = new ResizeObserver(resize); ro.observe(cont)
        return () => ro.disconnect()
    }, [])

    const toCanvas = useCallback((wx, wy, t) => {
        const tr = t || trRef.current
        return [wx * tr.scale + tr.ox, -wy * tr.scale + tr.oy]
    }, [])
    const toWorld = useCallback((cx, cy) => {
        const t = trRef.current
        return [(cx - t.ox) / t.scale, -(cy - t.oy) / t.scale]
    }, [])

    const getPaperRect = useCallback((ext, t) => {
        if (!ext || !isFinite(ext.w)) return null
        const pad = Math.max(ext.w, ext.h) * 0.13
        const [x1, y1] = toCanvas(ext.minX - pad, ext.maxY + pad * 0.7, t)
        const [x2, y2] = toCanvas(ext.maxX + pad, ext.minY - pad * 0.7, t)
        return { x: x1, y: y1, w: x2-x1, h: y2-y1 }
    }, [toCanvas])

    const fitToView = useCallback(() => {
        const c = canvasRef.current; if (!c || !extents) return
        const PAD = 80
        const cw = c.width - PAD * 2
        const ch = c.height - PAD * 2
        if (cw <= 0 || ch <= 0 || !extents.w || !extents.h) return
        const scale = Math.min(cw / extents.w, ch / extents.h) * 0.75
        const ox = PAD + (cw - extents.w * scale) / 2 - extents.minX * scale
        const oy = PAD + (ch - extents.h * scale) / 2 + extents.maxY * scale + (c.height - ch - PAD*2) / 2
        setTransform({ scale, ox, oy })
        setReady(true)
    }, [extents])

    useEffect(() => {
        if (!extents) return
        const t = setTimeout(fitToView, 150)
        return () => clearTimeout(t)
    }, [extents, fitToView])

    const draw = useCallback(() => {
        const canvas = canvasRef.current; if (!canvas) return
        const ctx = canvas.getContext('2d')
        const W = canvas.width, H = canvas.height
        const t = trRef.current, ents = dlRef.current, lys = lyrRef.current, ext = extRef.current

        ctx.fillStyle = '#CDD1D8'; ctx.fillRect(0, 0, W, H)

        const gs = Math.max(20, 60 * t.scale)
        const gx = ((t.ox%gs)+gs)%gs, gy = ((t.oy%gs)+gs)%gs
        ctx.strokeStyle = 'rgba(0,0,0,0.05)'; ctx.lineWidth = 0.5
        for (let x=gx; x<W; x+=gs) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
        for (let y=gy; y<H; y+=gs) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }

        const pr = getPaperRect(ext, t)
        if (pr) {
            ctx.save()
            ctx.shadowColor='rgba(0,0,0,0.20)'; ctx.shadowBlur=20; ctx.shadowOffsetX=2; ctx.shadowOffsetY=3
            ctx.fillStyle='#FFFFFF'; ctx.fillRect(pr.x, pr.y, pr.w, pr.h)
            ctx.restore()
            ctx.strokeStyle='#B8C4D0'; ctx.lineWidth=0.8; ctx.strokeRect(pr.x, pr.y, pr.w, pr.h)
        }

        ctx.save()
        if (pr) {
            ctx.beginPath(); ctx.rect(pr.x, pr.y, pr.w, pr.h); ctx.clip()
        }

        ents.forEach(e => {
            const li = lys[e.layer]; if (li && !li.visible) return
            const s = li?.style || LAYER_STYLES.DEFAULT
            ctx.strokeStyle = s.color; ctx.lineWidth = s.lineWidth; ctx.setLineDash(s.dash)

            if (e.type === 'LINE') {
                const [ax,ay]=toCanvas(e.x1,e.y1,t), [bx,by]=toCanvas(e.x2,e.y2,t)
                ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke()
            } else if (['LWPOLYLINE','SPLINE','POLYLINE'].includes(e.type)) {
                if (!e.xs?.length) return
                ctx.beginPath()
                e.xs.forEach((x,i)=>{ const [px,py]=toCanvas(x,e.ys[i],t); i===0?ctx.moveTo(px,py):ctx.lineTo(px,py) })
                if (e.closed) ctx.closePath()
                if (s.fill) { ctx.fillStyle=s.fill; ctx.fill() }
                ctx.stroke()
            } else if (e.type === 'CIRCLE') {
                const [cx2,cy2]=toCanvas(e.cx,e.cy,t)
                ctx.beginPath(); ctx.arc(cx2,cy2,e.r*t.scale,0,Math.PI*2)
                if (s.fill) { ctx.fillStyle=s.fill; ctx.fill() }; ctx.stroke()
            } else if (e.type === 'ARC') {
                const [cx2,cy2]=toCanvas(e.cx,e.cy,t)
                ctx.beginPath(); ctx.arc(cx2,cy2,e.r*t.scale,-e.sa*Math.PI/180,-e.ea*Math.PI/180,true); ctx.stroke()
            } else if (e.type === 'POINT') {
                const [px,py] = toCanvas(e.x, e.y, t)
                const dotR = 3.5
                ctx.setLineDash([])
                ctx.beginPath(); ctx.arc(px, py, dotR, 0, Math.PI*2)
                ctx.fillStyle = s.dot || s.color; ctx.fill()
                ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 1; ctx.stroke()
                if (e.labels?.length) {
                    const FS = 8.5, LH = 11
                    ctx.font = `600 ${FS}px Inter,sans-serif`
                    ctx.textAlign = 'left'
                    const lx = px + dotR + 5
                    const totalH = (e.labels.length - 1) * LH
                    const ly0 = py + FS * 0.35 - totalH / 2
                    e.labels.forEach((lbl, li) => {
                        const tw = ctx.measureText(lbl).width
                        const ty = ly0 + li * LH
                        ctx.fillStyle = 'rgba(255,255,255,0.92)'
                        ctx.beginPath()
                        if (ctx.roundRect) ctx.roundRect(lx-1, ty-FS+1, tw+5, FS+2, 2)
                        else ctx.rect(lx-1, ty-FS+1, tw+5, FS+2)
                        ctx.fill()
                        ctx.fillStyle = s.color
                        ctx.fillText(lbl, lx, ty)
                    })
                }
            }
        })

        ctx.restore()
        ctx.setLineDash([])

        if (measurePts.length > 0) {
            ctx.strokeStyle='#DC2626'; ctx.lineWidth=1.5; ctx.setLineDash([5,3])
            ctx.beginPath()
            measurePts.forEach(([wx,wy],i)=>{ const [px,py]=toCanvas(wx,wy,t); i===0?ctx.moveTo(px,py):ctx.lineTo(px,py) })
            ctx.stroke(); ctx.setLineDash([])
            measurePts.forEach(([wx,wy])=>{
                const [px,py]=toCanvas(wx,wy,t)
                ctx.beginPath(); ctx.arc(px,py,4.5,0,Math.PI*2)
                ctx.fillStyle='#DC2626'; ctx.fill(); ctx.strokeStyle='#fff'; ctx.lineWidth=1.2; ctx.stroke()
            })
            ctx.font='bold 11px Inter,sans-serif'; ctx.fillStyle='#DC2626'
            for (let i=1;i<measurePts.length;i++) {
                const [ax,ay]=measurePts[i-1],[bx,by]=measurePts[i]
                const d=Math.hypot(bx-ax,by-ay).toFixed(1)
                const [mx,my]=toCanvas((ax+bx)/2,(ay+by)/2,t)
                ctx.fillText(`${d}m`,mx+5,my-5)
            }
        }

        if (tool==='measure' && hoverPos) {
            const [hx,hy]=hoverPos
            ctx.strokeStyle='rgba(220,38,38,0.35)'; ctx.lineWidth=0.8; ctx.setLineDash([4,4])
            ctx.beginPath(); ctx.moveTo(hx,0); ctx.lineTo(hx,H); ctx.stroke()
            ctx.beginPath(); ctx.moveTo(0,hy); ctx.lineTo(W,hy); ctx.stroke()
            ctx.setLineDash([])
        }
    }, [drawList, layers, toCanvas, getPaperRect, measurePts, tool, hoverPos, extents, transform])

    useEffect(()=>{ draw() }, [draw])

    const handleWheel = useCallback(e => {
        e.preventDefault()
        const r = canvasRef.current.getBoundingClientRect()
        const mx=e.clientX-r.left, my=e.clientY-r.top, f=e.deltaY<0?1.12:0.89
        setTransform(p=>({ scale:p.scale*f, ox:mx-(mx-p.ox)*f, oy:my-(my-p.oy)*f }))
    },[])
    useEffect(()=>{
        const c=canvasRef.current; if(!c) return
        c.addEventListener('wheel',handleWheel,{passive:false})
        return()=>c.removeEventListener('wheel',handleWheel)
    },[handleWheel])

    const onMD  = e => { if(tool==='pan'){setDragging(true);setDragStart({x:e.clientX,y:e.clientY})} }
    const onMM  = e => {
        const r=canvasRef.current.getBoundingClientRect()
        setHoverPos([e.clientX-r.left,e.clientY-r.top])
        if(dragging&&tool==='pan'){
            const dx=e.clientX-dragStart.x,dy=e.clientY-dragStart.y
            setDragStart({x:e.clientX,y:e.clientY})
            setTransform(p=>({...p,ox:p.ox+dx,oy:p.oy+dy}))
        }
    }
    const onMU  = ()=>setDragging(false)
    const onML  = ()=>{setDragging(false);setHoverPos(null)}
    const onCLK = e=>{
        if(tool!=='measure') return
        const r=canvasRef.current.getBoundingClientRect()
        const [wx,wy]=toWorld(e.clientX-r.left,e.clientY-r.top)
        setMeasurePts(p=>[...p,[wx,wy]])
    }
    const zoom=f=>{
        const c=canvasRef.current;if(!c)return
        const cx=c.width/2,cy=c.height/2
        setTransform(p=>({scale:p.scale*f,ox:cx-(cx-p.ox)*f,oy:cy-(cy-p.oy)*f}))
    }

    const measureTotal=measurePts.length<2?null:
        measurePts.slice(1).reduce((s,[bx,by],i)=>{const[ax,ay]=measurePts[i];return s+Math.hypot(bx-ax,by-ay)},0).toFixed(2)

    useEffect(()=>{
        const h=e=>{if(e.key==='Escape')onClose()}
        window.addEventListener('keydown',h);return()=>window.removeEventListener('keydown',h)
    },[onClose])

    const toggleLayer=k=>setLayers(p=>({...p,[k]:{...p[k],visible:!p[k].visible}}))
    const showAll=()=>setLayers(p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,{...v,visible:true}])))
    const hideAll=()=>setLayers(p=>Object.fromEntries(Object.entries(p).map(([k,v])=>[k,{...v,visible:false}])))
    const totalL=Object.keys(layers).length, visibleL=Object.values(layers).filter(l=>l.visible).length

    // Parse title block — split the pipe-separated metadata line into individual items
    const titleLine = titleTexts.find(t => /MASTER.*LAND.*PLAN|ALKF.*LAND/i.test(t.text))?.text
    const rawMeta   = titleTexts.find(t => /CRS\s*:|EPSG\s*:|Sampling\s*:|Noise\s*threshold/i.test(t.text))?.text || ''
    const metaLines = rawMeta
        ? rawMeta.split(/\s*\|\s*/).map(s => s.trim()).filter(Boolean)
        : titleTexts.filter(t => !/MASTER.*LAND.*PLAN|ALKF.*LAND/i.test(t.text)).map(t => t.text)

    return (
        <div style={{position:'fixed',inset:0,zIndex:999,display:'flex',flexDirection:'column',
            fontFamily:"'Inter',system-ui,sans-serif",userSelect:'none'}}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                *{box-sizing:border-box;margin:0;padding:0;}
                .dv{background:transparent;border:none;cursor:pointer;display:flex;align-items:center;
                    justify-content:center;border-radius:5px;transition:background .12s;color:#374151;font-family:inherit;}
                .dv:hover{background:rgba(0,0,0,0.08);}
                .dv.on{background:#DBEAFE;color:#1D4ED8;}
                .sep{width:1px;height:22px;background:#D1D5DB;margin:0 6px;flex-shrink:0;}
            `}</style>

            {/* ── TOP BAR — ALKF logo replaces blue icon ── */}
            <div style={{height:50,background:'#0F172A',display:'flex',alignItems:'center',padding:'0 16px',flexShrink:0}}>
                <div style={{display:'flex',alignItems:'center',gap:10,paddingRight:16,borderRight:'1px solid #1E293B',marginRight:14}}>
                    {/* ALKF logo from public folder */}
                    <img
                        src="/logo.png"
                        alt="ALKF"
                        style={{height:28,width:'auto',objectFit:'contain',display:'block',flexShrink:0}}
                        onError={e => {
                            // Fallback to text if logo doesn't load
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                        }}
                    />
                    {/* Fallback badge — hidden unless image fails */}
                    <div style={{display:'none',width:30,height:30,background:'#2563EB',borderRadius:6,alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        <Layers size={16} color="white"/>
                    </div>
                    <span style={{fontSize:14,fontWeight:700,color:'#F1F5F9',letterSpacing:'-0.01em'}}>
                        <span style={{color:'#60A5FA'}}></span> DXF Viewer
                    </span>
                </div>
                <span style={{fontSize:13,color:'#475569',marginRight:6}}>›</span>
                <span style={{fontSize:13,fontWeight:500,color:'#CBD5E1',flex:1}}>{filename||'boundary.dxf'}</span>
                <button className="dv" onClick={onClose} style={{padding:'7px 16px',background:'rgba(255,255,255,0.08)',color:'#F1F5F9',fontSize:13,fontWeight:600,gap:6,borderRadius:6}}>
                    <X size={14}/> Close
                </button>
            </div>

            {/* ── TOOLBAR ── */}
            <div style={{height:46,background:'#F8FAFC',borderBottom:'1px solid #E2E8F0',display:'flex',alignItems:'center',padding:'0 14px',gap:2,flexShrink:0}}>
                <button className={`dv${tool==='pan'?' on':''}`} onClick={()=>setTool('pan')} style={{padding:'7px 14px',gap:6,fontSize:13,fontWeight:600}}><Move size={15}/> Pan</button>
                <button className={`dv${tool==='measure'?' on':''}`} onClick={()=>{setTool(t=>t==='measure'?'pan':'measure');setMeasurePts([])}} style={{padding:'7px 14px',gap:6,fontSize:13,fontWeight:600}}><Ruler size={15}/> Measure</button>
                {tool==='measure'&&measurePts.length>0&&<button className="dv" onClick={()=>setMeasurePts([])} style={{padding:'5px 10px',gap:4,fontSize:12,color:'#DC2626'}}><X size={11}/> Clear</button>}
                <div className="sep"/>
                <button className="dv" onClick={()=>zoom(1.25)} style={{padding:8}}><ZoomIn  size={16}/></button>
                <button className="dv" onClick={()=>zoom(0.80)} style={{padding:8}}><ZoomOut size={16}/></button>
                <button className="dv" onClick={fitToView}       style={{padding:8}}><Home    size={16}/></button>
                <button className="dv" onClick={fitToView}       style={{padding:8}}><RotateCcw size={16}/></button>
                <div className="sep"/>
                <span style={{fontSize:12,color:'#6B7280',fontFamily:'monospace',minWidth:52,textAlign:'center'}}>{Math.round(transform.scale*100)}%</span>
                {tool==='measure'&&(
                    <div style={{marginLeft:8,padding:'4px 12px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:5,display:'flex',alignItems:'center',gap:8}}>
                        <span style={{fontSize:12,color:'#DC2626',fontWeight:600}}>
                            {measurePts.length===0?'Click to start':measurePts.length===1?'Click next point…':`Total: ${measureTotal} m`}
                        </span>
                        {measurePts.length>0&&<span style={{fontSize:11,color:'#9CA3AF'}}>{measurePts.length} pts</span>}
                    </div>
                )}
                <div style={{flex:1}}/>
                <button className="dv" onClick={()=>setSidebarOpen(v=>!v)} style={{padding:'6px 12px',gap:6,fontSize:13,fontWeight:600}}>
                    <Layers size={15}/> Layers
                    <span style={{fontSize:10,background:'#EEF2FF',color:'#4F46E5',borderRadius:10,padding:'1px 7px',fontWeight:700}}>{visibleL}/{totalL}</span>
                </button>
            </div>

            {/* ── MAIN ── */}
            <div style={{flex:1,display:'flex',overflow:'hidden',position:'relative'}}>
                <div ref={containerRef} style={{flex:1,position:'relative',overflow:'hidden',cursor:tool==='pan'?(dragging?'grabbing':'grab'):'crosshair'}}>
                    <canvas ref={canvasRef} onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onML} onClick={onCLK} style={{display:'block',width:'100%',height:'100%'}}/>

                    {/* ── Status bar — centred at bottom of canvas ── */}
                    {ready && extents && (
                        <div style={{position:'absolute',bottom:14,left:'50%',transform:'translateX(-50%)',background:'rgba(255,255,255,0.95)',backdropFilter:'blur(8px)',border:'1px solid #E2E8F0',borderRadius:7,padding:'6px 20px',display:'flex',gap:24,alignItems:'center',boxShadow:'0 2px 12px rgba(0,0,0,0.10)',pointerEvents:'none',whiteSpace:'nowrap'}}>
                            {[['CRS','EPSG:3857'],['Sampling','1.0m'],['Entities',drawList.length],['Layers',totalL]].map(([k,v])=>(
                                <span key={k} style={{fontSize:11,color:'#6B7280'}}><span style={{fontWeight:700,color:'#374151',marginRight:4}}>{k}:</span>{v}</span>
                            ))}
                        </div>
                    )}

                    {/* ── Coordinate readout — bottom right of canvas ── */}
                    {hoverPos && (
                        <div style={{position:'absolute',bottom:14,right:14,background:'rgba(255,255,255,0.92)',border:'1px solid #E2E8F0',borderRadius:5,padding:'3px 10px',fontSize:10,color:'#6B7280',fontFamily:'monospace',pointerEvents:'none'}}>
                            {(()=>{const[wx,wy]=toWorld(hoverPos[0],hoverPos[1]);return`X: ${wx.toFixed(1)}  Y: ${wy.toFixed(1)}`})()}
                        </div>
                    )}
                </div>

                {/* ── SIDEBAR ── */}
                {sidebarOpen && (
                    <div style={{width:256,background:'#F8FAFC',borderLeft:'1px solid #E2E8F0',display:'flex',flexDirection:'column',flexShrink:0,overflowY:'auto'}}>
                        <div style={{padding:'14px 14px 0'}}>
                            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                                <span style={{fontSize:11,fontWeight:800,color:'#111827',textTransform:'uppercase',letterSpacing:'0.1em'}}>Layers</span>
                                <span style={{fontSize:11,color:'#9CA3AF'}}>{visibleL} of {totalL}</span>
                            </div>
                            <div style={{display:'flex',gap:6,marginBottom:12}}>
                                <button onClick={showAll} style={{flex:1,padding:'6px',borderRadius:6,border:'1px solid #E5E7EB',background:'#fff',fontSize:12,color:'#374151',cursor:'pointer',fontWeight:500,fontFamily:'inherit'}}>Show All</button>
                                <button onClick={hideAll} style={{flex:1,padding:'6px',borderRadius:6,border:'1px solid #E5E7EB',background:'#fff',fontSize:12,color:'#374151',cursor:'pointer',fontWeight:500,fontFamily:'inherit'}}>Hide All</button>
                            </div>
                        </div>
                        <div style={{padding:'0 10px 14px',display:'flex',flexDirection:'column',gap:4}}>
                            {Object.entries(layers).map(([name,info])=>(
                                <div key={name} onClick={()=>toggleLayer(name)}
                                    style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:7,cursor:'pointer',background:info.visible?'#EFF6FF':'transparent',border:`1px solid ${info.visible?'#BFDBFE':'#F3F4F6'}`,transition:'all .12s'}}>
                                    <div style={{width:12,height:12,borderRadius:3,background:info.style.color,flexShrink:0,opacity:info.visible?1:0.25}}/>
                                    <div style={{flex:1,minWidth:0}}>
                                        <div style={{fontSize:12,fontWeight:600,color:info.visible?'#1D4ED8':'#9CA3AF',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{info.style.label||name}</div>
                                        <div style={{fontSize:10,color:'#9CA3AF',marginTop:1}}>{name} · {info.count}</div>
                                    </div>
                                    {info.visible?<Eye size={13} style={{color:'#3B82F6',flexShrink:0}}/>:<EyeOff size={13} style={{color:'#D1D5DB',flexShrink:0}}/>}
                                </div>
                            ))}
                        </div>
                        <div style={{borderTop:'1px solid #E2E8F0',padding:'14px 14px'}}>
                            <div style={{fontSize:11,fontWeight:800,color:'#111827',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:10}}>Line Types</div>
                            <div style={{display:'flex',flexDirection:'column',gap:7}}>
                                {Object.entries(LAYER_STYLES).filter(([k])=>k!=='DEFAULT').map(([key,s])=>(
                                    <div key={key} style={{display:'flex',alignItems:'center',gap:10}}>
                                        <svg width="32" height="8" style={{flexShrink:0}}>
                                            <line x1="0" y1="4" x2="32" y2="4" stroke={s.color} strokeWidth={s.lineWidth+0.5} strokeDasharray={s.dash.length?s.dash.join(' '):undefined}/>
                                        </svg>
                                        <span style={{fontSize:12,color:'#374151'}}>{s.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {extents && isFinite(extents.w) && (
                            <div style={{borderTop:'1px solid #E2E8F0',padding:'14px 14px'}}>
                                <div style={{fontSize:11,fontWeight:800,color:'#111827',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>Extents</div>
                                {[['X min',extents.minX.toFixed(1)],['X max',extents.maxX.toFixed(1)],['Y min',extents.minY.toFixed(1)],['Y max',extents.maxY.toFixed(1)],['W',extents.w.toFixed(1)+' m'],['H',extents.h.toFixed(1)+' m']].map(([k,v])=>(
                                    <div key={k} style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                                        <span style={{fontSize:11,color:'#9CA3AF'}}>{k}</span>
                                        <span style={{fontSize:11,color:'#374151',fontFamily:'monospace'}}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── TITLE BLOCK — fixed to bottom-right of the entire viewer, never moves ── */}
                {ready && (titleLine || metaLines.length > 0) && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: sidebarOpen ? 256 : 0,
                        width: 340,
                        background: '#FFFFFF',
                        borderTop: '2px solid #E2E8F0',
                        borderLeft: '1px solid #E2E8F0',
                        padding: '10px 16px 12px',
                        pointerEvents: 'none',
                        boxShadow: '-2px -2px 12px rgba(0,0,0,0.08)',
                        zIndex: 10,
                    }}>
                        {/* ALKF logo small in title block */}
                        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,paddingBottom:6,borderBottom:'1px solid #F3F4F6'}}>
                            <img src="/logo.png" alt="ALKF" style={{height:16,width:'auto',objectFit:'contain',opacity:0.7}} />
                            <span style={{fontSize:10,color:'#9CA3AF',fontWeight:600,letterSpacing:'0.06em',textTransform:'uppercase'}}>Master Land Plan</span>
                        </div>
                        {titleLine && (
                            <div style={{fontSize:12,fontWeight:700,color:'#92400E',marginBottom:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                                {titleLine}
                            </div>
                        )}
                        {metaLines.length > 0 && (
                            <div style={{fontSize:10,color:'#6B7280',lineHeight:1.8}}>
                                {metaLines.map((line, i) => (
                                    <div key={i} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{line}</div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
