import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Database } from '../types/supabase';

type Volume = Database['public']['Tables']['volumes']['Row'] & {
    series?: (Database['public']['Tables']['series']['Row'] & {
        lessons?: Database['public']['Tables']['lessons']['Row'][]
    })[]
};

type Lesson = Database['public']['Tables']['lessons']['Row'] & {
    chapters?: Database['public']['Tables']['chapters']['Row'][],
    series?: Database['public']['Tables']['series']['Row'] & {
        volumes?: Database['public']['Tables']['volumes']['Row']
    }
};

type Progress = Database['public']['Tables']['user_progress']['Row'];

export function useReader() {
    const { user } = useAuth();
    const [volumes, setVolumes] = useState<Volume[]>([]);
    const [volumeDetails, setVolumeDetails] = useState<Volume | null>(null);
    const [lessonDetails, setLessonDetails] = useState<Lesson | null>(null);
    const [recentLesson, setRecentLesson] = useState<Lesson | null>(null);
    const [readingHistory, setReadingHistory] = useState<(Progress & { lessons: Lesson })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVolumes = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('volumes')
                .select(`
                    *,
                    series (
                        *,
                        lessons (*)
                    )
                `)
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVolumes(data || []);
        } catch (err: any) {
            setError(err.message);
        }
    }, []);

    const fetchVolumeDetails = useCallback(async (volumeId: number) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('volumes')
                .select(`
                    *,
                    series (
                        *,
                        lessons (*)
                    )
                `)
                .eq('id', volumeId)
                .single();

            if (error) throw error;
            setVolumeDetails(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchLessonDetails = useCallback(async (lessonId: number) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('lessons')
                .select(`
                    *,
                    chapters (*),
                    series (
                        *,
                        volumes (*)
                    )
                `)
                .eq('id', lessonId)
                .single();

            if (error) throw error;
            setLessonDetails(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRecentProgress = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('user_progress')
                .select(`
                    *,
                    lessons (
                        *,
                        series (
                            *,
                            volumes (*)
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('last_read_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            if (data) setRecentLesson(data.lessons as any);
        } catch (err: any) {
            setError(err.message);
        }
    }, [user]);

    const fetchReadingHistory = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('user_progress')
                .select(`
                    *,
                    lessons (
                        *,
                        series (
                            *,
                            volumes (*)
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('last_read_at', { ascending: false });

            if (error) throw error;
            setReadingHistory(data as any || []);
        } catch (err: any) {
            setError(err.message);
        }
    }, [user]);

    const updateProgress = async (lessonId: number, scrollPercentage: number, isCompleted: boolean = false) => {
        if (!user) return;
        try {
            const { error } = await supabase
                .from('user_progress')
                .upsert({
                    user_id: user.id,
                    lesson_id: lessonId,
                    scroll_percentage: scrollPercentage,
                    is_completed: isCompleted,
                    last_read_at: new Date().toISOString()
                });

            if (error) throw error;
        } catch (err: any) {
            console.error('Error updating progress:', err);
        }
    };

    const updateVolumeCover = async (volumeId: number, file: File) => {
        try {
            setLoading(true);
            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `covers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('volumes')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl: coverUrl } } = supabase.storage
                .from('volumes')
                .getPublicUrl(filePath);

            // 3. Update DB
            const { error: updateError } = await supabase
                .from('volumes')
                .update({ cover_url: coverUrl })
                .eq('id', volumeId);

            if (updateError) throw updateError;

            // 4. Refresh Data
            await fetchVolumeDetails(volumeId);
            return coverUrl;

        } catch (err: any) {
            console.error('Error updating cover:', err);
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolumes();
        if (user) {
            fetchRecentProgress();
            fetchReadingHistory();
        }
    }, [fetchVolumes, fetchRecentProgress, fetchReadingHistory, user]);

    return {
        volumes,
        volumeDetails,
        lessonDetails,
        recentLesson,
        loading,
        error,
        fetchVolumeDetails,
        fetchLessonDetails,
        updateProgress,
        updateVolumeCover,
        readingHistory,
        fetchReadingHistory,
        refresh: async () => {
            setLoading(true);
            await Promise.all([fetchVolumes(), fetchRecentProgress(), fetchReadingHistory()]);
            setLoading(false);
        }
    };
}
