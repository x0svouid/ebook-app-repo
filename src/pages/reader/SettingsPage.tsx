import React from 'react';
import { BottomNav } from '../../components/BottomNav';
import './SettingsPage.css';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // Derived user data
    const fullName = user?.user_metadata?.full_name || 'Utilisateur';
    const email = user?.email || 'email@exemple.com';
    const avatarUrl = user?.user_metadata?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuC69VVvUeImOIpTQM9AjXY9JzE2hWUbL-5rqX5x_jGQDopNphQ2-UCzNhzPrBPaxhOny0Eb9DHG4EofYBH84fUx9-IRTIKboMz2Gxmxed5ZW87YnCcudXDMtKKFTNi9kImIgwvVcTusKpzgD1W2B78aVhj6_kSLDqoDExpnR0Je2dgO5gd8101s8b-v3Ho-fUofgulh5BDmub7vRaiv3OAruE08y5_2S1Y08-3gt06PBbelB0stmVxC-dPzE2mnhyK4643obtrDVmE";

    return (
        <div className="dark bg-background-dark font-display text-slate-200 antialiased min-h-screen flex selection:bg-primary/30">
            {/* Desktop Sidebar Navigation */}
            <aside className="hidden md:flex flex-col items-center w-20 lg:w-64 shrink-0 border-r border-white/5 bg-[#0a1113] sticky top-0 h-screen py-8 gap-2">
                <div className="mb-8 flex items-center justify-center lg:justify-start lg:px-6 w-full">
                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_library</span>
                    <span className="hidden lg:block ml-3 text-white font-bold text-lg tracking-tight">Oikos</span>
                </div>
                <nav className="flex-1 flex flex-col gap-1 w-full px-3">
                    <a href="/reader" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">home</span>
                        <span className="hidden lg:block text-sm font-medium">Accueil</span>
                    </a>
                    <a href="/reader/current" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">local_library</span>
                        <span className="hidden lg:block text-sm font-medium">Mes Manuels</span>
                    </a>
                    <a href="/search" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">search</span>
                        <span className="hidden lg:block text-sm font-medium">Rechercher</span>
                    </a>
                    <a href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
                        <span className="hidden lg:block text-sm font-bold">Paramètres</span>
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 pt-10 md:pt-10 pb-32 md:pb-12 overflow-y-auto no-scrollbar md:max-w-2xl md:mx-auto md:w-full">
                    {/* Header */}
                    <header className="mb-8">
                        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide mb-6 sm:mb-8">Paramètres</h1>

                        {/* Profile Card */}
                        <div className="flex flex-col items-center text-center p-5 sm:p-6 settings-surface rounded-2xl shadow-lg">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-cyan-400 shadow-[0_0_15px_rgba(25,195,230,0.3)]">
                                    <img
                                        alt="Photo de profil"
                                        className="w-full h-full rounded-full object-cover border-4 border-background-dark"
                                        src={avatarUrl}
                                    />
                                </div>
                                <button className="absolute bottom-0 right-0 bg-background-dark p-1.5 sm:p-2 rounded-full border border-white/10 shadow-md text-primary hover:bg-white/10 transition-colors">
                                    <span className="material-symbols-outlined text-sm sm:text-lg leading-none">edit</span>
                                </button>
                            </div>
                            <h2 className="font-serif font-semibold text-xl sm:text-2xl text-white mb-0.5">{fullName}</h2>
                            <p className="text-xs sm:text-sm text-slate-500 font-light tracking-wide">{email}</p>
                            <div className="flex gap-3 sm:gap-4 mt-5 sm:mt-6 w-full">
                                <div className="flex-1 bg-background-dark/50 rounded-xl p-3 settings-surface-inner">
                                    <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Niveau</p>
                                    <p className="text-primary font-bold text-base sm:text-lg">Expert</p>
                                </div>
                                <div className="flex-1 bg-background-dark/50 rounded-xl p-3 settings-surface-inner">
                                    <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-1 font-bold">Statut</p>
                                    <p className="text-white font-bold text-base sm:text-lg">Actif</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Settings Sections */}
                    <div className="space-y-7 sm:space-y-8">
                        {/* Reading Preferences */}
                        <section>
                            <h3 className="font-serif text-base sm:text-lg text-white mb-3 sm:mb-4 ml-1 flex items-center gap-3">
                                <span className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(25,195,230,0.6)]"></span>
                                Préférences de Lecture
                            </h3>
                            <div className="settings-surface rounded-2xl overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-white/5 group-hover:border-primary/30 transition-colors">
                                            <span className="material-symbols-outlined text-xl">text_fields</span>
                                        </div>
                                        <span className="font-medium text-slate-200 text-sm sm:text-base">Police par défaut</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-white transition-colors">
                                        <span className="text-xs sm:text-sm font-serif italic">Playfair Display</span>
                                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3.5 sm:p-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-white/5">
                                            <span className="material-symbols-outlined text-xl">dark_mode</span>
                                        </div>
                                        <span className="font-medium text-slate-200 text-sm sm:text-base">Mode Sombre</span>
                                    </div>
                                    <button className="w-11 sm:w-12 h-6 sm:h-7 bg-primary rounded-full relative p-1 flex items-center justify-end transition-colors shadow-[0_0_10px_rgba(25,195,230,0.4)]">
                                        <div className="bg-white w-4 sm:w-5 h-4 sm:h-5 rounded-full shadow-sm"></div>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Storage & Sync */}
                        <section>
                            <h3 className="font-serif text-base sm:text-lg text-white mb-3 sm:mb-4 ml-1 flex items-center gap-3">
                                <span className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(25,195,230,0.6)]"></span>
                                Stockage &amp; Synchro
                            </h3>
                            {/* Cloud storage */}
                            <div className="settings-surface rounded-2xl p-4 sm:p-5 shadow-sm mb-3 sm:mb-4">
                                <div className="flex justify-between items-center mb-3 sm:mb-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-white/5">
                                            <span className="material-symbols-outlined text-xl">cloud_queue</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-slate-200 block text-sm sm:text-base">Stockage Cloud</span>
                                            <span className="text-[10px] sm:text-xs text-slate-500">Utilisé: 1.2 GB / 5.0 GB</span>
                                        </div>
                                    </div>
                                    <button className="text-[10px] sm:text-xs font-bold text-primary px-2.5 sm:px-3 py-1 sm:py-1.5 bg-primary/10 rounded-lg hover:bg-primary/20 border border-primary/20 transition-colors">Gérer</button>
                                </div>
                                <div className="w-full bg-background-dark rounded-full h-1.5 sm:h-2 overflow-hidden flex shadow-inner">
                                    <div className="h-full bg-primary w-[24%] rounded-l-full shadow-[0_0_10px_rgba(25,195,230,0.5)]"></div>
                                    <div className="h-full bg-primary/30 w-[10%]"></div>
                                </div>
                            </div>
                            {/* Sync */}
                            <div className="settings-surface rounded-2xl overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-white/5">
                                            <span className="material-symbols-outlined text-xl">sync</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-200 text-sm">Synchro Appareils</p>
                                            <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Dernière synchro : il y a 2 min</p>
                                        </div>
                                    </div>
                                    <button className="w-11 sm:w-12 h-6 sm:h-7 bg-background-dark border border-white/10 rounded-full relative p-1 flex items-center justify-start transition-colors">
                                        <div className="bg-slate-500 w-4 sm:w-5 h-4 sm:h-5 rounded-full shadow-sm"></div>
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Account */}
                        <section>
                            <h3 className="font-serif text-base sm:text-lg text-white mb-3 sm:mb-4 ml-1 flex items-center gap-3">
                                <span className="w-1.5 h-4 bg-primary rounded-full shadow-[0_0_8px_rgba(25,195,230,0.6)]"></span>
                                Compte
                            </h3>
                            <div className="settings-surface rounded-2xl overflow-hidden shadow-sm">
                                <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-white/5 group-hover:border-primary/30 transition-colors">
                                            <span className="material-symbols-outlined text-xl">lock</span>
                                        </div>
                                        <span className="font-medium text-slate-200 text-sm sm:text-base">Confidentialité</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-500 text-sm group-hover:text-white transition-colors">chevron_right</span>
                                </div>
                                <div className="flex items-center justify-between p-3.5 sm:p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-background-dark flex items-center justify-center text-primary border border-white/5 group-hover:border-primary/30 transition-colors">
                                            <span className="material-symbols-outlined text-xl">notifications</span>
                                        </div>
                                        <span className="font-medium text-slate-200 text-sm sm:text-base">Notifications</span>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-500 text-sm group-hover:text-white transition-colors">chevron_right</span>
                                </div>
                            </div>
                        </section>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full mt-2 sm:mt-4 bg-red-500/5 text-red-400 font-medium py-3.5 sm:py-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30 text-sm sm:text-base">
                            <span className="material-symbols-outlined text-lg sm:text-xl">logout</span>
                            Déconnexion
                        </button>

                        {/* Footer */}
                        <div className="text-center pb-6 sm:pb-8 space-y-1">
                            <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">GF Manuel v2.4.0</p>
                            <p className="text-[10px] text-slate-600">© 2024 Alex Sterling. Tous droits réservés.</p>
                        </div>
                    </div>
                </main>
            </div>

            <BottomNav />
        </div>
    );
};

export default SettingsPage;
