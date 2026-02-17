import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, Camera, Mail, Shield, Save, Loader, MapPin, Grid } from 'lucide-react';

export default function ProfilePage() {
    const { user, profile, loading: authLoading } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [secteur, setSecteur] = useState('');
    const [bloc, setBloc] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (profile) {
            setFirstName(profile.first_name || '');
            setLastName(profile.last_name || '');
            setSecteur(profile.secteur || '');
            setBloc(profile.bloc || '');
            // Fallback for migration: if separated names missing, try to split full_name
            if (!profile.first_name && !profile.last_name && profile.full_name) {
                const parts = profile.full_name.split(' ');
                setFirstName(parts[0] || '');
                setLastName(parts.slice(1).join(' ') || '');
            }
            setAvatarUrl(profile.avatar_url);
        }
    }, [profile]);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setMessage(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `avatars/${user?.id}/${fileName}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            // 3. Update State & DB immediately
            setAvatarUrl(publicUrl);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user?.id);

            if (updateError) throw updateError;

            setMessage({ type: 'success', text: 'Photo de profil mise à jour !' });
        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            setMessage({ type: 'error', text: error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            setMessage(null);

            const updates = {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`, // Maintain full_name sync
                secteur: secteur,
                bloc: bloc,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user?.id);

            if (error) throw error;
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) return <div className="min-h-screen bg-[#0a1618] flex items-center justify-center text-white">Chargement...</div>;

    const displayName = (firstName || lastName) ? `${firstName} ${lastName}` : (profile?.full_name || user?.email);

    return (
        <div className="min-h-screen bg-[#0a1618] pb-24 pt-20 px-4">
            <div className="max-w-md mx-auto space-y-8">

                <h1 className="text-2xl font-serif text-white mb-6">Mon Profil</h1>

                <div className="bg-[#111e21] border border-white/5 rounded-2xl p-6 space-y-6 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#19c3e6]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    {/* Avatar Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-2 border-[#19c3e6]/30 overflow-hidden bg-white/5 flex items-center justify-center relative">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-slate-500" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader className="w-6 h-6 text-[#19c3e6] animate-spin" />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-[#19c3e6] rounded-full text-[#0a1618] shadow-lg cursor-pointer hover:bg-[#19c3e6]/90 transition-colors">
                                <Camera size={16} />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={uploadAvatar}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                        <p className="mt-4 text-white font-serif text-lg">{displayName}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/5">
                                {profile?.role || 'Membre'}
                            </span>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="space-y-4 pt-4 border-t border-white/5">

                        {/* Email (Read-only) */}
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                <Mail size={12} /> Email
                            </label>
                            <input
                                value={user?.email || ''}
                                disabled
                                className="w-full bg-[#0a1618] border border-white/5 rounded-lg p-3 text-slate-400 text-sm font-medium"
                            />
                        </div>

                        {/* Names */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                    <User size={12} /> Prénom
                                </label>
                                <input
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full bg-[#0a1618] border border-white/10 focus:border-[#19c3e6]/50 rounded-lg p-3 text-white text-sm font-medium transition-colors outline-none"
                                    placeholder="Prénom"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                    <User size={12} /> Nom
                                </label>
                                <input
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full bg-[#0a1618] border border-white/10 focus:border-[#19c3e6]/50 rounded-lg p-3 text-white text-sm font-medium transition-colors outline-none"
                                    placeholder="Nom"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                    <MapPin size={12} /> Secteur
                                </label>
                                <input
                                    value={secteur}
                                    onChange={(e) => setSecteur(e.target.value)}
                                    className="w-full bg-[#0a1618] border border-white/10 focus:border-[#19c3e6]/50 rounded-lg p-3 text-white text-sm font-medium transition-colors outline-none"
                                    placeholder="Secteur"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                    <Grid size={12} /> Bloc
                                </label>
                                <input
                                    value={bloc}
                                    onChange={(e) => setBloc(e.target.value)}
                                    className="w-full bg-[#0a1618] border border-white/10 focus:border-[#19c3e6]/50 rounded-lg p-3 text-white text-sm font-medium transition-colors outline-none"
                                    placeholder="Bloc"
                                />
                            </div>
                        </div>

                        {/* Role (Read-only) */}
                        <div className="space-y-1">
                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                <Shield size={12} /> Rôle & Permissions
                            </label>
                            <div className="w-full bg-[#0a1618] border border-white/5 rounded-lg p-3 text-slate-400 text-xs leading-relaxed">
                                {profile?.role === 'admin' ? (
                                    "Accès complet à l'administration, scanner, gestion des utilisateurs."
                                ) : profile?.role === 'leader' ? (
                                    "Accès au scanner et à la gestion de votre groupe."
                                ) : (
                                    "Accès à la lecture et au suivi de progression."
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                        {message && (
                            <div className={`text-xs p-3 rounded-lg mb-4 text-center ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="w-full py-3 bg-[#19c3e6] text-[#0a1618] font-bold rounded-lg hover:bg-[#19c3e6]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {saving ? (
                                <Loader size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    Enregistrer les modifications
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
