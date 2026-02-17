import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useReader, LessonWithProgress } from '../../hooks/useReader';
import { useAuth } from '../../context/AuthContext';
import { BottomNav } from '../../components/BottomNav';

const AccueilReader: React.FC = () => {
    const navigate = useNavigate();
    const { volumes, recentLesson: rawRecentLesson, loading, error } = useReader();
    const { user } = useAuth();
    const recentLesson = rawRecentLesson as LessonWithProgress | null;

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 text-center">
                <div>
                    <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
                    <h2 className="text-xl font-bold text-white mb-2">Erreur de chargement</h2>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-primary text-background-dark px-6 py-2 rounded-xl font-bold"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background-dark min-h-screen text-slate-100 font-display pb-32">
            {/* Header section with glassmorphism */}
            <div className="relative pt-12 px-6 pb-8 overflow-hidden">
                {/* Glow effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[0%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[60px]"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">Bonjour encore</p>
                        <div
                            onClick={() => navigate('/profile')}
                            className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-slate-300">person</span>
                            )}
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
                        Quel livre lirez-vous <span className="text-primary italic">aujourd'hui ?</span>
                    </h1>
                </div>
            </div>

            {/* Current Reading Progress card */}
            {recentLesson && (
                <div className="px-6 mb-10">
                    <div
                        onClick={() => navigate(`/reader/lesson/${recentLesson.id}`)}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden group cursor-pointer shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors"></div>

                        <div className="flex gap-5">
                            <div className="relative shrink-0">
                                <img
                                    src={recentLesson.series?.volumes?.cover_url || 'https://via.placeholder.com/100x150'}
                                    alt="Current book"
                                    className="w-20 h-28 object-cover rounded-xl shadow-lg transform group-hover:translate-z-10 transition-transform duration-500"
                                />
                                <div className="absolute -bottom-2 -right-2 h-8 w-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                    <span className="material-symbols-outlined text-background-dark text-lg">play_arrow</span>
                                </div>
                            </div>
                            <div className="flex-1 py-1">
                                <h3 className="text-primary font-bold text-xs uppercase tracking-widest mb-1">{recentLesson.series?.title || 'Lecture en cours'}</h3>
                                <h2 className="text-white font-bold text-lg mb-4 line-clamp-1">{recentLesson.title}</h2>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        <span>Correction</span>
                                        <span>{recentLesson.progress?.scroll_percentage || 0}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${recentLesson.progress?.scroll_percentage || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Book Collection Grid */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Ma collection</h2>
                    <Link to="/search" className="text-primary text-xs font-bold flex items-center gap-1">
                        Voir tout <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                    {volumes.map((volume) => (
                        <div
                            key={volume.id}
                            onClick={() => navigate(`/reader/volume/${volume.id}`)}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[2/3] mb-3 overflow-hidden rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.03]">
                                <img
                                    src={volume.cover_url || 'https://via.placeholder.com/200x300'}
                                    alt={volume.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 transition-colors group-hover:text-primary">{volume.title}</h3>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-1">{volume.author}</p>
                        </div>
                    ))}

                    {volumes.length === 0 && (
                        <div className="col-span-2 py-10 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-slate-500 text-sm">Aucun manuel dans votre collection</p>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default AccueilReader;
