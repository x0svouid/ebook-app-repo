import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Profile {
    id: string;
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    email: string | null; // Note: email is not directly in profiles usually, but joined from auth.users or manually handled
    role: string;
    subscription_status: string;
    avatar_url: string | null;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== 'admin') {
            navigate('/reader');
            return;
        }
        fetchUsers();
    }, [role]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch profiles
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        // In a real app, you might hit an edge function to update auth.users or just update profile status
        const { error } = await supabase
            .from('profiles')
            .update({ subscription_status: newStatus })
            .eq('id', userId);

        if (error) {
            alert("Erreur lors de la mise à jour.");
        } else {
            setUsers(users.map(u => u.id === userId ? { ...u, subscription_status: newStatus } : u));
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="min-h-screen bg-[#0a1113] flex items-center justify-center text-white">Chargement...</div>;

    return (
        <div className="min-h-screen bg-[#0a1113] text-slate-200 font-display p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <h1 className="text-3xl font-serif font-bold text-white">Utilisateurs</h1>
                        </div>
                        <p className="text-slate-400 ml-10">Gérez les accès et les abonnements.</p>
                    </div>
                    <div className="relative w-full md:w-auto">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500">search</span>
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-80 bg-[#111e21] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                    </div>
                </header>

                <div className="bg-[#111e21] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/2">
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Rôle</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.full_name || 'User'} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="material-symbols-outlined text-slate-500">person</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white max-w-[200px] truncate">{user.full_name || 'Sans nom'}</div>
                                                    <div className="text-xs text-slate-500 max-w-[200px] truncate">{user.email || 'Email masqué'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700/30 text-slate-400'}
                                            `}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                                                ${user.subscription_status === 'active'
                                                    ? 'bg-green-500/5 text-green-400 border-green-500/20'
                                                    : 'bg-red-500/5 text-red-400 border-red-500/20'}
                                            `}>
                                                {user.subscription_status === 'active' ? 'Actif' : 'Bloqué'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => toggleUserStatus(user.id, user.subscription_status)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                                                title={user.subscription_status === 'active' ? "Bloquer l'utilisateur" : "Activer l'utilisateur"}
                                            >
                                                <span className="material-symbols-outlined">
                                                    {user.subscription_status === 'active' ? 'block' : 'check_circle'}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
