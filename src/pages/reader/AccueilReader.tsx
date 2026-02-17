import React, { useEffect } from 'react';
import { useReader, LessonWithProgress } from '../../hooks/useReader';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/BottomNav';
import './AccueilReader.css';

const AccueilReader: React.FC = () => {
    const { volumes, recentLesson: rawRecentLesson, loading, error, fetchVolumes, fetchRecentProgress } = useReader();
    const { user, profile } = useAuth();
    const navigate = useNavigate();

    // Use type assertion here if useReader cannot easily return the exact intersected type
    const recentLesson = rawRecentLesson as LessonWithProgress | null;

    useEffect(() => {
        if (user) {
            fetchVolumes();
            // Assuming this function exists in useReader to refresh progress
            // fetchRecentProgress(); 
        }
    }, [user]);

    if (loading) {
        return (
            <div className="bg-background-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background-dark min-h-screen flex items-center justify-center text-white">
                <div className="text-center p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                    <p className="text-red-400 font-bold mb-2">Une erreur est survenue</p>
                    <p className="text-sm opacity-80">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-bold transition-colors">
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bonjour';
        if (hour < 18) return 'Bon après-midi';
        return 'Bonsoir';
    };

    return (
        <div className="bg-background-dark min-h-screen flex flex-col font-display antialiased selection:bg-primary/30 pb-20 md:pb-0">
            {/* Desktop Sidebar Navigation (Hidden on Mobile) */}
            <div className="flex flex-1 min-h-0">
                <aside className="hidden md:flex flex-col items-center w-20 lg:w-64 shrink-0 border-r border-white/5 bg-[#0a1113] h-screen sticky top-0 py-8 gap-2">
                    <div className="mb-8 flex items-center justify-center lg:justify-start lg:px-6 w-full cursor-pointer">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_library</span>
                        <span className="hidden lg:block ml-3 text-white font-bold text-lg tracking-tight">Oikos</span>
                    </div>

                    <nav className="flex-1 flex flex-col gap-1 w-full px-3">
                        <a href="#" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                            <span className="hidden lg:block text-sm font-bold">Accueil</span>
                        </a>
                        <a href="/reader/current" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">local_library</span>
                            <span className="hidden lg:block text-sm font-medium">Mes Manuels</span>
                        </a>
                        <a href="/search" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">search</span>
                            <span className="hidden lg:block text-sm font-medium">Rechercher</span>
                        </a>
                        <a href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">settings</span>
                            <span className="hidden lg:block text-sm font-medium">Paramètres</span>
                        </a>
                    </nav>

                    <div className="w-full px-4 mt-auto">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-blue-600/10 border border-primary/20">
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-1">Abonnement</p>
                            <p className="text-xs text-white font-medium mb-3">Premium Actif</p>
                            <div className="h-1 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-primary rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto w-full md:px-8 md:py-8">
                    <div className="max-w-5xl mx-auto w-full px-4 md:px-0 pt-6 md:pt-0">
                        {/* Header */}
                        <header className="mb-8 md:mb-10 flex justify-between items-end">
                            <div>
                                <p className="text-primary font-bold text-xs md:text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    {getGreeting()}, {profile?.first_name || 'Lecteur'}
                                </p>
                                <h1 className="text-3xl md:text-4xl font-serif font-extrabold text-white leading-tight">
                                    Prêt à continuer <br /> votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">apprentissage</span> ?
                                </h1>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-12 h-12 rounded-full border border-white/10 bg-slate-800 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                    <span className="material-symbols-outlined text-white">notifications</span>
                                </div>
                            </div>
                        </header>

                        {/* Continue Reading Section */}
                        {recentLesson && (
                            <section className="mb-12 animate-fade-in-up">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Reprendre la lecture</h2>
                                    <button
                                        onClick={() => navigate('/reader/current')}
                                        className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                                    >
                                        Voir tout
                                    </button>
                                </div>

                                <div
                                    onClick={() => navigate(`/reader/lesson/${recentLesson.lesson_id}`)}
                                    className="relative group cursor-pointer w-full bg-[#111e21] border border-white/5 hover:border-primary/30 rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col sm:flex-row gap-6 items-center sm:items-stretch"
                                >
                                    {/* Cover Image */}
                                    <div className="shrink-0 w-32 sm:w-40 aspect-[2/3] rounded-lg overflow-hidden shadow-lg relative">
                                        {recentLesson.series?.volumes?.cover_url ? (
                                            <img
                                                src={recentLesson.series.volumes.cover_url}
                                                alt="Cover"
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-4xl text-slate-600">book</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-center text-center sm:text-left w-full">
                                        <div className="mb-1">
                                            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary mb-2">
                                                En cours
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                                {recentLesson.series?.volumes?.title || "Titre du manuel"}
                                            </h3>
                                            <p className="text-slate-400 text-sm md:text-base mb-4 font-medium">
                                                {recentLesson.title || `Leçon ${recentLesson.number}`}
                                            </p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full max-w-md bg-slate-800/50 rounded-full h-2 mb-4 overflow-hidden backdrop-blur-sm mx-auto sm:mx-0">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(25,195,230,0.5)]"
                                                style={{ width: `${recentLesson.progress?.scroll_percentage || 0}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            <span>
                                                {recentLesson.progress?.scroll_percentage || 0}% Complété
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                            <span>
                                                {recentLesson.duration || "15 min"} restants
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="hidden sm:flex items-center px-4">
                                        <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-300 shadow-lg group-hover:shadow-primary/50 group-hover:scale-110">
                                            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Library Grid */}
                        <section className="mb-24">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Ma Bibliothèque</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {volumes.map((volume) => (
                                    <div
                                        key={volume.id}
                                        onClick={() => navigate(`/reader/volume/${volume.id}`)}
                                        className="group cursor-pointer flex flex-col gap-3"
                                    >
                                        <div className="aspect-[2/3] w-full rounded-xl overflow-hidden shadow-lg border border-white/5 relative bg-slate-800">
                                            {volume.cover_url ? (
                                                <img
                                                    src={volume.cover_url}
                                                    alt={volume.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <span className="material-symbols-outlined text-4xl">book</span>
                                                </div>
                                            )}
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-wider transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                    Lire
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-serif font-bold text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {volume.title}
                                            </h3>
                                            {/* @ts-ignore */}
                                            {volume.author && <p className="text-slate-500 text-xs font-medium mt-1">{volume.author}</p>}
                                        </div>
                                    </div>
                                ))}

                                {/* Add New Card (Admin/Placeholder) */}
                                {role === 'admin' && (
                                    <div
                                        onClick={() => navigate('/admin/volumes/create')}
                                        className="aspect-[2/3] w-full rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/5 group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary">add</span>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-primary transition-colors">Ajouter</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
};

export default AccueilReader;
