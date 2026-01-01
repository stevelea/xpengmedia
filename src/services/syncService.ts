import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserPreferences, UserDashboard } from '../types/database';

// Debounce helper - creates a debounced version of any function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Sync theme to Supabase
export const syncThemeToCloud = async (userId: string, theme: 'light' | 'dark') => {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        theme,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
  } catch (error) {
    console.error('Error syncing theme:', error);
  }
};

// Sync locale to Supabase
export const syncLocaleToCloud = async (userId: string, region: string, language: string) => {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        region,
        language,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
  } catch (error) {
    console.error('Error syncing locale:', error);
  }
};

// Sync dashboard layout to Supabase
export const syncDashboardToCloud = async (
  userId: string,
  hiddenPlatforms: string[],
  favoritePlatforms: string[]
) => {
  if (!isSupabaseConfigured()) return;

  try {
    await supabase
      .from('user_dashboard')
      .upsert({
        user_id: userId,
        hidden_platforms: hiddenPlatforms,
        favorite_platforms: favoritePlatforms,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
  } catch (error) {
    console.error('Error syncing dashboard:', error);
  }
};

// Sync favorites to Supabase
export const syncFavoritesToCloud = async (
  userId: string,
  favorites: Array<{ id: string; name: string; url: string; icon: string; category: string }>
) => {
  if (!isSupabaseConfigured()) return;

  try {
    // Delete existing favorites for this user
    await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId);

    // Insert new favorites
    if (favorites.length > 0) {
      await supabase
        .from('user_favorites')
        .insert(
          favorites.map(fav => ({
            user_id: userId,
            platform_id: fav.id,
            name: fav.name,
            url: fav.url,
            icon: fav.icon,
            category: fav.category,
          }))
        );
    }
  } catch (error) {
    console.error('Error syncing favorites to cloud:', error);
  }
};

// Fetch favorites from Supabase
export const fetchFavoritesFromCloud = async (userId: string) => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(fav => ({
      id: fav.platform_id,
      name: fav.name,
      url: fav.url,
      icon: fav.icon,
      category: fav.category,
    }));
  } catch (error) {
    console.error('Error fetching favorites from cloud:', error);
    return null;
  }
};

// Fetch preferences from Supabase
export const fetchPreferencesFromCloud = async (userId: string): Promise<UserPreferences | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching preferences from cloud:', error);
    return null;
  }
};

// Fetch dashboard from Supabase
export const fetchDashboardFromCloud = async (userId: string): Promise<UserDashboard | null> => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data, error } = await supabase
      .from('user_dashboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching dashboard from cloud:', error);
    return null;
  }
};

// Create debounced sync functions (500ms delay)
export const debouncedSyncTheme = debounce(syncThemeToCloud, 500);
export const debouncedSyncLocale = debounce(syncLocaleToCloud, 500);
export const debouncedSyncDashboard = debounce(syncDashboardToCloud, 500);
export const debouncedSyncFavorites = debounce(syncFavoritesToCloud, 500);
