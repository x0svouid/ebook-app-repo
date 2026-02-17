import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useAuth } from '../context/AuthContext';

type Volume = Database['public']['Tables']['volumes']['Row'];
type Series = Database['public']['Tables']['series']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type UserProgress = Database['public']['Tables']['user_progress']['Row'];

export interface LessonWithProgress extends Lesson {
    progress?: UserProgress;
    series?: Series & { volumes?: Volume };
}

export function useReader() {
    const { user, role } = useAuth();
    const [volumes, setVolumes] = useState<Volume[]>([]);
    const [recentLesson, setRecentLesson] = useState<LessonWithProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [volumeDetails, setVolumeDetails] = useState<Volume & { series: (Series & { lessons: (Lesson & { chapters?: { id: number; title: string; order_index: number }[] })[] })[] } | null>(null);

    // Fetch all volumes (books)
    const fetchVolumes = async () => {
        try {
            let query = supabase
                .from('volumes')
                .select('*')
                .order('created_at', { ascending: false });

            // Only filter by published if NOT admin
            if (role !== 'admin') {
                query = query.eq('is_published', true);
            }

            const { data, error } = await query;

            if (error) throw error;
            setVolumes(data || []);
        } catch (err: any) {
            console.error('Error fetching volumes:', err);
            setError(err.message);
        }
    };

    // Fetch details for a specific volume
    const fetchVolumeDetails = async (volumeId: number) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('volumes')
                // Add chapters to the select query
                .select('*, series(*, lessons(*, chapters(id, title, order_index)))')
                .eq('id', volumeId)
                .single();

            if (error) throw error;

            // Sort series and lessons and chapters
            if (data && data.series) {
                data.series.sort((a: any, b: any) => a.order_index - b.order_index);
                data.series.forEach((s: any) => {
                    if (s.lessons) {
                        s.lessons.sort((a: any, b: any) => a.number - b.number);
                        // Sort chapters if they exist
                        s.lessons.forEach((l: any) => {
                            if (l.chapters) {
                                l.chapters.sort((a: any, b: any) => a.order_index - b.order_index);
                            }
                        });
                    }
                });
            }

            // @ts-ignore
            setVolumeDetails(data);
        } catch (err: any) {
            console.error('Error fetching volume details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch the most recently read lesson
    const fetchRecentProgress = async () => {
        if (!user) return;

        try {
            // Get the most recently updated progress entry
            const { data: progressData, error: progressError } = await supabase
                .from('user_progress')
                .select('*, lessons(*, series(*, volumes(*)))')
                .eq('user_id', user.id)
                .order('last_read_at', { ascending: false })
                .limit(1)
                .single();

            if (progressError && progressError.code !== 'PGRST116') { // Ignore "no rows found"
                throw progressError;
            }

            if (progressData && progressData.lessons) {
                // @ts-ignore - Supabase type inference for joined tables can be tricky
                const lesson: Lesson = progressData.lessons;
                // @ts-ignore
                const series: Series & { volumes: Volume } = lesson.series;

                setRecentLesson({
                    ...lesson,
                    // @ts-ignore
                    series: series,
                    progress: {
                        user_id: progressData.user_id,
                        lesson_id: progressData.lesson_id,
                        is_completed: progressData.is_completed,
                        scroll_percentage: progressData.scroll_percentage,
                        last_read_at: progressData.last_read_at
                    }
                });
            }
        } catch (err: any) {
            console.error('Error fetching recent progress:', err);
            // Don't set global error for this, just log it
        }
    };

    const [readingHistory, setReadingHistory] = useState<UserProgress[]>([]);

    const fetchReadingHistory = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('user_progress')
                .select('*, lessons(*, series(*, volumes(*)))')
                .eq('user_id', user.id)
                .order('last_read_at', { ascending: false });

            if (error) throw error;
            setReadingHistory(data || []);
        } catch (err: any) {
            console.error('Error fetching reading history:', err);
        }
    };

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            await Promise.all([fetchVolumes(), fetchRecentProgress(), fetchReadingHistory()]);
            setLoading(false);
        };

        // Only fetch initial data if we're not using the hook for a specific volume detail view
        // logic could be improved but keeping it simple for now
        initData();
    }, [user, role]);

    // Fetch details for a specific lesson (including chapters)
    const [lessonDetails, setLessonDetails] = useState<Lesson & { chapters: Database['public']['Tables']['chapters']['Row'][], series: Series | null } | null>(null);

    const fetchLessonDetails = async (lessonId: number) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('lessons')
                .select('*, chapters(*), series(*)')
                .eq('id', lessonId)
                .single();

            if (error) throw error;

            if (data && data.chapters) {
                // @ts-ignore
                data.chapters.sort((a: any, b: any) => a.order_index - b.order_index);
            }

            // @ts-ignore
            setLessonDetails(data);
        } catch (err: any) {
            console.error('Error fetching lesson details:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update reading progress
    const updateProgress = async (lessonId: number, scrollPercentage: number, isCompleted: boolean = false) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('user_progress')
                .upsert({
                    user_id: user.id,
                    lesson_id: lessonId,
                    scroll_percentage: Math.round(scrollPercentage),
                    is_completed: isCompleted,
                    last_read_at: new Date().toISOString()
                }, { onConflict: 'user_id, lesson_id' });

            if (error) throw error;
        } catch (err: any) {
            console.error('Error updating progress:', err);
            // Silent error on progress update to not disrupt reading
        }
    };

    const updateVolumeCover = async (volumeId: number, file: File) => {
        try {
            setLoading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(fileName);

            const coverUrl = publicUrlData.publicUrl;

            // 3. Update Volume Record
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
        fetchVolumes,
        fetchRecentProgress,
        refresh: async () => {
            setLoading(true);
            await Promise.all([fetchVolumes(), fetchRecentProgress(), fetchReadingHistory()]);
            setLoading(false);
        }
    };
}
