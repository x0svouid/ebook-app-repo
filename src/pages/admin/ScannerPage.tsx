import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';
import './ScannerPage.css';
import { extractLessonDataFromImages, ExtractedChapter, ExtractedLessonData } from '../../services/gemini';

type Step = 'upload' | 'processing' | 'review' | 'success';

interface LessonOption {
    id: number;
    title: string;
    series: { title: string } | null;
}

const ScannerPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('upload');
    const [imagesSrc, setImagesSrc] = useState<string[]>([]);
    const [lessons, setLessons] = useState<LessonOption[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

    // Rich Data State
    const [extractedData, setExtractedData] = useState<ExtractedLessonData | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    // Fetch lessons for the dropdown
    useEffect(() => {
        const fetchLessons = async () => {
            const { data } = await supabase
                .from('lessons')
                .select('id, title, series:series_id(title)')
                .order('title');

            if (data) {
                // @ts-ignore
                setLessons(data);
            }
        };
        fetchLessons();
    }, []);

    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Impossible d'accéder à la caméra");
            setIsCameraOpen(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImagesSrc(prev => [...prev, dataUrl]);
            stopCamera();
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsCameraOpen(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagesSrc(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number) => {
        setImagesSrc(prev => prev.filter((_, i) => i !== index));
    };

    const processImages = async () => {
        if (imagesSrc.length === 0) {
            alert("Aucune image à traiter");
            return;
        }

        setStep('processing');

        try {
            const results = await extractLessonDataFromImages(imagesSrc);
            setExtractedData(results);
            setStep('review');
        } catch (error: any) {
            console.error("AI Processing Error:", error);
            let errorMessage = "Erreur inconnue";
            if (error instanceof Error) errorMessage = error.message;
            alert(`Erreur lors de l'analyse IA :\n${errorMessage}`);
            setStep('upload');
        }
    };

    // Helper to update extracted data fields safely
    const updateDataField = (field: keyof ExtractedLessonData, value: any) => {
        if (!extractedData) return;
        setExtractedData({ ...extractedData, [field]: value });
    };

    const updateChapter = (index: number, field: keyof ExtractedChapter, value: string | number) => {
        if (!extractedData) return;
        const newChapters = [...extractedData.chapters];
        // @ts-ignore
        newChapters[index][field] = value;
        setExtractedData({ ...extractedData, chapters: newChapters });
    };

    const addChapter = () => {
        if (!extractedData) return;
        const newChapters = [...extractedData.chapters, { title: "Nouvelle Section", content: "", order: extractedData.chapters.length + 1 }];
        setExtractedData({ ...extractedData, chapters: newChapters });
    };

    const moveChapter = (index: number, direction: 'up' | 'down') => {
        if (!extractedData) return;
        const newChapters = [...extractedData.chapters];
        if (direction === 'up' && index > 0) {
            [newChapters[index], newChapters[index - 1]] = [newChapters[index - 1], newChapters[index]];
        } else if (direction === 'down' && index < newChapters.length - 1) {
            [newChapters[index], newChapters[index + 1]] = [newChapters[index + 1], newChapters[index]];
        }
        // Update order fields
        newChapters.forEach((ch, idx) => ch.order = idx + 1);
        setExtractedData({ ...extractedData, chapters: newChapters });
    };

    const removeChapter = (index: number) => {
        if (!extractedData) return;
        setExtractedData({
            ...extractedData,
            chapters: extractedData.chapters.filter((_, i) => i !== index)
        });
    };

    // Helper for slug generation
    const slugify = (text: string) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const saveAllData = async () => {
        if (!extractedData) return;

        try {
            // 0. Validate required fields
            if (!extractedData.volume_title || !extractedData.series_title || !extractedData.lesson_title) {
                alert("Les titres du Volume, de la Série et de la Leçon sont obligatoires.");
                return;
            }

            let volumeId: number;
            let seriesId: number;

            // 1. Check or Create Volume
            const volumeTitle = extractedData.volume_title.trim();
            const seriesTitle = extractedData.series_title.trim();
            const lessonTitle = extractedData.lesson_title.trim();

            const { data: existingVolume, error: volCheckError } = await supabase
                .from('volumes')
                .select('id')
                .ilike('title', volumeTitle)
                .single();

            if (volCheckError && volCheckError.code !== 'PGRST116') { // PGRST116 is "no rows found"
                throw volCheckError;
            }

            if (existingVolume) {
                volumeId = existingVolume.id;
            } else {
                // Handle Cover Image Upload
                let coverUrl = null;
                if (coverImage) {
                    const fileExt = coverImage.name.split('.').pop();
                    const fileName = `${slugify(volumeTitle)}_${Date.now()}.${fileExt}`;
                    const filePath = `covers/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('images')
                        .upload(filePath, coverImage);

                    if (uploadError) {
                        console.error("Cover upload error (proceeding without cover):", uploadError);
                        alert("Erreur upload couverture : " + uploadError.message);
                    } else {
                        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                        coverUrl = data.publicUrl;
                    }
                }

                const { data: newVolume, error: volCreateError } = await supabase
                    .from('volumes')
                    .insert({
                        title: volumeTitle,
                        slug: slugify(volumeTitle),
                        is_published: false, // Default to draft
                        cover_url: coverUrl
                    })
                    .select('id')
                    .single();

                if (volCreateError) throw volCreateError;
                volumeId = newVolume.id;
            }

            // 2. Check or Create Series
            const { data: existingSeries, error: seriesCheckError } = await supabase
                .from('series')
                .select('id')
                .eq('volume_id', volumeId)
                .ilike('title', seriesTitle)
                .single();

            if (seriesCheckError && seriesCheckError.code !== 'PGRST116') {
                throw seriesCheckError;
            }

            if (existingSeries) {
                seriesId = existingSeries.id;
            } else {
                // Get updated order index
                const { data: maxOrderData } = await supabase
                    .from('series')
                    .select('order_index')
                    .eq('volume_id', volumeId)
                    .order('order_index', { ascending: false })
                    .limit(1);

                const nextOrder = (maxOrderData?.[0]?.order_index || 0) + 1;

                const { data: newSeries, error: seriesCreateError } = await supabase
                    .from('series')
                    .insert({
                        title: seriesTitle,
                        volume_id: volumeId,
                        order_index: nextOrder
                    })
                    .select('id')
                    .single();

                if (seriesCreateError) throw seriesCreateError;
                seriesId = newSeries.id;
            }

            // 3. Check or Create Lesson (Smart Import Logic)
            let lessonId: number;
            let startChapterOrder = 1;

            const { data: existingLesson, error: lessonCheckError } = await supabase
                .from('lessons')
                .select('id')
                .eq('series_id', seriesId)
                .ilike('title', lessonTitle)
                .single();

            if (lessonCheckError && lessonCheckError.code !== 'PGRST116') throw lessonCheckError;

            if (existingLesson) {
                // Reuse existing lesson
                lessonId = existingLesson.id;

                // Determine user feedback
                // We could verify if it's the exact same content, but for now we assume append desire
                alert(`Leçon existante trouvée : "${lessonTitle}". Les nouveaux chapitres seront ajoutés à la suite.`);

                // Find the highest chapter order index in this lesson to append after
                const { data: maxChapterData } = await supabase
                    .from('chapters')
                    .select('order_index')
                    .eq('lesson_id', lessonId)
                    .order('order_index', { ascending: false })
                    .limit(1)
                    .single();

                startChapterOrder = (maxChapterData?.order_index || 0) + 1;

            } else {
                // Create new Lesson
                // Get next lesson number in series
                const { data: maxLessonData } = await supabase
                    .from('lessons')
                    .select('number')
                    .eq('series_id', seriesId)
                    .order('number', { ascending: false })
                    .limit(1);

                const nextLessonNum = (maxLessonData?.[0]?.number || 0) + 1;

                const { data: newLesson, error: lessonError } = await supabase
                    .from('lessons')
                    .insert({
                        series_id: seriesId,
                        number: nextLessonNum,
                        title: lessonTitle,
                        introduction: extractedData.introduction,
                        base_text: extractedData.base_text,
                        conclusion: extractedData.conclusion,
                        truths_to_retain: extractedData.truths_to_retain,
                        practical_application: extractedData.practical_application
                    })
                    .select('id')
                    .single();

                if (lessonError) throw lessonError;
                lessonId = newLesson.id;
            }

            // 4. Insert Chapters
            const chaptersToInsert = extractedData.chapters.map((ch, index) => ({
                lesson_id: lessonId,
                title: ch.title || "Sans titre",
                content: ch.content || "",
                order_index: startChapterOrder + index
            }));

            const { error: chaptersError } = await supabase
                .from('chapters')
                .insert(chaptersToInsert);

            if (chaptersError) throw chaptersError;

            setStep('success');
        } catch (error: any) {
            console.error('Error saving data:', error);
            alert("Erreur lors de la sauvegarde: " + error.message);
        }
    };

    return (
        <div className="bg-background-dark min-h-screen text-slate-100 font-display pb-24 relative overflow-x-hidden">
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[80%] bg-[#19c3e6]/5 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#19c3e6]/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10 px-6 pt-12">
                <header className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-medium text-white leading-tight">
                        Scanner<br />Intelligent
                    </h1>
                </header>

                {step === 'upload' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-400/80">Manuel Cible</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-[#18282c] border border-white/5 text-white text-sm font-bold p-4 rounded-xl appearance-none outline-none focus:border-[#19c3e6]/50 transition-colors"
                                    onChange={(e) => setSelectedLessonId(Number(e.target.value))}
                                    value={selectedLessonId || ''}
                                >
                                    <option value="">Sélectionner un manuel...</option>
                                    {lessons.map(l => (
                                        <option key={l.id} value={l.id}>{l.title}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">expand_more</span>
                            </div>
                        </div>

                        {!isCameraOpen ? (
                            <div className="space-y-4">
                                <div onClick={startCamera} className="w-full aspect-[4/3] bg-[#18282c]/30 border-2 border-dashed border-cyan-500/30 rounded-3xl relative flex flex-col items-center justify-center cursor-pointer hover:bg-[#18282c]/50 hover:border-cyan-500/50 transition-all group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="w-16 h-16 rounded-full bg-[#19c3e6]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ring-1 ring-[#19c3e6]/30 shadow-[0_0_30px_rgba(25,195,230,0.1)]">
                                        <span className="material-symbols-outlined text-[28px] text-[#19c3e6]">photo_camera</span>
                                    </div>
                                    <h3 className="text-white font-bold text-base mb-1 relative z-10">Prendre une photo</h3>
                                </div>
                                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#23363b] hover:bg-[#2a4046] text-slate-300 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-colors border border-white/5 active:scale-[0.99]">
                                    <span className="material-symbols-outlined text-[#19c3e6]">upload_file</span>
                                    IMPORTER DES IMAGES (PDF/JPG)
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" multiple onChange={handleFileUpload} />
                            </div>
                        ) : (
                            <div className="w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <button onClick={(e) => { e.stopPropagation(); capturePhoto(); }} className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-md active:scale-95 transition-transform shadow-lg">
                                    <div className="w-10 h-10 bg-white rounded-full"></div>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); stopCamera(); }} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        )}

                        {imagesSrc.length > 0 && (
                            <div className="mt-6">
                                <div className="grid grid-cols-4 gap-2">
                                    {imagesSrc.map((src, index) => (
                                        <div key={index} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/10 group bg-[#111e21]">
                                            <img src={src} alt={`Page ${index + 1}`} className="w-full h-full object-cover" />
                                            <button onClick={() => removeImage(index)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-[12px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={processImages} className="w-full mt-6 py-4 rounded-xl bg-[#19c3e6] text-[#111e21] font-bold shadow-lg shadow-[#19c3e6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">auto_awesome</span> LANCER L'ANALYSE IA
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 'processing' && (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-6 animate-fade-in">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-4 border-[#18282c]"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-[#19c3e6]/30 border-t-[#19c3e6] animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center"><span className="material-symbols-outlined text-3xl text-[#19c3e6] animate-pulse">auto_awesome</span></div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-xl font-bold text-white">Extraction des Données...</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">Analyse de structure, points clés, et contenu en cours.</p>
                        </div>
                    </div>
                )}

                {step === 'review' && extractedData && (
                    <div className="animate-fade-in pb-8 space-y-8">
                        {/* 0. Hierarchy Section (New) */}
                        <div className="space-y-4">
                            <h3 className="text-[#19c3e6] font-bold uppercase text-xs tracking-widest border-b border-white/10 pb-2">Organisation du Contenu</h3>
                            <div className="bg-[#18282c] border border-white/5 rounded-xl p-4 space-y-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Volume (Manuel)</label>
                                    <input
                                        value={extractedData.volume_title}
                                        onChange={(e) => updateDataField('volume_title', e.target.value)}
                                        className="w-full bg-[#111e21] border border-white/10 rounded-lg p-3 text-white text-sm font-bold placeholder-white/20"
                                        placeholder="Ex: Vol 1: Les Fondements"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1 mb-3">S'il n'existe pas, il sera créé automatiquement.</p>

                                    {/* Cover Image Upload (Only effective for new volumes currently) */}
                                    <div className="flex items-center gap-4">
                                        <div
                                            onClick={() => coverInputRef.current?.click()}
                                            className="w-16 h-24 bg-[#111e21] border border-white/10 rounded-lg flex items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-colors overflow-hidden group relative"
                                        >
                                            {coverImagePreview ? (
                                                <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-slate-600 group-hover:text-cyan-500 transition-colors">image</span>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-white text-xs">edit</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Image de Couverture</p>
                                            <p className="text-[10px] text-slate-600">Optionnel. Pour les nouveaux volumes.</p>
                                        </div>
                                        <input
                                            type="file"
                                            ref={coverInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleCoverUpload}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Série</label>
                                    <input
                                        value={extractedData.series_title}
                                        onChange={(e) => updateDataField('series_title', e.target.value)}
                                        className="w-full bg-[#111e21] border border-white/10 rounded-lg p-3 text-white text-sm font-bold placeholder-white/20"
                                        placeholder="Ex: Série 1: La Nouvelle Vie"
                                    />
                                    <p className="text-[10px] text-slate-500 mt-1">Sera créée ou rattachée au volume ci-dessus.</p>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Titre de la Leçon</label>
                                    <input
                                        value={extractedData.lesson_title}
                                        onChange={(e) => updateDataField('lesson_title', e.target.value)}
                                        className="w-full bg-[#111e21] border border-white/10 rounded-lg p-3 text-white text-sm font-bold placeholder-white/20"
                                        placeholder="Ex: Leçon 3: La Prière"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 1. Metadata Section */}
                        <div className="space-y-4">
                            <h3 className="text-[#19c3e6] font-bold uppercase text-xs tracking-widest border-b border-white/10 pb-2">Informations Générales</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-bold uppercase">Texte de Base</label>
                                    <input value={extractedData.base_text} onChange={(e) => updateDataField('base_text', e.target.value)} className="w-full bg-[#111e21] border border-white/10 rounded-lg p-3 text-white text-sm" />
                                </div>
                                <div>
                                    <textarea value={extractedData.introduction} onChange={(e) => updateDataField('introduction', e.target.value)} className="w-full h-24 bg-[#111e21] border border-white/10 rounded-lg p-3 text-slate-300 text-sm resize-none" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Chapters Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                <h3 className="text-[#19c3e6] font-bold uppercase text-xs tracking-widest">Plan de la Leçon ({extractedData.chapters.length})</h3>
                                <button onClick={addChapter} className="text-xs font-bold text-[#19c3e6] hover:text-white transition-colors flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">add</span> AJOUTER SECTION
                                </button>
                            </div>

                            {extractedData.chapters.map((chapter, index) => (
                                <div key={index} className="bg-[#18282c] border border-white/5 rounded-xl p-4 relative group transition-all hover:border-[#19c3e6]/30">
                                    <div className="absolute -left-2 top-4 w-1 h-8 bg-[#19c3e6] rounded-r-md"></div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[9px] font-bold text-[#19c3e6] uppercase tracking-wider">Section {index + 1}</span>
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => moveChapter(index, 'up')}
                                                disabled={index === 0}
                                                className="p-1 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                                                title="Monter"
                                            >
                                                <span className="material-symbols-outlined text-lg">arrow_upward</span>
                                            </button>
                                            <button
                                                onClick={() => moveChapter(index, 'down')}
                                                disabled={index === extractedData.chapters.length - 1}
                                                className="p-1 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
                                                title="Descendre"
                                            >
                                                <span className="material-symbols-outlined text-lg">arrow_downward</span>
                                            </button>
                                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                                            <button onClick={() => removeChapter(index)} className="p-1 text-slate-500 hover:text-red-400 transition-colors" title="Supprimer">
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <input value={chapter.title} onChange={(e) => updateChapter(index, 'title', e.target.value)} className="w-full bg-[#111e21] border border-white/10 rounded-lg p-3 text-white font-bold text-sm focus:border-[#19c3e6]/50 transition-colors outline-none" placeholder="Titre (ex: 1. Introduction)" />
                                        <textarea value={chapter.content} onChange={(e) => updateChapter(index, 'content', e.target.value)} className="w-full h-32 bg-[#111e21] border border-white/10 rounded-lg p-3 text-slate-300 font-mono text-xs leading-relaxed resize-none focus:border-[#19c3e6]/50 transition-colors outline-none" placeholder="Contenu Markdown..." />
                                    </div>
                                </div>
                            ))}

                            {extractedData.chapters.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-xl">
                                    <p className="text-slate-500 text-sm">Aucune section détectée.</p>
                                    <button onClick={addChapter} className="mt-2 text-[#19c3e6] text-sm font-bold hover:underline">Ajouter une section manuellement</button>
                                </div>
                            )}
                        </div>

                        {/* 3. Conclusion & Application */}
                        <div className="space-y-4">
                            <h3 className="text-[#19c3e6] font-bold uppercase text-xs tracking-widest border-b border-white/10 pb-2">Conclusion & Application</h3>
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase">Conclusion</label>
                                <textarea value={extractedData.conclusion} onChange={(e) => updateDataField('conclusion', e.target.value)} className="w-full h-24 bg-[#111e21] border border-white/10 rounded-lg p-3 text-slate-300 text-sm resize-none" />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase">Vérités à Retenir (Une par ligne)</label>
                                <textarea
                                    value={extractedData.truths_to_retain ? extractedData.truths_to_retain.join('\n') : ''}
                                    onChange={(e) => updateDataField('truths_to_retain', e.target.value.split('\n'))}
                                    className="w-full h-24 bg-[#111e21] border border-white/10 rounded-lg p-3 text-slate-300 text-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase">Mise en Pratique (Une par ligne)</label>
                                <textarea
                                    value={extractedData.practical_application ? extractedData.practical_application.join('\n') : ''}
                                    onChange={(e) => updateDataField('practical_application', e.target.value.split('\n'))}
                                    className="w-full h-24 bg-[#111e21] border border-white/10 rounded-lg p-3 text-slate-300 text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 sticky bottom-24 bg-background-dark/80 backdrop-blur-md p-4 -mx-4 rounded-t-2xl border-t border-white/5 z-20">
                            <button onClick={() => setStep('upload')} className="flex-1 py-4 rounded-xl border border-white/10 text-slate-400 font-bold hover:bg-white/5 transition-colors">Refaire</button>
                            <button onClick={saveAllData} className="flex-[2] py-4 rounded-xl bg-[#19c3e6] text-[#111e21] font-bold shadow-lg shadow-[#19c3e6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">save</span> TOUT SAUVEGARDER
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-8 animate-fade-in text-center px-4">
                        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-[20px] animate-pulse"></div>
                            <span className="material-symbols-outlined text-[48px] text-green-500 relative z-10">task_alt</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Importation Terminée !</h2>
                        <button onClick={() => navigate('/admin')} className="w-full py-4 rounded-xl bg-[#18282c] border border-white/10 text-white font-bold">Retour au Dashboard</button>
                        <button onClick={() => { setStep('upload'); setImagesSrc([]); setExtractedData(null); }} className="w-full py-4 rounded-xl bg-[#19c3e6] text-[#111e21] font-bold">Nouveau Scan</button>
                    </div>
                )}
            </div>
            <BottomNav />
        </div>
    );
};

export default ScannerPage;
