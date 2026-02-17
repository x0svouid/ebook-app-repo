import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
    const { role } = useAuth();
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 bg-transparent pointer-events-none">
            <div className="max-w-md mx-auto h-[68px] glass-nav rounded-2xl flex items-center justify-around px-2 py-1 pointer-events-auto border border-white/5 shadow-2xl shadow-black/40">
                <Link to="/reader" className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${location.pathname === '/reader' ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/reader' ? "'FILL' 1" : "" }}>home</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Accueil</span>
                </Link>
                <Link to="/reader/current" className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${location.pathname === '/reader/current' || location.pathname.includes('/reader/volume') ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname.includes('/reader/volume') ? "'FILL' 1" : "" }}>local_library</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Manuels</span>
                </Link>
                <Link to="/search" className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${location.pathname === '/search' ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/search' ? "'FILL' 1" : "" }}>search</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Chercher</span>
                </Link>

                {role === 'admin' && (
                    <Link to="/admin" className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${location.pathname.startsWith('/admin') ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}>
                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname.startsWith('/admin') ? "'FILL' 1" : "" }}>admin_panel_settings</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Admin</span>
                    </Link>
                )}

                <Link to="/settings" className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${location.pathname === '/settings' ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: location.pathname === '/settings' ? "'FILL' 1" : "" }}>person</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Profil</span>
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;
