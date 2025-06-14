export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cloud_files: {
        Row: {
          created_at: string | null
          download_url: string | null
          file_id: string
          file_name: string
          file_size: number | null
          id: string
          mime_type: string | null
          parent_folder: string | null
          provider: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          download_url?: string | null
          file_id: string
          file_name: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          parent_folder?: string | null
          provider: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          download_url?: string | null
          file_id?: string
          file_name?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          parent_folder?: string | null
          provider?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cloud_files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deck_comments: {
        Row: {
          content: string
          created_at: string | null
          deck_id: string | null
          id: string
          likes: number | null
          parent_comment_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deck_id?: string | null
          id?: string
          likes?: number | null
          parent_comment_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deck_id?: string | null
          id?: string
          likes?: number | null
          parent_comment_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_comments_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "shared_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "deck_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deck_downloads: {
        Row: {
          deck_id: string | null
          downloaded_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          deck_id?: string | null
          downloaded_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          deck_id?: string | null
          downloaded_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_downloads_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "shared_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      deck_ratings: {
        Row: {
          created_at: string | null
          deck_id: string | null
          id: string
          rating: number
          review_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          deck_id?: string | null
          id?: string
          rating: number
          review_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          deck_id?: string | null
          id?: string
          rating?: number
          review_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_ratings_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "shared_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_ratings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          audio_segment_url: string | null
          back: string | null
          created_at: string | null
          difficulty: string | null
          front: string
          id: string
          last_reviewed: string | null
          next_review: string | null
          review_count: number | null
          session_id: string | null
          success_rate: number | null
          tags: string[] | null
          type: string | null
          updated_at: string | null
          user_id: string | null
          visual_content_id: string | null
        }
        Insert: {
          audio_segment_url?: string | null
          back?: string | null
          created_at?: string | null
          difficulty?: string | null
          front: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number | null
          session_id?: string | null
          success_rate?: number | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          visual_content_id?: string | null
        }
        Update: {
          audio_segment_url?: string | null
          back?: string | null
          created_at?: string | null
          difficulty?: string | null
          front?: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          review_count?: number | null
          session_id?: string | null
          success_rate?: number | null
          tags?: string[] | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
          visual_content_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flashcards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          audio_file_url: string | null
          card_count: number | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          language: string | null
          progress: number | null
          source_type: string | null
          source_url: string | null
          status: string | null
          summary: string | null
          title: string
          transcript: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          audio_file_url?: string | null
          card_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          language?: string | null
          progress?: number | null
          source_type?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          title: string
          transcript?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          audio_file_url?: string | null
          card_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          language?: string | null
          progress?: number | null
          source_type?: string | null
          source_url?: string | null
          status?: string | null
          summary?: string | null
          title?: string
          transcript?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_decks: {
        Row: {
          author_id: string | null
          card_count: number
          created_at: string | null
          deck_data: Json
          description: string | null
          difficulty: string
          download_count: number | null
          id: string
          is_featured: boolean | null
          language: string | null
          rating_average: number | null
          rating_count: number | null
          subject: string
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          author_id?: string | null
          card_count: number
          created_at?: string | null
          deck_data: Json
          description?: string | null
          difficulty: string
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          language?: string | null
          rating_average?: number | null
          rating_count?: number | null
          subject: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          author_id?: string | null
          card_count?: number
          created_at?: string | null
          deck_data?: Json
          description?: string | null
          difficulty?: string
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          language?: string | null
          rating_average?: number | null
          rating_count?: number | null
          subject?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_decks_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          difficulty_preference: string | null
          id: string
          learning_goals: string[] | null
          performance_history: Json | null
          preferred_modes: string[] | null
          preferred_styles: string[] | null
          strong_areas: string[] | null
          study_time_preference: number | null
          updated_at: string | null
          user_id: string | null
          weak_areas: string[] | null
        }
        Insert: {
          created_at?: string | null
          difficulty_preference?: string | null
          id?: string
          learning_goals?: string[] | null
          performance_history?: Json | null
          preferred_modes?: string[] | null
          preferred_styles?: string[] | null
          strong_areas?: string[] | null
          study_time_preference?: number | null
          updated_at?: string | null
          user_id?: string | null
          weak_areas?: string[] | null
        }
        Update: {
          created_at?: string | null
          difficulty_preference?: string | null
          id?: string
          learning_goals?: string[] | null
          performance_history?: Json | null
          preferred_modes?: string[] | null
          preferred_styles?: string[] | null
          strong_areas?: string[] | null
          study_time_preference?: number | null
          updated_at?: string | null
          user_id?: string | null
          weak_areas?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          dark_mode: boolean | null
          display_name: string
          email: string
          id: string
          is_verified: boolean | null
          language: string | null
          subscription_tier: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          display_name: string
          email: string
          id?: string
          is_verified?: boolean | null
          language?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          display_name?: string
          email?: string
          id?: string
          is_verified?: boolean | null
          language?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      visual_content: {
        Row: {
          content_type: string
          created_at: string | null
          data: Json
          html_content: string | null
          id: string
          image_base64: string | null
          metadata: Json | null
          session_id: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          content_type: string
          created_at?: string | null
          data: Json
          html_content?: string | null
          id?: string
          image_base64?: string | null
          metadata?: Json | null
          session_id?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          content_type?: string
          created_at?: string | null
          data?: Json
          html_content?: string | null
          id?: string
          image_base64?: string | null
          metadata?: Json | null
          session_id?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visual_content_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visual_content_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
