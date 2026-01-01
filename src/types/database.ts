export type XpengModel = 'G3' | 'G3i' | 'P5' | 'P7' | 'P7i' | 'G6' | 'G9' | 'X9' | 'MONA M03' | null;

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          car_model: XpengModel;
          car_nickname: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          car_model?: XpengModel;
          car_nickname?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          car_model?: XpengModel;
          car_nickname?: string | null;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'dark';
          region: string;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: 'light' | 'dark';
          region?: string;
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          theme?: 'light' | 'dark';
          region?: string;
          language?: string;
          updated_at?: string;
        };
      };
      user_dashboard: {
        Row: {
          id: string;
          user_id: string;
          hidden_platforms: string[];
          favorite_platforms: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hidden_platforms?: string[];
          favorite_platforms?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          hidden_platforms?: string[];
          favorite_platforms?: string[];
          updated_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          platform_id: string;
          name: string;
          url: string;
          icon: string | null;
          category: string | null;
          is_pinned: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform_id: string;
          name: string;
          url: string;
          icon?: string | null;
          category?: string | null;
          is_pinned?: boolean;
          created_at?: string;
        };
        Update: {
          platform_id?: string;
          name?: string;
          url?: string;
          icon?: string | null;
          category?: string | null;
          is_pinned?: boolean;
        };
      };
    };
  };
}

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
export type UserDashboard = Database['public']['Tables']['user_dashboard']['Row'];
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row'];
