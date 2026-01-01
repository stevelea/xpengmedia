import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { AuthContextType, AuthState } from '../types/auth';
import type { UserProfile, UserPreferences, UserDashboard } from '../types/database';

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  preferences: null,
  dashboard: null,
  isLoading: true,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Fetch user data from Supabase tables
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const [profileRes, preferencesRes, dashboardRes] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', userId).single(),
        supabase.from('user_preferences').select('*').eq('user_id', userId).single(),
        supabase.from('user_dashboard').select('*').eq('user_id', userId).single(),
      ]);

      return {
        profile: profileRes.data as UserProfile | null,
        preferences: preferencesRes.data as UserPreferences | null,
        dashboard: dashboardRes.data as UserDashboard | null,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { profile: null, preferences: null, dashboard: null };
    }
  }, []);

  // Migrate localStorage data to Supabase on first login
  const migrateLocalData = useCallback(async (userId: string) => {
    try {
      // Check if user already has preferences (not first login)
      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingPrefs) {
        return;
      }

      // Collect localStorage data
      const theme = localStorage.getItem('theme') || 'dark';
      const localeData = localStorage.getItem('xpeng_locale');
      const locale = localeData ? JSON.parse(localeData) : { region: 'global', language: 'en' };
      const hiddenPlatforms = localStorage.getItem('xpeng-hidden-platforms');
      const favoritePlatforms = localStorage.getItem('xpeng-favorite-platforms');

      // Migrate preferences
      await supabase.from('user_preferences').upsert({
        user_id: userId,
        theme: theme as 'light' | 'dark',
        region: locale.region,
        language: locale.language,
      });

      // Migrate dashboard layout
      await supabase.from('user_dashboard').upsert({
        user_id: userId,
        hidden_platforms: hiddenPlatforms ? JSON.parse(hiddenPlatforms) : [],
        favorite_platforms: favoritePlatforms ? JSON.parse(favoritePlatforms) : [],
      });

      // Migrate favorites (from FavoritesContext)
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        for (const fav of favorites) {
          await supabase.from('user_favorites').upsert({
            user_id: userId,
            platform_id: fav.id,
            name: fav.name,
            url: fav.url,
            icon: fav.icon || '',
            category: fav.category || '',
            is_pinned: false,
          }, { onConflict: 'user_id,platform_id' });
        }
      }

    } catch (error) {
      console.error('Error migrating localStorage data:', error);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Handle OAuth callback - check for tokens/code in URL (for HashRouter compatibility)
    const handleOAuthCallback = async (): Promise<boolean> => {
      const fullUrl = window.location.href;
      let hash = window.location.hash;
      let search = window.location.search;

      // Check if tokens were captured earlier (before HashRouter modified the URL)
      const capturedHash = sessionStorage.getItem('oauth_hash');
      const capturedSearch = sessionStorage.getItem('oauth_search');
      const capturedFullUrl = sessionStorage.getItem('oauth_full_url');

      if (capturedHash && capturedHash.includes('access_token')) {
        hash = capturedHash;
        sessionStorage.removeItem('oauth_hash');
      }

      if (capturedSearch && capturedSearch.includes('access_token')) {
        search = capturedSearch;
        sessionStorage.removeItem('oauth_search');
      }

      // Use captured full URL if available
      let urlToCheck = fullUrl;
      if (capturedFullUrl) {
        urlToCheck = capturedFullUrl;
        sessionStorage.removeItem('oauth_full_url');
      }

      // Method 1: Check for access_token in hash (implicit flow)
      if (hash.includes('access_token')) {
        const tokenPart = hash.includes('#access_token')
          ? hash.substring(1)
          : hash.replace('#/', '').replace('#', '');

        const params = new URLSearchParams(tokenPart);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error setting session from hash:', error);
          } else if (data.session) {
            window.history.replaceState(null, '', window.location.pathname + '#/');
            return true;
          }
        }
      }

      // Method 2: Check for code in query params (PKCE flow)
      if (search.includes('code=')) {
        const params = new URLSearchParams(search);
        const code = params.get('code');

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error('Error exchanging code:', error);
          } else if (data.session) {
            window.history.replaceState(null, '', window.location.pathname + '#/');
            return true;
          }
        }
      }

      // Method 3: Check in the full URL for tokens
      if (urlToCheck.includes('access_token=')) {
        const tokenMatch = urlToCheck.match(/access_token=([^&#]+)/);
        const refreshMatch = urlToCheck.match(/refresh_token=([^&#]+)/);

        const accessTokenValue = tokenMatch?.[1];
        const refreshTokenValue = refreshMatch?.[1] || '';

        if (accessTokenValue) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessTokenValue,
            refresh_token: refreshTokenValue,
          });

          if (error) {
            console.error('Error setting session from URL:', error);
          } else if (data.session) {
            window.history.replaceState(null, '', window.location.pathname + '#/');
            return true;
          }
        }
      }

      return false;
    };

    // Track if we've already initialized to prevent duplicate updates
    let initialized = false;

    // Initialize auth - must await OAuth callback before checking session
    const initAuth = async () => {
      try {
        await handleOAuthCallback();

        // Only set initial state if onAuthStateChange hasn't already done it
        if (!initialized) {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            initialized = true;
            const userData = await fetchUserData(session.user.id);
            setState({
              user: session.user,
              session,
              ...userData,
              isLoading: false,
              isAuthenticated: true,
            });
          } else {
            setState(prev => ({ ...prev, isLoading: false }));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Always set loading to false on error so UI doesn't get stuck
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    // Listen for auth changes - set up BEFORE initAuth to catch early events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session?.user) {
          initialized = true;

          // Set authenticated state IMMEDIATELY, then fetch additional data
          setState({
            user: session.user,
            session,
            profile: null,
            preferences: null,
            dashboard: null,
            isLoading: false,
            isAuthenticated: true,
          });

          // Migrate and fetch data in background with timeout (don't block auth)
          const migrateAndFetch = async () => {
            const timeout = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Database timeout')), 5000)
            );

            try {
              await Promise.race([migrateLocalData(session.user.id), timeout]);
              const userData = await Promise.race([fetchUserData(session.user.id), timeout]);

              // Update with fetched data
              setState(prev => ({
                ...prev,
                ...(userData as object),
              }));
            } catch (dataError) {
              console.warn('Database operation failed (app still works offline):', dataError);
            }
          };
          migrateAndFetch();
        } else if (event === 'INITIAL_SESSION') {
          initialized = true;
          if (session?.user) {
            // Set authenticated state IMMEDIATELY
            setState({
              user: session.user,
              session,
              profile: null,
              preferences: null,
              dashboard: null,
              isLoading: false,
              isAuthenticated: true,
            });

            // Fetch data in background with timeout
            const fetchWithTimeout = async () => {
              const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Fetch timeout')), 5000)
              );
              try {
                const userData = await Promise.race([fetchUserData(session.user.id), timeout]);
                setState(prev => ({
                  ...prev,
                  ...(userData as object),
                }));
              } catch (dataError) {
                console.warn('Error fetching user data (non-blocking):', dataError);
              }
            };
            fetchWithTimeout();
          } else {
            // No session - just stop loading
            setState(prev => ({ ...prev, isLoading: false }));
          }
        } else if (event === 'SIGNED_OUT') {
          initialized = false;
          setState({
            ...initialState,
            isLoading: false,
          });
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setState(prev => ({
            ...prev,
            session,
            user: session.user,
          }));
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    initAuth();

    // Safety timeout - ensure loading state doesn't get stuck
    const safetyTimeout = setTimeout(() => {
      setState(prev => {
        if (prev.isLoading) {
          console.warn('Auth loading timeout - forcing isLoading to false');
          return { ...prev, isLoading: false };
        }
        return prev;
      });
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [fetchUserData, migrateLocalData]);

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured()) {
      console.error('Supabase not configured');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    // Clear local state immediately - don't wait for Supabase
    setState({
      ...initialState,
      isLoading: false,
    });

    // Clear localStorage token
    localStorage.removeItem('supabase.auth.token');

    // Try to sign out from Supabase (with timeout)
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Sign out timeout')), 3000)
      );

      await Promise.race([
        supabase.auth.signOut(),
        timeoutPromise
      ]);
    } catch (err) {
      console.warn('Supabase sign out issue (state already cleared):', err);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) {
      return;
    }

    // Create a timeout promise
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database timeout after 5s - check if Supabase project is paused')), 5000)
    );

    try {
      const upsertPromise = supabase
        .from('user_profiles')
        .upsert({
          id: state.user.id,
          email: state.user.email,
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .select();

      const result = await Promise.race([upsertPromise, timeout]) as { data: unknown; error: unknown };

      if (result.error) {
        throw result.error;
      }

      setState(prev => ({
        ...prev,
        profile: prev.profile
          ? { ...prev.profile, ...updates }
          : { id: state.user!.id, ...updates } as UserProfile,
      }));
    } catch (err) {
      console.error('Profile update failed:', err);
      throw err;
    }
  };

  // Update preferences
  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!state.user) return;

    const { error } = await supabase
      .from('user_preferences')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', state.user.id);

    if (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }

    setState(prev => ({
      ...prev,
      preferences: prev.preferences ? { ...prev.preferences, ...updates } : null,
    }));
  };

  // Update dashboard
  const updateDashboard = async (updates: Partial<UserDashboard>) => {
    if (!state.user) return;

    const { error } = await supabase
      .from('user_dashboard')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', state.user.id);

    if (error) {
      console.error('Error updating dashboard:', error);
      throw error;
    }

    setState(prev => ({
      ...prev,
      dashboard: prev.dashboard ? { ...prev.dashboard, ...updates } : null,
    }));
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (!state.user) return;

    const userData = await fetchUserData(state.user.id);
    setState(prev => ({
      ...prev,
      ...userData,
    }));
  };

  const value: AuthContextType = {
    ...state,
    signInWithGoogle,
    signOut,
    updateProfile,
    updatePreferences,
    updateDashboard,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
