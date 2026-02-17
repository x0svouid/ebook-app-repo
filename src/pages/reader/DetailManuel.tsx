import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomNav } from '../../components/BottomNav';
import './DetailManuel.css';
import { useReader } from '../../hooks/useReader';
import { useAuth } from '../../context/AuthContext';
import { useRef } from 'react';

const DetailManuel: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { volumeDetails, fetchVolumeDetails, loading, error, updateVolumeCover } = useReader();
    const { role } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id) {
            fetchVolumeDetails(Number(id));
        }
    }, [id]);

    const handleEditClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && id) {
            try {
                await updateVolumeCover(Number(id), e.target.files[0]);
            } catch (err) {
                console.error("Failed to update cover:", err);
                alert("Erreur lors de la mise à jour de la couverture.");
            }
        }
    };

    // State for expanded items
    // Series expansion (Level 1)
    const [expandedSeries, setExpandedSeries] = React.useState<number[]>([]);
    // Lesson expansion (Level 2)
    const [expandedLessons, setExpandedLessons] = React.useState<number[]>([]);

    const toggleSeries = (seriesId: number) => {
        setExpandedSeries(prev =>
            prev.includes(seriesId)
                ? prev.filter(id => id !== seriesId)
                : [...prev, seriesId]
        );
    };

    const toggleLesson = (lessonId: number) => {
        setExpandedLessons(prev =>
            prev.includes(lessonId)
                ? prev.filter(id => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    if (loading) {
        return (
            <div className="bg-background-dark min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !volumeDetails) {
        return (
            <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center text-white gap-4 p-4 text-center">
                <span className="material-symbols-outlined text-4xl text-slate-500">error</span>
                <p>Manuel introuvable ou erreur de chargement.</p>
                <button
                    onClick={() => navigate('/reader')}
                    className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors"
                >
                    Retour à l'accueil
                </button>
            </div>
        );
    }

    return (
        <div className="bg-background-dark min-h-screen flex flex-col font-display antialiased selection:bg-primary/30 pb-20 md:pb-0">
            {/* Desktop Sidebar Navigation */}
            <div className="flex flex-1 min-h-0">
                <aside className="hidden md:flex flex-col items-center w-20 lg:w-64 shrink-0 border-r border-white/5 bg-[#0a1113] h-screen sticky top-0 py-8 gap-2">
                    <div className="mb-8 flex items-center justify-center lg:justify-start lg:px-6 w-full cursor-pointer" onClick={() => navigate('/reader')}>
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_library</span>
                        <span className="hidden lg:block ml-3 text-white font-bold text-lg tracking-tight">Oikos</span>
                    </div>
                    <nav className="flex-1 flex flex-col gap-1 w-full px-3">
                        <a href="/reader" className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 text-white border border-white/5">
                            <span className="material-symbols-outlined text-[22px]">home</span>
                            <span className="hidden lg:block text-sm font-medium">Accueil</span>
                        </a>
                        <a href="/reader/current" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">local_library</span>
                            <span className="hidden lg:block text-sm font-medium">Mes Manuels</span>
                        </a>
                        <a href="/search" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
                            <span className="hidden lg:block text-sm font-bold">Rechercher</span>
                        </a>
                        <a href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                            <span className="material-symbols-outlined text-[22px]">settings</span>
                            <span className="hidden lg:block text-sm font-medium">Paramètres</span>
                        </a>
                    </nav>
                </aside>

                <main className="flex-1 overflow-y-auto w-full md:px-8 md:py-8">
                    <div className="max-w-4xl mx-auto w-full">
                        {/* Mobile Header / Back Button */}
                        <div className="flex items-center gap-4 mb-6 md:hidden px-4 pt-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors active:scale-95"
                            >
                                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                            </button>
                        </div>

                        {/* Top: Volume Info */}
                        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12 animate-fade-in px-4 md:px-0">
                            <div className="relative group shrink-0">
                                <div className="aspect-[2/3] w-48 sm:w-56 rounded-lg shadow-2xl overflow-hidden border border-white/10 relative transform group-hover:scale-[1.02] transition-transform duration-500">
                                    {volumeDetails.cover_url ? (
                                        <img
                                            src={volumeDetails.cover_url}
                                            alt={volumeDetails.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-6xl text-slate-700">book</span>
                                        </div>
                                    )}
                                    {/* Edit Overlay */}
                                    {role === 'admin' && (
                                        <div
                                            onClick={handleEditClick}
                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-10"
                                        >
                                            <span className="text-white font-bold text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined">edit</span>
                                                Modifier
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {role === 'admin' && (
                                    <button
                                        onClick={() => navigate(`/admin/volumes/edit/${id}`)}
                                        className="absolute bottom-4 right-4 w-10 h-10 bg-primary text-background-dark rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-20"
                                        title="Modifier la couverture"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">mode_edit</span>
                                    </button>
                                )}
                            </div>
                            <div className="text-center max-w-md md:max-w-xs">
                                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-3 sm:mb-4 tracking-tight">
                                    {volumeDetails.title}
                                </h2>
                                <div className="h-1 w-12 bg-primary mx-auto mb-4 sm:mb-6 rounded-full"></div>
                                <p className="text-slate-300 font-serif leading-relaxed italic text-base sm:text-lg opacity-90">
                                    "Une exploration profonde des fondements de la pensée humaine et des dilemmes moraux qui façonnent notre société contemporaine."
                                </p>
                            </div>
                        </section>

                        {/* Table of Contents - Nested Hierarchy */}
                        <section className="mt-8 md:mt-0 md:flex-1">
                            <div className="flex items-center justify-between mb-5 sm:mb-6">
                                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Sommaire</h3>
                            </div>

                            <div className="space-y-4">
                                {volumeDetails.series?.map((series) => {
                                    const isSeriesExpanded = expandedSeries.includes(series.id);

                                    return (
                                        <div key={series.id} className="border-b border-white/5 pb-2">
                                            {/* Level 1: Series Header */}
                                            <button
                                                onClick={() => toggleSeries(series.id)}
                                                className="w-full flex items-center justify-between text-left py-3 group hover:bg-white/5 px-2 rounded-lg transition-colors"
                                            >
                                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
                                                    {series.title}
                                                </h4>
                                                <span className={`material-symbols-outlined text-slate-500 transition-transform duration-300 ${isSeriesExpanded ? 'rotate-180' : ''}`}>
                                                    expand_more
                                                </span>
                                            </button>

                                            {/* Level 1 Content: Lessons */}
                                            {isSeriesExpanded && (
                                                <div className="mt-2 space-y-2 pl-2 animate-fade-in">
                                                    {series.lessons?.map((lesson) => {
                                                        const chapters = lesson.chapters || [];
                                                        const hasChapters = chapters.length > 0;
                                                        const isLessonExpanded = expandedLessons.includes(lesson.id);

                                                        return (
                                                            <div key={lesson.id} className="space-y-2">
                                                                {/* Level 2: Lesson Header / Link */}
                                                                <div
                                                                    onClick={() => hasChapters ? toggleLesson(lesson.id) : navigate(`/reader/lesson/${lesson.id}`)}
                                                                    className={`p-3.5 sm:p-4 rounded-2xl bg-card-dark border border-white/5 flex items-center gap-3 sm:gap-4 group active:bg-white/5 transition-colors cursor-pointer hover:border-primary/50
                                                                        ${isLessonExpanded ? 'border-primary/30 bg-white/5' : ''}
                                                                    `}
                                                                >
                                                                    <div className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center transition-colors
                                                                        ${isLessonExpanded
                                                                            ? 'bg-primary text-background-dark shadow-lg shadow-primary/20'
                                                                            : 'bg-white/5 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}
                                                                    `}>
                                                                        <span className="material-symbols-outlined text-[20px] sm:text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                                            {hasChapters ? 'menu_book' : 'play_arrow'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className={`font-bold text-sm sm:text-base truncate transition-colors ${isLessonExpanded ? 'text-white' : 'text-slate-200'}`}>
                                                                            {lesson.title}
                                                                        </h4>
                                                                        <p className="text-[10px] sm:text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                                                                            {lesson.duration || "10 min"} • {hasChapters ? `${chapters.length} Chapitres` : 'Lecture seule'}
                                                                        </p>
                                                                    </div>
                                                                    {hasChapters ? (
                                                                        <span className={`material-symbols-outlined text-slate-600 text-[20px] sm:text-[24px] group-hover:text-white transition-transform duration-300 ${isLessonExpanded ? 'rotate-180' : ''}`}>
                                                                            expand_more
                                                                        </span>
                                                                    ) : (
                                                                        <span className="material-symbols-outlined text-slate-600 text-[20px] sm:text-[24px] group-hover:text-white transition-colors">
                                                                            chevron_right
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Level 3: Chapters (Nested) */}
                                                                {hasChapters && isLessonExpanded && (
                                                                    <div className="pl-6 space-y-2 animate-fade-in border-l border-white/10 ml-5 py-2">
                                                                        {chapters.map((chapter: any, cIndex: number) => (

                                                                            <div
                                                                                key={chapter.id}
                                                                                onClick={() => navigate(`/reader/lesson/${lesson.id}?chapter=${cIndex}`)}
                                                                                className="p-3 rounded-xl hover:bg-white/5 flex items-center gap-3 group/chapter cursor-pointer transition-colors"
                                                                            >
                                                                                <div className="w-6 h-6 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover/chapter:text-primary group-hover/chapter:bg-primary/10 transition-colors">
                                                                                    {cIndex + 1}
                                                                                </div>
                                                                                <span className="text-sm text-slate-400 group-hover/chapter:text-white transition-colors font-medium truncate">
                                                                                    {chapter.title || `Chapitre ${chapter.order_index}`}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {(!series.lessons || series.lessons.length === 0) && (
                                                        <p className="text-sm text-slate-500 italic pl-4 py-2">Aucune leçon dans cette série.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {(!volumeDetails.series || volumeDetails.series.length === 0) && (
                                    <p className="text-center text-slate-500 mt-8">Ce manuel ne contient pas encore de chapitres.</p>
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

export default DetailManuel;
