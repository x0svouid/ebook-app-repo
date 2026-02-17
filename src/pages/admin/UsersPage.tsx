
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

interface User {
    id: string;
    name: string;
    role: 'ADMIN' | 'LEADER';
    bloc: string;
    secteur: string;
    avatar: string;
    email: string;
    active: boolean;
}

const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<User[]>([]);



    const [loading, setLoading] = useState(true);

    // Fetch users from Supabase
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('full_name');

            if (error) throw error;

            if (data) {
                const mappedUsers: User[] = data.map((profile: any) => ({
                    id: profile.id,
                    name: profile.full_name || 'Sans nom',
                    role: (profile.role === 'admin' ? 'ADMIN' : 'LEADER'),
                    bloc: profile.bloc || '-',
                    secteur: profile.secteur || '-',
                    avatar: profile.avatar_url || '',
                    email: profile.email || '',
                    active: profile.active ?? true
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id: string) => {
        // Optimistic update
        setUsers(users.map(user =>
            user.id === id ? { ...user, active: !user.active } : user
        ));

        // Actual update
        const userToUpdate = users.find(u => u.id === id);
        if (userToUpdate) {
            const { error } = await supabase
                .from('profiles')
                .update({ active: !userToUpdate.active })
                .eq('id', id);

            if (error) {
                console.error("Error updating status:", error);
                // Revert on error
                setUsers(users.map(user =>
                    user.id === id ? { ...user, active: user.active } : user
                ));
            }
        }
    };

    const handleUserClick = (id: string) => {
        navigate(`/admin/users/${id}`);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bloc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.secteur.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#0b1416] min-h-screen text-slate-100 font-display pb-32 relative overflow-x-hidden selection:bg-primary/30">
            {/* Page specific styles to match design exactly */}
            <style>{`
                .user-card {
                    background-color: #121e21; /* Slightly lighter than bg */
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .search-input {
                    background-color: #121e21;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .role-badge-admin {
                    background-color: rgba(91, 33, 182, 0.3); /* Purple tint */
                    border: 1px solid rgba(139, 92, 246, 0.4);
                    color:rgb(196, 181, 253);
                }
                .role-badge-leader {
                    background-color: rgba(6, 78, 59, 0.3); /* Green tint */
                    border: 1px solid rgba(16, 185, 129, 0.4);
                    color:rgb(110, 231, 183);
                }
                /* Custom Toggle Switch matching design */
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #19c3e6;
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #19c3e6;
                }
            `}</style>

            <header className="px-5 pt-12 pb-6 flex items-start justify-between relative z-10">
                <h1 className="text-4xl font-serif font-bold tracking-tight text-white leading-[1.1]">
                    Gestion des<br />Utilisateurs
                </h1>
                <div className="relative">
                    {/* Blue circle button with add icon */}
                    <div
                        className="w-12 h-12 rounded-full bg-[#18363c] flex items-center justify-center relative cursor-pointer hover:bg-[#1f454d] transition-colors"
                        onClick={() => navigate('/admin/users/new')}
                    >
                        <span className="material-symbols-outlined text-[#19c3e6] text-2xl">person_add</span>
                        {/* Notification dot */}
                        <div className="absolute top-2 right-1 w-3 h-3 bg-[#19c3e6] rounded-full border-2 border-[#0b1416]"></div>
                    </div>
                </div>
            </header>

            <div className="px-5 mb-8 relative z-10">
                <div className="flex items-center search-input rounded-xl px-4 py-3.5 shadow-sm">
                    <span className="material-symbols-outlined text-slate-400 mr-3 text-xl">search</span>
                    <input
                        className="bg-transparent border-none outline-none w-full text-[15px] placeholder:text-slate-500 text-white focus:ring-0 p-0 font-medium"
                        placeholder="Rechercher un membre..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="material-symbols-outlined text-slate-400 text-xl cursor-pointer">tune</span>
                </div>
            </div>

            <main className="px-5 space-y-4 relative z-0">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-4 border-slate-700 border-t-[#19c3e6] rounded-full animate-spin"></div>
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className="user-card px-4 py-4 rounded-[20px] flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-transform"
                            onClick={() => handleUserClick(user.id)}
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                {user.avatar ? (
                                    <div className="w-[52px] h-[52px] rounded-full p-[2px] bg-gradient-to-tr from-blue-500 to-purple-500">
                                        <img alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-[#121e21]" src={user.avatar} />
                                    </div>
                                ) : (
                                    <div className="w-[52px] h-[52px] rounded-full bg-slate-700/50 border border-white/10 flex items-center justify-center text-lg font-bold text-slate-300">
                                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-[17px] text-white truncate mb-0.5">
                                    {user.name}
                                </h3>
                                <p className="text-[13px] text-slate-400 font-medium mb-2">
                                    Bloc: {user.bloc} - Secteur: {user.secteur}
                                </p>
                                <span className={`inline-block px-3 py-[3px] rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'role-badge-admin' : 'role-badge-leader'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>

                            {/* Toggle */}
                            <div
                                className="relative inline-block w-11 h-6 shrink-0 z-10"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggle(user.id);
                                }}
                            >
                                <input
                                    readOnly
                                    checked={user.active}
                                    className={`absolute block w-5 h-5 rounded-full appearance-none cursor-pointer transition-all duration-300 top-[2px] z-10 ${user.active ? 'right-[2px] bg-white' : 'left-[2px] bg-slate-400'}`}
                                    type="checkbox"
                                />
                                <div className={`block w-full h-full rounded-full transition-colors duration-300 ${user.active ? 'bg-[#19c3e6]' : 'bg-slate-700'}`}></div>
                            </div>
                        </div>
                    )))}
            </main>

            {/* Background Glows matching Screenshot */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#132d33] to-transparent opacity-40 pointer-events-none"></div>

            <BottomNav />
        </div>
    );
};

export default UsersPage;
