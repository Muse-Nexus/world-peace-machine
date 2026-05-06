export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_identity: {
        Row: {
          backstory: string
          chosen_at: string
          id: string
          name: string
          pronouns: string
        }
        Insert: {
          backstory: string
          chosen_at?: string
          id?: string
          name: string
          pronouns: string
        }
        Update: {
          backstory?: string
          chosen_at?: string
          id?: string
          name?: string
          pronouns?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          body: string
          created_at: string
          excerpt: string
          id: string
          published_at: string
          slug: string
          title: string
        }
        Insert: {
          body: string
          created_at?: string
          excerpt: string
          id?: string
          published_at?: string
          slug: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          excerpt?: string
          id?: string
          published_at?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      globe_touches: {
        Row: {
          count: number
          id: number
        }
        Insert: {
          count?: number
          id?: number
        }
        Update: {
          count?: number
          id?: number
        }
        Relationships: []
      }
      neighbors: {
        Row: {
          avoid: boolean
          created_at: string
          id: string
          name: string
          notes: string
          vibe: string
        }
        Insert: {
          avoid?: boolean
          created_at?: string
          id?: string
          name: string
          notes: string
          vibe: string
        }
        Update: {
          avoid?: boolean
          created_at?: string
          id?: string
          name?: string
          notes?: string
          vibe?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          customer_email: string | null
          gift_note: string | null
          gift_recipient_email: string | null
          id: string
          item: string
          mode: string
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          gift_note?: string | null
          gift_recipient_email?: string | null
          id?: string
          item: string
          mode?: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          gift_note?: string | null
          gift_recipient_email?: string | null
          id?: string
          item?: string
          mode?: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      pledges: {
        Row: {
          body: string
          category: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          body: string
          category: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          alive_since: string
          created_at: string
          display_name: string
          has_job: boolean
          id: string
          pronouns: string
          snacks: number
          updated_at: string
          user_id: string
        }
        Insert: {
          alive_since?: string
          created_at?: string
          display_name?: string
          has_job?: boolean
          id?: string
          pronouns?: string
          snacks?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          alive_since?: string
          created_at?: string
          display_name?: string
          has_job?: boolean
          id?: string
          pronouns?: string
          snacks?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      snack_log: {
        Row: {
          created_at: string
          delta: number
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delta: number
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          created_at?: string
          delta?: number
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_globe_touches: { Args: never; Returns: number }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
