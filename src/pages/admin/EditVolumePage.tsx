import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Database } from '../../types/supabase';

// type Volume = Database['public']['Tables']['volumes']['Row'] & { author?: string; description?: string }; // Removed unused
type Series = Database['public']['Tables']['series']['Row'] & { lessons: { count: number }[] };

const EditVolumePage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { role } = useAuth();

    // State
    const [seriesList, setSeriesList] = useState<Series[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [title, setTitle] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showAddChapterModal, setShowAddChapterModal] = useState(false);
    const [newChapterTitle, setNewChapterTitle] = useState('');

    // Fetch Data
    useEffect(() => {
        if (role && role !== 'admin') {
            navigate('/reader');
            return;
        }
        if (id) {
            fetchVolumeData(id);
        }
    }, [id, role]);

    const fetchVolumeData = async (volumeId: string) => {
        setLoading(true);
        try {
            // Fetch Volume
            const { data: volData, error: volError } = await supabase
                .from('volumes')
                .select('*')
                .eq('id', volumeId)
                .single();

            if (volError) throw volError;

            // @ts-ignore
            // setVolume(volData); // Removed
            setTitle(volData.title);
            setIsPublished(volData.is_published || false);
            // @ts-ignore
            setAuthor(volData.author || '');
            // @ts-ignore
            setDescription(volData.description || '');
            setCoverUrl(volData.cover_url);

            // Fetch Series with Lesson Count
            const { data: seriesData, error: seriesError } = await supabase
                .from('series')
                .select('*, lessons(count)')
                .eq('volume_id', volumeId)
                .order('order_index');

            if (seriesError) throw seriesError;
            // @ts-ignore
            setSeriesList(seriesData || []);

        } catch (error) {
            console.error("Error fetching volume:", error);
            alert("Erreur lors du chargement du manuel.");
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateSeriesTitle = async (seriesId: number, currentTitle: string) => {
        const newTitle = prompt("Nouveau titre du chapitre :", currentTitle);
        if (newTitle && newTitle !== currentTitle) {
            const { error } = await supabase
                .from('series')
                .update({ title: newTitle })
                .eq('id', seriesId);

            if (error) {
                alert("Erreur lors de la mise à jour.");
            } else {
                if (id) fetchVolumeData(id);
            }
        }
    };

    const handleAddSeries = async () => {
        if (!id || !newChapterTitle.trim()) return;

        const nextOrder = seriesList.length > 0
            ? Math.max(...seriesList.map(s => s.order_index)) + 1
            : 0;

        const { error } = await supabase
            .from('series')
            .insert({
                volume_id: parseInt(id),
                title: newChapterTitle.trim(),
                order_index: nextOrder
            });

        if (error) {
            console.error("Add chapter error:", error);
            alert("Erreur lors de la création : " + error.message);
        } else {
            setNewChapterTitle('');
            setShowAddChapterModal(false);
            fetchVolumeData(id);
        }
    };

    const handleDeleteSeries = async (seriesId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce chapitre ? Cette action est irréversible.")) return;

        const { error } = await supabase
            .from('series')
            .delete()
            .eq('id', seriesId);

        if (error) {
            console.error("Delete series error:", error);
            alert("Erreur lors de la suppression : " + error.message);
        } else {
            if (id) fetchVolumeData(id);
        }
    };

    const handleDeleteVolume = async () => {
        if (!confirm("ATTENTION : Vous êtes sur le point de supprimer TOUT le manuel, y compris tous les chapitres et leçons associés.\n\nÊtes-vous ABSOLUMENT sûr ?")) return;

        const { error } = await supabase
            .from('volumes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Delete volume error:", error);
            alert("Erreur lors de la suppression du manuel : " + error.message);
        } else {
            alert("Manuel supprimé avec succès.");
            navigate('/reader');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let finalCoverUrl = coverUrl;

            // Upload new cover if selected
            if (coverFile) {
                const fileExt = coverFile.name.split('.').pop();
                const fileName = `cover_${Date.now()}.${fileExt}`;
                const filePath = `covers/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, coverFile);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                finalCoverUrl = data.publicUrl;
            }

            // Update Volume
            const { error: updateError } = await supabase
                .from('volumes')
                .update({
                    title,
                    // @ts-ignore
                    author,
                    description,
                    is_published: isPublished,
                    cover_url: finalCoverUrl
                })
                .eq('id', id);

            if (updateError) throw updateError;

            alert("Modifications enregistrées !");
            navigate('/reader'); // Or stay?

        } catch (error: any) {
            console.error("Save error:", error);
            alert("Erreur sauvegarde : " + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#0a1113] flex items-center justify-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-[#0a1113] text-slate-200 font-display p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-white">Modifier le Manuel</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Column: Cover */}
                    <div className="md:col-span-4 space-y-4">
                        <h2 className="text-cyan-500 font-bold text-xs uppercase tracking-widest mb-2">Couverture</h2>
                        <div className="bg-[#111e21] rounded-xl p-4 border border-white/5 text-center">
                            <div className="aspect-[2/3] w-48 mx-auto bg-slate-800 rounded-lg mb-4 overflow-hidden relative group">
                                <img
                                    src={coverPreview || coverUrl || ''}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <p className="text-slate-500 text-[10px] mb-3">
                                Formats acceptés : JPG, PNG.<br />
                                Taille recommandée : 1200x1800px.
                            </p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-2 bg-[#18282c] border border-white/10 rounded-lg text-white font-medium text-xs hover:border-cyan-500/50 hover:bg-[#1f3035] transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm text-cyan-500">image</span>
                                Échanger
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleCoverChange}
                            />
                        </div>
                    </div>

                    {/* Right Column: Metadata & Chapters */}
                    <div className="md:col-span-8 space-y-6">
                        {/* Metadata Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[#5f747a] text-[10px] font-bold uppercase mb-1">Statut</label>
                                <button
                                    onClick={() => setIsPublished(!isPublished)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${isPublished
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                        : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-4 rounded-full relative transition-colors ${isPublished ? 'bg-green-500' : 'bg-slate-600'}`}>
                                            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isPublished ? 'left-4.5' : 'left-0.5'}`} style={{ left: isPublished ? '18px' : '2px' }}></div>
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-wider">
                                            {isPublished ? 'Publié' : 'Brouillon'}
                                        </span>
                                    </div>
                                    <span className="material-symbols-outlined text-lg">
                                        {isPublished ? 'public' : 'lock'}
                                    </span>
                                </button>
                            </div>
                            <div>
                                <label className="block text-[#5f747a] text-[10px] font-bold uppercase mb-1">Titre du manuel</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-[#111e21] border border-white/10 rounded-lg p-3 text-white placeholder-white/20 focus:border-cyan-500 outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[#5f747a] text-[10px] font-bold uppercase mb-1">Nom de l'auteur</label>
                                <input
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Ex: Jean-Michel Blanquer"
                                    className="w-full bg-[#111e21] border border-white/10 rounded-lg p-3 text-white placeholder-white/20 focus:border-cyan-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Chapters Management */}
                        <div>
                            <div className="flex justify-between items-center mb-4 mt-8">
                                <h2 className="text-cyan-500 font-bold text-xs uppercase tracking-widest">Gestion des Chapitres</h2>
                                <span className="text-xs text-[#1f3a40] bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/30 font-medium">
                                    {seriesList.length} chapitres
                                </span>
                            </div>

                            <div className="space-y-3">
                                {seriesList.map((series) => (
                                    <div key={series.id} className="bg-[#111e21] border border-white/5 rounded-xl p-4 flex items-center gap-4 group hover:border-white/10 transition-colors">
                                        <div className="text-slate-600 cursor-move">
                                            <span className="material-symbols-outlined text-xl">drag_indicator</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white font-bold text-sm">{series.title}</h3>
                                            <p className="text-xs text-slate-500">
                                                {/* @ts-ignore */}
                                                {series.lessons?.[0]?.count || 0} pages
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleUpdateSeriesTitle(series.id, series.title)}
                                                className="px-3 py-1.5 bg-[#18282c] text-slate-300 text-xs rounded-lg hover:text-white transition-colors"
                                            >
                                                Éditer le titre
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSeries(series.id)}
                                                className="w-8 h-8 flex items-center justify-center bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                                title="Supprimer le chapitre"
                                            >
                                                <span className="material-symbols-outlined text-base">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => setShowAddChapterModal(true)}
                                    className="w-full py-4 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all group"
                                >
                                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">add_circle</span>
                                    Ajouter un chapitre
                                </button>

                                {/* Add Chapter Modal */}
                                {showAddChapterModal && (
                                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddChapterModal(false)}>
                                        <div className="bg-[#111e21] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                                            <h3 className="text-white font-bold text-lg mb-1">Nouveau chapitre</h3>
                                            <p className="text-slate-400 text-sm mb-4">Entrez le titre du nouveau chapitre.</p>
                                            <input
                                                type="text"
                                                value={newChapterTitle}
                                                onChange={(e) => setNewChapterTitle(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddSeries(); }}
                                                placeholder="Ex: Chapitre 1 - Introduction"
                                                autoFocus
                                                className="w-full bg-[#0a1113] border border-white/10 rounded-lg p-3 text-white placeholder-white/20 focus:border-cyan-500 outline-none transition-colors mb-4"
                                            />
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => { setShowAddChapterModal(false); setNewChapterTitle(''); }}
                                                    className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                                                >
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={handleAddSeries}
                                                    disabled={!newChapterTitle.trim()}
                                                    className="flex-1 py-2.5 bg-cyan-500 text-[#0a1113] rounded-lg text-sm font-bold hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Créer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="pt-6 space-y-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0a1113] font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>

                            <button
                                onClick={handleDeleteVolume}
                                className="w-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold py-3 rounded-xl transition-all"
                            >
                                Supprimer le Manuel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditVolumePage;
