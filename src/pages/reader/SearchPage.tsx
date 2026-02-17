import React from 'react';
import { BottomNav } from '../../components/BottomNav';
import './SearchPage.css';

const SearchPage: React.FC = () => {
    return (
        <div className="dark bg-background-dark font-display text-slate-200 antialiased min-h-screen flex selection:bg-primary/30">
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
                    <a href="/search" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
                        <span className="hidden lg:block text-sm font-bold">Rechercher</span>
                    </a>
                    <a href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">settings</span>
                        <span className="hidden lg:block text-sm font-medium">Paramètres</span>
                    </a>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-h-screen">
                <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-12 pt-12 md:pt-10 pb-32 md:pb-12 overflow-y-auto no-scrollbar md:max-w-3xl md:mx-auto md:w-full">
                    <header className="mb-8 sm:mb-10">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-5 sm:mb-6 font-serif">Recherche</h1>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-primary text-xl sm:text-2xl">search</span>
                            </div>
                            <input
                                className="w-full glass-search rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 shadow-xl bg-transparent text-sm sm:text-base"
                                placeholder="Titres, auteurs, leçons..."
                                type="text"
                            />
                        </div>
                    </header>

                    <section className="mb-8 sm:mb-10">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h2 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Recherches récentes</h2>
                            <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-70 transition-opacity">Effacer</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-search border border-white/5 text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                                <span>Éthique</span>
                                <span className="material-symbols-outlined text-xs sm:text-sm text-slate-500">close</span>
                            </div>
                            <div className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full glass-search border border-white/5 text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-2 hover:bg-white/10 transition-colors cursor-pointer">
                                <span>Physique</span>
                                <span className="material-symbols-outlined text-xs sm:text-sm text-slate-500">close</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 sm:mb-6">Suggéré pour vous</h2>
                        <div className="space-y-5 sm:space-y-6">
                            <div className="flex gap-4 sm:gap-5 group cursor-pointer">
                                <div className="shrink-0 w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-[1.03] transition-transform duration-300">
                                    <img
                                        alt="Histoire Moderne"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2metKRh07YxA01vMGVpt_yK43uVCbcCbMnXvWoLM9deZPD6deYvn8sVhqsWN5s_cbz0Drlj4-SWQVouInqV1YBR79sgE8Th4RjQXW9HhBjNW-zfiQ5yhXUE6XmYL8Ai-vBu3-E6tYRbH_pBWSjsdSLMntmSPGOTTOmK3S5Nacq1G3tdAVXMns_XnFEHOONibYUI0ihov9vpdoTjHtMpZaG6WGWYypRlIcaaXMUjMgSN0SY0EYaMp5mocuqzBYfbpyYWYDWghuQaU"
                                    />
                                </div>
                                <div className="flex flex-col justify-center border-b border-white/5 flex-1 pb-4">
                                    <h3 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-primary transition-colors">Histoire Moderne</h3>
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">Jules Michelet</p>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-3">
                                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Manuel</span>
                                        <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider font-semibold">12 Chapitres</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-5 group cursor-pointer">
                                <div className="shrink-0 w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-[1.03] transition-transform duration-300">
                                    <img
                                        alt="Philosophie"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCllX4yS-lEyrh48rdYmXSnuhhsStKsMFT77ZzJOBbPDmu4RkTUD1CtQaBNerFI0qGkg4M4SkAVPKnIO73uTc_7kKlxOgkw7oQXpCpYBrnst9H3lmYq7QQBG6NwD4r4T59KK5DkATf4irN_7TUapS968o8Q2DJx7_luJLdRtd7u19lag0i6brNccKmRYGfBju1CJOYZGF7yHCuVf9YOzMo1Zh4gmGNR7UA6sUd0weXk0mgZA8oHiwDLm87R9IPUD8R0eJAwaxBrlWo"
                                    />
                                </div>
                                <div className="flex flex-col justify-center border-b border-white/5 flex-1 pb-4">
                                    <h3 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-primary transition-colors">Philosophie &amp; Éthique</h3>
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">Collection GF</p>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-3">
                                        <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">En Cours</span>
                                        <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider font-semibold">45% Terminé</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 sm:gap-5 group cursor-pointer">
                                <div className="shrink-0 w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-[1.03] transition-transform duration-300">
                                    <img
                                        alt="Physique"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjq707MfHl0UlwFmhMrmcxanc4aWQkmCnmuE38JF9t9sQmxJamyz4pLTJhCf0gXQUG0ogoNAXjs8UcNbNgmJxXLySyCtT7heuNf0U9l5JkudFRx4xhPuwzykkIENsATSO7N0hIAHUK1laky8U3NeGRM6la2gQDDguDu2qt58WFUr7H_aY6Qr9v4RFFsvMUqcttsWleQk86cz9hQPdt-Ft2GoJ2yNcGdIAEz0yfBIK42XHaS2fnZzDc1x-6lMRkvHfMzhFSx3glZCE"
                                    />
                                </div>
                                <div className="flex flex-col justify-center border-b border-white/5 flex-1 pb-4">
                                    <h3 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-primary transition-colors">Physique Quantique</h3>
                                    <p className="text-[10px] sm:text-xs text-slate-500 font-medium tracking-wide uppercase mt-1">E. Schrödinger</p>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-3">
                                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Avancé</span>
                                        <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Scientifique</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <BottomNav />
        </div>
    );
};

export default SearchPage;
