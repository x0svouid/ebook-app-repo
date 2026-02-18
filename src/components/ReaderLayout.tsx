import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

interface ReaderLayoutProps {
    children: React.ReactNode;
}

const ReaderLayout: React.FC<ReaderLayoutProps> = ({ children }) => {
    const location = useLocation();

    // Helper to determine active link style
    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        const baseClass = "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors";
        const activeClass = "bg-primary/10 text-primary border border-primary/20";
        const inactiveClass = "text-slate-400 hover:text-white hover:bg-white/5";

        return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
    };

    return (
        <div className="dark bg-background-dark font-display text-slate-200 antialiased min-h-screen flex selection:bg-primary/30">
            {/* Desktop Sidebar Navigation (hidden on mobile) */}
            <aside className="hidden md:flex flex-col items-center w-20 lg:w-64 shrink-0 border-r border-white/5 bg-background-dark sticky top-0 h-screen py-8 gap-2">
                <div className="mb-8 flex items-center justify-center lg:justify-start lg:px-6 w-full">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_library</span>
                    <span className="hidden lg:block ml-3 text-white font-bold text-lg tracking-tight">Oikos</span>
                </div>
                <nav className="flex-1 flex flex-col gap-1 w-full px-3">
                    <Link to="/reader" className={getLinkClass('/reader')}>
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                        <span className="hidden lg:block text-sm font-bold">Accueil</span>
                    </Link>
                    <Link to="/reader/lectures" className={getLinkClass('/reader/lectures')}>
                        <span className="material-symbols-outlined text-[22px]">local_library</span>
                        <span className="hidden lg:block text-sm font-medium">Mes Lectures</span>
                    </Link>
                    <Link to="/search" className={getLinkClass('/search')}>
                        <span className="material-symbols-outlined text-[22px]">search</span>
                        <span className="hidden lg:block text-sm font-medium">Rechercher</span>
                    </Link>
                    <Link to="/settings" className={getLinkClass('/settings')}>
                        <span className="material-symbols-outlined text-[22px]">settings</span>
                        <span className="hidden lg:block text-sm font-medium">Paramètres</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative">
                {/* Mobile status bar spacer */}
                <div className="h-12 w-full shrink-0 md:h-0"></div>

                <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 pb-32 md:pb-12 overflow-y-auto no-scrollbar md:max-w-5xl md:mx-auto md:w-full">
                    {children}
                </main>

                {/* Mobile Bottom Navigation */}
                <BottomNav />
            </div>
        </div>
    );
};

export default ReaderLayout;
