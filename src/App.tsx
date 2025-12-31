import { useTheme } from './context/ThemeContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SettingsPage } from './pages/SettingsPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { CategoriesPage } from './pages/CategoriesPage';
import AllServicesPage from './pages/AllServicesPage';
import VideosPage from './pages/VideosPage';
import MusicPage from './pages/MusicPage';
import GamesPage from './pages/GamesPage';
import ChargingPage from './pages/ChargingPage';
import OtherServicesPage from './pages/OtherServicesPage';

export default function App() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen px-4 py-6 md:px-8 md:py-10">
            <div className="mx-auto w-full max-w-6xl space-y-10">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/videos" element={<VideosPage />} />
                <Route path="/music" element={<MusicPage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/charging" element={<ChargingPage />} />
                <Route path="/other-services" element={<OtherServicesPage />} />
                <Route path="/all-services" element={<AllServicesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
