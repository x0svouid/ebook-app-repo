import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BottomNav } from '../../components/BottomNav';

const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('profiles').select('*').order('full_name');
            if (error) throw error;
            if (data) setUsers(data);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-[#0b1416] min-h-screen text-slate-100 font-display pb-32">
            <header className="px-5 pt-12 pb-6 flex items-start justify-between">
                <h1 className="text-4xl font-serif font-bold text-white">Gestion des<br />Utilisateurs</h1>
                <button onClick={() => navigate('/admin/users/new')} className="w-12 h-12 rounded-full bg-[#18363c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#19c3e6]">person_add</span>
                </button>
            </header>
            <main className="px-5 space-y-4">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-[#121e21] p-4 rounded-[20px] flex items-center gap-4" onClick={() => navigate(`/admin/users/${user.id}`)}>
                        <div className="flex-1">
                            <h3 className="font-bold text-white">{user.full_name}</h3>
                            <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                    </div>
                ))}
            </main>
            <BottomNav />
        </div>
    );
};
export default UsersPage;