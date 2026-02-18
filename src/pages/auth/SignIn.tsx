import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
// import { useAuth } from '../../context/AuthContext'; // Social auth disabled to match screenshot

const SignIn: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    // const { signInWithGoogle, signInWithApple } = useAuth();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/reader');
        }
    };

    return (
        <div className="bg-[#0a1113] font-display text-slate-200 antialiased min-h-screen flex flex-col justify-center items-center relative overflow-hidden selection:bg-primary/30">
            {/* Background gradient similar to screenshot */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f1d22] to-[#0a1113] pointer-events-none"></div>

            <main className="w-full max-w-sm px-6 relative z-10 flex flex-col items-center">

                {/* Logo Section */}
                <div className="mb-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl bg-[#0f1d22] border border-white/5 flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(25,195,230,0.15)] relative">
                        <span className="text-3xl font-extrabold text-primary tracking-tighter font-display">Oikos</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Connexion</h1>
                    <p className="text-slate-400 text-sm text-center max-w-[280px] leading-relaxed">
                        Accédez à votre espace pédagogique premium.
                    </p>
                </div>

                {error && (
                    <div className="w-full mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="w-full space-y-5" onSubmit={handleEmailLogin}>
                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full bg-[#162024] border border-white/5 rounded-xl py-3.5 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-medium"
                            id="email"
                            placeholder="nom@exemple.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest" htmlFor="password">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <input
                                className="w-full bg-[#162024] border border-white/5 rounded-xl py-3.5 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm font-medium tracking-widest"
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-500 hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-0">
                        <a className="text-xs font-medium text-primary hover:text-cyan-300 transition-colors" href="#">
                            Mot de passe oublié ?
                        </a>
                    </div>

                    <button
                        className="w-full bg-primary text-[#0a1113] font-bold text-base py-3.5 rounded-xl hover:bg-cyan-300 transition-all active:scale-[0.98] shadow-[0_0_20px_-5px_rgba(25,195,230,0.4)] flex items-center justify-center gap-2 mt-2"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <span>Connexion...</span>
                        ) : (
                            <>
                                <span>Se connecter</span>
                                <span className="material-symbols-outlined text-[20px] font-bold">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Vous n'avez pas de compte ?
                        <Link to="/register" className="text-white font-bold hover:text-primary transition-colors ml-1 inline-flex items-center gap-1 group">
                            Créer un compte
                            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">chevron_right</span>
                        </Link>
                    </p>
                </div>

                {/* Decorative bottom bar/indicator usually seen on mobile, keeping subtle */}
                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full opacity-50"></div>
            </main>
        </div>
    );
};

export default SignIn;
