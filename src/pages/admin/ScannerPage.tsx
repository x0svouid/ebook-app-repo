import React, { useState } from 'react';
import { Camera } from '../../components/scanner/Camera';
import { ImagePreview } from '../../components/scanner/ImagePreview';
import { ExtractionProgress } from '../../components/scanner/ExtractionProgress';
import { ResultEditor } from '../../components/scanner/ResultEditor';
import { BottomNav } from '../../components/BottomNav';

const ScannerPage: React.FC = () => {
    // Correct steps: capture -> preview -> extraction -> editor
    const [originalImages, setOriginalImages] = useState<string[]>([]);
    const [extractedData, setExtractedData] = useState<any>(null);
    const [currentView, setCurrentView] = useState<'camera' | 'preview' | 'extraction' | 'editor'>('camera');

    // Step 1: Capture
    const handleCapture = (image: string) => {
        setOriginalImages(prev => [...prev, image]);
        setCurrentView('preview');
    };

    const handleUpload = (files: File[]) => {
        const readers = files.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(images => {
            setOriginalImages(prev => [...prev, ...images]);
            setCurrentView('preview');
        });
    };

    // Step 2: Preview & Add more
    const handleContinue = () => {
        setCurrentView('extraction');
    };

    const handleAddMore = () => {
        setCurrentView('camera');
    };

    // Step 3: Extraction
    const handleExtractionComplete = (data: any) => {
        setExtractedData(data);
        setCurrentView('editor');
    };

    // Step 4: Finalizing
    const handleReset = () => {
        setOriginalImages([]);
        setExtractedData(null);
        setCurrentView('camera');
    };

    return (
        <div className="bg-[#0b1416] min-h-screen text-slate-100 selection:bg-primary/30 pb-32">
            {/* Header logic - only show in camera/preview if they don't have their own */}
            <header className="px-5 pt-10 pb-4 relative z-50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-xl">
                            {currentView === 'camera' ? 'photo_camera' :
                                currentView === 'preview' ? 'collections' :
                                    currentView === 'extraction' ? 'auto_awesome' : 'edit_note'}
                        </span>
                    </div>
                    <h1 className="text-xl font-serif font-bold tracking-tight">
                        {currentView === 'camera' && "Numériser un manuel"}
                        {currentView === 'preview' && "Images capturées"}
                        {currentView === 'extraction' && "Intelligence Artificielle"}
                        {currentView === 'editor' && "Vérification des données"}
                    </h1>
                </div>
                <p className="text-xs text-slate-400 ml-11">
                    {currentView === 'camera' && "Prenez en photo les pages du chapitre"}
                    {currentView === 'preview' && `${originalImages.length} page(s) prête(s) pour l'analyse`}
                    {currentView === 'extraction' && "Extraction du contenu en cours..."}
                    {currentView === 'editor' && "Vérifiez et corrigez le contenu extrait"}
                </p>
            </header>

            <main className="relative h-full">
                {currentView === 'camera' && (
                    <Camera onCapture={handleCapture} onUpload={handleUpload} />
                )}

                {currentView === 'preview' && (
                    <ImagePreview
                        images={originalImages}
                        onContinue={handleContinue}
                        onAddMore={handleAddMore}
                        onDelete={(idx) => {
                            const newImages = [...originalImages];
                            newImages.splice(idx, 1);
                            setOriginalImages(newImages);
                            if (newImages.length === 0) handleReset();
                        }}
                    />
                )}

                {currentView === 'extraction' && (
                    <ExtractionProgress
                        images={originalImages}
                        onComplete={handleExtractionComplete}
                    />
                )}

                {currentView === 'editor' && extractedData && (
                    <ResultEditor
                        data={extractedData}
                        images={originalImages}
                        onSave={() => {
                            // Logic for saving to DB managed in editor component
                            // but we can add success redirects/feedback here
                        }}
                        onReset={handleReset}
                    />
                )}
            </main>

            <div className="fixed bottom-0 left-0 w-full p-5 bg-[#0b1416]/80 backdrop-blur-xl border-t border-white/5 z-40">
                <BottomNav />
            </div>
        </div>
    );
};

export default ScannerPage;
