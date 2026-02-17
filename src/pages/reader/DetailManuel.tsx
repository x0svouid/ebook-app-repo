import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReader, VolumeWithSeries } from '../../hooks/useReader';
import { useAuth } from '../../context/AuthContext';
import { BottomNav } from '../../components/BottomNav';

const DetailManuel: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { fetchVolumeDetails, loading, error } = useReader();
    const { user } = useAuth();
    const [volume, setVolume] = useState<VolumeWithSeries | null>(null);
    const [expandedSeries, setExpandedSeries] = useState<string | null>(null);

    const isAdmin = user?.user_metadata?.role === 'admin';

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        const data = await fetchVolumeDetails(id!);
        if (data) {
            setVolume(data);
            // Auto expand the first series if available
            if (data.series && data.series.length > 0) {
                setExpandedSeries(data.series[0].id);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !volume) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 text-center">
                <div>
                    <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
                    <h2 className="text-xl font-bold text-white mb-2">Impossible de trouver le manuel</h2>
                    <p className="text-slate-400 mb-6">{error || 'Le manuel demandé n\'existe pas.'}</p>
                    <button onClick={() => navigate('/reader')} className="bg-primary text-background-dark px-6 py-2 rounded-xl font-bold">
                        Retour au catalogue
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0b1416] min-h-screen text-slate-100 font-display pb-32">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-[#0b1416]/80 backdrop-blur-xl px-5 py-4 flex items-center justify-between border-b border-white/5">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/5">
                    <span className="material-symbols-outlined">arrow_back_ios_new</span>
                </button>
                <span className="text-sm font-bold text-white uppercase tracking-widest line-clamp-1 max-w-[200px]">{volume.title}</span>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:bg-white/5">
                    <span className="material-symbols-outlined">more_horiz</span>
                </button>
            </header>

            {/* Book Cover Splash Area */}
            <div className="relative pt-24 px-6 pb-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[300px] opacity-20 blur-[100px]"
                    style={{ background: `radial-gradient(circle at center, #19c3e6 0%, transparent 70%)` }}></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-[180px] aspect-[2/3] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-8 transform transition-transform duration-700 hover:scale-105">
                        <img src={volume.cover_url || 'https://via.placeholder.com/300x450'} alt={volume.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="text-center max-w-[300px]">
                        <h1 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">{volume.title}</h1>
                        <p className="text-primary font-bold tracking-widest text-[11px] uppercase mb-4">{volume.author}</p>

                        <div className="flex items-center justify-center gap-2 mb-6 text-slate-400 text-xs font-medium">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">auto_stories</span> {volume.series?.length || 0} Sérié</span>
                            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">schedule</span> 15h de lecture</span>
                        </div>

                        {isAdmin && (
                            <button
                                onClick={() => navigate(`/admin/volumes/edit/${volume.id}`)}
                                className="bg-white/10 text-white px-8 py-3 rounded-full font-bold text-sm border border-white/5 hover:bg-white/15 transition-all flex items-center gap-2 mx-auto"
                            >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Modifier le manuel
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Tabs/Description */}
            <div className="px-6 mb-10">
                <div className="flex gap-6 border-b border-white/5 mb-6">
                    <button className="pb-3 text-primary border-b-2 border-primary font-bold text-sm">Sommaire</button>
                    <button className="pb-3 text-slate-500 font-bold text-sm">Détails</button>
                    <button className="pb-3 text-slate-500 font-bold text-sm">Avis</button>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    {volume.description || \"Aucune description disponible pour ce manuel.\"}
                </p>
            </div>

            {/* Hierarchical Table of Contents */}
            <div className="px-6 pb-20">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 px-1">Structure du manuel</h2>

                <div className="space-y-4">
                    {volume.series?.map((serie, sIndex) => {
                        const isExpanded = expandedSeries === serie.id;

                        return (
                            <div key={serie.id} className=\"rounded-2xl border border-white/5 overflow-hidden transition-all duration-300\"
                                style={{ backgroundColor: isExpanded ? 'rgba(25, 195, 230, 0.03)' : 'rgba(255, 255, 255, 0.02)' }}>

                                {/* Series Header */}
                                <div
                                    onClick={() => setExpandedSeries(isExpanded ? null : serie.id)}
                                    className=\"px-5 py-4 flex items-center justify-between cursor-pointer\"
                                >
                                    <div className=\"flex items-center gap-4\">
                                        <div className=\"w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400\">
                                            {sIndex + 1}
                                        </div>
                                        <div>
                                            <h3 className=\"text-white font-bold text-[15px]\">{serie.title}</h3>
                                            <p className=\"text-[10px] text-slate-500 font-bold uppercase tracking-wider\">
                                                {serie.lessons?.length || 0} Leçons
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`material-symbols-outlined transition-transform duration-300 text-slate-500 ${isExpanded ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </div>

                                {/* Lessons List */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[2000px] border-t border-white/5' : 'max-h-0'}`}>
                                    <div className=\"p-2 space-y-1\">
                                        {serie.lessons?.map((lesson, lIndex) => {
                                            const hasChapters = (lesson as any).chapters && (lesson as any).chapters.length > 0;

                                            return (
                                                <div key={lesson.id} className=\"group\">
                                                    <div
                                                        onClick={() => navigate(`/reader/lesson/${lesson.id}`)}
                                                        className=\"flex items-center justify-between px-4 py-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer\"
                                                    >
                                                        <div className=\"flex items-center gap-3\">
                                                            <div className=\"w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors\"></div>
                                                            <div>
                                                                <h4 className=\"text-slate-200 font-medium text-sm transition-colors group-hover:text-white\">
                                                                    {lIndex + 1}. {lesson.title}
                                                                </h4>
                                                                <p className=\"text-[10px] text-slate-500 font-medium\">
                                                                    {hasChapters ? `${(lesson as any).chapters?.length} Chapitres` : 'Lecture seule'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className=\"flex items-center gap-3\">
                                                            {lesson.is_completed && (
                                                                <span className=\"material-symbols-outlined text-emerald-400 text-lg\">check_circle</span>
                                                            )}
                                                            <span className=\"material-symbols-outlined text-slate-600 text-lg group-hover:text-primary transition-colors\">
                                                                play_circle
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Nested Chapters if any */}
                                                    {hasChapters && (
                                                        <div className=\"ml-10 pr-4 pb-2 space-y-1 border-l border-white/5 mb-2\">
                                                            {(lesson as any).chapters?.map((chapter: any, cIndex: number) => (
                                                                <div
                                                                    key={chapter.id}
                                                                    className=\"flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.03] cursor-pointer group/chapter\"
                                                                >
                                                                    <span className=\"text-xs text-slate-500 group-hover/chapter:text-slate-300 transition-colors capitalize\">
                                                                        {chapter.title || `Chapitre ${cIndex + 1}`}
                                                                    </span>
                                                                    <span className=\"text-[10px] text-slate-600\">{(chapter.content?.length || 0) > 1000 ? '12 min' : '5 min'}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default DetailManuel;
