import { Link, useLocation } from 'react-router-dom'

const links = [
    { path: '/',                 label: 'Home' },
    { path: '/maps',             label: 'Site Analysis' },
    { path: '/master-land-plan', label: 'Master Land Plan' },
    { path: '/architecture',     label: 'Architecture' },
    { path: '/about',            label: 'About' },
]

export default function Navbar() {
    const location = useLocation()
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#E2E8F0] shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                {/* Logo — fixed: was h-20 w-20 (80px) inside h-14 (56px) navbar */}
                <Link to="/" className="flex items-center">
                    <img
                        src="/logo3.PNG"
                        alt="ALKF+ Spatial Intelligence Platform"
                        className="h-10 w-10 object-cover rounded-full"
                    />
                </Link>

                {/* Nav links */}
                <nav className="hidden md:flex items-center gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                location.pathname === link.path
                                    ? 'text-[#2563EB] bg-[#EFF6FF]'
                                    : 'text-[#4B5563] hover:text-[#2563EB] hover:bg-[#F8FAFC]'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* CTA */}
                <Link
                    to="/request-api"
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-[0_2px_8px_rgba(37,99,235,0.25)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.35)] hover:-translate-y-px"
                >
                    Request API
                </Link>
            </div>
        </header>
    )
}
