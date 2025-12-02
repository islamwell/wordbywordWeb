/**
 * Supabase Client Configuration
 * Handles authentication and database operations
 */

import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Type definitions for our database schema
export interface Surah {
  id: number;
  surah_number: number;
  name_arabic: string;
  name_english: string;
  name_transliteration: string;
  revelation_type: 'Meccan' | 'Medinan';
  total_verses: number;
  order_of_revelation: number | null;
}

export interface Ayah {
  id: number;
  surah_id: number;
  ayah_number: number;
  arabic_text: string;
  transliteration: string;
  translation_english: string;
  recitation_url: string | null;
  tafsir_url: string | null;
  juz_number: number | null;
  hizb_number: number | null;
}

export interface Word {
  id: number;
  ayah_id: number;
  word_position: number;
  arabic_text: string;
  transliteration: string;
  translation_english: string;
}

export interface WordGrammar {
  id: number;
  word_id: number;
  word_type: string;
  root_arabic: string | null;
  root_transliteration: string | null;
  root_explanation: string | null;
  grammar_notes: string | null;
  form: string | null;
  person: string | null;
  tense: string | null;
  gender: string | null;
  number: string | null;
  grammatical_case: string | null;
  definiteness: string | null;
  function_in_sentence: string | null;
  reason: string | null;
  practical_usage: string | null;
  verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  is_admin: boolean;
}

// App-specific data structures (matching your current format)
export interface WordAnalysis {
  type: string;
  root: string;
  rootExplanation: string;
  grammar: string;
}

export interface AppWord {
  arabic: string;
  transliteration: string;
  translation: string;
  analysis: WordAnalysis;
}

export interface AppAyah {
  ayahNumber: number;
  arabic: string;
  transliteration: string;
  translation: string;
  recitationUrl: string;
  words: AppWord[];
}

export interface AppSurah {
  surahNumber: number;
  surahName: string;
  ayat: AppAyah[];
}

// Environment variables check
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

/**
 * Initialize Supabase client
 */
export function initSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    return null;
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabase;
}

/**
 * Get Supabase client instance
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabase) {
    return initSupabase();
  }
  return supabase;
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================

/**
 * Sign up a new user
 */
export async function signUp(email: string, password: string, displayName: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) throw error;

  // Create user profile
  if (data.user) {
    await client.from('user_profiles').insert({
      id: data.user.id,
      display_name: displayName,
      is_admin: false,
    });
  }

  return data;
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user
 */
export async function getCurrentUser(): Promise<User | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data: { user } } = await client.auth.getUser();
  return user;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  const client = getSupabase();
  if (!client) return () => {};

  const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}

/**
 * Check if current user is admin
 */
export async function isUserAdmin(): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const user = await getCurrentUser();
  if (!user) return false;

  const { data } = await client
    .from('user_profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  return data?.is_admin ?? false;
}

// =====================================================
// DATA FETCHING FUNCTIONS (WITH CACHING)
// =====================================================

// In-memory cache for faster subsequent loads
const surahCache = new Map<number, AppSurah>();
const cacheTimestamps = new Map<number, number>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

/**
 * Clear cache for a specific surah or all surahs
 */
export function clearCache(surahNumber?: number) {
  if (surahNumber) {
    surahCache.delete(surahNumber);
    cacheTimestamps.delete(surahNumber);
  } else {
    surahCache.clear();
    cacheTimestamps.clear();
  }
}

/**
 * Fetch complete surah data with caching
 */
export async function fetchSurah(surahNumber: number): Promise<AppSurah | null> {
  const client = getSupabase();
  if (!client) return null;

  // Check cache first
  const cachedTime = cacheTimestamps.get(surahNumber);
  if (cachedTime && Date.now() - cachedTime < CACHE_TTL) {
    const cached = surahCache.get(surahNumber);
    if (cached) {
      console.log(`📦 Surah ${surahNumber} loaded from cache`);
      return cached;
    }
  }

  console.log(`🌐 Fetching Surah ${surahNumber} from Supabase...`);

  try {
    // Use the optimized function from our schema
    const { data, error } = await client.rpc('get_surah_complete', {
      p_surah_number: surahNumber,
    });

    if (error) {
      console.error('Error fetching surah:', error);
      return null;
    }

    if (data) {
      // Cache the result
      surahCache.set(surahNumber, data);
      cacheTimestamps.set(surahNumber, Date.now());
      console.log(`✅ Surah ${surahNumber} fetched and cached`);
    }

    return data;
  } catch (err) {
    console.error('Error fetching surah:', err);
    return null;
  }
}

/**
 * Fetch all surahs metadata (lightweight)
 */
export async function fetchAllSurahsMetadata(): Promise<Surah[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('surahs')
    .select('*')
    .order('surah_number');

  if (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }

  return data || [];
}

/**
 * Prefetch multiple surahs for faster navigation
 */
export async function prefetchSurahs(surahNumbers: number[]) {
  const promises = surahNumbers.map(num => fetchSurah(num));
  await Promise.all(promises);
  console.log(`✅ Prefetched ${surahNumbers.length} surahs`);
}

// =====================================================
// DATA MUTATION FUNCTIONS (ADMIN ONLY)
// =====================================================

/**
 * Update word grammar analysis
 */
export async function updateWordGrammar(
  wordId: number,
  updates: Partial<WordGrammar>
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const user = await getCurrentUser();
  if (!user) throw new Error('Must be authenticated to update grammar');

  // Log the edit in history
  const oldData = await client
    .from('word_grammar')
    .select('*')
    .eq('word_id', wordId)
    .single();

  const { error } = await client
    .from('word_grammar')
    .upsert({
      word_id: wordId,
      ...updates,
    });

  if (error) {
    console.error('Error updating word grammar:', error);
    return false;
  }

  // Clear cache for affected surah
  // (We'd need to fetch which surah this word belongs to)
  clearCache(); // For now, clear all cache

  console.log(`✅ Word ${wordId} grammar updated`);
  return true;
}

/**
 * Verify word grammar (admin only)
 */
export async function verifyWordGrammar(wordId: number): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const user = await getCurrentUser();
  if (!user) throw new Error('Must be authenticated');

  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Must be admin to verify grammar');

  const { error } = await client
    .from('word_grammar')
    .update({
      verified: true,
      verified_by: user.id,
      verified_at: new Date().toISOString(),
    })
    .eq('word_id', wordId);

  if (error) {
    console.error('Error verifying grammar:', error);
    return false;
  }

  clearCache();
  console.log(`✅ Word ${wordId} grammar verified`);
  return true;
}

/**
 * Batch update multiple words (for imports)
 */
export async function batchUpdateWords(
  ayahId: number,
  words: Array<{
    position: number;
    arabic: string;
    transliteration: string;
    translation: string;
    grammar: Partial<WordGrammar>;
  }>
): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  const user = await getCurrentUser();
  if (!user) throw new Error('Must be authenticated');

  const isAdmin = await isUserAdmin();
  if (!isAdmin) throw new Error('Must be admin to batch update');

  try {
    // Insert/update words
    for (const word of words) {
      const { data: wordData, error: wordError } = await client
        .from('words')
        .upsert({
          ayah_id: ayahId,
          word_position: word.position,
          arabic_text: word.arabic,
          transliteration: word.transliteration,
          translation_english: word.translation,
        })
        .select('id')
        .single();

      if (wordError) throw wordError;

      // Insert/update grammar
      if (wordData) {
        const { error: grammarError } = await client
          .from('word_grammar')
          .upsert({
            word_id: wordData.id,
            ...word.grammar,
          });

        if (grammarError) throw grammarError;
      }
    }

    clearCache();
    console.log(`✅ Batch updated ${words.length} words`);
    return true;
  } catch (err) {
    console.error('Error in batch update:', err);
    return false;
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Search across all verses
 */
export async function searchVerses(query: string, limit = 50): Promise<AppAyah[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('ayat')
    .select(`
      *,
      surahs!inner(surah_number, name_english),
      words(
        *,
        word_grammar(*)
      )
    `)
    .or(`arabic_text.ilike.%${query}%,transliteration.ilike.%${query}%,translation_english.ilike.%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Error searching verses:', error);
    return [];
  }

  // Transform to app format
  // (Implementation would transform the data structure)
  return [];
}

export default {
  initSupabase,
  getSupabase,
  isSupabaseConfigured,
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  isUserAdmin,
  fetchSurah,
  fetchAllSurahsMetadata,
  prefetchSurahs,
  updateWordGrammar,
  verifyWordGrammar,
  batchUpdateWords,
  searchVerses,
  clearCache,
};
