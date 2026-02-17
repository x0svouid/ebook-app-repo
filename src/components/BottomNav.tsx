import { useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Search, Settings, User, PlusCircle, Users, LayoutDashboard, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { role } = useAuth();

    const isAdmin = role === 'admin';

    const isActive = (path: string) => {
        if (path === '/reader' && (location.pathname === '/reader' || location.pathname === '/reader/current')) return true;
        return location.pathname === path;
    };

    const navItems = [
        { icon: Home, label: 'Accueil', path: '/reader' },
        { icon: BookOpen, label: 'Lectures', path: '/reader/lectures' },
        { icon: Search, label: 'Découvrir', path: '/search' },
        { icon: User, label: 'Profil', path: '/profile' },
    ];

    const adminItems = [
        { icon: LayoutDashboard, label: 'Board', path: '/admin' },
        { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
        { icon: PlusCircle, label: 'Volumes', path: '/admin/volumes/new' },
    ];

    const currentItems = isAdmin ? adminItems : navItems;

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#111e21]/95 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between pb-safe z-50 lg:hidden">
            {currentItems.map((item, idx) => (
                <button
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive(item.path) ? 'text-primary scale-110' : 'text-slate-400'
                        }`}
                >
                    <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                    <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
                    {isActive(item.path) && (
                        <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(25,195,230,0.6)]" />
                    )}
                </button>
            ))}

            {isAdmin && (
                <button
                    onClick={() => navigate('/admin/scan')}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 absolute left-1/2 -translate-x-1/2 -top-6 ${isActive('/admin/scan') ? 'text-primary' : 'text-white'
                        }`}
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-500 ${isActive('/admin/scan')
                            ? 'bg-primary rotate-0 scale-110 shadow-primary/40'
                            : 'bg-primary/90 -rotate-12 scale-100 shadow-primary/20 hover:rotate-0 hover:scale-110'
                        }`}>
                        <Camera size={28} />
                    </div>
                </button>
            )}
        </div>
    );
};

export default BottomNav;
