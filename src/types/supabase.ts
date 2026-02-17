export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            volumes: {
                Row: {
                    id: number
                    title: string
                    cover_url: string | null
                    slug: string
                    is_published: boolean | null
                    created_at: string | null
                    author: string | null
                    description: string | null
                }
                Insert: {
                    id?: number
                    title: string
                    cover_url?: string | null
                    slug: string
                    is_published?: boolean | null
                    created_at?: string | null
                    author?: string | null
                    description?: string | null
                }
                Update: {
                    id?: number
                    title?: string
                    cover_url?: string | null
                    slug?: string
                    is_published?: boolean | null
                    created_at?: string | null
                    author?: string | null
                    description?: string | null
                }
            }
            series: {
                Row: {
                    id: number
                    volume_id: number | null
                    title: string
                    order_index: number
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    volume_id?: number | null
                    title: string
                    order_index: number
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    volume_id?: number | null
                    title?: string
                    order_index?: number
                    created_at?: string | null
                }
            }
            lessons: {
                Row: {
                    id: number
                    series_id: number | null
                    number: number
                    title: string
                    introduction: string | null
                    base_text: string | null
                    duration: string | null
                    key_points: string[] | null
                    conclusion: string | null
                    truths_to_retain: string[] | null
                    practical_application: string[] | null
                    pdf_source_url: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: number
                    series_id?: number | null
                    number: number
                    title: string
                    introduction?: string | null
                    base_text?: string | null
                    duration?: string | null
                    key_points?: string[] | null
                    conclusion?: string | null
                    truths_to_retain?: string[] | null
                    practical_application?: string[] | null
                    pdf_source_url?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: number
                    series_id?: number | null
                    number?: number
                    title?: string
                    introduction?: string | null
                    base_text?: string | null
                    duration?: string | null
                    key_points?: string[] | null
                    conclusion?: string | null
                    truths_to_retain?: string[] | null
                    practical_application?: string[] | null
                    pdf_source_url?: string | null
                    created_at?: string | null
                }
            }
            chapters: {
                Row: {
                    id: number
                    lesson_id: number | null
                    title: string | null
                    content: string
                    order_index: number
                }
                Insert: {
                    id?: number
                    lesson_id?: number | null
                    title?: string | null
                    content: string
                    order_index: number
                }
                Update: {
                    id?: number
                    lesson_id?: number | null
                    title?: string | null
                    content?: string
                    order_index?: number
                }
            }
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    email: string | null
                    full_name: string | null
                    avatar_url: string | null
                    role: 'admin' | 'leader' | null
                    first_name: string | null
                    last_name: string | null
                    secteur: string | null
                    bloc: string | null
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'student' | null
                    first_name?: string | null
                    last_name?: string | null
                    secteur?: string | null
                    bloc?: string | null
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    role?: 'admin' | 'student' | null
                    first_name?: string | null
                    last_name?: string | null
                    secteur?: string | null
                    bloc?: string | null
                }
            }
            user_progress: {
                Row: {
                    user_id: string
                    lesson_id: number
                    is_completed: boolean | null
                    scroll_percentage: number | null
                    last_read_at: string | null
                }
                Insert: {
                    user_id: string
                    lesson_id: number
                    is_completed?: boolean | null
                    scroll_percentage?: number | null
                    last_read_at?: string | null
                }
                Update: {
                    user_id?: string
                    lesson_id?: number
                    is_completed?: boolean | null
                    scroll_percentage?: number | null
                    last_read_at?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
