/**
 * Airtable Integration Module
 * Handles data sync between local storage and Airtable
 */

// Airtable configuration
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || '';
const AIRTABLE_TABLE_NAME = 'Quran_Words'; // Table name in Airtable

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

interface AirtableRecord {
  id?: string;
  fields: {
    surah_number: number;
    ayah_number: number;
    word_index: number;
    arabic: string;
    transliteration: string;
    translation: string;
    root: string;
    root_explanation: string;
    grammar_type: string;
    grammar_details: string;
    recitation_url?: string;
    last_modified: string;
  };
}

/**
 * Check if Airtable is configured
 */
export function isAirtableConfigured(): boolean {
  return Boolean(AIRTABLE_API_KEY && AIRTABLE_BASE_ID);
}

/**
 * Fetch word data from Airtable
 */
export async function fetchWordFromAirtable(
  surahNum: number,
  ayahNum: number,
  wordIndex: number
): Promise<AirtableRecord | null> {
  if (!isAirtableConfigured()) {
    console.log('Airtable not configured, using local data');
    return null;
  }

  try {
    const filterFormula = `AND(
      {surah_number} = ${surahNum},
      {ayah_number} = ${ayahNum},
      {word_index} = ${wordIndex}
    )`;

    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records && data.records.length > 0 ? data.records[0] : null;
  } catch (error) {
    console.error('Error fetching from Airtable:', error);
    return null;
  }
}

/**
 * Save word data to Airtable
 */
export async function saveWordToAirtable(
  surahNum: number,
  ayahNum: number,
  wordIndex: number,
  wordData: any
): Promise<{ success: boolean; recordId?: string; error?: string }> {
  if (!isAirtableConfigured()) {
    return { success: false, error: 'Airtable not configured' };
  }

  try {
    // First, check if record exists
    const existingRecord = await fetchWordFromAirtable(surahNum, ayahNum, wordIndex);

    const recordData: AirtableRecord = {
      fields: {
        surah_number: surahNum,
        ayah_number: ayahNum,
        word_index: wordIndex,
        arabic: wordData.arabic,
        transliteration: wordData.transliteration,
        translation: wordData.translation,
        root: wordData.analysis.root,
        root_explanation: wordData.analysis.rootExplanation,
        grammar_type: wordData.analysis.type,
        grammar_details: wordData.analysis.grammar,
        recitation_url: wordData.recitationUrl || '',
        last_modified: new Date().toISOString()
      }
    };

    let response;
    if (existingRecord) {
      // Update existing record
      response = await fetch(`${AIRTABLE_API_URL}/${existingRecord.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordData)
      });
    } else {
      // Create new record
      response = await fetch(AIRTABLE_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: [recordData] })
      });
    }

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const result = await response.json();
    const recordId = existingRecord ? existingRecord.id : result.records[0].id;

    return { success: true, recordId };
  } catch (error) {
    console.error('Error saving to Airtable:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Bulk fetch all words for a surah from Airtable
 */
export async function fetchSurahFromAirtable(surahNum: number): Promise<AirtableRecord[]> {
  if (!isAirtableConfigured()) {
    return [];
  }

  try {
    const filterFormula = `{surah_number} = ${surahNum}`;
    const url = `${AIRTABLE_API_URL}?filterByFormula=${encodeURIComponent(filterFormula)}&sort[0][field]=ayah_number&sort[1][field]=word_index`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error('Error fetching surah from Airtable:', error);
    return [];
  }
}

/**
 * Sync status helper
 */
export function getSyncStatus(): 'online' | 'offline' | 'syncing' {
  if (!navigator.onLine) return 'offline';
  if (!isAirtableConfigured()) return 'offline';
  return 'online';
}
