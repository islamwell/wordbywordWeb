/**
 * Data Migration Script: JSON Files → Supabase
 *
 * This script reads your existing JSON files and imports them into Supabase.
 * Run with: npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Surah metadata (from https://api.alquran.cloud/v1/meta)
const SURAH_METADATA = {
  1: { name: 'Al-Fatihah', arabic: 'الفاتحة', type: 'Meccan', verses: 7, order: 5 },
  2: { name: 'Al-Baqarah', arabic: 'البقرة', type: 'Medinan', verses: 286, order: 87 },
  73: { name: 'Al-Muzzammil', arabic: 'المزمل', type: 'Meccan', verses: 20, order: 3 },
  114: { name: 'An-Nas', arabic: 'الناس', type: 'Meccan', verses: 6, order: 21 },
};

interface JsonWord {
  arabic: string;
  transliteration: string;
  translation: string;
  analysis?: {
    type: string;
    root: string;
    rootExplanation?: string;
    grammar: string;
  };
  grammar?: {
    type: string;
    root?: string;
    form?: string;
    person?: string;
    tense?: string;
    reason?: string;
    practical?: string;
    [key: string]: any;
  };
}

interface JsonAyah {
  ayahNumber?: number;
  verse?: number;
  arabic: string;
  transliteration: string;
  translation: string;
  recitationUrl?: string;
  words: JsonWord[];
}

interface JsonSurah {
  surahNumber?: number;
  surah?: number;
  surahName?: string;
  name?: string;
  ayat?: JsonAyah[];
  verses?: JsonAyah[];
}

/**
 * Read JSON file
 */
function readJsonFile(filePath: string): any {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return null;
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Insert or update surah metadata
 */
async function upsertSurah(surahNumber: number): Promise<number | null> {
  const meta = SURAH_METADATA[surahNumber as keyof typeof SURAH_METADATA];
  if (!meta) {
    console.warn(`⚠️  No metadata for Surah ${surahNumber}`);
    return null;
  }

  const { data, error } = await supabase
    .from('surahs')
    .upsert({
      surah_number: surahNumber,
      name_arabic: meta.arabic,
      name_english: meta.name,
      name_transliteration: meta.name,
      revelation_type: meta.type,
      total_verses: meta.verses,
      order_of_revelation: meta.order,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`❌ Error upserting Surah ${surahNumber}:`, error);
    return null;
  }

  console.log(`✅ Surah ${surahNumber} (${meta.name}) upserted`);
  return data.id;
}

/**
 * Insert or update ayah
 */
async function upsertAyah(
  surahId: number,
  ayah: JsonAyah
): Promise<number | null> {
  const ayahNumber = ayah.ayahNumber || ayah.verse || 0;

  const { data, error } = await supabase
    .from('ayat')
    .upsert({
      surah_id: surahId,
      ayah_number: ayahNumber,
      arabic_text: ayah.arabic,
      transliteration: ayah.transliteration,
      translation_english: ayah.translation,
      recitation_url: ayah.recitationUrl || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`❌ Error upserting Ayah ${ayahNumber}:`, error);
    return null;
  }

  return data.id;
}

/**
 * Insert or update word and its grammar
 */
async function upsertWord(
  ayahId: number,
  word: JsonWord,
  position: number
): Promise<boolean> {
  // Insert word
  const { data: wordData, error: wordError } = await supabase
    .from('words')
    .upsert({
      ayah_id: ayahId,
      word_position: position,
      arabic_text: word.arabic,
      transliteration: word.transliteration,
      translation_english: word.translation,
    })
    .select('id')
    .single();

  if (wordError) {
    console.error(`❌ Error upserting word at position ${position}:`, wordError);
    return false;
  }

  // Insert grammar (from either 'analysis' or 'grammar' field)
  const grammarData = word.analysis || word.grammar;
  if (grammarData && wordData) {
    const { error: grammarError } = await supabase
      .from('word_grammar')
      .upsert({
        word_id: wordData.id,
        word_type: grammarData.type || 'Unknown',
        root_transliteration: grammarData.root || null,
        root_explanation: grammarData.rootExplanation || null,
        grammar_notes: grammarData.grammar || null,
        form: grammarData.form || null,
        person: grammarData.person || null,
        tense: grammarData.tense || null,
        reason: grammarData.reason || null,
        practical_usage: grammarData.practical || null,
        verified: false,
      });

    if (grammarError) {
      console.error(`❌ Error upserting grammar for word ${wordData.id}:`, grammarError);
      return false;
    }
  }

  return true;
}

/**
 * Process a single surah JSON file
 */
async function processSurahFile(filePath: string) {
  console.log(`\n📖 Processing: ${filePath}`);

  const data: JsonSurah = readJsonFile(filePath);
  if (!data) return;

  const surahNumber = data.surahNumber || data.surah;
  if (!surahNumber) {
    console.error('❌ No surah number found in file');
    return;
  }

  // Insert surah
  const surahId = await upsertSurah(surahNumber);
  if (!surahId) return;

  // Process verses
  const verses = data.ayat || data.verses || [];
  console.log(`   Processing ${verses.length} verses...`);

  for (const ayah of verses) {
    const ayahId = await upsertAyah(surahId, ayah);
    if (!ayahId) continue;

    // Process words
    const words = ayah.words || [];
    for (let i = 0; i < words.length; i++) {
      await upsertWord(ayahId, words[i], i + 1);
    }
  }

  console.log(`✅ Completed Surah ${surahNumber}`);
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting Supabase Migration...\n');
  console.log('=====================================');

  // List of JSON files to import
  const files = [
    'surah-114-grammar.json',
    'surah-002-baqarah-grammar.json',
    'surah-2-grammar-verses-26-50.json',
    'surah-2-grammar-verses-51-75.json',
    'surah-2-grammar-verses-76-100.json',
    'surah-2-grammar-verses-101-125.json',
    'surah-2-grammar-verses-126-150.json',
    'surah-2-grammar-verses-151-175.json',
    'surah-2-grammar-verses-201-225.json',
    'surah-2-grammar-verses-251-275.json',
    'surah-2-grammar-verses-276-286.json',
  ];

  for (const file of files) {
    try {
      await processSurahFile(file);
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err);
    }
  }

  console.log('\n=====================================');
  console.log('✅ Migration completed!');
  console.log('\n📊 Summary:');

  // Get counts
  const { count: surahCount } = await supabase
    .from('surahs')
    .select('*', { count: 'exact', head: true });

  const { count: ayahCount } = await supabase
    .from('ayat')
    .select('*', { count: 'exact', head: true });

  const { count: wordCount } = await supabase
    .from('words')
    .select('*', { count: 'exact', head: true });

  const { count: grammarCount } = await supabase
    .from('word_grammar')
    .select('*', { count: 'exact', head: true });

  console.log(`   Surahs: ${surahCount}`);
  console.log(`   Ayat: ${ayahCount}`);
  console.log(`   Words: ${wordCount}`);
  console.log(`   Grammar entries: ${grammarCount}`);
  console.log('\n🎉 Ready to use Supabase!');
}

// Run migration
migrate().catch(console.error);
