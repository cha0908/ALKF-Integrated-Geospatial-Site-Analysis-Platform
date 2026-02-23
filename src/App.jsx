import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Platform from './pages/Platform'
import InteractiveMaps from './pages/InteractiveMaps'
import Architecture from './pages/Architecture'
import About from './pages/About'
import RequestAPI from './pages/RequestAPI'

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F1F5FB]">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/platform" element={<Platform />} />
                    <Route path="/maps" element={<InteractiveMaps />} />
                    <Route path="/architecture" element={<Architecture />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/request-api" element={<RequestAPI />} />
                </Routes>
            </main>
           
        </div>
    )
}

export default App
