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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          avatar_url: string | null
          role: string
          university: string | null
          department: string | null
          semester: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: string
          university?: string | null
          department?: string | null
          semester?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: string
          university?: string | null
          department?: string | null
          semester?: string | null
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          title: string
          description: string | null
          subject_id: string
          semester: string
          file_path: string
          file_name: string
          file_type: string
          file_size: string
          uploader_id: string
          downloads_count: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          subject_id: string
          semester: string
          file_path: string
          file_name: string
          file_type: string
          file_size: string
          uploader_id: string
          downloads_count?: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          subject_id?: string
          semester?: string
          file_path?: string
          file_name?: string
          file_type?: string
          file_size?: string
          uploader_id?: string
          downloads_count?: number
          status?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          note_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          note_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          note_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_downloads: {
        Args: { note_id_input: string }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

