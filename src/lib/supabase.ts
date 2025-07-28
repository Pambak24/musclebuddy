import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'client' | 'therapist';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'client' | 'therapist';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'client' | 'therapist';
          created_at?: string;
          updated_at?: string;
        };
      };
      client_assessments: {
        Row: {
          id: string;
          user_id: string;
          primary_complaint: string;
          pain_level: number;
          medical_history: string | null;
          current_medications: string | null;
          goals: string | null;
          movement_assessment: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          primary_complaint: string;
          pain_level: number;
          medical_history?: string | null;
          current_medications?: string | null;
          goals?: string | null;
          movement_assessment?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          primary_complaint?: string;
          pain_level?: number;
          medical_history?: string | null;
          current_medications?: string | null;
          goals?: string | null;
          movement_assessment?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          client_id: string;
          therapist_id: string | null;
          scheduled_date: string;
          duration_minutes: number;
          status: 'scheduled' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          therapist_id?: string | null;
          scheduled_date: string;
          duration_minutes?: number;
          status?: 'scheduled' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          therapist_id?: string | null;
          scheduled_date?: string;
          duration_minutes?: number;
          status?: 'scheduled' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercise_programs: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          description: string | null;
          exercises: any;
          created_by: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          name: string;
          description?: string | null;
          exercises: any;
          created_by: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          name?: string;
          description?: string | null;
          exercises?: any;
          created_by?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercise_progress: {
        Row: {
          id: string;
          program_id: string;
          client_id: string;
          exercise_name: string;
          sets_completed: number;
          reps_completed: number;
          weight_used: number | null;
          duration_seconds: number | null;
          notes: string | null;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          client_id: string;
          exercise_name: string;
          sets_completed: number;
          reps_completed: number;
          weight_used?: number | null;
          duration_seconds?: number | null;
          notes?: string | null;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          client_id?: string;
          exercise_name?: string;
          sets_completed?: number;
          reps_completed?: number;
          weight_used?: number | null;
          duration_seconds?: number | null;
          notes?: string | null;
          completed_at?: string;
          created_at?: string;
        };
      };
    };
  };
}