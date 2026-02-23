import { Network, GitBranch, Star, BarChart2, ArrowRight } from 'lucide-react'

const stages = [
    {
        icon: <Network size={22} />,
        step: '01',
        title: 'Network Extraction',
        desc: 'Pull road and pedestrian graphs from OpenStreetMap using OSMnx. Produces a raw node-edge network for any geographic bounding box.',
        tags: ['OSMnx', 'OpenStreetMap', 'NetworkX'],
    },
    {
        icon: <GitBranch size={22} />,
        step: '02',
        title: 'Graph Modeling',
        desc: 'Transform raw networks into annotated weighted graphs. Compute centrality, connectivity metrics, and adjacency matrices.',
        tags: ['Betweenness', 'Pagerank', 'Dijkstra'],
    },
    {
        icon: <Star size={22} />,
        step: '03',
        title: 'Scoring Engine',
        desc: 'Apply multi-criteria scoring across walkability, transit access, noise pollution, and visual quality indices.',
        tags: ['Spatial Econometrics', 'Isochrones', 'Weights'],
    },
    {
        icon: <BarChart2 size={22} />,
        step: '04',
        title: 'Visualization Output',
        desc: 'Render choropleth layers, isochrone maps, and exportable GeoJSON reports for stakeholders.',
        tags: ['GeoJSON', 'Choropleth', 'PDF Export'],
    },
]

export default function Platform() {
    return (
        <div className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2563EB] mb-3">Platform</p>
                    <h1 className="text-4xl font-extrabold text-[#1E293B] tracking-tight mb-4">How It Works</h1>
                    <p className="text-[#4B5563] max-w-xl mx-auto">
                        A four-stage automated pipeline that transforms raw geographic data into actionable site intelligence.
                    </p>
                </div>

                {/* Pipeline stages */}
                <div className="flex flex-col items-center gap-0 max-w-3xl mx-auto">
                    {stages.map((s, i) => (
                        <div key={s.title} className="w-full flex flex-col items-center">
                            <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-7 flex gap-6">
                                {/* Step number + icon */}
                                <div className="flex flex-col items-center gap-2 min-w-[56px]">
                                    <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                                        {s.icon}
                                    </div>
                                    <span className="text-xs font-bold text-[#94A3B8]">{s.step}</span>
                                </div>
                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-[#1E293B] text-lg mb-2">{s.title}</h3>
                                    <p className="text-sm text-[#4B5563] leading-relaxed mb-4">{s.desc}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {s.tags.map((tag) => (
                                            <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Connector */}
                            {i < stages.length - 1 && (
                                <div className="h-8 border-l-2 border-dashed border-[#BFDBFE] self-center" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
