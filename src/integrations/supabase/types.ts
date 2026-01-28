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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cabinets: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          owner_id: string
          phone: string | null
          postal_code: string | null
          siret: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          owner_id: string
          phone?: string | null
          postal_code?: string | null
          siret?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          owner_id?: string
          phone?: string | null
          postal_code?: string | null
          siret?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      connected_devices: {
        Row: {
          created_at: string
          device_name: string
          device_type: string
          id: string
          is_connected: boolean | null
          last_connected_at: string | null
          manufacturer: string | null
          tier: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_name: string
          device_type: string
          id?: string
          is_connected?: boolean | null
          last_connected_at?: string | null
          manufacturer?: string | null
          tier?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_name?: string
          device_type?: string
          id?: string
          is_connected?: boolean | null
          last_connected_at?: string | null
          manufacturer?: string | null
          tier?: number | null
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      mri_devices: {
        Row: {
          cabinet_id: string
          capabilities: Json | null
          created_at: string | null
          device_type: string
          firmware_version: string | null
          id: string
          ip_address: unknown
          last_maintenance_at: string | null
          last_seen_at: string | null
          manufacturer: string
          metadata: Json | null
          model: string
          next_maintenance_at: string | null
          serial_number: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cabinet_id: string
          capabilities?: Json | null
          created_at?: string | null
          device_type?: string
          firmware_version?: string | null
          id?: string
          ip_address?: unknown
          last_maintenance_at?: string | null
          last_seen_at?: string | null
          manufacturer: string
          metadata?: Json | null
          model: string
          next_maintenance_at?: string | null
          serial_number: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cabinet_id?: string
          capabilities?: Json | null
          created_at?: string | null
          device_type?: string
          firmware_version?: string | null
          id?: string
          ip_address?: unknown
          last_maintenance_at?: string | null
          last_seen_at?: string | null
          manufacturer?: string
          metadata?: Json | null
          model?: string
          next_maintenance_at?: string | null
          serial_number?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mri_devices_cabinet_id_fkey"
            columns: ["cabinet_id"]
            isOneToOne: false
            referencedRelation: "cabinets"
            referencedColumns: ["id"]
          },
        ]
      }
      mri_scans: {
        Row: {
          anomalies_detected: number | null
          body_zones: string[] | null
          cabinet_id: string
          completed_at: string | null
          created_at: string | null
          device_id: string | null
          duration_seconds: number | null
          findings: Json | null
          id: string
          metadata: Json | null
          patient_reference: string
          protocol_id: string
          report_url: string | null
          risk_level: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          anomalies_detected?: number | null
          body_zones?: string[] | null
          cabinet_id: string
          completed_at?: string | null
          created_at?: string | null
          device_id?: string | null
          duration_seconds?: number | null
          findings?: Json | null
          id?: string
          metadata?: Json | null
          patient_reference: string
          protocol_id: string
          report_url?: string | null
          risk_level?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          anomalies_detected?: number | null
          body_zones?: string[] | null
          cabinet_id?: string
          completed_at?: string | null
          created_at?: string | null
          device_id?: string | null
          duration_seconds?: number | null
          findings?: Json | null
          id?: string
          metadata?: Json | null
          patient_reference?: string
          protocol_id?: string
          report_url?: string | null
          risk_level?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mri_scans_cabinet_id_fkey"
            columns: ["cabinet_id"]
            isOneToOne: false
            referencedRelation: "cabinets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mri_scans_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "mri_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      mri_subscriptions: {
        Row: {
          cabinet_id: string
          created_at: string | null
          current_period_end: string
          current_period_start: string
          glasses_included: number | null
          id: string
          plan_id: string
          scans_limit: number | null
          scans_this_period: number | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cabinet_id: string
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          glasses_included?: number | null
          id?: string
          plan_id?: string
          scans_limit?: number | null
          scans_this_period?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cabinet_id?: string
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          glasses_included?: number | null
          id?: string
          plan_id?: string
          scans_limit?: number | null
          scans_this_period?: number | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mri_subscriptions_cabinet_id_fkey"
            columns: ["cabinet_id"]
            isOneToOne: false
            referencedRelation: "cabinets"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          notification_preferences: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          notification_preferences?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          notification_preferences?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      screening_protocols: {
        Row: {
          body_zones: string[]
          created_at: string | null
          description: string | null
          description_fr: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          name: string
          name_fr: string
          sequence_types: string[] | null
          targets: string[] | null
        }
        Insert: {
          body_zones: string[]
          created_at?: string | null
          description?: string | null
          description_fr?: string | null
          duration_minutes: number
          id: string
          is_active?: boolean | null
          name: string
          name_fr: string
          sequence_types?: string[] | null
          targets?: string[] | null
        }
        Update: {
          body_zones?: string[]
          created_at?: string | null
          description?: string | null
          description_fr?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          name?: string
          name_fr?: string
          sequence_types?: string[] | null
          targets?: string[] | null
        }
        Relationships: []
      }
      scripts: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          last_used_at: string | null
          tags: string[] | null
          title: string
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      usage_analytics: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          prompts_displayed: number | null
          script_id: string | null
          session_duration_seconds: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          prompts_displayed?: number | null
          script_id?: string | null
          session_duration_seconds?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          prompts_displayed?: number | null
          script_id?: string | null
          session_duration_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_analytics_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "connected_devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_analytics_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          notified: boolean | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          notified?: boolean | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          notified?: boolean | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      secure_scans: {
        Row: {
          anomalies_detected: number | null
          body_zones: string[] | null
          cabinet_id: string | null
          completed_at: string | null
          created_at: string | null
          device_id: string | null
          duration_seconds: number | null
          id: string | null
          patient_reference_masked: string | null
          protocol_id: string | null
          risk_level: string | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          anomalies_detected?: number | null
          body_zones?: string[] | null
          cabinet_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          device_id?: string | null
          duration_seconds?: number | null
          id?: string | null
          patient_reference_masked?: never
          protocol_id?: string | null
          risk_level?: string | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          anomalies_detected?: number | null
          body_zones?: string[] | null
          cabinet_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          device_id?: string | null
          duration_seconds?: number | null
          id?: string | null
          patient_reference_masked?: never
          protocol_id?: string | null
          risk_level?: string | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mri_scans_cabinet_id_fkey"
            columns: ["cabinet_id"]
            isOneToOne: false
            referencedRelation: "cabinets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mri_scans_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "mri_devices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_patient_scan_details: {
        Args: { scan_id: string }
        Returns: {
          findings: Json
          id: string
          patient_reference: string
          report_url: string
        }[]
      }
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
