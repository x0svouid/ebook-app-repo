import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useReader } from '../../hooks/useReader';
import ReactMarkdown from 'react-markdown';

// Helper to split markdown content into "pages" based on headers
const splitContentIntoPages = (markdown: string): string[] => {
    if (!markdown) return [];
    // Split by H3 (###) headers, keeping the header in the next part
    // Using positive lookahead regex if possible, or just split and rejoin
    // Simple approach: Split by '\n### '
    const parts = markdown.split(/\n(?=### )/g);
    return parts.map(p => p.trim()).filter(p => p.length > 0);
};

interface ReaderStep {
    type: 'intro' | 'content' | 'conclusion';
    content?: string;
    title?: string;
    chapterIndex?: number;
    subPageIndex?: number;
    totalSubPages?: number;
}

const LessonReader: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { lessonDetails, fetchLessonDetails, updateProgress, loading, error } = useReader();

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const [steps, setSteps] = useState<ReaderStep[]>([]);

    useEffect(() => {
        if (id) {
            fetchLessonDetails(Number(id));
        }
    }, [id]);

    // Build steps array when lessonDetails is loaded
    useEffect(() => {
        if (!lessonDetails) return;

        const newSteps: ReaderStep[] = [];

        // 1. Introduction
        newSteps.push({ type: 'intro', title: lessonDetails.title });

        // 2. Chapters (flattened into pages)
        if (lessonDetails.chapters) {
            lessonDetails.chapters.forEach((chapter, cIdx) => {
                const pages = splitContentIntoPages(chapter.content);
                if (pages.length === 0) {
                    // Fallback for empty chapter
                    newSteps.push({
                        type: 'content',
                        title: chapter.title || undefined,
                        content: "*Contenu vide*",
                        chapterIndex: cIdx,
                        subPageIndex: 0,
                        totalSubPages: 1
                    });
                } else {
                    pages.forEach((pageContent, pIdx) => {
                        newSteps.push({
                            type: 'content',
                            title: chapter.title || undefined,
                            content: pageContent,
                            chapterIndex: cIdx,
                            subPageIndex: pIdx,
                            totalSubPages: pages.length
                        });
                    });
                }
            });
        }

        // 3. Conclusion
        newSteps.push({ type: 'conclusion', title: "Conclusion" });

        setSteps(newSteps);

        // Handle Deep Linking (initial load only)
        const chapterParam = searchParams.get('chapter');
        if (chapterParam) {
            const cIdxTarget = parseInt(chapterParam, 10);
            if (!isNaN(cIdxTarget)) {
                // Find first step matching this chapter index
                const targetStepIndex = newSteps.findIndex(s => s.chapterIndex === cIdxTarget);
                if (targetStepIndex !== -1) {
                    setCurrentStepIndex(targetStepIndex);
                }
            }
        }

    }, [lessonDetails]);


    useEffect(() => {
        // Scroll to top when changing steps
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }

        // Update progress
        if (id && steps.length > 0) {
            // Update progress logic
            // const currentProgress = ((currentStepIndex + 1) / steps.length) * 100;
            // const isCompleted = steps[currentStepIndex].type === 'conclusion';
            // updateProgress(Number(id), Math.min(Math.max(currentProgress, 0), 100), isCompleted);
        }

    }, [currentStepIndex, steps, id]);


    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const handleFinish = async () => {
        if (id) {
            await updateProgress(Number(id), 100, true);
            navigate(-1);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a1113] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !lessonDetails) {
        return (
            <div className="min-h-screen bg-[#0a1113] flex items-center justify-center flex-col gap-4 text-slate-400">
                <span className="material-symbols-outlined text-4xl">error</span>
                <p>{error || "Leçon introuvable"}</p>
                <button onClick={() => navigate(-1)} className="text-primary hover:underline">
                    Retour
                </button>
            </div>
        );
    }

    const currentStep = steps[currentStepIndex] || { type: 'intro' };
    const progressVal = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className="fixed inset-0 bg-[#0a1113] font-serif text-slate-200 flex flex-col z-50">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-4 py-3 bg-[#0a1113] border-b border-white/5 z-10 shrink-0">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                <div className="flex flex-col items-center">
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-sans font-bold">
                        {lessonDetails.series?.title || "Leçon"}
                    </p>
                    <div className="flex flex-col items-center">
                        <h1 className="text-sm font-bold text-white max-w-[200px] sm:max-w-md truncate text-center font-sans">
                            {lessonDetails.title}
                        </h1>
                        <span className="text-[10px] text-primary font-sans font-bold">
                            {currentStep.type === 'intro' ? "Introduction" :
                                currentStep.type === 'conclusion' ? "Conclusion" :
                                    `Chapitre ${(currentStep.chapterIndex || 0) + 1} • ${(currentStep.subPageIndex || 0) + 1}/${currentStep.totalSubPages}`}
                        </span>
                    </div>
                </div>

                <div className="w-10 flex justify-end">
                    <button className="text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined">text_fields</span>
                    </button>
                </div>
            </header>

            {/* Pagination Progress Bar */}
            <div className="h-1 bg-white/5 w-full shrink-0">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(progressVal, 100)}%` }}
                ></div>
            </div>

            {/* Content Area */}
            <div
                ref={contentRef}
                className="flex-1 overflow-y-auto no-scrollbar scroll-smooth relative"
            >
                <div className="max-w-2xl mx-auto px-6 py-12 md:py-20 min-h-full flex flex-col">

                    {/* View: Introduction */}
                    {currentStep.type === 'intro' && (
                        <div className="flex-1 flex flex-col items-center justify-center animate-fade-in text-center">
                            <h1 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 leading-tight tracking-tight uppercase">
                                {lessonDetails.title}
                            </h1>
                            <p className="text-lg md:text-xl text-primary font-serif font-bold mb-8 tracking-wide">
                                {lessonDetails.series?.title}
                            </p>

                            {lessonDetails.introduction && (
                                <div className="prose prose-invert prose-lg text-slate-300 italic mb-10 font-light leading-relaxed max-w-2xl">
                                    {lessonDetails.introduction}
                                </div>
                            )}

                            {(lessonDetails.duration || lessonDetails.base_text) && (
                                <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-10">
                                    {lessonDetails.duration && (
                                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                            <span className="material-symbols-outlined text-primary text-3xl mb-2">schedule</span>
                                            <p className="text-xs uppercase tracking-widest text-slate-500 font-sans font-bold">Durée</p>
                                            <p className="text-white font-bold">{lessonDetails.duration}</p>
                                        </div>
                                    )}
                                    {lessonDetails.base_text && (
                                        <div className="bg-white/5 rounded-xl p-4 text-center border border-white/5">
                                            <span className="material-symbols-outlined text-primary text-3xl mb-2">menu_book</span>
                                            <p className="text-xs uppercase tracking-widest text-slate-500 font-sans font-bold">Lecture</p>
                                            <p className="text-white font-bold">{lessonDetails.base_text}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {lessonDetails.key_points && lessonDetails.key_points.length > 0 && (
                                <div className="w-full max-w-2xl bg-[#18282c] border border-white/5 rounded-2xl p-6 mb-10 text-left">
                                    <h3 className="text-[#19c3e6] font-bold uppercase text-xs tracking-widest mb-4 border-b border-white/5 pb-2">Points Clés</h3>
                                    <ul className="space-y-3">
                                        {lessonDetails.key_points.map((point, idx) => (
                                            <li key={idx} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                                                <span className="material-symbols-outlined text-[#19c3e6] text-lg shrink-0">check_small</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* View: Content Page */}
                    {currentStep.type === 'content' && (
                        <div className="animate-fade-in">
                            {/* Only show Title on the first page of the chapter */}
                            {currentStep.subPageIndex === 0 && (
                                <div className="flex gap-4 mb-12">
                                    <div className="w-1.5 self-stretch bg-primary shrink-0"></div>
                                    <h2 className="text-3xl md:text-5xl font-serif font-black text-white uppercase tracking-tight leading-none">
                                        {currentStep.title}
                                    </h2>
                                </div>
                            )}

                            <div className="prose prose-invert prose-lg md:prose-xl max-w-none 
                                prose-headings:font-serif prose-headings:font-bold 
                                prose-p:text-slate-300 prose-p:leading-loose 
                                prose-strong:text-white">

                                <ReactMarkdown
                                    components={{
                                        // Custom styling for verses (blockquotes)
                                        // Custom styling for verses (blockquotes)
                                        blockquote: ({ node, children, ...props }) => {
                                            const childArray = React.Children.toArray(children);
                                            // Heuristic: If there's more than one paragraph, the last one is likely the reference.
                                            // Even if there is only 1, we treat it as text. 
                                            // The user must separate text and reference with a blank line in markdown to generate 2 <p> tags.
                                            const hasReference = childArray.length > 1;

                                            return (
                                                <div className="relative my-12 group">
                                                    <blockquote className="pl-6 border-l-4 border-primary text-slate-200 font-serif italic text-2xl leading-relaxed" {...props}>
                                                        {childArray.map((child, index) => {
                                                            const isFirst = index === 0;
                                                            const isLast = index === childArray.length - 1;
                                                            const isReference = hasReference && isLast;

                                                            if (isReference) {
                                                                return (
                                                                    <div key={index} className="not-italic mt-6 text-right w-full">
                                                                        {/* Reference Styling: Blue, Sans, Bold, Uppercase */}
                                                                        <div className="text-[#19c3e6] font-sans font-bold text-sm uppercase tracking-widest inline-block border-t border-[#19c3e6]/30 pt-4">
                                                                            {child}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }

                                                            return (
                                                                <div key={index} className={isFirst ? "drop-cap-wrapper mb-4" : "mb-4"}>
                                                                    {child}
                                                                </div>
                                                            );
                                                        })}
                                                    </blockquote>
                                                    {/* CSS Injection for Drop Cap - Targeting the P tag inside the wrapper */}
                                                    <style>{`
                                                        .drop-cap-wrapper > p::first-letter {
                                                            float: left;
                                                            font-size: 4.5em; /* Increased size */
                                                            line-height: 0.7;
                                                            font-weight: 700; /* Black/Bold */
                                                            margin-right: 0.75rem;
                                                            margin-top: 0.25rem;
                                                            margin-bottom: -0.5rem; /* Fix layout shift */
                                                            color: #19c3e6;
                                                            font-family: 'DM Serif Display', serif;
                                                            text-transform: uppercase;
                                                        }
                                                    `}</style>
                                                </div>
                                            );
                                        },
                                        // Enhancing H3 subtitiles (White, Serif, Large, Underlined)
                                        h3: ({ node, children, ...props }) => (
                                            <div className="mt-16 mb-8">
                                                <h3 className="text-3xl font-serif font-bold text-white mb-3" {...props}>
                                                    {children}
                                                </h3>
                                                <div className="w-16 h-1 bg-primary rounded-full"></div>
                                            </div>
                                        ),
                                        // Custom paragraph styling for better readability
                                        // Note: We remove the margins here when inside blockquote references to avoid double spacing, 
                                        // but since we wrap children in blockquote above, this 'p' might be nested. 
                                        // The simple p styling is fine for general text.
                                        p: ({ node, children, ...props }) => (
                                            <p className="mb-6 leading-relaxed text-slate-300 font-lora text-lg md:text-xl last:mb-0" {...props}>
                                                {children}
                                            </p>
                                        )
                                    }}
                                >
                                    {currentStep.content || ""}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}

                    {/* View: Conclusion */}
                    {currentStep.type === 'conclusion' && (
                        <div className="flex-1 flex flex-col justify-center animate-fade-in">
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-4xl text-primary">done_all</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">Leçon Terminée !</h2>
                                <p className="text-slate-400">Voici ce qu'il faut retenir de cette session.</p>
                            </div>

                            {lessonDetails.conclusion && (
                                <div className="mb-10 bg-white/5 rounded-2xl p-6 border border-white/5">
                                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">lightbulb</span> Conclusion
                                    </h3>
                                    <p className="text-slate-300 italic leading-relaxed">{lessonDetails.conclusion}</p>
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6 mb-10">
                                {lessonDetails.truths_to_retain && lessonDetails.truths_to_retain.length > 0 && (
                                    <div className="bg-[#18282c] border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-[#19c3e6] font-bold uppercase text-xs tracking-widest mb-4 pb-2 border-b border-white/5">Vérités à Retenir</h3>
                                        <ul className="space-y-3">
                                            {lessonDetails.truths_to_retain.map((t, i) => (
                                                <li key={i} className="flex gap-3 text-slate-300 text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#19c3e6] mt-2 shrink-0"></span>
                                                    {t}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {lessonDetails.practical_application && lessonDetails.practical_application.length > 0 && (
                                    <div className="bg-[#18282c] border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-[#19c3e6] font-bold uppercase text-xs tracking-widest mb-4 pb-2 border-b border-white/5">Mise en Pratique</h3>
                                        <ul className="space-y-3">
                                            {lessonDetails.practical_application.map((a, i) => (
                                                <li key={i} className="flex gap-3 text-slate-300 text-sm">
                                                    <span className="material-symbols-outlined text-[#19c3e6] text-lg shrink-0">arrow_right_alt</span>
                                                    {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons (Bottom Sticky) */}
                    <div className="mt-auto pt-10 flex gap-4">
                        {currentStepIndex > 0 && (
                            <button
                                onClick={handlePrevious}
                                className="flex-1 py-4 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-sans"
                            >
                                <span className="material-symbols-outlined">arrow_back</span> Précédent
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            className={`flex-[2] py-4 rounded-xl font-bold flex items-center justify-center gap-2 font-sans transition-all 
                                ${currentStep.type === 'conclusion'
                                    ? "bg-green-500 text-white shadow-lg shadow-green-500/20 hover:scale-[1.02]"
                                    : "bg-primary text-[#0a1113] shadow-lg shadow-primary/20 hover:scale-[1.02]"
                                }`}
                        >
                            {currentStep.type === 'intro' ? "Commencer" :
                                currentStep.type === 'conclusion' ? "Terminer" : "Suivant"}
                            <span className="material-symbols-outlined">
                                {currentStep.type === 'conclusion' ? "check" : "arrow_forward"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonReader;
