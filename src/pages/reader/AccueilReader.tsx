import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ReaderLayout from '../../components/ReaderLayout';
import './AccueilReader.css';
import { useReader, LessonWithProgress } from '../../hooks/useReader';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from '../admin/AdminDashboard';

const AccueilReader: React.FC = () => {
    // const navigate = useNavigate(); // Removed unused
    const { user, role } = useAuth(); // Get user and role from auth context
    const { volumes, recentLesson: rawRecentLesson, loading, error } = useReader();
    const recentLesson = rawRecentLesson as LessonWithProgress | null;
    const location = useLocation();

    // Only redirect to dashboard if on the root reader page
    if (role === 'admin' && location.pathname === '/reader') {
        return <AdminDashboard />;
    }

    // Get first name from metadata or default to "Ami"
    const firstName = user?.user_metadata?.full_name
        ? user.user_metadata.full_name.split(' ')[0]
        : "Ami";

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a1113] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a1113] flex items-center justify-center text-red-400">
                <p>Erreur: {error}</p>
            </div>
        );
    }

    return (
        <ReaderLayout>
            {/* Header */}
            <header className="flex justify-between items-center mb-6 sm:mb-8 pt-2 md:pt-8">
                <div>
                    <p className="text-slate-400 font-medium mb-1 tracking-wide uppercase text-[10px] sm:text-xs">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-serif">
                        Bon retour, <span className="text-primary">{firstName}</span>
                    </h1>
                </div>
                <div className="relative group cursor-pointer">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-cyan-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur-[2px]"></div>
                    <img
                        alt="Profile Avatar"
                        className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-background-dark shadow-sm"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9osWF4idDQXT81WX49Z8bLEZFKpVHjiyGvXYTyCS9AL4d2w4y8Tq2E3vu8uPS2_Sxn80uK651AtOieVnHOsVEx-nFPmUgxx6UBPV6cBemyOezux2EV-9ryY5xpOBgsM54pticRzin_WaSMqHN1rGSSfBeKpZJiaFluiJ1hMDvkfCeIURWAeZCeMyCHfYvWSKXqiC9YIgjmv7x2sYKvsmh2uW7rvdF5BB0klYwPnQAsXbs0Jv4SjaNR5jeLUgrwrPAkzXS3GDORFs"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-primary border-2 border-background-dark rounded-full"></div>
                </div>
            </header>

            {/* Continue Learning Section */}
            {recentLesson && (
                <section className="mb-8 sm:mb-12">
                    <div className="flex items-end justify-between mb-4 sm:mb-5">
                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-serif">Continuer l'apprentissage</h2>
                        <Link to="/reader/current" className="text-primary text-xs font-bold hover:text-cyan-400 transition-colors uppercase tracking-wider mb-1">
                            Voir tout
                        </Link>
                    </div>

                    <div className="relative w-full rounded-2xl overflow-hidden group shadow-2xl shadow-black/50 bg-[#0f1d22]">
                        <div className="relative p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                            <div className="shrink-0 w-20 h-28 sm:w-28 sm:h-40 md:w-32 md:h-44 rounded-lg shadow-xl overflow-hidden relative border border-white/10 transform group-hover:scale-[1.02] transition-transform duration-500">
                                <img
                                    alt={recentLesson.series?.title || "Leçon en cours"}
                                    className="w-full h-full object-cover"
                                    src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800" // Placeholder for now or use series cover
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 pointer-events-none"></div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center h-full pt-1">
                                <span className="inline-block px-2 sm:px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3 w-fit backdrop-blur-sm">
                                    En cours
                                </span>
                                <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 leading-tight font-serif tracking-wide">
                                    {recentLesson.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-5 font-light italic font-serif">
                                    {recentLesson.series?.title || 'Série inconnue'} • Leçon {recentLesson.number}
                                </p>
                                <div className="w-full bg-slate-800/80 rounded-full h-1 sm:h-1.5 mb-1.5 sm:mb-2 overflow-hidden backdrop-blur-md border border-white/5">
                                    <div
                                        className="bg-gradient-to-r from-primary to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(25,195,230,0.5)]"
                                        style={{ width: `${recentLesson.progress?.scroll_percentage || 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-slate-400 font-medium mb-3 sm:mb-5 uppercase tracking-wide">
                                    <span>Progression</span>
                                    <span className="text-primary">{recentLesson.progress?.scroll_percentage || 0}%</span>
                                </div>
                                <Link to={`/reader/lesson/${recentLesson.id}`} className="w-full sm:w-auto sm:px-8 bg-white text-background-dark font-bold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-200 hover:bg-primary hover:text-white shadow-lg shadow-black/20 flex items-center justify-center gap-2 group/btn">
                                    <span className="material-symbols-outlined text-lg sm:text-xl group-hover/btn:scale-110 transition-transform">
                                        play_arrow
                                    </span>
                                    Reprendre
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Book Collection Grid */}
            <section>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 tracking-tight font-serif">Ma Collection ({volumes.length})</h2>
                {volumes.length === 0 ? (
                    <p className="text-slate-400 text-sm">Votre collection est vide pour le moment.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-5 gap-y-6 sm:gap-y-9">
                        {volumes.map((volume) => (
                            <div key={volume.id} className="relative group cursor-pointer block">
                                <Link to={`/reader/volume/${volume.id}`} className="block">
                                    <div className="relative aspect-[2/3] w-full mb-3 sm:mb-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-glow transition-all duration-300 transform group-hover:-translate-y-1 bg-slate-800">
                                        {volume.cover_url ? (
                                            <img
                                                alt={volume.title}
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                                src={volume.cover_url}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                                <span className="material-symbols-outlined text-4xl">book</span>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-background-dark/80 backdrop-blur-md rounded-full p-1.5 text-white/70 hover:text-white hover:bg-primary transition-colors">
                                            <span className="material-symbols-outlined text-[16px] block">bookmark_border</span>
                                        </div>
                                    </div>
                                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-100 leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                        {volume.title}
                                    </h3>
                                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide uppercase">Oikos Premium</p>
                                </Link>

                                {/* Admin Edit Button */}
                                {role === 'admin' && (
                                    <Link
                                        to={`/admin/volumes/edit/${volume.id}`}
                                        className="absolute top-2 left-2 w-9 h-9 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg text-white hover:bg-cyan-400 hover:scale-110 transition-all z-50 group/edit"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </ReaderLayout>
    );
};

export default AccueilReader;
