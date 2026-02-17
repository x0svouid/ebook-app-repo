import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
    id: string;
    email: string;
    role: 'admin' | 'leader' | 'user';
    full_name: string | null;
    avatar_url: string | null;
    first_name: string | null;
    last_name: string | null;
    secteur: string | null;
    bloc: string | null;
    active: boolean;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    role: 'admin' | 'leader' | null;
    profile: Profile | null;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<'admin' | 'leader' | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for changes on auth state (sign in, sign out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setRole(null);
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
            } else {
                setProfile(data);
                setRole(data?.role as 'admin' | 'leader' | null);
            }
        } catch (err) {
            console.error('Unexpected error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/reader`
            }
        });
        if (error) console.error('Error signing in with Google:', error.message);
    };

    const signInWithApple = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
            options: {
                redirectTo: `${window.location.origin}/reader`
            }
        });
        if (error) console.error('Error signing in with Apple:', error.message);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error.message);
    };

    const updateProfile = async (data: any) => {
        const { error } = await supabase.auth.updateUser({
            data: data
        });
        if (error) throw error;

        // Manually update local state to reflect changes immediately
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // Refresh profile
        if (user) await fetchProfile(user.id);
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, role, profile, signInWithGoogle, signInWithApple, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
