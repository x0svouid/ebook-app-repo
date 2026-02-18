
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

const EditUserPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Mock state 
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bloc: '',
        secteur: '',
        role: 'LEADER' as 'ADMIN' | 'LEADER',
        active: true,
        avatar: ''
    });

    useEffect(() => {
        if (id) fetchUser(id);
    }, [id]);

    const fetchUser = async (userId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    name: data.full_name || '',
                    email: data.email || '',
                    bloc: data.bloc || '',
                    secteur: data.secteur || '',
                    role: data.role === 'admin' ? 'ADMIN' : 'LEADER',
                    active: data.active ?? true,
                    avatar: data.avatar_url || ''
                });
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            alert("Erreur lors du chargement de l'utilisateur");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!id) return;

        try {
            const updates = {
                full_name: formData.name,
                // email: formData.email, // Email usually handled by Auth, updating in profiles is fine for display but won't change auth email unless using admin api
                bloc: formData.bloc,
                secteur: formData.secteur,
                role: formData.role === 'ADMIN' ? 'admin' : 'leader',
                active: formData.active,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', id);

            if (error) throw error;

            alert("Modifications enregistrées avec succès !");
            navigate('/admin/users');
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Erreur lors de l'enregistrement");
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return;

        try {
            // Note: Deleting a user from 'profiles' does not delete them from Supabase Auth.
            // For a complete delete, we would need a server-side function.
            // For now, we delete the profile or mark as inactive. 
            // Let's try to delete the profile row.
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert("Utilisateur supprimé (profil).");
            navigate('/admin/users');
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Erreur lors de la suppression");
        }
    };

    return (
        <div className="bg-[#0b1416] min-h-screen text-slate-100 font-display pb-32 relative overflow-x-hidden selection:bg-primary/30">
            {/* Styles specific to this page */}
            <style>{`
                .glass-input-container {
                     background-color: #121e21;
                     border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .glass-input {
                    background: transparent;
                    color: white;
                }
                .glass-input::placeholder {
                    color: #64748b;
                }
                .role-card {
                    background-color: #121e21;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.2s ease;
                }
                .role-card-selected {
                     /* Green glow for leader, purple for admin handled inline */
                     background-color: rgba(255, 255, 255, 0.03);
                }
            `}</style>

            <header className="px-5 pt-6 pb-2 flex items-center justify-between relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#18282b] text-white hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                </button>
                <h1 className="text-[17px] font-bold tracking-tight text-white/90">
                    Modifier le Profil
                </h1>
                <div className="w-10"></div>
            </header>

            <main className="px-5 relative z-0 mt-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="relative mb-4">
                        <div className="w-[110px] h-[110px] rounded-full p-[3px] bg-gradient-to-b from-[#19c3e6] to-purple-500">
                            <div className="w-full h-full rounded-full border-[3px] border-[#0b1416] overflow-hidden">
                                <img alt="Avatar" className="w-full h-full object-cover" src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`} />
                            </div>
                        </div>
                        {/* Pencil Icon */}
                        <div className="absolute bottom-1 right-0 w-8 h-8 rounded-full bg-[#1a2c30] border border-white/10 flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-xs text-white">edit</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-white mb-0.5">{formData.name}</h2>
                    <p className="text-xs font-medium text-slate-500 tracking-wide">ID: #{id || 'GF-8829'}</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* Nom Complet */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500" htmlFor="fullname">Nom Complet</label>
                        <div className="glass-input-container rounded-[14px] flex items-center px-4 py-3.5">
                            {/* Icon placeholder if needed, screenshot shows simple input */}
                            <input
                                className="glass-input w-full border-none outline-none text-sm font-medium p-0"
                                id="fullname"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500" htmlFor="email">Email</label>
                        <div className="glass-input-container rounded-[14px] flex items-center px-4 py-3.5">
                            <input
                                className="glass-input w-full border-none outline-none text-sm font-medium p-0"
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Bloc / Secteur Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500" htmlFor="bloc">Bloc</label>
                            <div className="glass-input-container rounded-[14px] flex items-center px-4 py-3.5">
                                <input
                                    className="glass-input w-full border-none outline-none text-sm font-medium p-0"
                                    id="bloc"
                                    type="text"
                                    value={formData.bloc}
                                    onChange={(e) => setFormData({ ...formData, bloc: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500" htmlFor="secteur">Secteur</label>
                            <div className="glass-input-container rounded-[14px] flex items-center px-4 py-3.5">
                                <input
                                    className="glass-input w-full border-none outline-none text-sm font-medium p-0"
                                    id="secteur"
                                    type="text"
                                    value={formData.secteur}
                                    onChange={(e) => setFormData({ ...formData, secteur: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-3 pt-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Rôle</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="cursor-pointer">
                                <input
                                    className="peer sr-only"
                                    name="role"
                                    type="radio"
                                    checked={formData.role === 'ADMIN'}
                                    onChange={() => setFormData({ ...formData, role: 'ADMIN' })}
                                />
                                <div className={`role-card h-[100px] rounded-[18px] flex flex-col items-center justify-center gap-2 hover:bg-white/5 
                                    ${formData.role === 'ADMIN' ? 'border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.15)] bg-[#8b5cf6]/5' : ''}`}>
                                    <span className={`material-symbols-outlined text-2xl ${formData.role === 'ADMIN' ? 'text-purple-400' : 'text-slate-500'}`}>admin_panel_settings</span>
                                    <span className={`text-[11px] font-bold tracking-widest uppercase ${formData.role === 'ADMIN' ? 'text-white' : 'text-slate-500'}`}>Admin</span>
                                </div>
                            </label>
                            <label className="cursor-pointer">
                                <input
                                    className="peer sr-only"
                                    name="role"
                                    type="radio"
                                    checked={formData.role === 'LEADER'}
                                    onChange={() => setFormData({ ...formData, role: 'LEADER' })}
                                />
                                <div className={`role-card h-[100px] rounded-[18px] flex flex-col items-center justify-center gap-2 hover:bg-white/5 
                                    ${formData.role === 'LEADER' ? 'border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-[#10b981]/5' : ''}`}>
                                    <span className={`material-symbols-outlined text-2xl ${formData.role === 'LEADER' ? 'text-emerald-400' : 'text-slate-500'}`}>school</span>
                                    <span className={`text-[11px] font-bold tracking-widest uppercase ${formData.role === 'LEADER' ? 'text-white' : 'text-slate-500'}`}>Leader</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="glass-input-container px-4 py-4 rounded-[18px] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#1a2c30] border border-white/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm text-slate-300">verified_user</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-white">Statut du Compte</span>
                                <span className="text-[11px] text-slate-500">Activer ou suspendre l'accès</span>
                            </div>
                        </div>
                        <div
                            className="relative inline-block w-11 h-6 shrink-0 cursor-pointer"
                            onClick={() => setFormData({ ...formData, active: !formData.active })}
                        >
                            <div className={`absolute w-5 h-5 rounded-full transition-all duration-300 top-[2px] z-10 ${formData.active ? 'right-[2px] bg-white' : 'left-[2px] bg-slate-400'}`}></div>
                            <div className={`block w-full h-full rounded-full transition-colors duration-300 ${formData.active ? 'bg-[#19c3e6]' : 'bg-slate-700'}`}></div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 flex flex-col items-center gap-5 mb-10">
                        <button
                            className="w-full bg-[#19c3e6] hover:bg-[#15adc9] text-[#0b1416] font-bold text-[15px] py-4 rounded-[18px] shadow-[0_0_20px_rgba(25,195,230,0.3)] hover:shadow-[0_0_30px_rgba(25,195,230,0.5)] transition-all active:scale-[0.98]"
                            type="button"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>

                        <button
                            className="flex items-center gap-2 text-[#ef4444] text-[13px] font-medium hover:text-red-400 transition-colors"
                            type="button"
                            onClick={handleDelete}
                        >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            Supprimer l'utilisateur
                        </button>
                    </div>
                </form>
            </main>

            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-[#132d33] to-transparent opacity-30 pointer-events-none"></div>

            <BottomNav />
        </div>
    );
};

export default EditUserPage;
