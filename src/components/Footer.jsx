import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-[#0F172A] text-white">
            <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-10">
                {/* Brand */}
                <div className="flex flex-col gap-3 max-w-xs">
                    <div className="flex items-center gap-2">
                        
                        <span className="font-bold text-white text-base">ALKF</span>
                    </div>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">
                        Enterprise Urban Intelligence Engine<br />for Advanced Spatial Analytics
                    </p>
                </div>

                {/* Platform */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">Platform</h4>
                    <Link to="/maps" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Interactive Maps</Link>
                    <Link to="/architecture" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Architecture</Link>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">Company</h4>
                    <Link to="/about" className="text-sm text-[#94A3B8] hover:text-white transition-colors">About</Link>
                    <Link to="/request-api" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Request API</Link>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-[#64748B]">Contact</h4>
                    <a href="mailto:info@alkf.io" className="text-sm text-[#94A3B8] hover:text-white transition-colors">info@alkf.io</a>
                </div>
            </div>

            <div className="border-t border-[#1E293B]">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <p className="text-xs text-[#475569]">© 2026 ALKF. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
