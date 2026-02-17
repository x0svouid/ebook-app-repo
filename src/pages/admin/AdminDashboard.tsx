// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReader, LessonWithProgress } from '../../hooks/useReader';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { volumes, recentLesson: rawRecentLesson, loading } = useReader();
    const { role } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalVolumes: 0,
        activeReaders: 0
    });

    const recentLesson = rawRecentLesson as LessonWithProgress | null;

    useEffect(() => {
        if (role !== 'admin') {
            navigate('/reader');
            return;
        }

        const fetchStats = async () => {
            try {
                const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { count: volumesCount } = await supabase.from('volumes').select('*', { count: 'exact', head: true });
                // Mock active readers for now
                setStats({
                    totalUsers: usersCount || 0,
                    totalVolumes: volumesCount || 0,
                    activeReaders: Math.floor((usersCount || 0) * 0.4)
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };

        fetchStats();
    }, [role, navigate]);

    if (loading) return <div className="min-h-screen bg-[#0a1113] flex items-center justify-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-[#0a1113] text-slate-200 font-display p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white mb-2">Tableau de Bord</h1>
                        <p className="text-slate-400">Vue d'ensemble de l'application et gestion du contenu.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => navigate('/admin/users')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                            Utilisateurs
                        </button>
                        <button onClick={() => navigate('/admin/settings')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">
                            Paramètres
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-[#111e21] p-6 rounded-2xl border border-white/5">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Utilisateurs Total</h3>
                        <p className="text-4xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-[#111e21] p-6 rounded-2xl border border-white/5">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Manuels Publiés</h3>
                        <p className="text-4xl font-bold text-white">{stats.totalVolumes}</p>
                    </div>
                    <div className="bg-[#111e21] p-6 rounded-2xl border border-white/5">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Lecteurs Actifs</h3>
                        <p className="text-4xl font-bold text-cyan-400">{stats.activeReaders}</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-cyan-500">library_books</span>
                            Gestion des Manuels
                        </h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/admin/volumes/create')}
                                className="w-full flex items-center justify-between p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl hover:bg-cyan-500/20 transition-all group"
                            >
                                <span className="font-bold text-cyan-400 group-hover:text-cyan-300">Créer un nouveau manuel</span>
                                <span className="material-symbols-outlined text-cyan-500">add_circle</span>
                            </button>

                            {volumes.map(vol => (
                                <div key={vol.id} className="flex items-center justify-between p-4 bg-[#111e21] border border-white/5 rounded-xl hover:border-white/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-14 bg-slate-800 rounded bg-cover bg-center" style={{ backgroundImage: `url(${vol.cover_url})` }}></div>
                                        <div>
                                            <h4 className="font-bold text-white">{vol.title}</h4>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${vol.is_published ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                                                {vol.is_published ? 'Publié' : 'Brouillon'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/admin/volumes/edit/${vol.id}`)}
                                        className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-purple-500">build</span>
                            Actions Rapides
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 bg-[#111e21] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all text-left group">
                                <span className="material-symbols-outlined text-3xl text-slate-600 group-hover:text-white mb-2 transition-colors">group_add</span>
                                <h4 className="font-bold text-slate-300 group-hover:text-white">Inviter</h4>
                            </button>
                            <button className="p-4 bg-[#111e21] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all text-left group">
                                <span className="material-symbols-outlined text-3xl text-slate-600 group-hover:text-white mb-2 transition-colors">notifications</span>
                                <h4 className="font-bold text-slate-300 group-hover:text-white">Annonce</h4>
                            </button>
                            <button className="p-4 bg-[#111e21] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all text-left group">
                                <span className="material-symbols-outlined text-3xl text-slate-600 group-hover:text-white mb-2 transition-colors">analytics</span>
                                <h4 className="font-bold text-slate-300 group-hover:text-white">Rapports</h4>
                            </button>
                            <button className="p-4 bg-[#111e21] border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all text-left group">
                                <span className="material-symbols-outlined text-3xl text-slate-600 group-hover:text-white mb-2 transition-colors">settings_suggest</span>
                                <h4 className="font-bold text-slate-300 group-hover:text-white">Système</h4>
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
