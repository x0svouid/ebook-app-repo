import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useReader, LessonWithProgress } from '../../hooks/useReader';
import { useAuth } from '../../context/AuthContext';
import { BottomNav } from '../../components/BottomNav';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { volumes, recentLesson: rawRecentLesson, loading } = useReader();
    const { user } = useAuth();
    const recentLesson = rawRecentLesson as LessonWithProgress | null;

    const quickActions = [
        { title: 'Scanner', icon: 'document_scanner', path: '/admin/scan', color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { title: 'Utilisateurs', icon: 'group', path: '/admin/users', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { title: 'Nouveau Livre', icon: 'library_add', path: '/admin/volumes/new', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { title: 'Analytiques', icon: 'bar_chart', path: '/admin/stats', color: 'text-amber-400', bg: 'bg-amber-400/10' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background-dark flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-dark min-h-screen text-slate-100 font-display pb-32">
            {/* Header section with glassmorphism */}
            <div className="relative pt-12 px-6 pb-8 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[0%] right-[-5%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[60px]"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-slate-400 font-medium tracking-wide uppercase text-xs">Espace Administrateur</p>
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-300">notifications</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-serif font-bold text-white mb-2 leading-tight">
                        Bonjour, <span className="text-primary">{user?.user_metadata?.full_name?.split(' ')[0] || 'Admin'}</span>
                    </h1>
                    <p className="text-slate-400 text-sm max-w-[280px]">Gérez votre collection de manuels et suivez les progrès des membres.</p>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="px-6 mb-10">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">Actions Rapides</h2>
                <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action) => (
                        <div
                            key={action.title}
                            onClick={() => navigate(action.path)}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-3 active:scale-95 transition-all hover:bg-white/10 group cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-xl ${action.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <span className={`material-symbols-outlined ${action.color} text-2xl`}>{action.icon}</span>
                            </div>
                            <span className="text-xs font-bold text-slate-200">{action.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress/Stats Summary */}
            <div className="px-6 mb-10">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16"></div>

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1">Résumé Collection</h3>
                            <p className="text-slate-400 text-xs">Aperçu global de l'activité</p>
                        </div>
                        <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400">trending_up</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Manuels</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">{volumes.length}</span>
                                <span className="text-[10px] text-emerald-400 font-bold">+2</span>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Membres</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">42</span>
                                <span className="text-[10px] text-emerald-400 font-bold">+5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity or Manuals */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-6 px-1">
                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Derniers Ajouts</h2>
                    <Link to="/reader" className="text-primary text-xs font-bold flex items-center gap-1">
                        Voir tout <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                </div>

                <div className="space-y-4">
                    {volumes.slice(0, 3).map((volume) => (
                        <div
                            key={volume.id}
                            onClick={() => navigate(`/admin/volumes/edit/${volume.id}`)}
                            className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <img
                                src={volume.cover_url || 'https://via.placeholder.com/150'}
                                alt={volume.title}
                                className="w-16 h-20 object-cover rounded-lg shadow-lg"
                            />
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-sm mb-1 line-clamp-1">{volume.title}</h3>
                                <p className="text-slate-400 text-xs mb-3">{volume.author}</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px] text-slate-500">list</span>
                                        <span className="text-[10px] text-slate-500 font-bold">12 Sérié</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px] text-slate-500">schedule</span>
                                        <span className="text-[10px] text-slate-500 font-bold">Ajouté hier</span>
                                    </div>
                                </div>
                            </div>
                            <button className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined">edit</span>
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={() => navigate('/admin/volumes/new')}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-primary hover:border-primary/50 transition-all font-bold text-sm bg-white/[0.02]"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Ajouter un nouveau manuel
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default AdminDashboard;
