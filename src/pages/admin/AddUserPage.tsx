import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

const AddUserPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        bloc: '',
        secteur: '',
        role: 'LEADER' as 'ADMIN' | 'LEADER',
        active: true,
        sendEmail: true
    });

    const handleCreate = async () => {
        if (!formData.email || !formData.password || !formData.name) {
            alert("Veuillez remplir les champs obligatoires (Nom, Email, Mot de passe).");
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase.functions.invoke('create-user', {
                body: {
                    email: formData.email,
                    password: formData.password,
                    user_metadata: { full_name: formData.name },
                    profile_data: {
                        bloc: formData.bloc,
                        secteur: formData.secteur,
                        role: formData.role.toLowerCase(),
                        active: formData.active
                    },
                    send_email: formData.sendEmail
                }
            });

            if (error) throw error;
            if (data?.error) throw new Error(data.error);

            alert("Utilisateur créé avec succès !");
            navigate('/admin/users');
        } catch (error: any) {
            console.error("Error creating user:", error);
            alert(`Erreur: ${error.message || 'Une erreur est survenue'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#0b1416] min-h-screen text-slate-100 font-display pb-32">
            <style>{`
                .glass-input-container { background-color: #121e21; border: 1px solid rgba(255, 255, 255, 0.05); }
                .glass-input { background: transparent; color: white; }
                .role-card { background-color: #121e21; border: 1px solid rgba(255, 255, 255, 0.05); transition: all 0.2s ease; }
            `}</style>
            <header className="px-5 pt-6 pb-2 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#18282b]"><span className="material-symbols-outlined">arrow_back</span></button>
                <h1 className="text-[17px] font-bold">Ajouter un Utilisateur</h1>
                <div className="w-10"></div>
            </header>
            <main className="px-5 mt-6">
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Nom Complet *</label>
                        <div className="glass-input-container rounded-[14px] px-4 py-3.5"><input className="glass-input w-full text-sm font-medium" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Email *</label>
                        <div className="glass-input-container rounded-[14px] px-4 py-3.5"><input className="glass-input w-full text-sm font-medium" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Mot de passe provisoire *</label>
                        <div className="glass-input-container rounded-[14px] px-4 py-3.5"><input className="glass-input w-full text-sm font-medium" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Bloc</label>
                            <div className="glass-input-container rounded-[14px] px-4 py-3.5"><input className="glass-input w-full text-sm font-medium" type="text" value={formData.bloc} onChange={(e) => setFormData({ ...formData, bloc: e.target.value })} /></div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase text-slate-500">Secteur</label>
                            <div className="glass-input-container rounded-[14px] px-4 py-3.5"><input className="glass-input w-full text-sm font-medium" type="text" value={formData.secteur} onChange={(e) => setFormData({ ...formData, secteur: e.target.value })} /></div>
                        </div>
                    </div>
                    <div className="space-y-3 pt-2">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Rôle</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="cursor-pointer" onClick={() => setFormData({...formData, role: 'ADMIN'})}>
                                <div className={`role-card h-[100px] rounded-[18px] flex flex-col items-center justify-center gap-2 ${formData.role === 'ADMIN' ? 'border-[#8b5cf6]' : ''}`}>
                                    <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                                    <span className="text-[11px] font-bold">Admin</span>
                                </div>
                            </label>
                            <label className="cursor-pointer" onClick={() => setFormData({...formData, role: 'LEADER'})}>
                                <div className={`role-card h-[100px] rounded-[18px] flex flex-col items-center justify-center gap-2 ${formData.role === 'LEADER' ? 'border-[#10b981]' : ''}`}>
                                    <span className="material-symbols-outlined text-2xl">school</span>
                                    <span className="text-[11px] font-bold">Leader</span>
                                </div>
                            </label>
                        </div>
                    </div>
                    <button onClick={handleCreate} disabled={loading} className="w-full bg-[#19c3e6] text-[#0b1416] font-bold py-4 rounded-[18px]">{loading ? 'Création...' : 'Créer l\'utilisateur'}</button>
                </form>
            </main>
            <BottomNav />
        </div>
    );
};
export default AddUserPage;