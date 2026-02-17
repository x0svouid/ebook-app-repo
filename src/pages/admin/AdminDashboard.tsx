import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BottomNav } from '../../components/BottomNav';
import { useReader } from '../../hooks/useReader';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { volumes, recentLesson, loading } = useReader();
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || "Directeur";

    return (
        <div className="bg-background-dark text-slate-100 font-display min-h-screen">
            <div className="max-w-md mx-auto min-h-screen pb-32">
                <header className="px-6 pt-12 pb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80 mb-1">Espace Admin</h2>
                        <h1 className="text-3xl font-extrabold text-white">Bonjour, <span className="text-primary">{firstName}</span></h1>
                    </div>
                </header>

                <section className="px-6 mb-8">
                    <h3 className="text-[11px] font-extrabold uppercase text-slate-500 mb-4">Actions Rapides</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button onClick={() => navigate('/admin/volumes/new')} className="bg-gradient-to-br from-primary to-cyan-700 p-6 rounded-2xl text-left text-white">
                            <h4 className="font-bold text-xl">Nouveau Manuel</h4>
                            <p className="text-xs opacity-90">Créer un manuel pour les GF</p>
                        </button>
                    </div>
                </section>
                <BottomNav />
            </div>
        </div>
    );
};
export default AdminDashboard;