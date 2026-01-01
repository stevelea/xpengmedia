import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, UserPreferences, UserDashboard } from './database';

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  dashboard: UserDashboard | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  updateDashboard: (updates: Partial<UserDashboard>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

export const XPENG_MODELS = [
  { id: 'G3', name: 'XPENG G3' },
  { id: 'G3i', name: 'XPENG G3i' },
  { id: 'P5', name: 'XPENG P5' },
  { id: 'P7', name: 'XPENG P7' },
  { id: 'P7i', name: 'XPENG P7i' },
  { id: 'G6', name: 'XPENG G6' },
  { id: 'G9', name: 'XPENG G9' },
  { id: 'X9', name: 'XPENG X9' },
  { id: 'MONA M03', name: 'MONA M03' },
] as const;
