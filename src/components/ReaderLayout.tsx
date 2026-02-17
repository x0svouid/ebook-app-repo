import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Search, Settings } from 'lucide-react';
import BottomNav from './BottomNav';

interface ReaderLayoutProps {
    children: React.ReactNode;
}

const ReaderLayout: React.FC<ReaderLayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const desktopNavItems = [
        { icon: Home, label: 'Tableau de Bord', path: '/reader' },
        { icon: BookOpen, label: 'Ma Bibliothèque', path: '/reader/lectures' },
        { icon: Search, label: 'Recherche', path: '/search' },
        { icon: Settings, label: 'Paramètres', path: '/settings' },
    ];

    const isActive = (path: string) => {
        if (path === '/reader' && (location.pathname === '/reader' || location.pathname === '/reader/current')) return true;
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-[#111e21] flex">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 h-screen flex-col bg-[#111e21] border-r border-white/5 sticky top-0 p-8">
                <div className="flex items-center gap-3 mb-12">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <BookOpen size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Oikos Reader</span>
                </div>

                <nav className="flex-1 flex flex-col gap-2">
                    {desktopNavItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={20} className={isActive(item.path) ? '' : 'group-hover:scale-110 transition-transform'} />
                            <span className="font-semibold">{item.label}</span>
                            {isActive(item.path) && (
                                <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(25,195,230,0.6)]" />
                            )}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative pb-24 lg:pb-0 min-h-screen">
                {children}

                {/* Mobile Navigation */}
                <BottomNav />
            </main>
        </div>
    );
};

export default ReaderLayout;
