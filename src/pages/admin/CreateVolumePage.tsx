import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

const CreateVolumePage: React.FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageTrigger = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleCreate = async () => {
        if (!title.trim()) {
            alert("Le titre est obligatoire.");
            return;
        }

        try {
            setLoading(true);
            let coverUrl = null;

            // 1. Upload Cover Image if present
            if (coverFile) {
                const fileExt = coverFile.name.split('.').pop();
                const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(fileName, coverFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('images')
                    .getPublicUrl(fileName);

                coverUrl = publicUrlData.publicUrl;
            }

            // 2. Create Volume Record
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

            const { data, error } = await supabase
                .from('volumes')
                .insert({
                    title,
                    author: author || null,
                    cover_url: coverUrl,
                    slug,
                    is_published: false // Default to unpublished
                })
                .select()
                .single();

            if (error) throw error;

            alert("Manuel créé avec succès !");
            navigate(`/admin/volumes/edit/${data.id}`); // Redirect to edit page to add content

        } catch (error: any) {
            console.error('Error creating volume:', error);
            alert(`Erreur: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-dark font-display text-slate-200 antialiased flex flex-col min-h-screen selection:bg-primary/30">
            <main className="flex-1 px-6 pt-12 pb-32 overflow-y-auto no-scrollbar">
                <header className="mb-10 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                        </div>
                        <h1 className="font-serif font-bold text-4xl text-white tracking-tight">Nouveau Manuel</h1>
                        <p className="text-slate-400 text-sm mt-2">Configurez les détails de votre nouvel ouvrage pédagogique.</p>
                    </div>
                </header>

                <section className="mb-10">
                    <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Couverture</h2>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="relative aspect-[3/4] w-48 mx-auto">
                        <div
                            onClick={handleImageTrigger}
                            className={`w-full h-full border-2 border-dashed ${coverPreview ? 'border-primary' : 'border-primary/40'} rounded-2xl flex flex-col items-center justify-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group overflow-hidden relative`}
                        >
                            {coverPreview ? (
                                <img src={coverPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-primary text-4xl mb-3 opacity-60 group-hover:opacity-100 transition-opacity">add_a_photo</span>
                                    <button className="bg-primary/20 text-primary text-xs font-bold py-2 px-4 rounded-full border border-primary/30">
                                        Ajouter une image
                                    </button>
                                </>
                            )}
                            {coverPreview && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white font-medium text-sm">Changer l'image</span>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="space-y-6 mb-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Titre du Manuel</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            placeholder="Ex: Histoire Géographie Terminale"
                            type="text"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Auteur</label>
                        <input
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-4 px-5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            placeholder="Nom de l'auteur ou éditeur"
                            type="text"
                        />
                    </div>
                </section>

                <button
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mb-8"
                >
                    {loading ? 'Création en cours...' : 'Créer le Manuel'}
                </button>

                <section className="mb-10 opacity-50 pointer-events-none grayscale">
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Contenu</h2>
                        <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded ml-2">Disponible après création</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <button className="w-full bg-white/5 backdrop-blur-md p-6 rounded-2xl flex flex-col items-center justify-center gap-4 border border-primary/20 transition-all group">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-glow">
                                <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-white font-bold text-lg">Scanner un chapitre</span>
                                <span className="block text-slate-500 text-xs mt-1">Utilisez l'appareil photo pour numériser</span>
                            </div>
                        </button>
                        <button className="w-full bg-white/5 backdrop-blur-md p-4 rounded-xl flex items-center justify-between px-6 border border-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                                <span className="material-symbols-outlined text-slate-400">picture_as_pdf</span>
                                <span className="text-slate-300 font-medium">Importer un PDF</span>
                            </div>
                            <span className="material-symbols-outlined text-slate-500 text-sm">chevron_right</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Standard Bottom Nav */}
            <BottomNav />
        </div>
    );
};

export default CreateVolumePage;
