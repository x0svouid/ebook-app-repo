import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BottomNav } from '../../components/BottomNav';
import { useReader, LessonWithProgress } from '../../hooks/useReader';

import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { volumes, recentLesson: rawRecentLesson, loading } = useReader();
    const recentLesson = rawRecentLesson as LessonWithProgress | null;


    const firstName = user?.user_metadata?.full_name
        ? user.user_metadata.full_name.split(' ')[0]
        : "Directeur";

    return (
        <div className="bg-background-dark text-slate-100 font-display min-h-screen">
            <div className="max-w-md mx-auto min-h-screen bg-background-dark pb-32 relative overflow-x-hidden">
                <header className="px-6 pt-12 pb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80 mb-1">Espace Admin</h2>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                            Bonjour, <span className="text-primary">{firstName}</span>
                        </h1>
                    </div>
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-surface-dark to-neutral-dark border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
                            <span className="material-symbols-outlined text-slate-300">manage_accounts</span>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background-dark rounded-full"></div>
                    </div>
                </header>

                {/* Continue Learning Section */}
                {recentLesson && (
                    <section className="px-6 mb-8">
                        <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-4 ml-1">
                            Continuer l'apprentissage
                        </h3>
                        <div className="bg-surface-dark border border-white/5 p-4 rounded-2xl relative overflow-hidden group shadow-lg">
                            <div className="flex gap-4 relative z-10 items-center">
                                <div className="w-20 h-28 shrink-0 relative book-shadow rounded-sm overflow-hidden transform rotate-[-2deg] ml-1 bg-slate-800">
                                    {recentLesson.series?.volumes?.cover_url ? (
                                        <img
                                            src={recentLesson.series.volumes.cover_url}
                                            alt={recentLesson.series.title}
                                            className="w-full h-full object-cover opacity-80"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center p-2 text-center border-l-2 border-white/10">
                                            <div className="w-full h-full bg-slate-900 absolute inset-0 opacity-50"></div>
                                            <span className="relative z-10 text-[6px] text-primary/80 uppercase tracking-widest mb-1">Leçon</span>
                                            <h5 className="relative z-10 text-white font-serif font-bold text-[10px] leading-tight mb-2 line-clamp-3">{recentLesson.title}</h5>
                                            <div className="relative z-10 w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[8px] text-white">menu_book</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1 gap-3">
                                    <div>
                                        <h4 className="text-white font-serif font-bold text-lg leading-tight mb-1 line-clamp-1">{recentLesson.series?.title || 'Série inconnue'}</h4>
                                        <p className="text-slate-400 text-xs font-medium line-clamp-1">Leçon {recentLesson.number} : {recentLesson.title}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex justify-between mb-1.5">
                                                <span className="text-[10px] text-slate-400">Progression</span>
                                                <span className="text-[10px] text-primary font-bold">{recentLesson.progress?.scroll_percentage || 0}%</span>
                                            </div>
                                            <div className="w-full bg-slate-700/30 rounded-full h-1">
                                                <div
                                                    className="bg-primary h-full rounded-full shadow-[0_0_10px_rgba(25,195,230,0.4)]"
                                                    style={{ width: `${recentLesson.progress?.scroll_percentage || 0}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/reader/lesson/${recentLesson.id}`)}
                                            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-background-dark shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-transform"
                                        >
                                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="px-6 mb-8">
                    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-4 ml-1">
                        Actions Rapides
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => navigate('/admin/volumes/new')}
                            className="bg-gradient-to-br from-primary to-cyan-700 p-6 rounded-2xl text-left relative overflow-hidden group active:scale-[0.98] transition-all h-40 flex flex-col justify-between shadow-lg shadow-primary/20"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-900/30 rounded-full -ml-10 -mb-10 blur-xl"></div>
                            <div className="flex justify-between items-start z-10">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                                </div>
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">Prioritaire</span>
                            </div>
                            <div className="z-10">
                                <h4 className="text-white font-bold text-xl leading-tight mb-1">Nouveau Manuel</h4>
                                <p className="text-cyan-100 text-xs font-medium opacity-90">Créer un manuel pour les GF</p>
                            </div>
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/admin/scan')}
                                className="bg-surface-dark border border-white/5 p-4 rounded-2xl text-left relative overflow-hidden group active:scale-[0.98] transition-all h-36 flex flex-col justify-between hover:border-primary/30"
                            >
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-4 -mb-4 blur-xl group-hover:bg-primary/10 transition-colors"></div>
                                <div className="w-9 h-9 bg-neutral-dark rounded-xl flex items-center justify-center text-primary mb-2">
                                    <span className="material-symbols-outlined text-[20px]">center_focus_weak</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-base leading-tight">Reprendre<br />le Scan</h4>
                                    <p className="text-slate-500 text-[10px] font-medium mt-1">Maths Tle</p>
                                </div>
                            </button>
                            <button
                                onClick={() => navigate('/reader/current')}
                                className="bg-surface-dark border border-white/5 p-4 rounded-2xl text-left relative overflow-hidden group active:scale-[0.98] transition-all h-36 flex flex-col justify-between hover:border-cyan-500/30"
                            >
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-full -mr-4 -mb-4 blur-xl group-hover:bg-cyan-500/10 transition-colors"></div>
                                <div className="w-9 h-9 bg-neutral-dark rounded-xl flex items-center justify-center text-cyan-500 mb-2">
                                    <span className="material-symbols-outlined text-[20px]">edit_document</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-base leading-tight">Modifier un<br />Manuel de GF</h4>
                                    <p className="text-slate-500 text-[10px] font-medium mt-1">Gestion des GF</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </section>

                <section className="px-6 pb-6">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Collection</h3>
                        <Link to="/reader/current" className="text-primary text-[11px] font-bold hover:text-primary/80 transition-colors">Voir tout</Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : volumes.length === 0 ? (
                        <p className="text-slate-400 text-sm text-center py-8">Aucun volume dans la collection.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                            {volumes.slice(0, 4).map((volume) => (
                                <div key={volume.id} className="group flex flex-col gap-3 cursor-pointer" onClick={() => navigate(`/reader/volume/${volume.id}`)}>
                                    <div className="relative w-full aspect-[2/3] rounded-sm book-shadow overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 bg-slate-800">
                                        {volume.cover_url ? (
                                            <img
                                                src={volume.cover_url}
                                                alt={volume.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-[#0f172a] flex flex-col">
                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent"></div>
                                                <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
                                                    <span className="material-symbols-outlined text-cyan-400/80 text-4xl mb-4 font-thin">menu_book</span>
                                                    <h3 className="text-white font-serif font-bold text-sm text-center leading-tight mb-1 tracking-wide line-clamp-3">{volume.title}</h3>
                                                </div>
                                                <div className="h-1 bg-gradient-to-r from-cyan-600 to-blue-600"></div>
                                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-r from-white/10 to-transparent"></div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-1">
                                        <h4 className="text-white font-serif font-bold text-sm leading-tight mb-1 line-clamp-1">{volume.title}</h4>
                                        <p className="text-slate-500 text-[11px] font-medium">Oikos Premium</p>
                                    </div>
                                </div>
                            ))}

                            {/* "Add New" placeholder - keep consistent with existing design but make it functional if needed */}
                            <div className="group flex flex-col gap-3">
                                <div
                                    onClick={() => navigate('/admin/volumes/new')} // Assuming route exists or placeholder
                                    className="relative w-full aspect-[2/3] rounded-sm border border-dashed border-slate-700 bg-surface-dark flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer group-hover:bg-slate-800/50"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">add</span>
                                    </div>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wide group-hover:text-primary transition-colors">Ajouter</span>
                                </div>
                                <div className="px-1 opacity-50">
                                    <h4 className="text-slate-400 font-serif font-bold text-sm leading-tight mb-1">Nouvel Ouvrage</h4>
                                    <p className="text-slate-600 text-[11px] font-medium">--</p>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <div className="fixed -top-32 -right-32 w-96 h-96 bg-primary/10 blur-[100px] pointer-events-none mix-blend-screen"></div>
                <div className="fixed top-1/2 -left-32 w-80 h-80 bg-primary/5 blur-[80px] pointer-events-none mix-blend-screen"></div>

                <BottomNav />
            </div>
        </div>
    );
};

export default AdminDashboard;
