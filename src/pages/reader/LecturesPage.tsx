import { useNavigate } from 'react-router-dom';
import { useReader } from '../../hooks/useReader';
import ReaderLayout from '../../components/ReaderLayout';

const LecturesPage: React.FC = () => {
    const navigate = useNavigate();
    const { readingHistory, loading } = useReader();

    // Filter in-progress and completed items
    const inProgressItems = readingHistory.filter(item => !item.is_completed && (item.scroll_percentage || 0) > 0);
    const completedItems = readingHistory.filter(item => item.is_completed);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <ReaderLayout>
            <header className="mb-10 pt-4">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Mes Lectures</h1>
                <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">Suivez votre progression et reprenez vos leçons.</p>
            </header>

            <section className="mb-12">
                <h2 className="text-xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                    En cours
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                </h2>
                <div className="space-y-6">
                    {inProgressItems.length === 0 ? (
                        <p className="text-slate-500 text-sm italic">Aucune lecture en cours.</p>
                    ) : (
                        inProgressItems.map((item) => {
                            // @ts-ignore
                            const lesson = item.lessons;
                            // @ts-ignore
                            const series = lesson?.series;
                            // @ts-ignore
                            const volume = series?.volumes;

                            return (
                                <div key={item.lesson_id} className="relative w-full rounded-2xl overflow-hidden bg-slate-900/40 border border-slate-800 p-4 transition-all hover:border-slate-700">
                                    <div className="flex gap-4">
                                        <div className="shrink-0 w-20 h-28 rounded-lg shadow-lg overflow-hidden border border-white/5">
                                            {volume?.cover_url ? (
                                                <img alt={volume.title} className="w-full h-full object-cover" src={volume.cover_url} />
                                            ) : (
                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-600">book</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div>
                                                <h3 className="text-lg font-bold text-white leading-tight font-display tracking-tight">{volume?.title || 'Titre inconnu'}</h3>
                                                <p className="text-sm text-primary font-serif italic mt-0.5">{lesson?.title || `Leçon ${lesson?.number}`}</p>
                                            </div>
                                            <div className="mt-4">
                                                <div className="flex justify-between items-end mb-1.5">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Progression</span>
                                                    <span className="text-xs text-primary font-bold">{item.scroll_percentage}%</span>
                                                </div>
                                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-primary h-full rounded-full shadow-[0_0_8px_rgba(25,195,230,0.5)]" style={{ width: `${item.scroll_percentage}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center ml-2">
                                            <button
                                                onClick={() => navigate(`/reader/lesson/${item.lesson_id}`)}
                                                className="bg-white/10 hover:bg-white text-white hover:text-background-dark p-3 rounded-xl transition-all duration-300">
                                                <span className="material-symbols-outlined text-[24px] block">play_arrow</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Terminé récemment</h2>
                <div className="space-y-4">
                    {completedItems.length === 0 ? (
                        <p className="text-slate-500 text-sm italic">Aucune lecture terminée.</p>
                    ) : (
                        completedItems.map((item) => {
                            // @ts-ignore
                            const lesson = item.lessons;
                            // @ts-ignore
                            const series = lesson?.series;
                            // @ts-ignore
                            const volume = series?.volumes;

                            return (
                                <div key={item.lesson_id} className="flex items-center gap-4 p-3 bg-slate-900/20 rounded-xl border border-slate-800/50">
                                    <div className="shrink-0 w-12 h-16 rounded-md overflow-hidden bg-slate-800">
                                        {volume?.cover_url ? (
                                            <img alt={volume.title} className="w-full h-full object-cover grayscale opacity-60" src={volume.cover_url} />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-slate-600">book</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-200 truncate font-display">{volume?.title || 'Titre inconnu'}</h4>
                                        <p className="text-xs text-slate-500 font-serif italic truncate">{lesson?.title}</p>
                                    </div>
                                    <div className="bg-primary/10 p-2 rounded-full border border-primary/20">
                                        <span className="material-symbols-outlined text-primary text-[20px] block font-bold">check</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>
        </ReaderLayout>
    );
};

export default LecturesPage;
