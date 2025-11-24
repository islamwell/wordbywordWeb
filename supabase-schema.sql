-- =====================================================
-- Word by Word Quran Analysis - Supabase Database Schema
-- =====================================================
-- This schema is optimized for fast reads and efficient queries
-- with proper indexing and relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: surahs
-- Stores information about each Surah (chapter)
-- =====================================================
CREATE TABLE surahs (
    id SERIAL PRIMARY KEY,
    surah_number INTEGER UNIQUE NOT NULL CHECK (surah_number BETWEEN 1 AND 114),
    name_arabic TEXT NOT NULL,
    name_english TEXT NOT NULL,
    name_transliteration TEXT NOT NULL,
    revelation_type TEXT CHECK (revelation_type IN ('Meccan', 'Medinan')),
    total_verses INTEGER NOT NULL,
    order_of_revelation INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast surah lookups
CREATE INDEX idx_surahs_number ON surahs(surah_number);

-- =====================================================
-- TABLE: ayat (verses)
-- Stores individual verses within each Surah
-- =====================================================
CREATE TABLE ayat (
    id SERIAL PRIMARY KEY,
    surah_id INTEGER NOT NULL REFERENCES surahs(id) ON DELETE CASCADE,
    ayah_number INTEGER NOT NULL,
    arabic_text TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    translation_english TEXT NOT NULL,
    recitation_url TEXT,
    tafsir_url TEXT,
    juz_number INTEGER CHECK (juz_number BETWEEN 1 AND 30),
    hizb_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(surah_id, ayah_number)
);

-- Indexes for fast verse lookups
CREATE INDEX idx_ayat_surah ON ayat(surah_id);
CREATE INDEX idx_ayat_surah_ayah ON ayat(surah_id, ayah_number);
CREATE INDEX idx_ayat_juz ON ayat(juz_number);

-- =====================================================
-- TABLE: words
-- Stores individual words within verses
-- =====================================================
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    ayah_id INTEGER NOT NULL REFERENCES ayat(id) ON DELETE CASCADE,
    word_position INTEGER NOT NULL, -- Position within the verse (1, 2, 3, etc.)
    arabic_text TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    translation_english TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ayah_id, word_position)
);

-- Indexes for fast word lookups
CREATE INDEX idx_words_ayah ON words(ayah_id);
CREATE INDEX idx_words_ayah_position ON words(ayah_id, word_position);

-- =====================================================
-- TABLE: word_grammar
-- Stores detailed grammar analysis for each word
-- =====================================================
CREATE TABLE word_grammar (
    id SERIAL PRIMARY KEY,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,

    -- Basic grammar info
    word_type TEXT NOT NULL, -- e.g., "Verb", "Noun", "Particle", "Preposition"
    root_arabic TEXT,
    root_transliteration TEXT,
    root_explanation TEXT,
    grammar_notes TEXT,

    -- Detailed grammar fields (from your JSON structure)
    form TEXT, -- Verb form (I, II, III, etc.)
    person TEXT, -- "I", "You", "They", etc.
    tense TEXT, -- "Past", "Present", "Future", "Command"
    gender TEXT, -- "Masculine", "Feminine"
    number TEXT, -- "Singular", "Dual", "Plural"
    grammatical_case TEXT, -- "Nominative", "Accusative", "Genitive"
    definiteness TEXT, -- "Definite", "Indefinite"
    function_in_sentence TEXT, -- "Subject", "Object", "Predicate", etc.

    -- Extended explanations
    reason TEXT, -- Why this grammar form is used
    practical_usage TEXT, -- Practical tips for understanding

    -- Metadata
    verified BOOLEAN DEFAULT FALSE, -- Admin verified as correct
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(word_id)
);

-- Index for fast grammar lookups
CREATE INDEX idx_word_grammar_word ON word_grammar(word_id);
CREATE INDEX idx_word_grammar_type ON word_grammar(word_type);
CREATE INDEX idx_word_grammar_verified ON word_grammar(verified);

-- =====================================================
-- TABLE: user_profiles
-- Extended user information beyond Supabase auth
-- =====================================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for admin lookups
CREATE INDEX idx_user_profiles_admin ON user_profiles(is_admin);

-- =====================================================
-- TABLE: edit_history
-- Audit log of all grammar edits for tracking changes
-- =====================================================
CREATE TABLE edit_history (
    id SERIAL PRIMARY KEY,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    edited_by UUID NOT NULL REFERENCES auth.users(id),
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for history lookups
CREATE INDEX idx_edit_history_word ON edit_history(word_id);
CREATE INDEX idx_edit_history_user ON edit_history(edited_by);
CREATE INDEX idx_edit_history_created ON edit_history(created_at DESC);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_surahs_updated_at BEFORE UPDATE ON surahs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ayat_updated_at BEFORE UPDATE ON ayat
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_words_updated_at BEFORE UPDATE ON words
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_word_grammar_updated_at BEFORE UPDATE ON word_grammar
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE surahs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ayat ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_grammar ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE edit_history ENABLE ROW LEVEL SECURITY;

-- Surahs: Public read, admin write
CREATE POLICY "Surahs are viewable by everyone" ON surahs
    FOR SELECT USING (true);

CREATE POLICY "Surahs are editable by admins" ON surahs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
    );

-- Ayat: Public read, admin write
CREATE POLICY "Ayat are viewable by everyone" ON ayat
    FOR SELECT USING (true);

CREATE POLICY "Ayat are editable by admins" ON ayat
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
    );

-- Words: Public read, admin write
CREATE POLICY "Words are viewable by everyone" ON words
    FOR SELECT USING (true);

CREATE POLICY "Words are editable by admins" ON words
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
    );

-- Word Grammar: Public read, authenticated users can suggest, admins can verify
CREATE POLICY "Grammar is viewable by everyone" ON word_grammar
    FOR SELECT USING (true);

CREATE POLICY "Grammar is editable by authenticated users" ON word_grammar
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Grammar is updatable by authenticated users" ON word_grammar
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Grammar verification by admins" ON word_grammar
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
    );

-- User Profiles: Users can read their own, admins can read all
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.is_admin = true
        )
    );

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Edit History: Public read for transparency
CREATE POLICY "Edit history is viewable by everyone" ON edit_history
    FOR SELECT USING (true);

CREATE POLICY "Edit history is created automatically" ON edit_history
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- VIEWS FOR OPTIMIZED QUERIES
-- =====================================================

-- Complete verse view with all words and grammar
CREATE OR REPLACE VIEW complete_verses AS
SELECT
    s.surah_number,
    s.name_english as surah_name,
    a.ayah_number,
    a.arabic_text,
    a.transliteration,
    a.translation_english,
    a.recitation_url,
    a.tafsir_url,
    json_agg(
        json_build_object(
            'word_id', w.id,
            'position', w.word_position,
            'arabic', w.arabic_text,
            'transliteration', w.transliteration,
            'translation', w.translation_english,
            'grammar', json_build_object(
                'type', wg.word_type,
                'root', wg.root_arabic,
                'root_transliteration', wg.root_transliteration,
                'root_explanation', wg.root_explanation,
                'grammar_notes', wg.grammar_notes,
                'form', wg.form,
                'person', wg.person,
                'tense', wg.tense,
                'gender', wg.gender,
                'number', wg.number,
                'case', wg.grammatical_case,
                'definiteness', wg.definiteness,
                'function', wg.function_in_sentence,
                'reason', wg.reason,
                'practical', wg.practical_usage,
                'verified', wg.verified
            )
        )
        ORDER BY w.word_position
    ) as words
FROM surahs s
JOIN ayat a ON s.id = a.surah_id
JOIN words w ON a.id = w.ayah_id
LEFT JOIN word_grammar wg ON w.id = wg.word_id
GROUP BY s.surah_number, s.name_english, a.ayah_number, a.arabic_text,
         a.transliteration, a.translation_english, a.recitation_url, a.tafsir_url
ORDER BY s.surah_number, a.ayah_number;

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Get complete surah with all verses and words
CREATE OR REPLACE FUNCTION get_surah_complete(p_surah_number INTEGER)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'surahNumber', s.surah_number,
        'surahName', s.name_english,
        'surahArabic', s.name_arabic,
        'revelationType', s.revelation_type,
        'totalVerses', s.total_verses,
        'ayat', (
            SELECT json_agg(
                json_build_object(
                    'ayahNumber', a.ayah_number,
                    'arabic', a.arabic_text,
                    'transliteration', a.transliteration,
                    'translation', a.translation_english,
                    'recitationUrl', a.recitation_url,
                    'tafsirUrl', a.tafsir_url,
                    'words', (
                        SELECT json_agg(
                            json_build_object(
                                'arabic', w.arabic_text,
                                'transliteration', w.transliteration,
                                'translation', w.translation_english,
                                'analysis', json_build_object(
                                    'type', wg.word_type,
                                    'root', wg.root_transliteration,
                                    'rootExplanation', wg.root_explanation,
                                    'grammar', wg.grammar_notes
                                )
                            )
                            ORDER BY w.word_position
                        )
                        FROM words w
                        LEFT JOIN word_grammar wg ON w.id = wg.word_id
                        WHERE w.ayah_id = a.id
                    )
                )
                ORDER BY a.ayah_number
            )
            FROM ayat a
            WHERE a.surah_id = s.id
        )
    ) INTO result
    FROM surahs s
    WHERE s.surah_number = p_surah_number;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SAMPLE DATA INSERT (for testing)
-- =====================================================

-- Insert Surah Al-Fatiha
INSERT INTO surahs (surah_number, name_arabic, name_english, name_transliteration, revelation_type, total_verses, order_of_revelation)
VALUES (1, 'الفاتحة', 'Al-Fatiha', 'Al-Faatihah', 'Meccan', 7, 5);

-- Note: Use the data migration script to populate full data
-- This is just a sample for schema validation
