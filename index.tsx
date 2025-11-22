/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import ReactDOM from 'react-dom/client';
import { saveWordToAirtable, isAirtableConfigured, getSyncStatus } from './airtable';
import { AuthModal } from './src/AuthModal';
import { onAuthChange, logout, getCurrentUser, isFirebaseConfigured } from './src/firebase';
import type { User } from 'firebase/auth';

const THEMES = {
    dark: { bg: 'linear-gradient(135deg, #232526, #414345)' },
    light: { bg: 'linear-gradient(135deg, #f4f4f4, #e9e9e9)' },
    green: { bg: 'linear-gradient(135deg, #2A482A, #0F2D1E)' },
    blue: { bg: 'linear-gradient(135deg, #1E3A5F, #111827)' },
    red: { bg: 'linear-gradient(135deg, #4A1B1B, #2B0F0F)' },
    sepia: { bg: 'linear-gradient(135deg, #f4e9d8, #e9dec9)' },
};

const LOCAL_STORAGE_KEY = 'quranAppState';

const surahList = [
    { id: 1, name: 'Al-Fatihah', arabicName: 'ٱلْفَاتِحَة', revelationType: 'Meccan', verseCount: 7 },
    { id: 2, name: 'Al-Baqarah', arabicName: 'ٱلْبَقَرَة', revelationType: 'Medinan', verseCount: 286 },
    { id: 3, name: 'Ali \'Imran', arabicName: 'آلِ عِمْرَان', revelationType: 'Medinan', verseCount: 200 },
    { id: 4, name: 'An-Nisa', arabicName: 'ٱلنِّسَاء', revelationType: 'Medinan', verseCount: 176 },
    { id: 5, name: 'Al-Ma\'idah', arabicName: 'ٱلْمَائِدَة', revelationType: 'Medinan', verseCount: 120 },
    { id: 6, name: 'Al-An\'am', arabicName: 'ٱلْأَنْعَام', revelationType: 'Meccan', verseCount: 165 },
    { id: 7, name: 'Al-A\'raf', arabicName: 'ٱلْأَعْرَاف', revelationType: 'Meccan', verseCount: 206 },
    { id: 8, name: 'Al-Anfal', arabicName: 'ٱلْأَنْفَال', revelationType: 'Medinan', verseCount: 75 },
    { id: 9, name: 'At-Tawbah', arabicName: 'ٱلتَّوْبَة', revelationType: 'Medinan', verseCount: 129 },
    { id: 10, name: 'Yunus', arabicName: 'يُونُس', revelationType: 'Meccan', verseCount: 109 },
    { id: 11, name: 'Hud', arabicName: 'هُود', revelationType: 'Meccan', verseCount: 123 },
    { id: 12, name: 'Yusuf', arabicName: 'يُوسُف', revelationType: 'Meccan', verseCount: 111 },
    { id: 13, name: 'Ar-Ra\'d', arabicName: 'ٱلرَّعْد', revelationType: 'Meccan', verseCount: 43 },
    { id: 14, name: 'Ibrahim', arabicName: 'إِبْرَاهِيم', revelationType: 'Meccan', verseCount: 52 },
    { id: 15, name: 'Al-Hijr', arabicName: 'ٱلْحِجْر', revelationType: 'Meccan', verseCount: 99 },
    { id: 16, name: 'An-Nahl', arabicName: 'ٱلنَّحْل', revelationType: 'Meccan', verseCount: 128 },
    { id: 17, name: 'Al-Isra', arabicName: 'ٱلْإِسْرَاء', revelationType: 'Meccan', verseCount: 111 },
    { id: 18, name: 'Al-Kahf', arabicName: 'ٱلْكَهْف', revelationType: 'Meccan', verseCount: 110 },
    { id: 19, name: 'Maryam', arabicName: 'مَرْيَم', revelationType: 'Meccan', verseCount: 98 },
    { id: 20, name: 'Taha', arabicName: 'طه', revelationType: 'Meccan', verseCount: 135 },
    { id: 21, name: 'Al-Anbya', arabicName: 'ٱلْأَنْبِيَاء', revelationType: 'Meccan', verseCount: 112 },
    { id: 22, name: 'Al-Hajj', arabicName: 'ٱلْحَجّ', revelationType: 'Medinan', verseCount: 78 },
    { id: 23, name: 'Al-Mu\'minun', arabicName: 'ٱلْمُؤْمِنُون', revelationType: 'Meccan', verseCount: 118 },
    { id: 24, name: 'An-Nur', arabicName: 'ٱلنُّور', revelationType: 'Medinan', verseCount: 64 },
    { id: 25, name: 'Al-Furqan', arabicName: 'ٱلْفُرْقَان', revelationType: 'Meccan', verseCount: 77 },
    { id: 26, name: 'Ash-Shu\'ara', arabicName: 'ٱلشُّعَرَاء', revelationType: 'Meccan', verseCount: 227 },
    { id: 27, name: 'An-Naml', arabicName: 'ٱلنَّمْل', revelationType: 'Meccan', verseCount: 93 },
    { id: 28, name: 'Al-Qasas', arabicName: 'ٱلْقَصَص', revelationType: 'Meccan', verseCount: 88 },
    { id: 29, name: 'Al-\'Ankabut', arabicName: 'ٱلْعَنْكَبُوت', revelationType: 'Meccan', verseCount: 69 },
    { id: 30, name: 'Ar-Rum', arabicName: 'ٱلرُّوم', revelationType: 'Meccan', verseCount: 60 },
    { id: 31, name: 'Luqman', arabicName: 'لُقْمَان', revelationType: 'Meccan', verseCount: 34 },
    { id: 32, name: 'As-Sajdah', arabicName: 'ٱلسَّجْدَة', revelationType: 'Meccan', verseCount: 30 },
    { id: 33, name: 'Al-Ahzab', arabicName: 'ٱلْأَحْزَاب', revelationType: 'Medinan', verseCount: 73 },
    { id: 34, name: 'Saba', arabicName: 'سَبَأ', revelationType: 'Meccan', verseCount: 54 },
    { id: 35, name: 'Fatir', arabicName: 'فَاطِر', revelationType: 'Meccan', verseCount: 45 },
    { id: 36, name: 'Ya-Sin', arabicName: 'يس', revelationType: 'Meccan', verseCount: 83 },
    { id: 37, name: 'As-Saffat', arabicName: 'ٱلصَّافَّات', revelationType: 'Meccan', verseCount: 182 },
    { id: 38, name: 'Sad', arabicName: 'ص', revelationType: 'Meccan', verseCount: 88 },
    { id: 39, name: 'Az-Zumar', arabicName: 'ٱلزُّمَر', revelationType: 'Meccan', verseCount: 75 },
    { id: 40, name: 'Ghafir', arabicName: 'غَافِر', revelationType: 'Meccan', verseCount: 85 },
    { id: 41, name: 'Fussilat', arabicName: 'فُصِّلَت', revelationType: 'Meccan', verseCount: 54 },
    { id: 42, name: 'Ash-Shuraa', arabicName: 'ٱلشُّورىٰ', revelationType: 'Meccan', verseCount: 53 },
    { id: 43, name: 'Az-Zukhruf', arabicName: 'ٱلزُّخْرُف', revelationType: 'Meccan', verseCount: 89 },
    { id: 44, name: 'Ad-Dukhan', arabicName: 'ٱلدُّخَان', revelationType: 'Meccan', verseCount: 59 },
    { id: 45, name: 'Al-Jathiyah', arabicName: 'ٱلْجَاثِيَة', revelationType: 'Meccan', verseCount: 37 },
    { id: 46, name: 'Al-Ahqaf', arabicName: 'ٱلْأَحْقَاف', revelationType: 'Meccan', verseCount: 35 },
    { id: 47, name: 'Muhammad', arabicName: 'مُحَمَّد', revelationType: 'Medinan', verseCount: 38 },
    { id: 48, name: 'Al-Fath', arabicName: 'ٱلْفَتْح', revelationType: 'Medinan', verseCount: 29 },
    { id: 49, name: 'Al-Hujurat', arabicName: 'ٱلْحُجُرَات', revelationType: 'Medinan', verseCount: 18 },
    { id: 50, name: 'Qaf', arabicName: 'ق', revelationType: 'Meccan', verseCount: 45 },
    { id: 51, name: 'Adh-Dhariyat', arabicName: 'ٱلذَّارِيَات', revelationType: 'Meccan', verseCount: 60 },
    { id: 52, name: 'At-Tur', arabicName: 'ٱلطُّور', revelationType: 'Meccan', verseCount: 49 },
    { id: 53, name: 'An-Najm', arabicName: 'ٱلنَّجْم', revelationType: 'Meccan', verseCount: 62 },
    { id: 54, name: 'Al-Qamar', arabicName: 'ٱلْقَمَر', revelationType: 'Meccan', verseCount: 55 },
    { id: 55, name: 'Ar-Rahman', arabicName: 'ٱلرَّحْمَٰن', revelationType: 'Medinan', verseCount: 78 },
    { id: 56, name: 'Al-Waqi\'ah', arabicName: 'ٱلْوَاقِعَة', revelationType: 'Meccan', verseCount: 96 },
    { id: 57, name: 'Al-Hadid', arabicName: 'ٱلْحَدِيد', revelationType: 'Medinan', verseCount: 29 },
    { id: 58, name: 'Al-Mujadila', arabicName: 'ٱلْمُجَادِلَة', revelationType: 'Medinan', verseCount: 22 },
    { id: 59, name: 'Al-Hashr', arabicName: 'ٱلْحَشْر', revelationType: 'Medinan', verseCount: 24 },
    { id: 60, name: 'Al-Mumtahanah', arabicName: 'ٱلْمُمْتَحَنَة', revelationType: 'Medinan', verseCount: 13 },
    { id: 61, name: 'As-Saf', arabicName: 'ٱلصَّفّ', revelationType: 'Medinan', verseCount: 14 },
    { id: 62, name: 'Al-Jumu\'ah', arabicName: 'ٱلْجُمُعَة', revelationType: 'Medinan', verseCount: 11 },
    { id: 63, name: 'Al-Munafiqun', arabicName: 'ٱلْمُنَافِقُون', revelationType: 'Medinan', verseCount: 11 },
    { id: 64, name: 'At-Taghabun', arabicName: 'ٱلتَّغَابُن', revelationType: 'Medinan', verseCount: 18 },
    { id: 65, name: 'At-Talaq', arabicName: 'ٱلطَّلَاق', revelationType: 'Medinan', verseCount: 12 },
    { id: 66, name: 'At-Tahrim', arabicName: 'ٱلتَّحْرِيم', revelationType: 'Medinan', verseCount: 12 },
    { id: 67, name: 'Al-Mulk', arabicName: 'ٱلْمُلْك', revelationType: 'Meccan', verseCount: 30 },
    { id: 68, name: 'Al-Qalam', arabicName: 'ٱلْقَلَم', revelationType: 'Meccan', verseCount: 52 },
    { id: 69, name: 'Al-Haqqah', arabicName: 'ٱلْحَاقَّة', revelationType: 'Meccan', verseCount: 52 },
    { id: 70, name: 'Al-Ma\'arij', arabicName: 'ٱلْمَعَارِج', revelationType: 'Meccan', verseCount: 44 },
    { id: 71, name: 'Nuh', arabicName: 'نُوح', revelationType: 'Meccan', verseCount: 28 },
    { id: 72, name: 'Al-Jinn', arabicName: 'ٱلْجِنّ', revelationType: 'Meccan', verseCount: 28 },
    { id: 73, name: 'Al-Muzzammil', arabicName: 'ٱلْمُزَّمِّل', revelationType: 'Meccan', verseCount: 20 },
    { id: 74, name: 'Al-Muddaththir', arabicName: 'ٱلْمُدَّثِّر', revelationType: 'Meccan', verseCount: 56 },
    { id: 75, name: 'Al-Qiyamah', arabicName: 'ٱلْقِيَامَة', revelationType: 'Meccan', verseCount: 40 },
    { id: 76, name: 'Al-Insan', arabicName: 'ٱلْإِنْسَان', revelationType: 'Medinan', verseCount: 31 },
    { id: 77, name: 'Al-Mursalat', arabicName: 'ٱلْمُرْسَلَات', revelationType: 'Meccan', verseCount: 50 },
    { id: 78, name: 'An-Naba', arabicName: 'ٱلنَّبَأ', revelationType: 'Meccan', verseCount: 40 },
    { id: 79, name: 'An-Nazi\'at', arabicName: 'ٱلنَّازِعَات', revelationType: 'Meccan', verseCount: 46 },
    { id: 80, name: '\'Abasa', arabicName: 'عَبَسَ', revelationType: 'Meccan', verseCount: 42 },
    { id: 81, name: 'At-Takwir', arabicName: 'ٱلتَّكْوِير', revelationType: 'Meccan', verseCount: 29 },
    { id: 82, name: 'Al-Infitar', arabicName: 'ٱلْإِنْفِطَار', revelationType: 'Meccan', verseCount: 19 },
    { id: 83, name: 'Al-Mutaffifin', arabicName: 'ٱلْمُطَفِّفِين', revelationType: 'Meccan', verseCount: 36 },
    { id: 84, name: 'Al-Inshiqaq', arabicName: 'ٱلْإِنْشِقَاق', revelationType: 'Meccan', verseCount: 25 },
    { id: 85, name: 'Al-Buruj', arabicName: 'ٱلْبُرُوج', revelationType: 'Meccan', verseCount: 22 },
    { id: 86, name: 'At-Tariq', arabicName: 'ٱلطَّارِق', revelationType: 'Meccan', verseCount: 17 },
    { id: 87, name: 'Al-A\'la', arabicName: 'ٱلْأَعْلَىٰ', revelationType: 'Meccan', verseCount: 19 },
    { id: 88, name: 'Al-Ghashiyah', arabicName: 'ٱلْغَاشِيَة', revelationType: 'Meccan', verseCount: 26 },
    { id: 89, name: 'Al-Fajr', arabicName: 'ٱلْفَجْر', revelationType: 'Meccan', verseCount: 30 },
    { id: 90, name: 'Al-Balad', arabicName: 'ٱلْبَلَد', revelationType: 'Meccan', verseCount: 20 },
    { id: 91, name: 'Ash-Shams', arabicName: 'ٱلشَّمْس', revelationType: 'Meccan', verseCount: 15 },
    { id: 92, name: 'Al-Layl', arabicName: 'ٱللَّيْل', revelationType: 'Meccan', verseCount: 21 },
    { id: 93, name: 'Ad-Duhaa', arabicName: 'ٱلضُّحَىٰ', revelationType: 'Meccan', verseCount: 11 },
    { id: 94, name: 'Ash-Sharh', arabicName: 'ٱلشَّרْح', revelationType: 'Meccan', verseCount: 8 },
    { id: 95, name: 'At-Tin', arabicName: 'ٱلتِّين', revelationType: 'Meccan', verseCount: 8 },
    { id: 96, name: 'Al-\'Alaq', arabicName: 'ٱلْعَلَق', revelationType: 'Meccan', verseCount: 19 },
    { id: 97, name: 'Al-Qadr', arabicName: 'ٱلْقَدْر', revelationType: 'Meccan', verseCount: 5 },
    { id: 98, name: 'Al-Bayyinah', arabicName: 'ٱلْبَيِّنَة', revelationType: 'Medinan', verseCount: 8 },
    { id: 99, name: 'Az-Zalzalah', arabicName: 'ٱلزَّلْزَلَة', revelationType: 'Medinan', verseCount: 8 },
    { id: 100, name: 'Al-\'Adiyat', arabicName: 'ٱلْعَادِيَات', revelationType: 'Meccan', verseCount: 11 },
    { id: 101, name: 'Al-Qari\'ah', arabicName: 'ٱلْقَارِعَة', revelationType: 'Meccan', verseCount: 11 },
    { id: 102, name: 'At-Takathur', arabicName: 'ٱلتَّكَاثُر', revelationType: 'Meccan', verseCount: 8 },
    { id: 103, name: 'Al-\'Asr', arabicName: 'ٱلْعَصْر', revelationType: 'Meccan', verseCount: 3 },
    { id: 104, name: 'Al-Humazah', arabicName: 'ٱلْهُمَزَة', revelationType: 'Meccan', verseCount: 9 },
    { id: 105, name: 'Al-Fil', arabicName: 'ٱلْفِيل', revelationType: 'Meccan', verseCount: 5 },
    { id: 106, name: 'Quraysh', arabicName: 'قُرَيْش', revelationType: 'Meccan', verseCount: 4 },
    { id: 107, name: 'Al-Ma\'un', arabicName: 'ٱلْمَاعُون', revelationType: 'Meccan', verseCount: 7 },
    { id: 108, name: 'Al-Kawthar', arabicName: 'ٱلْكَوْثَر', revelationType: 'Meccan', verseCount: 3 },
    { id: 109, name: 'Al-Kafirun', arabicName: 'ٱلْكَافِرُون', revelationType: 'Meccan', verseCount: 6 },
    { id: 110, name: 'An-Nasr', arabicName: 'ٱلنَّصْر', revelationType: 'Medinan', verseCount: 3 },
    { id: 111, name: 'Al-Masad', arabicName: 'ٱلْمَسَد', revelationType: 'Meccan', verseCount: 5 },
    { id: 112, name: 'Al-Ikhlas', arabicName: 'ٱلْإِخْلَاص', revelationType: 'Meccan', verseCount: 4 },
    { id: 113, name: 'Al-Falaq', arabicName: 'ٱلْفَلَق', revelationType: 'Meccan', verseCount: 5 },
    { id: 114, name: 'An-Nas', arabicName: 'ٱلنَّاس', revelationType: 'Meccan', verseCount: 6 }
];

const initialAllSurahData = {
    1: {
        surahNumber: 1,
        surahName: "Al-Fatihah",
        ayat: [
            { ayahNumber: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Bismi Allāhi ar-Raḥmāni ar-Raḥīm', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/001001.mp3', words: [{arabic: 'بِسْمِ', transliteration: 'Bismi', translation: 'In the name', analysis: {type: 'Phrase', root: 'س م و', rootExplanation: 'Name, mark, to be high', grammar: 'The word for name (ism) ends with a kasra sound (-i) because it comes after the word بِ (bi-), which means "in" or "with". Words that follow such prepositions often take a kasra.'}}, {arabic: 'اللَّهِ', transliteration: 'Allāhi', translation: 'of Allah', analysis: {type: 'Proper Name', root: 'أ ل ه', rootExplanation: 'To worship, a deity', grammar: 'Ends with a kasra sound (-i) because it is showing possession, as in "the name *of* Allah".'}}, {arabic: 'الرَّحْمَٰنِ', transliteration: 'ar-Raḥmāni', translation: 'the Entirely Merciful', analysis: {type: 'Adjective', root: 'ر ح م', rootExplanation: 'Mercy, compassion', grammar: 'Ends with a kasra sound (-i) to match "Allah", the word it is describing.'}}, {arabic: 'الرَّحِيمِ', transliteration: 'ar-Raḥīm', translation: 'the Especially Merciful', analysis: {type: 'Adjective', root: 'ر ح م', rootExplanation: 'Mercy, compassion', grammar: 'Also ends with a kasra sound (-i) to match "Allah", the word it is describing.'}}]},
            { ayahNumber: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: 'Al-ḥamdu lillāhi Rabbi al-ʿālamīn', translation: '[All] praise is [due] to Allah, Lord of the worlds -', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/001002.mp3', words: [{arabic: 'الْحَمْدُ', transliteration: 'Al-ḥamdu', translation: 'The praise', analysis: {type: 'Noun', root: 'ح م د', rootExplanation: 'Praise, commendation', grammar: 'Ends with a dhumma sound (-u) because it is the subject, the main topic of the sentence.'}}, {arabic: 'لِلَّهِ', transliteration: 'lillāhi', translation: 'to Allah', analysis: {type: 'Preposition + Noun', root: 'أ ل ه', rootExplanation: 'To worship, a deity', grammar: 'The word Allah ends with a kasra (-i) because it follows the preposition لِـ (li-), which means "for" or "belongs to".'}}, {arabic: 'رَبِّ', transliteration: 'Rabbi', translation: 'Lord', analysis: {type: 'Noun', root: 'ر ب ب', rootExplanation: 'Lord, master, sustainer', grammar: 'Ends with a kasra sound (-i) because it is another description for Allah, and so it matches the case of "Allah".'}}, {arabic: 'الْعَالَمِينَ', transliteration: 'al-ʿālamīn', translation: 'of the worlds', analysis: {type: 'Noun', root: 'ع ل م', rootExplanation: 'To know, world, creation', grammar: 'The "-īna" ending here indicates the word is in a state of "possession" (Lord *of* the worlds) or follows a preposition.'}}]},
            { ayahNumber: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Ar-Raḥmāni ar-Raḥīm', translation: 'The Entirely Merciful, the Especially Merciful,', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/001003.mp3', words: [{arabic: 'الرَّحْمَٰنِ', transliteration: 'ar-Raḥmāni', translation: 'the Entirely Merciful', analysis: {type: 'Adjective', root: 'ر ح م', rootExplanation: 'Mercy, compassion', grammar: 'This is a description of "Allah" from the previous verse, so it takes the same kasra sound (-i).'}}, {arabic: 'الرَّحِيمِ', transliteration: 'ar-Raḥīm', translation: 'the Especially Merciful', analysis: {type: 'Adjective', root: 'ر ح م', rootExplanation: 'Mercy, compassion', grammar: 'This is a second description of "Allah", so it also takes the same kasra sound (-i).'}}]},
            { ayahNumber: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', transliteration: 'Māliki yawmi ad-dīn', translation: 'Sovereign of the Day of Recompense.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/001004.mp3', words: [{arabic: 'مَالِكِ', transliteration: 'Māliki', translation: 'Sovereign', analysis: {type: 'Noun', root: 'م ل ك', rootExplanation: 'To own, possess, rule', grammar: 'This is a third description for "Allah", so it also takes a kasra sound (-i).'}}, {arabic: 'يَوْمِ', transliteration: 'yawmi', translation: 'of the Day', analysis: {type: 'Noun', root: 'ي و م', rootExplanation: 'Day, period of time', grammar: 'Ends with a kasra sound (-i) to show possession: "Sovereign *of* the Day".'}}, {arabic: 'الدِّينِ', transliteration: 'ad-dīn', translation: 'of Recompense', analysis: {type: 'Noun', root: 'د ي ن', rootExplanation: 'Judgment, religion, debt', grammar: 'Ends with a kasra sound (-i) to show possession: "Day *of* Recompense".'}}]},
            { ayahNumber: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', transliteration: 'Iyyāka naʿbudu wa iyyāka nastaʿīn', translation: 'It is You we worship and You we ask for help.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/001005.mp3', words: [{arabic: 'إِيَّاكَ', transliteration: 'Iyyāka', translation: 'You (alone)', analysis: {type: 'Pronoun', root: 'N/A', rootExplanation: 'A special pronoun for "you" used as the object of an action.', grammar: 'Placing this before the verb adds emphasis, meaning "It is You *and no one else* we worship". It has a fatha ending.'}}, {arabic: 'نَعْبُدُ', transliteration: 'naʿbudu', translation: 'we worship', analysis: {type: 'Verb (present tense)', root: 'ع ب د', rootExplanation: 'To worship, serve', grammar: 'The "na-" at the beginning means "we". It ends in dhumma (-u), which is the default for present tense verbs like this.'}}, {arabic: 'وَإِيَّاكَ', transliteration: 'wa iyyāka', translation: 'and You (alone)', analysis: {type: 'Connector + Pronoun', root: 'N/A', rootExplanation: '"Wa" (and) plus the same emphatic pronoun "Iyyāka".', grammar: 'The emphasis is repeated for the second phrase.'}}, {arabic: 'نَسْتَعِينُ', transliteration: 'nastaʿīn', translation: 'we ask for help', analysis: {type: 'Verb (present tense)', root: 'ع و ن', rootExplanation: 'To help, assist', grammar: 'The "na-" at the beginning means "we". The "-sta-" is a pattern that often means "to seek" or "to ask for", so "we ask for help".'}}]},
            { ayahNumber: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', transliteration: 'Ihdinā aṣ-ṣirāṭa al-mustaqīm', translation: 'Guide us to the straight path -', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/001006.mp3', words: [{arabic: 'اهْدِنَا', transliteration: 'Ihdinā', translation: 'Guide us', analysis: {type: 'Command Verb + Pronoun', root: 'ه د ي', rootExplanation: 'To guide, lead', grammar: 'This is a command or a request ("Guide") with the object "us" ("nā") attached.'}}, {arabic: 'الصِّرَاطَ', transliteration: 'aṣ-ṣirāṭa', translation: 'the path', analysis: {type: 'Noun', root: 'ص ر ط', rootExplanation: 'Path, road, way', grammar: 'Ends with a fatha sound (-a) because it is the second object of the verb "guide". It answers, "Guide us to *what*?" — "the path".'}}, {arabic: 'الْمُسْتَقِيمَ', transliteration: 'al-mustaqīm', translation: 'the straight', analysis: {type: 'Adjective', root: 'ق و م', rootExplanation: 'To stand, be straight', grammar: 'Ends with a fatha sound (-a) to match the word it describes, "the path" (الصِّرَاطَ).'}}]},
            { ayahNumber: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', transliteration: 'Ṣirāṭa alladhīna anʿamta ʿalayhim ghayri al-maghḍūbi ʿalayhim wa lā aḍ-ḍāllīn', translation: 'The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/001007.mp3', words: [{arabic: 'صِرَاطَ', transliteration: 'Ṣirāṭa', translation: 'The path', analysis: {type: 'Noun', root: 'ص ر ط', rootExplanation: 'Path, road, way', grammar: 'Ends with a fatha (-a) because it is clarifying "the straight path" from the previous verse, so it takes the same fatha.'}}, {arabic: 'الَّذِينَ', transliteration: 'alladhīna', translation: 'of those', analysis: {type: 'Connecting Word', root: 'N/A', rootExplanation: 'A word that means "those who", connecting "path" to a description of people.', grammar: 'It is in a state of possession: "path *of* those who..."'}}, {arabic: 'أَنْعَمْتَ', transliteration: 'anʿamta', translation: 'You have bestowed favor', analysis: {type: 'Verb (past tense)', root: 'ن ع م', rootExplanation: 'Favor, blessing, ease', grammar: 'An action that is completed. The "-ta" ending means "you" (singular) did the action.'}}, {arabic: 'غَيْرِ', transliteration: 'ghayri', translation: 'not of', analysis: {type: 'Noun', root: 'غ ي ر', rootExplanation: 'Other than, not', grammar: 'Ends with a kasra (-i) because it acts as a substitute for "those", which was in a state of possession.'}}, {arabic: 'الْمَغْضُوبِ', transliteration: 'al-maghḍūbi', translation: 'those who have earned anger', analysis: {type: 'Noun (Receiver of action)', root: 'غ ض ب', rootExplanation: 'Anger, wrath', grammar: 'Ends with a kasra (-i) to show possession: "...not *of* those who have earned anger".'}}, {arabic: 'الضَّالِّينَ', transliteration: 'aḍ-ḍāllīn', translation: 'those who are astray', analysis: {type: 'Noun (Doers)', root: 'ض ل ل', rootExplanation: 'To be lost, go astray', grammar: 'The "-īna" ending shows it is connected by "and" to the previous group, which was in a state of possession.'}}]}
        ]
    },
    73: {
        surahNumber: 73,
        surahName: "Al-Muzzammil",
        ayat: [
            {
                ayahNumber: 1,
                arabic: "يَا أَيُّهَا الْمُزَّمِّلُ",
                transliteration: "Yā ayyuha al-muzzammil",
                translation: "O you who wraps himself [in clothing],",
                recitationUrl: "https://everyayah.com/data/Nasser_Alqatami_128kbps/073001.mp3",
                words: [
                    { arabic: 'يَا أَيُّهَا', transliteration: 'Yā ayyuhā', translation: 'O you', analysis: { type: 'Calling Phrase', root: 'N/A', rootExplanation: 'Used to get someone\'s attention, like saying "O" or "Hey you".', grammar: 'The word أَيُّ ends with a dhumma sound (-u) because it is the one being directly addressed in this specific calling structure.' } },
                    { arabic: 'الْمُزَّمِّلُ', transliteration: 'al-muzzammil', translation: 'the one who wraps himself', analysis: { type: 'Descriptive Noun (Doer)', root: 'ز م ل', rootExplanation: 'To wrap, enfold, or cover oneself in a garment.', grammar: 'Ends in a dhumma sound (-u) because it\'s the subject being described after the call "O you...". It\'s the main focus of the address.' } }
                ]
            },
            {
                ayahNumber: 2,
                arabic: "قُمِ اللَّيْلَ إِلَّا قَلِيلًا",
                transliteration: "Qumi al-layla illā qalīlā",
                translation: "Arise [to pray] the night, except for a little -",
                recitationUrl: "https://everyayah.com/data/Nasser_Alqatami_128kbps/073002.mp3",
                words: [
                    { arabic: 'قُمِ', transliteration: 'Qumi', translation: 'Arise', analysis: { type: 'Command Verb', root: 'ق و م', rootExplanation: 'To stand, rise, establish.', grammar: 'A command to a single person. The "i" sound (kasra) is added to connect it smoothly to the next word which starts with "al-".' } },
                    { arabic: 'اللَّيْلَ', transliteration: 'al-layla', translation: 'the night', analysis: { type: 'Noun (Time)', root: 'ل ي ل', rootExplanation: 'Night, the period of darkness.', grammar: 'Ends in a fatha sound (-a) because it specifies *when* the action of "Arise" should happen. Words specifying the time or place of an action often take a fatha.' } },
                    { arabic: 'إِلَّا', transliteration: 'illā', translation: 'except', analysis: { type: 'Exception Word', root: 'N/A', rootExplanation: 'Used to exclude something from a general statement, like "but" or "except".', grammar: 'A word that marks an exception.' } },
                    { arabic: 'قَلِيلًا', transliteration: 'qalīlā', translation: 'a little', analysis: { type: 'Noun/Adjective', root: 'ق ل ل', rootExplanation: 'To be few, little, small in number or amount.', grammar: 'Ends in a fatha sound (-an) because it is the thing being "excepted" or excluded by the word إِلَّا (illā).' } }
                ]
            },
            {
                ayahNumber: 3,
                arabic: "نِّصْفَهُ أَوِ انقُصْ مِنْهُ قَلِيلًا",
                transliteration: "Niṣfahū awi anquṣ minhu qalīlā",
                translation: "Half of it - or subtract from it a little.",
                recitationUrl: "https://everyayah.com/data/Nasser_Alqatami_128kbps/073003.mp3",
                words: [
                    { arabic: 'نِّصْفَهُ', transliteration: 'Niṣfahū', translation: 'Half of it', analysis: { type: 'Noun + Pronoun', root: 'ن ص ف', rootExplanation: 'To be half, middle.', grammar: 'Ends with a fatha sound (-a) because it is an alternative or clarification for "a little" (قَلِيلًا) from the previous verse, which also had a fatha.' } },
                    { arabic: 'أَوِ', transliteration: 'aw(i)', translation: 'or', analysis: { type: 'Connector Word', root: 'N/A', rootExplanation: 'Used to show a choice, like "or".', grammar: 'The "i" sound (kasra) is added to connect smoothly to the next word.' } },
                    { arabic: 'انقُصْ', transliteration: 'anquṣ', translation: 'subtract', analysis: { type: 'Command Verb', root: 'ن ق ص', rootExplanation: 'To decrease, lessen.', grammar: 'A command to a single person, telling them to do an action.' } },
                    { arabic: 'مِنْهُ', transliteration: 'minhu', translation: 'from it', analysis: { type: 'Connecting Word + Pronoun', root: 'N/A', rootExplanation: 'A combination of "min" (from) and "hu" (it).', grammar: 'Shows direction away from something.' } },
                    { arabic: 'قَلِيلًا', transliteration: 'qalīlā', translation: 'a little', analysis: { type: 'Noun', root: 'ق ل ل', rootExplanation: 'To be few, little.', grammar: 'Ends in a fatha sound (-an) because it is the object of the command "subtract". It answers the question "subtract what?" - "a little".' } }
                ]
            },
            {
                ayahNumber: 4,
                arabic: "أَوْ زِدْ عَلَيْهِ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
                transliteration: "Aw zid ʿalayhi wa rattili al-qurʾāna tartīlā",
                translation: "Or add to it, and recite the Qur'an with measured recitation.",
                recitationUrl: "https://everyayah.com/data/Nasser_Alqatami_128kbps/073004.mp3",
                words: [
                    { arabic: 'أَوْ', transliteration: 'Aw', translation: 'Or', analysis: { type: 'Connector Word', root: 'N/A', rootExplanation: 'Used to show a choice.', grammar: 'Connects two options.' } },
                    { arabic: 'زِدْ', transliteration: 'zid', translation: 'add', analysis: { type: 'Command Verb', root: 'ز ي د', rootExplanation: 'To increase, add.', grammar: 'A command to a single person.' } },
                    { arabic: 'عَلَيْهِ', transliteration: 'ʿalayhi', translation: 'to it', analysis: { type: 'Connecting Word + Pronoun', root: 'N/A', rootExplanation: 'Combination of "ʿalā" (upon) and "hi" (it).', grammar: 'Shows direction towards something.' } },
                    { arabic: 'وَرَتِّلِ', transliteration: 'wa rattili', translation: 'and recite', analysis: { type: 'Connector + Command Verb', root: 'ر ت ل', rootExplanation: 'To arrange, put in order; recite melodiously.', grammar: 'A command. The "i" sound (kasra) is added to connect it smoothly to the next word, "al-Qur\'an".' } },
                    { arabic: 'الْقُرْآنَ', transliteration: 'al-qurʾāna', translation: 'the Qur\'an', analysis: { type: 'Noun', root: 'ق ر أ', rootExplanation: 'To read, recite.', grammar: 'Ends with a fatha sound (-a) because it is the object of the command "recite". It answers "recite what?" - "the Qur\'an".' } },
                    { arabic: 'تَرْتِيلًا', transliteration: 'tartīlā', translation: 'with measured recitation', analysis: { type: 'Noun for Emphasis', root: 'ر ت ل', rootExplanation: 'To arrange, recite.', grammar: 'Ends with a fatha sound (-an) to add emphasis to the verb "recite" (رَتِّلِ). It\'s like saying "recite with a *true* recitation".' } }
                ]
            },
            { ayahNumber: 5, arabic: 'إِنَّا سَنُلْقِي عَلَيْكَ قَوْلًا ثَقِيلًا', transliteration: 'Innā sanulqī ʿalayka qawlan thaqīlā', translation: 'Indeed, We will cast upon you a heavy word.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073005.mp3', words: [{arabic: 'إِنَّا', transliteration: 'Innā', translation: 'Indeed, We', analysis: {type: 'Emphasizing Word + Pronoun', root: 'N/A', rootExplanation: 'Inna is used for emphasis, like saying "Verily" or "Indeed". "Nā" means "We".', grammar: 'Used at the start of a sentence to add certainty.'}}, {arabic: 'سَنُلْقِي', transliteration: 'sanulqī', translation: 'We will cast', analysis: {type: 'Future Verb', root: 'ل ق ي', rootExplanation: 'To meet, find, throw.', grammar: 'The "sa-" at the beginning indicates the action will happen in the future.'}}, {arabic: 'عَلَيْكَ', transliteration: 'ʿalayka', translation: 'upon you', analysis: {type: 'Connecting word + Pronoun', root: 'N/A', rootExplanation: '"ʿalā" (upon) + "ka" (you).', grammar: 'Indicates the direction of the action.'}}, {arabic: 'قَوْلًا', transliteration: 'qawlan', translation: 'a word', analysis: {type: 'Noun', root: 'ق و ل', rootExplanation: 'To say, a saying.', grammar: 'Ends with a fatha sound (-an) because it is the object of the verb "cast". It answers "cast what?" - "a word".'}}, {arabic: 'ثَقِيلًا', transliteration: 'thaqīlā', translation: 'heavy', analysis: {type: 'Adjective', root: 'ث q l', rootExplanation: 'To be heavy, weighty.', grammar: 'Ends with a fatha sound (-an) to match the word it describes ("qawlan").'}}]},
            { ayahNumber: 6, arabic: 'إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا', transliteration: 'Inna nāshiʾata al-layli hiya ashaddu waṭʾan wa aqwamu qīlā', translation: 'Indeed, the hours of the night are more effective for concurrence [of heart and tongue] and more suitable for words.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073006.mp3', words: [{arabic: 'نَاشِئَةَ', transliteration: 'nāshiʾata', translation: 'hours', analysis: {type: 'Noun', root: 'ن ش أ', rootExplanation: 'To arise, grow.', grammar: 'Ends in fatha (-a) because it is the subject of the emphasizing word "Inna".'}}, {arabic: 'اللَّيْلِ', transliteration: 'al-layli', translation: 'the night', analysis: {type: 'Noun', root: 'ل ي ل', rootExplanation: 'Night.', grammar: 'Ends in kasra (-i) to show possession: "the hours *of* the night".'}}, {arabic: 'أَشَدُّ', transliteration: 'ashaddu', translation: 'more effective', analysis: {type: 'Comparative Adjective', root: 'ش د د', rootExplanation: 'To be strong, intense.', grammar: 'A word pattern for "more ____". Ends in dhumma (-u) because it is describing the subject.'}}, {arabic: 'وَطْئًا', transliteration: 'waṭʾan', translation: 'for concurrence', analysis: {type: 'Noun for Clarification', root: 'و ط أ', rootExplanation: 'To trample, tread.', grammar: 'Ends in fatha (-an) to clarify *in what way* it is "more effective".'}}, {arabic: 'أَقْوَمُ', transliteration: 'aqwamu', translation: 'more suitable', analysis: {type: 'Comparative Adjective', root: 'ق و م', rootExplanation: 'To stand, be straight.', grammar: 'A word pattern for "more ____". Ends in dhumma (-u).'}}, {arabic: 'قِيلًا', transliteration: 'qīlā', translation: 'for words', analysis: {type: 'Noun for Clarification', root: 'ق و ل', rootExplanation: 'To say.', grammar: 'Ends in fatha (-an) to clarify *in what way* it is "more suitable".'}}]},
            { ayahNumber: 7, arabic: 'إِنَّ لَكَ فِي النَّهَارِ سَبْحًا طَوِيلًا', transliteration: 'Inna laka fī an-nahāri sabḥan ṭawīlā', translation: 'Indeed, for you by day is prolonged occupation.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073007.mp3', words: [{arabic: 'النَّهَارِ', transliteration: 'an-nahāri', translation: 'the day', analysis: {type: 'Noun', root: 'ن ه ر', rootExplanation: 'Daytime.', grammar: 'Ends in kasra (-i) because it follows the connecting word "fī" (in).'}}, {arabic: 'سَبْحًا', transliteration: 'sabḥan', translation: 'occupation', analysis: {type: 'Noun', root: 'س ب ح', rootExplanation: 'To swim, float.', grammar: 'Ends in fatha (-an) because it is the delayed subject of the emphasizing word "Inna".'}}, {arabic: 'طَوِيلًا', transliteration: 'ṭawīlā', translation: 'prolonged', analysis: {type: 'Adjective', root: 'ط و ل', rootExplanation: 'To be long.', grammar: 'Ends in fatha (-an) to match the word it describes ("sabḥan").'}}]},
            { ayahNumber: 8, arabic: 'وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا', transliteration: 'Wādhkuri isma rabbika wa tabattal ilayhi tabtīlā', translation: 'And remember the name of your Lord and devote yourself to Him with [complete] devotion.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073008.mp3', words: [{arabic: 'وَاذْكُرِ', transliteration: 'Wādhkuri', translation: 'And remember', analysis: {type: 'Command Verb', root: 'ذ ك ر', rootExplanation: 'To remember, mention.', grammar: 'A command. The "i" sound (kasra) is to smoothly connect to the next word.'}}, {arabic: 'اسْمَ', transliteration: 'isma', translation: 'name', analysis: {type: 'Noun', root: 'س م و', rootExplanation: 'To be high, a name.', grammar: 'Ends in fatha (-a) because it is the object of "remember". Remember what? The name.'}}, {arabic: 'رَبِّكَ', transliteration: 'rabbika', translation: 'your Lord', analysis: {type: 'Noun + Pronoun', root: 'ر ب ب', rootExplanation: 'Lord, master.', grammar: 'Ends in kasra (-i) to show possession: "name *of* your Lord".'}}, {arabic: 'وَتَبَتَّلْ', transliteration: 'wa tabattal', translation: 'and devote yourself', analysis: {type: 'Command Verb', root: 'ب ت ل', rootExplanation: 'To cut off, devote.', grammar: 'A command to a single person.'}}, {arabic: 'إِلَيْهِ', transliteration: 'ilayhi', translation: 'to Him', analysis: {type: 'Connecting word + Pronoun', root: 'N/A', rootExplanation: '"ilā" (to) + "hi" (Him).', grammar: 'Shows direction towards.'}}, {arabic: 'تَبْتِيلًا', transliteration: 'tabtīlā', translation: 'with devotion', analysis: {type: 'Noun for Emphasis', root: 'ب ت ل', rootExplanation: 'To cut off, devote.', grammar: 'Ends with fatha (-an) to add emphasis to the verb "devote". Like saying "devote with a *true* devotion".'}}]},
            { ayahNumber: 9, arabic: 'رَّبُّ الْمَشْرِقِ وَالْمَغْرِبِ لَا إِلَٰهَ إِلَّا هُوَ فَاتَّخِذْهُ وَكِيلًا', transliteration: 'Rabbu al-mashriqi wa al-maghribi lā ilāha illā huwa fattakhidhhu wakīlā', translation: '[He is] the Lord of the East and the West; there is no deity except Him, so take Him as Disposer of [your] affairs.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073009.mp3', words: [{arabic: 'رَّبُّ', transliteration: 'Rabbu', translation: '[He is] the Lord', analysis: {type: 'Noun', root: 'ر ب ب', rootExplanation: 'Lord, master.', grammar: 'Ends in dhumma (-u) because it is the subject of an implied sentence: "[He is] the Lord".'}}, {arabic: 'الْمَشْرِقِ', transliteration: 'al-mashriqi', translation: 'the East', analysis: {type: 'Noun', root: 'ش ر ق', rootExplanation: 'To rise (sun), east.', grammar: 'Ends in kasra (-i) to show possession: "Lord *of* the East".'}}, {arabic: 'الْمَغْرِبِ', transliteration: 'al-maghribi', translation: 'the West', analysis: {type: 'Noun', root: 'غ ر ب', rootExplanation: 'To set (sun), west.', grammar: 'Ends in kasra (-i) because it\'s connected by "and" to another word with kasra.'}}, {arabic: 'لَا إِلَٰهَ إِلَّا هُوَ', transliteration: 'lā ilāha illā huwa', translation: 'no deity except Him', analysis: {type: 'Declaration of Faith', root: 'أ ل ه', rootExplanation: 'To worship, a deity.', grammar: 'The core statement of monotheism in Islam.'}}, {arabic: 'فَاتَّخِذْهُ', transliteration: 'fattakhidhhu', translation: 'so take Him', analysis: {type: 'Command Verb + Pronoun', root: 'أ خ ذ', rootExplanation: 'To take.', grammar: 'A command verb with "hu" (Him) attached as the object.'}}, {arabic: 'وَكِيلًا', transliteration: 'wakīlā', translation: 'as Disposer of affairs', analysis: {type: 'Noun', root: 'و ك ل', rootExplanation: 'To entrust, guardian.', grammar: 'Ends in fatha (-an) as a second object, explaining *what* to take Him as.'}}]},
            {
                ayahNumber: 10,
                arabic: "وَاصْبِرْ عَلَىٰ مَا يَقُولُونَ وَاهْجُرْهُمْ هَجْرًا جَمِيلًا",
                transliteration: "Wāṣbir 'alā mā yaqūlūna wāhjurhum hajran jamīlā",
                translation: "And be patient over what they say and avoid them with a beautiful avoidance.",
                recitationUrl: "https://everyayah.com/data/Nasser_Alqatami_128kbps/073010.mp3",
                words: [
                    { arabic: 'وَاصْبِرْ', transliteration: 'waṣbir', translation: 'And be patient', analysis: { type: 'Connector + Command Verb', root: 'ص ب ر', rootExplanation: 'To be patient, to endure, to restrain oneself.', grammar: 'A command given to a single person (you).' } },
                    { arabic: 'عَلَىٰ', transliteration: 'ʿalā', translation: 'over/upon', analysis: { type: 'Connecting Word', root: 'N/A', rootExplanation: 'Indicates the subject of patience, like "on" or "over".', grammar: 'This word causes the next noun or phrase to have a kasra sound.' } },
                    { arabic: 'مَا', transliteration: 'mā', translation: 'what', analysis: { type: 'Connector Word', root: 'N/A', rootExplanation: 'A general word for "that which" or "what".', grammar: 'Connects the command to the thing being said.' } },
                    { arabic: 'يَقُولُونَ', transliteration: 'yaqūlūna', translation: 'they say', analysis: { type: 'Verb (present tense)', root: 'ق و ل', rootExplanation: 'To say, speak, utter words.', grammar: 'Refers to an action being done by a group of people ("they"). The "ūna" ending is a sign of a plural male subject.' } },
                    { arabic: 'وَاهْجُرْهُمْ', transliteration: 'wāhjurhum', translation: 'and avoid them', analysis: { type: 'Connector + Command + Pronoun', root: 'ه ج ر', rootExplanation: 'To abandon, desert, avoid, forsake.', grammar: 'A command "avoid" with the object "them" (hum) attached to it.' } },
                    { arabic: 'هَجْرًا', transliteration: 'hajran', translation: 'an avoidance', analysis: { type: 'Noun for Emphasis', root: 'ه ج ر', rootExplanation: 'To abandon, desert, avoid.', grammar: 'Ends with fatha (-an) to emphasize the verb "avoid". It\'s like saying "avoid with a *true* avoidance".' } },
                    { arabic: 'جَمِيلًا', transliteration: 'jamīlā', translation: 'beautiful', analysis: { type: 'Adjective', root: 'ج م ل', rootExplanation: 'To be beautiful, graceful, comely.', grammar: 'Ends with fatha (-an) to match the word it describes, "hajran" (avoidance).' } }
                ]
            },
            { ayahNumber: 11, arabic: 'وَذَرْنِي وَالْمُكَذِّبِينَ أُولِي النَّعْمَةِ وَمَهِّلْهُمْ قَلِيلًا', transliteration: 'Wa dharnī wal-mukadhdhibīna ulī an-naʿmati wa mahhilhum qalīlā', translation: 'And leave Me with the deniers, those of ease and comfort, and allow them a brief respite.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073011.mp3', words: [{arabic: 'وَذَرْنِي', transliteration: 'wa dharnī', translation: 'And leave Me', analysis: {type: 'Command Verb + Pronoun', root: 'و ذ ر', rootExplanation: 'To leave, let be.', grammar: 'A command "leave" with the object "Me" (nī) attached.'}}, {arabic: 'وَالْمُكَذِّبِينَ', transliteration: 'wal-mukadhdhibīna', translation: 'and the deniers', analysis: {type: 'Noun (Doers)', root: 'ك ذ ب', rootExplanation: 'To lie, deny.', grammar: 'Ends with the "-īna" sound, which often indicates an object of an action.'}}, {arabic: 'أُولِي', transliteration: 'ulī', translation: 'possessors of', analysis: {type: 'Noun', root: 'أ و ل', rootExplanation: 'Possessors of, those with.', grammar: 'A special word that means "those who have".'}}, {arabic: 'النَّعْمَةِ', transliteration: 'an-naʿmati', translation: 'the ease', analysis: {type: 'Noun', root: 'ن ع م', rootExplanation: 'Ease, comfort, blessing.', grammar: 'Ends with kasra (-i) to show possession: "possessors *of* ease".'}}, {arabic: 'وَمَهِّلْهُمْ', transliteration: 'wa mahhilhum', translation: 'and allow them respite', analysis: {type: 'Command Verb + Pronoun', root: 'م ه ل', rootExplanation: 'To give respite, delay.', grammar: 'A command "allow respite" with "them" (hum) attached.'}}]},
            { ayahNumber: 12, arabic: 'إِنَّ لَدَيْنَا أَنكَالًا وَجَحِيمًا', transliteration: 'Inna ladaynā ankālan wa jaḥīmā', translation: 'Indeed, with Us are shackles and a Hellfire,', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073012.mp3', words: [{arabic: 'لَدَيْنَا', transliteration: 'ladaynā', translation: 'with Us', analysis: {type: 'Location Word + Pronoun', root: 'ل د ن', rootExplanation: 'With, in the possession of.', grammar: 'Indicates possession or location.'}}, {arabic: 'أَنكَالًا', transliteration: 'ankālan', translation: 'shackles', analysis: {type: 'Noun', root: 'ن ك ل', rootExplanation: 'To shackle, restrain.', grammar: 'Ends in fatha (-an) because it is the delayed subject of the emphasizing word "Inna".'}}, {arabic: 'وَجَحِيمًا', transliteration: 'wa jaḥīmā', translation: 'and a Hellfire', analysis: {type: 'Noun', root: 'ج ح م', rootExplanation: 'Fierce fire, Hell.', grammar: 'Ends in fatha (-an) because it is connected by "and" to "ankālan".'}}]},
            { ayahNumber: 13, arabic: 'وَطَعَامًا ذَا غُصَّةٍ وَعَذَابًا أَلِيمًا', transliteration: 'Wa ṭaʿāman dhā ghuṣṣatin wa ʿadhāban alīmā', translation: 'And a food that chokes and a painful punishment.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073013.mp3', words: [{arabic: 'وَطَعَامًا', transliteration: 'wa ṭaʿāman', translation: 'And a food', analysis: {type: 'Noun', root: 'ط ع م', rootExplanation: 'To eat, food.', grammar: 'Ends in fatha (-an), connected to the list from the previous verse.'}}, {arabic: 'ذَا', transliteration: 'dhā', translation: 'possessing', analysis: {type: 'Descriptive Noun', root: 'ذ و', rootExplanation: 'Possessor of.', grammar: 'Describes the food, takes a fatha to match.'}}, {arabic: 'غُصَّةٍ', transliteration: 'ghuṣṣatin', translation: 'choking', analysis: {type: 'Noun', root: 'غ ص ص', rootExplanation: 'To choke.', grammar: 'Ends in kasra (-in) to show possession: "possessing *of* choking".'}}, {arabic: 'وَعَذَابًا', transliteration: 'wa ʿadhāban', translation: 'and a punishment', analysis: {type: 'Noun', root: 'ع ذ ب', rootExplanation: 'Punishment, torment.', grammar: 'Ends in fatha (-an), continuing the list.'}}, {arabic: 'أَلِيمًا', transliteration: 'alīmā', translation: 'painful', analysis: {type: 'Adjective', root: 'أ ل م', rootExplanation: 'To be painful.', grammar: 'Ends in fatha (-an) to match the word it describes ("ʿadhāban").'}}]},
            { ayahNumber: 14, arabic: 'يَوْمَ تَرْجُفُ الْأَرْضُ وَالْجِبَالُ وَكَانَتِ الْجِبَالُ كَثِيبًا مَّهِيلًا', transliteration: 'Yawma tarjufu al-arḍu wal-jibālu wa kānat al-jibālu kathīban mahīlā', translation: 'On the Day the earth and the mountains will convulse, and the mountains will become a heap of sand pouring down.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073014.mp3', words: [{arabic: 'يَوْمَ', transliteration: 'Yawma', translation: 'On the Day', analysis: {type: 'Noun (Time)', root: 'ي و م', rootExplanation: 'Day.', grammar: 'Ends in fatha (-a) because it specifies *when* the punishment will occur.'}}, {arabic: 'تَرْجُفُ', transliteration: 'tarjufu', translation: 'will convulse', analysis: {type: 'Verb (present tense)', root: 'ر ج ف', rootExplanation: 'To shake, tremble.', grammar: 'Describes a future action.'}}, {arabic: 'الْأَرْضُ', transliteration: 'al-arḍu', translation: 'the earth', analysis: {type: 'Noun', root: 'أ ر ض', rootExplanation: 'Earth, land.', grammar: 'Ends in dhumma (-u) because it is the doer of the verb "convulse".'}}, {arabic: 'كَثِيبًا', transliteration: 'kathīban', translation: 'a heap of sand', analysis: {type: 'Noun', root: 'ك ث b', rootExplanation: 'Heap of sand, dune.', grammar: 'Ends in fatha (-an) because it describes what the mountains "will become".'}}, {arabic: 'مَّهِيلًا', transliteration: 'mahīlā', translation: 'pouring down', analysis: {type: 'Adjective', root: 'ه ي ل', rootExplanation: 'To pour sand.', grammar: 'Ends in fatha (-an) to match the word it describes ("kathīban").'}}]},
            { ayahNumber: 15, arabic: 'إِنَّا أَرْسَلْنَا إِلَيْكُمْ رَسُولًا شَاهِدًا عَلَيْكُمْ كَمَا أَرْسَلْنَا إِلَىٰ فِرْعَوْنَ رَسُولًا', transliteration: 'Innā arsalnā ilaykum rasūlan shāhidan ʿalaykum kamā arsalnā ilā firʿawna rasūlā', translation: 'Indeed, We have sent to you a Messenger as a witness upon you just as We sent to Pharaoh a messenger.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073015.mp3', words: [{arabic: 'أَرْسَلْنَا', transliteration: 'arsalnā', translation: 'We have sent', analysis: {type: 'Verb (past tense)', root: 'ر س ل', rootExplanation: 'To send.', grammar: 'The "-nā" ending means "We" did the action.'}}, {arabic: 'رَسُولًا', transliteration: 'rasūlan', translation: 'a Messenger', analysis: {type: 'Noun', root: 'ر س ل', rootExplanation: 'Messenger.', grammar: 'Ends in fatha (-an) because it is the object of "sent". Sent what? A messenger.'}}, {arabic: 'شَاهِدًا', transliteration: 'shāhidan', translation: 'a witness', analysis: {type: 'Descriptive Noun (Doer)', root: 'ش ه د', rootExplanation: 'To witness, testify.', grammar: 'Ends in fatha (-an) describing the state of the messenger.'}}, {arabic: 'كَمَا', transliteration: 'kamā', translation: 'just as', analysis: {type: 'Comparison Word', root: 'N/A', rootExplanation: 'Used for making a comparison, like "like" or "just as".', grammar: 'Connects two similar events.'}}]},
            { ayahNumber: 16, arabic: 'فَعَصَىٰ فِرْعَوْنُ الرَّسُولَ فَأَخَذْنَاهُ أَخْذًا وَبِيلًا', transliteration: 'Fa-ʿaṣā firʿawnu ar-rasūla fa-akhadhnāhu akhdhan wabīlā', translation: 'But Pharaoh disobeyed the messenger, so We seized him with a ruinous seizure.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073016.mp3', words: [{arabic: 'فَعَصَىٰ', transliteration: 'Fa-ʿaṣā', translation: 'But disobeyed', analysis: {type: 'Verb (past tense)', root: 'ع ص ي', rootExplanation: 'To disobey, rebel.', grammar: 'An action that happened in the past.'}}, {arabic: 'فِرْعَوْنُ', transliteration: 'firʿawnu', translation: 'Pharaoh', analysis: {type: 'Proper Name', root: 'N/A', rootExplanation: 'The title of the ruler of ancient Egypt.', grammar: 'Ends in dhumma (-u) because he is the doer of the verb "disobeyed".'}}, {arabic: 'فَأَخَذْنَاهُ', transliteration: 'fa-akhadhnāhu', translation: 'so We seized him', analysis: {type: 'Verb (past tense) + Pronoun', root: 'أ خ ذ', rootExplanation: 'To take, seize.', grammar: 'A verb "seized" with "We" (nā) as the doer and "him" (hu) as the object.'}}, {arabic: 'أَخْذًا', transliteration: 'akhdhan', translation: 'a seizure', analysis: {type: 'Noun for Emphasis', root: 'أ خ ذ', rootExplanation: 'To take, seize.', grammar: 'Ends in fatha (-an) to emphasize the verb "seized". Like "seized with a *mighty* seizure".'}}, {arabic: 'وَبِيلًا', transliteration: 'wabīlā', translation: 'ruinous', analysis: {type: 'Adjective', root: 'و ب ل', rootExplanation: 'To be heavy, disastrous.', grammar: 'Ends in fatha (-an) to match the word it describes ("seizure").'}}]},
            { ayahNumber: 17, arabic: 'فَكَيْفَ تَتَّقُونَ إِن كَفَرْتُمْ يَوْمًا يَجْعَلُ الْوِلْدَانَ شِيبًا', transliteration: 'Fa-kayfa tattaqūna in kafartum yawman yajʿalu al-wildāna shībā', translation: 'Then how can you fear, if you disbelieve, a Day that will make the children white-haired?', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073017.mp3', words: [{arabic: 'فَكَيْفَ', transliteration: 'Fa-kayfa', translation: 'Then how', analysis: {type: 'Connector + Question Word', root: 'ك ي ف', rootExplanation: 'How.', grammar: 'Used to ask a question about the manner of something.'}}, {arabic: 'تَتَّقُونَ', transliteration: 'tattaqūna', translation: 'can you fear', analysis: {type: 'Verb (present tense)', root: 'و ق ي', rootExplanation: 'To protect, fear (God).', grammar: 'The "-ūna" ending refers to "you" (plural).'}}, {arabic: 'يَجْعَلُ', transliteration: 'yajʿalu', translation: '(that) will make', analysis: {type: 'Verb (present tense)', root: 'ج ع ل', rootExplanation: 'To make, cause to become.', grammar: 'Describes what the Day will do.'}}, {arabic: 'الْوِلْدَانَ', transliteration: 'al-wildāna', translation: 'the children', analysis: {type: 'Noun', root: 'و ل د', rootExplanation: 'To beget, child.', grammar: 'Ends in fatha (-a) because they are the object of the verb "make".'}}, {arabic: 'شِيبًا', transliteration: 'shībā', translation: 'white-haired', analysis: {type: 'Adjective', root: 'ش ي ب', rootExplanation: 'To be white-haired.', grammar: 'Ends in fatha (-an) because it is the state the children are "made" into.'}}]},
            { ayahNumber: 18, arabic: 'السَّمَاءُ مُنفَطِرٌ بِهِ ۚ كَانَ وَعْدُهُ مَفْعُولًا', transliteration: 'As-samāʾu munfaṭirun bihī kāna waʿduhu mafʿūlā', translation: 'The heaven will break apart therefrom; ever is His promise fulfilled.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073018.mp3', words: [{arabic: 'السَّمَاءُ', transliteration: 'As-samāʾu', translation: 'The heaven', analysis: {type: 'Noun', root: 'س م و', rootExplanation: 'To be high, sky.', grammar: 'Ends in dhumma (-u) because it is the subject of the sentence.'}}, {arabic: 'مُنفَطِرٌ', transliteration: 'munfaṭirun', translation: 'will break apart', analysis: {type: 'Descriptive Noun (State)', root: 'ف ط ر', rootExplanation: 'To split, cleave.', grammar: 'Ends in dhumma (-un) to match and describe the subject ("the heaven").'}}, {arabic: 'وَعْدُهُ', transliteration: 'waʿduhu', translation: 'His promise', analysis: {type: 'Noun + Pronoun', root: 'و ع د', rootExplanation: 'To promise.', grammar: 'Ends in dhumma (-u) because it is the subject of the verb "was" (kāna).'}}, {arabic: 'مَفْعُولًا', transliteration: 'mafʿūlā', translation: 'fulfilled', analysis: {type: 'Descriptive Noun (State)', root: 'ف ع ل', rootExplanation: 'To do, act.', grammar: 'Ends in fatha (-an) because it is the description of what the promise "was".'}}]},
            { ayahNumber: 19, arabic: 'إِنَّ هَٰذِهِ تَذْكِرَةٌ ۖ فَمَن شَاءَ اتَّخَذَ إِلَىٰ رَبِّهِ سَبِيلًا', transliteration: 'Inna hādhihī tadhkiratun faman shāʾa ittakhadha ilā rabbihī sabīlā', translation: 'Indeed, this is a reminder, so whoever wills may take to his Lord a way.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073019.mp3', words: [{arabic: 'تَذْكِرَةٌ', transliteration: 'tadhkiratun', translation: 'a reminder', analysis: {type: 'Noun', root: 'ذ ك ر', rootExplanation: 'To remember, mention.', grammar: 'Ends in dhumma (-un) because it is the description of the subject in the "Inna" sentence.'}}, {arabic: 'فَمَن', transliteration: 'faman', translation: 'so whoever', analysis: {type: 'Connector + Conditional Word', root: 'N/A', rootExplanation: '"Fa" (so) + "man" (whoever). Sets up a condition.', grammar: 'Introduces a cause-and-effect statement.'}}, {arabic: 'شَاءَ', transliteration: 'shāʾa', translation: 'wills', analysis: {type: 'Verb (past tense)', root: 'ش ي أ', rootExplanation: 'To will, want.', grammar: 'The first part of the condition ("if he wills...").'}}, {arabic: 'اتَّخَذَ', transliteration: 'ittakhadha', translation: 'may take', analysis: {type: 'Verb (past tense)', root: 'أ خ ذ', rootExplanation: 'To take.', grammar: 'The result of the condition ("...then he takes").'}}, {arabic: 'سَبِيلًا', transliteration: 'sabīlā', translation: 'a way', analysis: {type: 'Noun', root: 'س ب ل', rootExplanation: 'Way, path.', grammar: 'Ends in fatha (-an) because it is the object of the verb "take". Take what? A way.'}}]},
            { ayahNumber: 20, arabic: 'إِنَّ رَبَّكَ يَعْلَمُ أَنَّكَ تَقُومُ أَدْنَىٰ مِن ثُلُثَيِ اللَّيْلِ وَنِصْفَهُ وَثُلُثَهُ وَطَائِفَةٌ مِّنَ الَّذِينَ مَعَكَ ۚ وَاللَّهُ يُقَدِّرُ اللَّيْلَ وَالنَّهَارَ ۚ عَلِمَ أَن لَّن تُحْصُوهُ فَتَابَ عَلَيْكُمْ ۖ فَاقْرَءُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ ۚ عَلِمَ أَن سَيَكُونُ مِنكُم مَّرْضَىٰ ۙ وَآخَرُونَ يُقَاتِلُونَ فِي سَبِيلِ اللَّهِ ۙ وَآخَرُونَ يَضْرِبُونَ فِي الْأَرْضِ يَبْتَغُونَ مِن فَضْلِ اللَّهِ ۖ وَآخَرُونَ يُقَاتِلُونَ فِي سَبِيلِ اللَّهِ ۖ فَاقْرَءُوا مَا تَيَسَّرَ مِنْهُ ۚ وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَأَقْرِضُوا اللَّهَ قَرْضًا حَسَنًا ۚ وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ هُوَ خَيْرًا وَأَعْظَمَ أَجْرًا ۚ وَاسْتَغْفِرُوا اللَّهَ ۖ إِنَّ اللَّهَ غَفُورٌ رَّحِيمٌ', transliteration: 'Inna rabbaka yaʿlamu annaka taqūmu adnā min thuluthayi al-layli wa-niṣfahū wa-thuluthahū wa-ṭāʾifatun mina alladhīna maʿaka...', translation: 'Indeed, your Lord knows that you stand [in prayer] almost two-thirds of the night or half of it or a third of it, and so do a group of those with you. And Allah determines [the extent of] the night and the day. He has known that you will not be able to do it and has turned to you in forgiveness, so recite what is easy [for you] of the Qur\'an...', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/073020.mp3', words: [{arabic: 'يَعْلَمُ', transliteration: 'yaʿlamu', translation: 'knows', analysis: {type: 'Verb (present tense)', root: 'ع ل م', rootExplanation: 'To know.', grammar: 'An ongoing action. Ends with dhumma (-u) as the default state for such verbs.'}}, {arabic: 'تَقُومُ', transliteration: 'taqūmu', translation: 'you stand', analysis: {type: 'Verb (present tense)', root: 'ق و م', rootExplanation: 'To stand, rise.', grammar: 'Describes an action you (singular) do.'}}, {arabic: 'يُقَدِّرُ', transliteration: 'yuqaddiru', translation: 'determines', analysis: {type: 'Verb (present tense)', root: 'ق د ر', rootExplanation: 'To measure, determine.', grammar: 'An ongoing action done by Him.'}}, {arabic: 'فَتَابَ', transliteration: 'fatāba', translation: 'so He has turned', analysis: {type: 'Verb (past tense)', root: 'ت و ب', rootExplanation: 'To repent, turn back.', grammar: 'An action that is completed.'}}, {arabic: 'فَاقْرَءُوا', transliteration: 'faqraʾū', translation: 'so recite', analysis: {type: 'Command Verb', root: 'ق ر أ', rootExplanation: 'To read, recite.', grammar: 'A command given to a group of people ("you all").'}}]}
        ]
    },
    112: {
        surahNumber: 112,
        surahName: "Al-Ikhlas",
        ayat: [
            { ayahNumber: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteration: 'Qul huwa Allāhu aḥad', translation: 'Say, "He is Allah, [who is] One,', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/112001.mp3', words: [
                {arabic: 'قُلْ', transliteration: 'Qul', translation: 'Say', analysis: {type: 'Verb (Command)', root: 'ق و ل', rootExplanation: 'To say, speak, utter words.', grammar: "Fi'l Amr (command verb). It is mabni 'ala as-sukoon (built on a silent ending) because it's a sound verb addressed to a single person."}}, 
                {arabic: 'هُوَ', transliteration: 'huwa', translation: 'He', analysis: {type: 'Pronoun', root: 'N/A', rootExplanation: 'He/It.', grammar: 'Dameer Munfasil (Detached Pronoun). It serves as the mubtada’ (subject) of the sentence.'}}, 
                {arabic: 'اللَّهُ', transliteration: 'Allāhu', translation: 'Allah', analysis: {type: 'ism-noun (Proper Name)', root: 'أ ل ه', rootExplanation: 'To worship, a deity, The One True God.', grammar: "Lafẓ al-Jalālah (The Majestic Word). It is the khabar (predicate/news) for the subject 'huwa'. Marfū' (nominative) with a dammah."}}, 
                {arabic: 'أَحَدٌ', transliteration: 'aḥad', translation: 'One', analysis: {type: 'ism-noun', root: 'أ ح د', rootExplanation: 'One, single, unique, The One.', grammar: "A second predicate (khabar) or a substitute (badal) for 'Allah'. Marfū' (nominative) with tanween dammah, signifying grandeur. Emphasizes absolute, indivisible oneness."}}
            ]},
            { ayahNumber: 2, arabic: 'اللَّهُ الصَّمَدُ', transliteration: 'Allāhu aṣ-ṣamad', translation: 'Allah, the Eternal Refuge.', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/112002.mp3', words: [
                {arabic: 'اللَّهُ', transliteration: 'Allāhu', translation: 'Allah', analysis: {type: 'ism-noun (Proper Name)', root: 'أ ل ه', rootExplanation: 'To worship, a deity, The One True God.', grammar: "Mubtada' (subject) of the sentence. Marfū' (nominative) with a dammah."}}, 
                {arabic: 'الصَّمَدُ', transliteration: 'aṣ-ṣamad', translation: 'the Eternal Refuge', analysis: {type: 'ism-noun', root: 'ص م د', rootExplanation: 'The one who is needed by all but needs no one; The Self-Sufficient Master.', grammar: "al means 'the', definite. It is the khabar (predicate) for the subject 'Allah'. Marfū' (nominative) with a dammah to match."}}
            ]},
            { ayahNumber: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteration: 'Lam yalid wa lam yūlad', translation: 'He neither begets nor is born,', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/112003.mp3', words: [
                {arabic: 'لَمْ يَلِدْ', transliteration: 'Lam yalid', translation: 'He did not beget', analysis: {type: 'Negation + Verb', root: 'و ل د', rootExplanation: 'To beget, give birth, procreate.', grammar: "'lam' is a particle of negation that puts the present tense verb 'yalid' into the jussive case (majzūm), indicated by the sukoon. The meaning becomes past tense: 'He did not beget'."}}, 
                {arabic: 'وَلَمْ يُولَدْ', transliteration: 'wa lam yūlad', translation: 'and He was not begotten', analysis: {type: 'Connector + Negation + Verb (Passive)', root: 'و ل د', rootExplanation: 'To beget, give birth, procreate.', grammar: "'wa' means 'and'. 'yūlad' is the passive form (mabni lil-majhūl), meaning the action of birth was not done to Him. It is also majzūm due to 'lam'."}}
            ]},
            { ayahNumber: 4, arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', transliteration: 'Wa lam yakun lahū kufuwan aḥad', translation: 'Nor is there to Him any equivalent."', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/112004.mp3', words: [
                {arabic: 'وَلَمْ يَكُن', transliteration: 'wa lam yakun', translation: 'And there was not', analysis: {type: 'Connector + Negation + Verb', root: 'ك و ن', rootExplanation: 'To be, exist.', grammar: "'wa' (and) + 'lam' (negation) + 'yakun' (verb 'to be'). 'yakun' is an incomplete verb (fi'l nāqis) and is majzūm (jussive) due to 'lam'."}}, 
                {arabic: 'لَّهُ', transliteration: 'lahū', translation: 'to Him', analysis: {type: 'Preposition + Pronoun', root: 'N/A', rootExplanation: "'Li' (for/to) + 'hu' (Him).", grammar: "This prepositional phrase (shibh jumlah) is the advanced predicate (khabar muqaddam) of 'yakun', brought forward for emphasis."}}, 
                {arabic: 'كُفُوًا', transliteration: 'kufuwan', translation: 'an equivalent', analysis: {type: 'ism-noun', root: 'ك ف أ', rootExplanation: 'Equal, match, comparable.', grammar: "This is the predicate (khabar) of 'yakun', and it is mansūb (accusative), indicated by the tanween fatha."}}, 
                {arabic: 'أَحَدٌ', transliteration: 'aḥad', translation: 'any one', analysis: {type: 'ism-noun', root: 'أ ح د', rootExplanation: 'One, anyone.', grammar: "This is the delayed subject (ism mu'akhar) of 'yakun'. It is marfū' (nominative) with tanween dammah. The word order emphasizes that not a single one is equivalent to Him."}}
            ]}
        ]
    },
    2: {
        surahNumber: 2,
        surahName: "Al-Baqarah",
        ayat: [
            { ayahNumber: 1, arabic: 'الم', transliteration: 'Alif Lam Meem', translation: 'Alif, Lam, Meem', words: [
                {arabic: 'ا', transliteration: 'Alif', translation: 'Alif', analysis: {type: 'Quranic Initial (Huruf Muqatta\'at)', root: 'N/A', rootExplanation: 'Disjointed letter - meaning known only to Allah', grammar: 'Function: Opening letter of uncertain meaning. Definiteness: N/A. Notes: One of 29 surahs that begin with mysterious letters.'}},
                {arabic: 'ل', transliteration: 'Lam', translation: 'Lam', analysis: {type: 'Quranic Initial (Huruf Muqatta\'at)', root: 'N/A', rootExplanation: 'Disjointed letter - meaning known only to Allah', grammar: 'Function: Opening letter of uncertain meaning. Definiteness: N/A. Notes: Second of three mysterious opening letters.'}},
                {arabic: 'م', transliteration: 'Meem', translation: 'Meem', analysis: {type: 'Quranic Initial (Huruf Muqatta\'at)', root: 'N/A', rootExplanation: 'Disjointed letter - meaning known only to Allah', grammar: 'Function: Opening letter of uncertain meaning. Definiteness: N/A. Notes: Third of three mysterious opening letters.'}}
            ]},
            { ayahNumber: 2, arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ', transliteration: 'Dhālika al-kitābu lā rayba fīhi hudan lil-muttaqīn', translation: 'This is the Book about which there is no doubt, a guidance for those conscious of Allah', words: [
                {arabic: 'ذَٰلِكَ', transliteration: 'dhālika', translation: 'That', analysis: {type: 'Demonstrative Pronoun', root: 'N/A', rootExplanation: 'Singular demonstrative', grammar: 'Gender: Masculine. Number: Singular. Case: Nominative (subject). Function: Subject - points to the Quran. Definiteness: Definite. Used for distant or elevated things.'}},
                {arabic: 'الْكِتَابُ', transliteration: 'al-kitābu', translation: 'the Book', analysis: {type: 'Noun', root: 'ك ت ب', rootExplanation: 'To write', grammar: 'Gender: Masculine. Number: Singular. Case: Nominative (indicated by damma/u). Function: Predicate. Definiteness: Definite (has ال). Refers to the Quran.'}},
                {arabic: 'لَا', transliteration: 'lā', translation: 'no', analysis: {type: 'Negative Particle', root: 'N/A', rootExplanation: 'Particle of absolute negation', grammar: 'Function: Negates existence of doubt. Strong negation particle.'}},
                {arabic: 'رَيْبَ', transliteration: 'rayba', translation: 'doubt', analysis: {type: 'Noun', root: 'ر ي ب', rootExplanation: 'Doubt, suspicion', grammar: 'Gender: Masculine. Number: Singular. Case: Accusative (fatha). Function: Negated entity. Definiteness: Indefinite.'}},
                {arabic: 'فِيهِ', transliteration: 'fīhi', translation: 'in it', analysis: {type: 'Preposition + Pronoun', root: 'N/A', rootExplanation: 'فِي (in) + ـهِ (it/him)', grammar: 'Gender: Masculine (refers to Book). Number: Singular. Case: Genitive. Function: Locative. Definiteness: Definite (pronoun).'}},
                {arabic: 'هُدًى', transliteration: 'hudan', translation: 'guidance', analysis: {type: 'Noun', root: 'ه د ي', rootExplanation: 'To guide', grammar: 'Gender: Masculine. Number: Singular. Case: Nominative. Function: Predicate. Definiteness: Indefinite. Tanween indicates quality.'}},
                {arabic: 'لِلْمُتَّقِينَ', transliteration: 'lil-muttaqīn', translation: 'for the righteous', analysis: {type: 'Preposition + Noun', root: 'و ق ي', rootExplanation: 'To protect, guard (Form VIII: to be conscious of Allah)', grammar: 'Gender: Masculine. Number: Plural. Case: Genitive (yā ending). Function: Benefactive. Definiteness: Definite. لِ = for. Muttaqīn = God-conscious ones.'}}
            ]},
            { ayahNumber: 3, arabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ', transliteration: 'Alladhīna yu\'minūna bil-ghaybi wa-yuqīmūna aṣ-ṣalāta wa-mimmā razaqnāhum yunfiqūn', translation: 'Who believe in the unseen, establish prayer, and spend out of what We have provided for them', words: [
                {arabic: 'الَّذِينَ', transliteration: 'alladhīna', translation: 'those who', analysis: {type: 'Relative Pronoun', root: 'N/A', rootExplanation: 'Masculine plural relative pronoun', grammar: 'Gender: Masculine. Number: Plural. Function: Defines al-muttaqīn from previous verse. Definiteness: Definite. Indeclinable.'}},
                {arabic: 'يُؤْمِنُونَ', transliteration: 'yu\'minūna', translation: 'they believe', analysis: {type: 'Verb (Imperfect/Present)', root: 'ء م ن', rootExplanation: 'To be safe, to believe (Form IV)', grammar: 'Form IV. Gender: Masculine. Number: Plural. Person: Third. Tense: Present. Function: Main verb. Continuous belief.'}},
                {arabic: 'بِالْغَيْبِ', transliteration: 'bil-ghayb', translation: 'in the unseen', analysis: {type: 'Preposition + Noun', root: 'غ ي ب', rootExplanation: 'The unseen, hidden', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive (kasra). Function: Object of belief. Definiteness: Definite. بِ = in/with.'}},
                {arabic: 'وَيُقِيمُونَ', transliteration: 'wa-yuqīmūna', translation: 'and they establish', analysis: {type: 'Conjunction + Verb', root: 'ق و م', rootExplanation: 'To stand, establish (Form IV)', grammar: 'Form IV. وَ = and. Gender: Masculine. Number: Plural. Person: Third. Tense: Present. Function: Coordinated verb. Establish properly.'}},
                {arabic: 'الصَّلَاةَ', transliteration: 'aṣ-ṣalāh', translation: 'the prayer', analysis: {type: 'Noun', root: 'ص ل و', rootExplanation: 'To pray, bless', grammar: 'Gender: Feminine. Number: Singular. Case: Accusative (fatha). Function: Direct object. Definiteness: Definite. The five daily prayers.'}},
                {arabic: 'وَمِمَّا', transliteration: 'wa-mimmā', translation: 'and from what', analysis: {type: 'Conjunction + Preposition + Relative Pronoun', root: 'N/A', rootExplanation: 'وَ (and) + مِنْ (from) + مَا (what)', grammar: 'Function: Introduces source of spending. مِنْ indicates partitive - spending from what they have.'}},
                {arabic: 'رَزَقْنَاهُمْ', transliteration: 'razaqnāhum', translation: 'We provided them', analysis: {type: 'Verb (Perfect/Past)', root: 'ر ز ق', rootExplanation: 'To provide, sustain', grammar: 'Person: First plural (We - Allah). Tense: Perfect/Past. نَا = We. هُمْ = them. Function: Relative clause verb. Allah provides sustenance.'}},
                {arabic: 'يُنْفِقُونَ', transliteration: 'yunfiqūn', translation: 'they spend', analysis: {type: 'Verb (Imperfect/Present)', root: 'ن ف ق', rootExplanation: 'To spend, expend (Form IV)', grammar: 'Form IV. Gender: Masculine. Number: Plural. Person: Third. Tense: Present. Function: Main verb. Voluntary charitable spending.'}}
            ]},
            { ayahNumber: 4, arabic: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ', transliteration: 'Walladhīna yu\'minūna bimā unzila ilayka wa-mā unzila min qablika wa-bil-ākhirati hum yūqinūn', translation: 'And who believe in what has been revealed to you, and what was revealed before you, and of the Hereafter they are certain', words: [
                {arabic: 'وَالَّذِينَ', transliteration: 'walladhīna', translation: 'and those who', analysis: {type: 'Conjunction + Relative Pronoun', root: 'N/A', rootExplanation: 'وَ (and) + relative pronoun', grammar: 'Gender: Masculine. Number: Plural. Function: Continues description of believers. Definiteness: Definite.'}},
                {arabic: 'يُؤْمِنُونَ', transliteration: 'yu\'minūna', translation: 'believe', analysis: {type: 'Verb (Imperfect/Present)', root: 'ء م ن', rootExplanation: 'To believe (Form IV)', grammar: 'Form IV. Gender: Masculine. Number: Plural. Person: Third. Tense: Present. Function: Main verb.'}},
                {arabic: 'بِمَا', transliteration: 'bimā', translation: 'in what', analysis: {type: 'Preposition + Relative Pronoun', root: 'N/A', rootExplanation: 'بِ (in) + مَا (what)', grammar: 'Function: Introduces object of belief. بِمَا = in what/that which.'}},
                {arabic: 'أُنْزِلَ', transliteration: 'unzila', translation: 'was revealed', analysis: {type: 'Verb (Perfect/Past Passive)', root: 'ن ز ل', rootExplanation: 'To descend (Form IV passive)', grammar: 'Form IV Passive. Gender: Masculine. Number: Singular. Person: Third. Tense: Perfect/Past. Function: Passive verb - revelation sent down.'}},
                {arabic: 'إِلَيْكَ', transliteration: 'ilayka', translation: 'to you', analysis: {type: 'Preposition + Pronoun', root: 'N/A', rootExplanation: 'إِلَى (to) + كَ (you)', grammar: 'Gender: Masculine. Number: Singular. Person: Second. Function: Recipient of revelation. Definiteness: Definite. Refers to Prophet Muhammad.'}},
                {arabic: 'وَمَا', transliteration: 'wa-mā', translation: 'and what', analysis: {type: 'Conjunction + Relative Pronoun', root: 'N/A', rootExplanation: 'وَ (and) + مَا (what)', grammar: 'Function: Coordinates second object of belief. Previous revelations.'}},
                {arabic: 'أُنْزِلَ', transliteration: 'unzila', translation: 'was revealed', analysis: {type: 'Verb (Perfect/Past Passive)', root: 'ن ز ل', rootExplanation: 'To descend (Form IV passive)', grammar: 'Form IV Passive. Same verb repeated. Refers to Torah, Gospel, Psalms, etc.'}},
                {arabic: 'مِنْ', transliteration: 'min', translation: 'from', analysis: {type: 'Preposition', root: 'N/A', rootExplanation: 'Preposition indicating temporal origin', grammar: 'Function: Time reference. Governs genitive. Temporal meaning: from before.'}},
                {arabic: 'قَبْلِكَ', transliteration: 'qablika', translation: 'before you', analysis: {type: 'Adverb + Pronoun', root: 'ق ب ل', rootExplanation: 'Before', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive (kasra). Function: Temporal phrase. Definiteness: Made definite by pronoun. Mudaf-Mudaf Ilayhi: قَبْلِ is mudaf, كَ is mudaf ilayhi.'}},
                {arabic: 'وَبِالْآخِرَةِ', transliteration: 'wa-bil-ākhirati', translation: 'and in the Hereafter', analysis: {type: 'Conjunction + Preposition + Noun', root: 'ء خ ر', rootExplanation: 'Last, final', grammar: 'وَ = and. بِ = in. Gender: Feminine. Number: Singular. Case: Genitive (kasra). Function: Third object of belief. Definiteness: Definite. Day of Judgment.'}},
                {arabic: 'هُمْ', transliteration: 'hum', translation: 'they', analysis: {type: 'Personal Pronoun', root: 'N/A', rootExplanation: 'Third person plural pronoun', grammar: 'Gender: Masculine. Number: Plural. Person: Third. Function: Emphatic subject pronoun. Definiteness: Definite.'}},
                {arabic: 'يُوقِنُونَ', transliteration: 'yūqinūn', translation: 'have certainty', analysis: {type: 'Verb (Imperfect/Present)', root: 'ي ق ن', rootExplanation: 'To be certain (Form IV)', grammar: 'Form IV. Gender: Masculine. Number: Plural. Person: Third. Tense: Present. Function: Main verb. Absolute certainty, higher than regular belief.'}}
            ]},
            { ayahNumber: 5, arabic: 'أُولَٰئِكَ عَلَىٰ هُدًى مِنْ رَبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ', transliteration: 'Ulāʾika ʿalā hudan min rabbihim wa-ulāʾika humu al-mufliḥūn', translation: 'Those are upon guidance from their Lord, and it is those who are the successful', words: [
                {arabic: 'أُولَٰئِكَ', transliteration: 'ulāʾika', translation: 'those', analysis: {type: 'Demonstrative Pronoun', root: 'N/A', rootExplanation: 'Plural demonstrative', grammar: 'Gender: Masculine. Number: Plural. Function: Subject - refers to believers in verses 3-4. Definiteness: Definite. Elevated status.'}},
                {arabic: 'عَلَىٰ', transliteration: 'ʿalā', translation: 'upon', analysis: {type: 'Preposition', root: 'N/A', rootExplanation: 'Preposition indicating position', grammar: 'Function: Indicates being established upon guidance. Governs genitive case. Metaphorical use.'}},
                {arabic: 'هُدًى', transliteration: 'hudan', translation: 'guidance', analysis: {type: 'Noun', root: 'ه د ي', rootExplanation: 'To guide', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive. Function: Object of preposition. Definiteness: Indefinite. Complete, perfect guidance.'}},
                {arabic: 'مِنْ', transliteration: 'min', translation: 'from', analysis: {type: 'Preposition', root: 'N/A', rootExplanation: 'Preposition indicating source', grammar: 'Function: Source of guidance. Governs genitive. From their Lord, not themselves.'}},
                {arabic: 'رَبِّهِمْ', transliteration: 'rabbihim', translation: 'their Lord', analysis: {type: 'Noun + Pronoun', root: 'ر ب ب', rootExplanation: 'Lord, Master, Sustainer', grammar: 'Gender: Masculine. Number: Singular (noun) / Plural (pronoun). Case: Genitive (kasra). Function: Source of guidance. Definiteness: Made definite by pronoun. Mudaf-Mudaf Ilayhi: رَبِّ is mudaf, هِمْ is mudaf ilayhi.'}},
                {arabic: 'وَأُولَٰئِكَ', transliteration: 'wa-ulāʾika', translation: 'and those', analysis: {type: 'Conjunction + Demonstrative Pronoun', root: 'N/A', rootExplanation: 'وَ + plural demonstrative', grammar: 'Gender: Masculine. Number: Plural. Function: Second clause subject. Definiteness: Definite. Repetition for emphasis.'}},
                {arabic: 'هُمُ', transliteration: 'humu', translation: 'they', analysis: {type: 'Personal Pronoun', root: 'N/A', rootExplanation: 'Pronoun of separation (damir al-fasl)', grammar: 'Gender: Masculine. Number: Plural. Person: Third. Function: Emphatic restriction pronoun. Definiteness: Definite. They specifically are successful.'}},
                {arabic: 'الْمُفْلِحُونَ', transliteration: 'al-mufliḥūn', translation: 'the successful', analysis: {type: 'Noun (Active Participle)', root: 'ف ل ح', rootExplanation: 'To succeed, prosper (Form IV)', grammar: 'Form IV Active Participle. Gender: Masculine. Number: Plural. Case: Nominative (ـونَ). Function: Predicate. Definiteness: Definite. Ultimate success = Paradise.'}}
            ]}
        ]
    },
    114: {
        surahNumber: 114,
        surahName: "An-Nas",
        ayat: [
            { ayahNumber: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', transliteration: 'Qul a\'ūdhu bi-rabbi an-nās', translation: 'Say: I seek refuge in the Lord of mankind', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/114001.mp3', words: [
                {arabic: 'قُلْ', transliteration: 'Qul', translation: 'Say', analysis: {type: 'Verb - Command (Fi\'l Amr)', root: 'ق-و-ل (q-w-l)', rootExplanation: 'To say, to speak', grammar: 'Gender: Masculine. Number: Singular (addressing one person). Form: Command verb built on sukoon (silent ending). Function: Order/instruction to recite.'}},
                {arabic: 'أَعُوذُ', transliteration: 'a\'ūdhu', translation: 'I seek refuge', analysis: {type: 'Verb - Present (Fi\'l Mudari\')', root: 'ع-و-ذ (\'a-w-dh)', rootExplanation: 'To seek protection, to take refuge', grammar: 'Gender: Can be M/F (first person). Number: Singular. Person: First person (I). Tense: Present/continuous. Form I verb. Ends in dammah (u).'}},
                {arabic: 'بِ', transliteration: 'bi', translation: 'in/with', analysis: {type: 'Preposition (Harf Jarr)', root: 'N/A', rootExplanation: 'Particle meaning "in" or "with"', grammar: 'Function: Causes the next word to be in genitive case (majroor with kasrah). Shows the means or location of seeking refuge.'}},
                {arabic: 'رَبِّ', transliteration: 'rabbi', translation: 'Lord', analysis: {type: 'Noun (Ism)', root: 'ر-ب-ب (r-b-b)', rootExplanation: 'Lord, Sustainer, Master', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive (majroor) due to preposition "bi" - ends in kasrah (i). Definiteness: Made definite by being mudaf (first part of construct). Mudaf-Mudaf Ilayhi: Yes - mudaf (possessed), with hidden pronoun "my" (rabbi = my Lord). Grammar rule: Mudaf cannot have tanween or alif-laam.'}},
                {arabic: 'النَّاسِ', transliteration: 'an-nās', translation: 'mankind', analysis: {type: 'Noun (Ism)', root: 'ن-و-س / أ-ن-س', rootExplanation: 'People, mankind, humans', grammar: 'Gender: Masculine. Number: Plural/collective (jama\'). Case: Genitive (majroor) - ends in kasrah (i). Reason: (1) Mudaf ilayhi (second part of construct with "rabb"), (2) Governed by construct relationship. Definiteness: Definite with alif-laam (ال). Pattern: الناس appears 5 times in this surah.'}}
            ]},
            { ayahNumber: 2, arabic: 'مَلِكِ النَّاسِ', transliteration: 'Maliki an-nās', translation: 'The King of mankind', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/114002.mp3', words: [
                {arabic: 'مَلِكِ', transliteration: 'Maliki', translation: 'King', analysis: {type: 'Noun (Ism)', root: 'م-ل-ك (m-l-k)', rootExplanation: 'To own, to rule, to possess sovereignty', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive (majroor) - ends in kasrah (i). Reason: Badal (substitute/apposition) for "rabbi" from verse 1, takes same case. Definiteness: Made definite by being mudaf. Mudaf-Mudaf Ilayhi: Yes - mudaf (first term). Function: Additional title describing Allah, building on verse 1.'}},
                {arabic: 'النَّاسِ', transliteration: 'an-nās', translation: 'mankind', analysis: {type: 'Noun (Ism)', root: 'ن-و-س / أ-ن-س', rootExplanation: 'People, mankind', grammar: 'Gender: Masculine. Number: Plural/collective. Case: Genitive (majroor) with kasrah. Reason: Mudaf ilayhi (second term of construct). Definiteness: Definite with alif-laam. Repetition: 2nd occurrence.'}}
            ]},
            { ayahNumber: 3, arabic: 'إِلَٰهِ النَّاسِ', transliteration: 'Ilāhi an-nās', translation: 'The God of mankind', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/114003.mp3', words: [
                {arabic: 'إِلَٰهِ', transliteration: 'Ilāhi', translation: 'God', analysis: {type: 'Noun (Ism)', root: 'أ-ل-ه (a-l-h)', rootExplanation: 'God, deity, One worthy of worship', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive (majroor) with kasrah. Reason: Badal (substitute) continuing from verses 1-2. Definiteness: Made definite by being mudaf. Mudaf-Mudaf Ilayhi: Yes - mudaf. Pattern: Third title in series (Rabb, Malik, Ilah).'}},
                {arabic: 'النَّاسِ', transliteration: 'an-nās', translation: 'mankind', analysis: {type: 'Noun (Ism)', root: 'ن-و-س / أ-ن-س', rootExplanation: 'People, mankind', grammar: 'Gender: Masculine. Number: Plural/collective. Case: Genitive (majroor) with kasrah. Reason: Mudaf ilayhi. Definiteness: Definite with alif-laam. Repetition: 3rd occurrence.'}}
            ]},
            { ayahNumber: 4, arabic: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', transliteration: 'Min sharri al-waswāsi al-khannās', translation: 'From the evil of the sneaking whisperer', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/114004.mp3', words: [
                {arabic: 'مِنْ', transliteration: 'Min', translation: 'from', analysis: {type: 'Preposition (Harf Jarr)', root: 'N/A', rootExplanation: 'Particle meaning "from"', grammar: 'Function: Causes next word to be genitive (majroor). Shows source or origin of what is being avoided. Connects to "a\'ūdhu" (I seek refuge) from verse 1.'}},
                {arabic: 'شَرِّ', transliteration: 'sharri', translation: 'evil', analysis: {type: 'Noun (Ism)', root: 'ش-ر-ر (sh-r-r)', rootExplanation: 'Evil, harm, wickedness', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive (majroor) with kasrah. Reason: (1) After preposition "min", (2) Mudaf (first term of construct). Definiteness: Made definite by being mudaf. Mudaf-Mudaf Ilayhi: Yes - mudaf. Pattern: Doubled root letters (sh-r-r).'}},
                {arabic: 'الْوَسْوَاسِ', transliteration: 'al-waswās', translation: 'the whisperer', analysis: {type: 'Noun (Ism) - Intensive pattern', root: 'و-س-و-س (w-s-w-s)', rootExplanation: 'To whisper, to make evil suggestions', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive (majroor) with kasrah. Reason: Mudaf ilayhi to "sharr". Definiteness: Definite with alif-laam. Pattern: فَعْلال (fa\'lāl) - intensive/exaggerative form showing repeated action. Doubled root: و-س (w-s) repeated.'}},
                {arabic: 'الْخَنَّاسِ', transliteration: 'al-khannās', translation: 'the sneaker', analysis: {type: 'Noun (Ism) - Intensive pattern', root: 'خ-ن-س (kh-n-s)', rootExplanation: 'To retreat, to withdraw, to sneak away', grammar: 'Gender: Masculine. Number: Singular. Case: Genitive (majroor) with kasrah. Reason: Sifah (adjective) describing "al-waswās", matching its case. Definiteness: Definite with alif-laam (matches described word). Pattern: فَعَّال (fa\'\'āl) - intensive form. Doubled middle letter (nn) shows emphasis.'}}
            ]},
            { ayahNumber: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', transliteration: 'Alladhī yuwaswisu fī ṣudūri an-nās', translation: 'Who whispers in the hearts of mankind', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/114005.mp3', words: [
                {arabic: 'الَّذِي', transliteration: 'Alladhī', translation: 'who/that which', analysis: {type: 'Relative Pronoun (Ism Mawsool)', root: 'N/A', rootExplanation: 'Relative pronoun meaning "who" or "that which"', grammar: 'Gender: Masculine. Number: Singular. Function: Starts relative clause describing "al-waswās al-khannās". Case: Follows the case of its antecedent (genitive). Always definite (built-in alif-laam in الذي).'}},
                {arabic: 'يُوَسْوِسُ', transliteration: 'yuwaswisu', translation: 'he whispers', analysis: {type: 'Verb - Present (Fi\'l Mudari\')', root: 'و-س-و-س (w-s-w-s)', rootExplanation: 'To whisper', grammar: 'Gender: Masculine. Number: Singular. Person: Third person (he). Tense: Present/habitual. Form: Form II (yu-fa\'\'ilu pattern) showing intensity and repetition. Doer (fa\'il): Hidden pronoun "he" referring to al-waswās. Ends in dammah (u).'}},
                {arabic: 'فِي', transliteration: 'fī', translation: 'in', analysis: {type: 'Preposition (Harf Jarr)', root: 'N/A', rootExplanation: 'Particle meaning "in" or "inside"', grammar: 'Function: Makes next word genitive (majroor). Shows location/place where whispering occurs.'}},
                {arabic: 'صُدُورِ', transliteration: 'ṣudūri', translation: 'chests/hearts', analysis: {type: 'Noun (Ism)', root: 'ص-د-ر (ṣ-d-r)', rootExplanation: 'Chest, breast (seat of thoughts and feelings)', grammar: 'Gender: Masculine. Number: Plural (jama\' takseer - broken plural). Pattern: فُعُول (fu\'ūl). Case: Genitive (majroor) with kasrah. Reason: (1) After preposition "fī", (2) Mudaf. Definiteness: Made definite by being mudaf. Mudaf-Mudaf Ilayhi: Yes - mudaf.'}},
                {arabic: 'النَّاسِ', transliteration: 'an-nās', translation: 'mankind', analysis: {type: 'Noun (Ism)', root: 'ن-و-س / أ-ن-س', rootExplanation: 'People, mankind', grammar: 'Gender: Masculine. Number: Plural/collective. Case: Genitive (majroor) with kasrah. Reason: Mudaf ilayhi to "ṣudūr". Definiteness: Definite with alif-laam. Repetition: 4th occurrence.'}}
            ]},
            { ayahNumber: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', transliteration: 'Mina al-jinnati wa an-nās', translation: 'From among the jinn and mankind', recitationUrl: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/114006.mp3', words: [
                {arabic: 'مِنَ', transliteration: 'Mina', translation: 'from among', analysis: {type: 'Preposition (Harf Jarr)', root: 'N/A', rootExplanation: 'Particle meaning "from among"', grammar: 'Function: Makes next word genitive. Extra "a" added for smooth connection with following alif-laam (min + al = mina). Bayān (clarifying) - explains that the whisperer can be from jinn OR humans.'}},
                {arabic: 'الْجِنَّةِ', transliteration: 'al-jinnati', translation: 'the jinn', analysis: {type: 'Noun (Ism)', root: 'ج-ن-ن (j-n-n)', rootExplanation: 'Jinn (hidden beings created from fire)', grammar: 'Gender: Treated as feminine (collective noun with ة ending). Number: Collective/plural. Case: Genitive (majroor) with kasrah. Reason: After preposition "mina". Definiteness: Definite with alif-laam. Pattern: فِعْلَة (fi\'lah) collective form.'}},
                {arabic: 'وَ', transliteration: 'wa', translation: 'and', analysis: {type: 'Conjunction (Harf \'Atf)', root: 'N/A', rootExplanation: 'Coordinating conjunction "and"', grammar: 'Function: Connects two similar items (jinn and humans). The word after "wa" takes same case as word before it (both genitive).'}},
                {arabic: 'النَّاسِ', transliteration: 'an-nās', translation: 'mankind', analysis: {type: 'Noun (Ism)', root: 'ن-و-س / أ-ن-س', rootExplanation: 'People, mankind', grammar: 'Gender: Masculine. Number: Plural/collective. Case: Genitive (majroor) with kasrah. Reason: Ma\'toof (coordinated) with "al-jinnah", governed by "mina". Definiteness: Definite with alif-laam. Repetition: 5th and final occurrence. Pattern note: Surah begins with "rabbi an-nās" and ends with "wa an-nās" - beautiful structure.'}}
            ]}
        ]
    }
};

function SurahSelector({ isOpen, onClose, onSelect, currentSurahNumber }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSurahs = useMemo(() => {
        if (!searchTerm) return surahList;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return surahList.filter(surah =>
            surah.name.toLowerCase().includes(lowerCaseSearch) ||
            surah.id.toString().includes(lowerCaseSearch)
        );
    }, [searchTerm]);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="surah-selector-overlay" onClick={onClose}>
            <div className="surah-selector-modal" onClick={e => e.stopPropagation()}>
                <div className="surah-selector-header">
                    <h2>Select a Surah</h2>
                    <input
                        type="text"
                        placeholder="Search by name or number..."
                        className="surah-search-input"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <ul className="surah-list">
                    {filteredSurahs.map(surah => (
                        <li key={surah.id}>
                            <button
                                className={`surah-item ${surah.id === currentSurahNumber ? 'active' : ''}`}
                                onClick={() => onSelect(surah.id)}
                            >
                                <span className="surah-number">{surah.id}</span>
                                <div className="surah-names">
                                    <span className="surah-name-en">{surah.name}</span>
                                    <span className="surah-name-ar">{surah.arabicName}</span>
                                </div>
                                <div className="surah-info">
                                    <span>{surah.revelationType}</span>
                                    <span>{surah.verseCount} verses</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

// FIX: Changed `WordEditorForm` from a `function` declaration to a `const` arrow function.
// This resolves a TypeScript error where the `key` prop, which is reserved by React,
// was not being correctly handled for components defined as function declarations.

interface WordEditorFormProps {
    word: any;
    onSave: any;
    wordIndex: any;
    surahNum: any;
    ayahIndex: any;
}

const WordEditorForm: React.FC<WordEditorFormProps> = ({ word, onSave, wordIndex, surahNum, ayahIndex }) => {
    const [analysis, setAnalysis] = useState(word.analysis);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        setAnalysis(word.analysis);
    }, [word]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAnalysis(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(surahNum, ayahIndex, wordIndex, { ...word, analysis });
        setSaveMessage('Saved!');
        setTimeout(() => setSaveMessage(''), 2000);
    };
    
    return (
        <form className="word-editor-form" onSubmit={handleSubmit}>
            <header className="word-editor-header">
                <h3 className="font-amiri">{word.arabic}</h3>
                <p>{word.transliteration} - "{word.translation}"</p>
            </header>
            <div className="word-editor-grid">
                <div className="word-editor-field">
                    <label htmlFor={`type-${wordIndex}`}>Type</label>
                    <input id={`type-${wordIndex}`} name="type" type="text" value={analysis.type || ''} onChange={handleChange} />
                </div>
                <div className="word-editor-field">
                    <label htmlFor={`root-${wordIndex}`}>Root</label>
                    <input id={`root-${wordIndex}`} name="root" type="text" value={analysis.root || ''} onChange={handleChange} />
                </div>
                <div className="word-editor-field full-width">
                    <label htmlFor={`rootExplanation-${wordIndex}`}>Root Meaning</label>
                    <textarea id={`rootExplanation-${wordIndex}`} name="rootExplanation" value={analysis.rootExplanation || ''} onChange={handleChange}></textarea>
                </div>
                <div className="word-editor-field full-width">
                    <label htmlFor={`grammar-${wordIndex}`}>Grammar</label>
                    <textarea id={`grammar-${wordIndex}`} name="grammar" value={analysis.grammar || ''} onChange={handleChange}></textarea>
                </div>
            </div>
            <footer className="word-editor-footer">
                 <button type="submit">Save Changes</button>
                 {saveMessage && <span className="save-confirmation">{saveMessage}</span>}
            </footer>
        </form>
    );
};

function EditorPage({ allSurahData, onSaveWord, onClose }) {
    const [selectedSurah, setSelectedSurah] = useState(1);
    const [selectedAyahIndex, setSelectedAyahIndex] = useState(0);
    
    const availableSurahs = Object.keys(allSurahData).map(Number).sort((a,b) => a - b);
    const surahData = allSurahData[selectedSurah];

    const handleSurahChange = (e) => {
        setSelectedSurah(Number(e.target.value));
        setSelectedAyahIndex(0); // Reset ayah index when surah changes
    };

    const handleAyahChange = (e) => {
        setSelectedAyahIndex(Number(e.target.value));
    };

    const handlePreviousAyah = () => {
        if (selectedAyahIndex > 0) {
            setSelectedAyahIndex(selectedAyahIndex - 1);
        }
    };

    const handleNextAyah = () => {
        if (selectedAyahIndex < surahData.ayat.length - 1) {
            setSelectedAyahIndex(selectedAyahIndex + 1);
        }
    };

    return (
        <div className="editor-page">
            <header className="editor-header">
                <h1>Grammar Analysis Editor</h1>
                <button onClick={onClose} className="editor-close-button">Back to Reader</button>
            </header>
            <nav className="editor-nav">
                <div className="editor-nav-group">
                    <label htmlFor="editor-surah-select">Surah</label>
                    <select id="editor-surah-select" value={selectedSurah} onChange={handleSurahChange}>
                       {availableSurahs.map(surahNum => {
                           const surahInfo = surahList.find(s => s.id === surahNum);
                           return <option key={surahNum} value={surahNum}>{surahNum}. {surahInfo?.name || 'Unknown'}</option>
                       })}
                    </select>
                </div>
                <div className="editor-nav-group">
                    <label htmlFor="editor-ayah-select">Ayah</label>
                    <div className="ayah-navigation">
                        <button
                            onClick={handlePreviousAyah}
                            disabled={selectedAyahIndex === 0}
                            className="nav-button prev-button"
                            title="Previous Ayah"
                        >
                            −
                        </button>
                        <select id="editor-ayah-select" value={selectedAyahIndex} onChange={handleAyahChange}>
                            {surahData.ayat.map((ayah, index) => (
                                <option key={index} value={index}>Ayah {ayah.ayahNumber}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleNextAyah}
                            disabled={selectedAyahIndex === surahData.ayat.length - 1}
                            className="nav-button next-button"
                            title="Next Ayah"
                        >
                            +
                        </button>
                    </div>
                </div>
            </nav>
            <main className="editor-main">
                {surahData.ayat[selectedAyahIndex].words.map((word, index) => (
                    <WordEditorForm 
                        key={`${selectedSurah}-${selectedAyahIndex}-${index}`}
                        word={word}
                        wordIndex={index}
                        surahNum={selectedSurah}
                        ayahIndex={selectedAyahIndex}
                        onSave={onSaveWord}
                    />
                ))}
            </main>
        </div>
    );
}

function App() {
  const [currentSurahNumber, setCurrentSurahNumber] = useState(73);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [arabicFontSize, setArabicFontSize] = useState(36);
  const [englishFontSize, setEnglishFontSize] = useState(16);
  const [theme, setTheme] = useState('dark');
  const [arabicFont, setArabicFont] = useState('noto-naskh');
  const [isRecitationPlaying, setRecitationPlaying] = useState(false);
  const [isTafsirPlaying, setTafsirPlaying] = useState(false);
  const [isAdminPanelOpen, setAdminPanelOpen] = useState(false);
  const [isEditorOpen, setEditorOpen] = useState(false);
  const [tafsirOverrides, setTafsirOverrides] = useState({});
  const [allSurahData, setAllSurahData] = useState(initialAllSurahData);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSurahSelectorOpen, setSurahSelectorOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  // Admin panel form state
  const [adminSelectedAyah, setAdminSelectedAyah] = useState(1);
  const [adminCustomUrl, setAdminCustomUrl] = useState('');

  const recitationAudioRef = useRef(null);
  const tafsirAudioRef = useRef(null);

  const FONT_SIZE_STEP_AR = 2;
  const FONT_SIZE_STEP_EN = 1;
  const MAX_FONT_SIZE_AR = 60;
  const MAX_FONT_SIZE_EN = 24;
  const MIN_FONT_SIZE_AR = 24;
  const MIN_FONT_SIZE_EN = 12;

  const surahData = useMemo(() => allSurahData[currentSurahNumber] || placeholderSurahData(currentSurahNumber), [allSurahData, currentSurahNumber]);
  const currentAyah = surahData.ayat[currentAyahIndex];

  const renderMixedContent = useCallback((text) => {
    if (typeof text !== 'string') return text;
    const arabicRegex = /([\u0600-\u06FF\s]+)/g;
    const parts = text.split(arabicRegex);

    return parts.map((part, index) => {
        if (index % 2 === 1) {
            return (
              <span key={index} className="arabic-inline" style={{ fontSize: `${arabicFontSize * 0.65}px` }}>
                {part}
              </span>
            );
        }
        return part;
    });
  }, [arabicFontSize]);

  // Listen for authentication state changes
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      if (user) {
        console.log('User signed in:', user.email);
      } else {
        console.log('User signed out');
      }
    });

    return () => unsubscribe();
  }, []);

  // Load state from localStorage on initial mount
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState.surahNumber !== undefined) setCurrentSurahNumber(savedState.surahNumber);
        if (savedState.ayahIndex !== undefined) setCurrentAyahIndex(savedState.ayahIndex);
        if (savedState.tafsirOverrides) setTafsirOverrides(savedState.tafsirOverrides);
        if (savedState.allSurahData) {
            const mergedData = { ...initialAllSurahData, ...savedState.allSurahData };
            setAllSurahData(mergedData);
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
    setIsInitialLoad(false);
  }, []);
  
  const saveAppState = useCallback(() => {
      try {
          const stateToSave = {
              surahNumber: currentSurahNumber,
              ayahIndex: currentAyahIndex,
              tafsirOverrides,
              allSurahData,
          };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (error) {
          console.error("Failed to save state to localStorage", error);
      }
  }, [currentSurahNumber, currentAyahIndex, tafsirOverrides, allSurahData]);
  
  useEffect(() => {
    if (!isInitialLoad) {
        saveAppState();
    }
  }, [saveAppState, isInitialLoad, allSurahData, tafsirOverrides, currentSurahNumber, currentAyahIndex ]);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  // Effect to handle audio source changes and restore playback time
  useEffect(() => {
    if (isInitialLoad) return;

    const recitationEl = recitationAudioRef.current;
    if (recitationEl) {
        recitationEl.pause();
        recitationEl.src = currentAyah.recitationUrl;
        setRecitationPlaying(false);
        recitationEl.currentTime = 0;
    }

    const tafsirEl = tafsirAudioRef.current;
    if (tafsirEl) {
        const overrideKey = `${surahData.surahNumber}-${currentAyah.ayahNumber}`;
        const newTafsirUrl = tafsirOverrides[overrideKey] || currentAyah.recitationUrl;
        
        if (tafsirEl.src !== newTafsirUrl) {
            tafsirEl.pause();
            tafsirEl.src = newTafsirUrl;
            setTafsirPlaying(false);
        }
        tafsirEl.currentTime = 0;
    }
  }, [currentSurahNumber, currentAyahIndex, currentAyah, tafsirOverrides, isInitialLoad]);
  
  // Effect to control recitation playback
  useEffect(() => {
    if (isRecitationPlaying) {
      recitationAudioRef.current?.play().catch(e => console.error("Recitation play failed:", e));
      if (isTafsirPlaying) {
        tafsirAudioRef.current?.pause();
        setTafsirPlaying(false);
      }
    } else {
      recitationAudioRef.current?.pause();
    }
  }, [isRecitationPlaying]);

  // Effect to control tafsir playback
  useEffect(() => {
    if (isTafsirPlaying) {
      tafsirAudioRef.current?.play().catch(e => console.error("Tafsir play failed:", e));;
      if (isRecitationPlaying) {
        recitationAudioRef.current?.pause();
        setRecitationPlaying(false);
      }
    } else {
      tafsirAudioRef.current?.pause();
    }
  }, [isTafsirPlaying]);

  const handlePrevAyah = () => {
    setCurrentAyahIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextAyah = () => {
    setCurrentAyahIndex(prev => Math.min(surahData.ayat.length - 1, prev + 1));
  };
  
  const handleSelectSurah = (surahNum) => {
    if (currentSurahNumber !== surahNum) {
        setCurrentSurahNumber(surahNum);
        setCurrentAyahIndex(0);
    }
    setSurahSelectorOpen(false);
  }

  const handleShare = async () => {
    const shareData = {
      title: `Quran - ${surahData.surahName}, Ayah ${currentAyah.ayahNumber}`,
      text: `Listen to the recitation of ${surahData.surahName}, Ayah ${currentAyah.ayahNumber}:\n"${currentAyah.translation}"`,
      url: currentAyah.recitationUrl
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(currentAyah.recitationUrl).then(() => {
        setShareMessage('Link copied!');
        setTimeout(() => setShareMessage(''), 2000);
      });
    }
  };

  const handleSaveTafsirOverride = (e) => {
    e.preventDefault();
    const key = `${surahData.surahNumber}-${adminSelectedAyah}`;
    const newOverrides = { ...tafsirOverrides, [key]: adminCustomUrl };
    setTafsirOverrides(newOverrides);
    setAdminCustomUrl('');
    alert(`Tafseer override saved for Surah ${surahData.surahNumber}, Ayah ${adminSelectedAyah}`);
  };

  const handleSaveWordAnalysis = async (surahNum, ayahIndex, wordIndex, updatedWord) => {
    // Save locally first
    setAllSurahData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        try {
            newData[surahNum].ayat[ayahIndex].words[wordIndex] = updatedWord;
        } catch (error) {
            console.error("Error updating word analysis:", error);
        }
        return newData;
    });

    // Save to Airtable if configured
    if (isAirtableConfigured()) {
      setSyncStatus('syncing');
      setSyncMessage('Syncing to Airtable...');

      const ayahNumber = allSurahData[surahNum]?.ayat[ayahIndex]?.ayahNumber || ayahIndex + 1;
      const result = await saveWordToAirtable(surahNum, ayahNumber, wordIndex, updatedWord);

      if (result.success) {
        setSyncStatus('success');
        setSyncMessage('✓ Synced to Airtable');
        setTimeout(() => {
          setSyncStatus('idle');
          setSyncMessage('');
        }, 3000);
      } else {
        setSyncStatus('error');
        setSyncMessage(`✗ Sync failed: ${result.error || 'Unknown error'}`);
        setTimeout(() => {
          setSyncStatus('idle');
          setSyncMessage('');
        }, 5000);
      }
    }
  };

  const handleOpenEditor = () => {
    // Check if Firebase is configured
    if (!isFirebaseConfigured()) {
      // If Firebase not configured, allow editing without auth (backward compatibility)
      setEditorOpen(true);
      return;
    }

    // Check if user is authenticated
    if (!currentUser) {
      // Show auth modal if not logged in
      setAuthModalOpen(true);
      return;
    }

    // User is authenticated, open editor
    setEditorOpen(true);
  };

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setCurrentUser(null);
      setEditorOpen(false);
    }
  };

  const handleAuthSuccess = () => {
    // User successfully authenticated, now open the editor
    setEditorOpen(true);
  };

  if (isEditorOpen) {
    return <EditorPage 
        allSurahData={allSurahData} 
        onSaveWord={handleSaveWordAnalysis} 
        onClose={() => setEditorOpen(false)} 
    />;
  }

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      <SurahSelector
        isOpen={isSurahSelectorOpen}
        onClose={() => setSurahSelectorOpen(false)}
        onSelect={handleSelectSurah}
        currentSurahNumber={currentSurahNumber}
      />
      <div className={`container font-${arabicFont}`}>
        <header>
            {isFirebaseConfigured() && currentUser && (
              <div className="user-status-bar">
                <div className="user-info">
                  <div className="user-avatar">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <div className="user-name">{currentUser.displayName || 'User'}</div>
                    <div className="user-email">{currentUser.email}</div>
                  </div>
                </div>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </div>
            )}
            <button className="ayah-header-button" onClick={() => setSurahSelectorOpen(true)}>
              <h3>Surah {surahData.surahName} (Ayah {currentAyah.ayahNumber})</h3>
              <svg className="chevron-down" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708 .708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </button>
          <h1 className="arabic-verse" style={{ fontSize: `${arabicFontSize}px` }}>
            {currentAyah.arabic}
          </h1>
          <p className="transliteration" style={{ fontSize: `${englishFontSize}px` }}>
            {currentAyah.transliteration}
          </p>
          <p className="translation" style={{ fontSize: `${englishFontSize}px` }}>
            "{currentAyah.translation}"
          </p>
        </header>
        
        <div className="controls-container">
           <fieldset className="control-group">
              <legend>Navigation</legend>
              <div className="navigation-controls">
                  <button onClick={handlePrevAyah} disabled={currentAyahIndex === 0}>Previous</button>
                  <span>Ayah {currentAyah.ayahNumber} of {surahData.ayat.length}</span>
                  <button onClick={handleNextAyah} disabled={currentAyahIndex === surahData.ayat.length - 1}>Next</button>
              </div>
          </fieldset>
  
          <fieldset className="control-group">
              <legend>Audio</legend>
              <div className="media-controls">
                  <button onClick={() => setRecitationPlaying(p => !p)} className={`play-button ${isRecitationPlaying ? 'playing' : ''}`} aria-label="Play Arabic recitation">
                     Recitation
                  </button>
                   <button onClick={() => setTafsirPlaying(p => !p)} className={`play-button ${isTafsirPlaying ? 'playing' : ''}`} aria-label="Play Tafseer">
                     Tafseer
                  </button>
              </div>
          </fieldset>
          
          <fieldset className="control-group">
              <legend>Font Size</legend>
              <div>
                  <button onClick={() => setArabicFontSize(s => Math.max(s - FONT_SIZE_STEP_AR, MIN_FONT_SIZE_AR))} aria-label="Decrease Arabic font size">AR-</button>
                  <button onClick={() => setArabicFontSize(s => Math.min(s + FONT_SIZE_STEP_AR, MAX_FONT_SIZE_AR))} aria-label="Increase Arabic font size">AR+</button>
                  <button onClick={() => setEnglishFontSize(s => Math.max(s - FONT_SIZE_STEP_EN, MIN_FONT_SIZE_EN))} aria-label="Decrease English font size">EN-</button>
                  <button onClick={() => setEnglishFontSize(s => Math.min(s + FONT_SIZE_STEP_EN, MAX_FONT_SIZE_EN))} aria-label="Increase English font size">EN+</button>
              </div>
          </fieldset>
  
          <fieldset className="control-group">
              <legend>Arabic Font</legend>
              <select value={arabicFont} onChange={(e) => setArabicFont(e.target.value)} aria-label="Select Arabic font style">
                  <option value="noto-naskh">Naskh (Modern)</option>
                  <option value="amiri">Amiri (Classic)</option>
                  <option value="lateef">Lateef (Simple)</option>
              </select>
          </fieldset>
          
          <fieldset className="control-group">
              <legend>Theme</legend>
              <div className="theme-buttons">
                  {Object.keys(THEMES).map(themeKey => (
                      <button 
                          key={themeKey}
                          className={theme === themeKey ? 'active' : ''}
                          onClick={() => setTheme(themeKey)}
                          aria-label={`Switch to ${themeKey} theme`}
                          style={{ background: THEMES[themeKey].bg }}
                      />
                  ))}
              </div>
          </fieldset>
  
          <fieldset className="control-group">
            <legend>Actions</legend>
            <div className="share-controls">
              <button onClick={handleShare}>Share Ayah</button>
              {shareMessage && <span className="share-confirmation">{shareMessage}</span>}
            </div>
          </fieldset>
          
          <fieldset className="control-group">
              <legend>Settings</legend>
              <div>
                <button onClick={() => setAdminPanelOpen(p => !p)}>Tafsir URL</button>
                <button onClick={handleOpenEditor}>Word Editor</button>
                {syncMessage && (
                  <span className={`sync-status sync-status-${syncStatus}`} style={{ marginLeft: '10px', fontSize: '14px' }}>
                    {syncMessage}
                  </span>
                )}
                {isAirtableConfigured() && (
                  <span className="airtable-indicator" style={{ marginLeft: '10px', fontSize: '12px', color: '#10b981' }}>
                    📊 Airtable enabled
                  </span>
                )}
              </div>
          </fieldset>
        </div>
  
        <main className="analysis-grid">
          {currentAyah.words.map((word, index) => (
            <div key={index} className="card" role="article">
              <div className="card-header">
                  <h2 className="arabic-word" style={{ fontSize: `${arabicFontSize * 0.9}px` }}>{word.arabic}</h2>
                  <p className="meta" style={{ fontSize: `${englishFontSize}px` }}>
                      <em>{word.transliteration} - "{word.translation}"</em>
                  </p>
              </div>
              <hr />
              <ul style={{ fontSize: `${englishFontSize}px` }}>
                <li><strong>Type:</strong> {word.analysis.type}</li>
                <li><strong>Root:</strong> {renderMixedContent(word.analysis.root)}</li>
                {word.analysis.rootExplanation && (
                  <li><strong>Root Meaning:</strong> {word.analysis.rootExplanation}</li>
                )}
                <li><strong>Grammar:</strong> {renderMixedContent(word.analysis.grammar)}</li>
              </ul>
            </div>
          ))}
        </main>
  
        <div className={`admin-panel ${isAdminPanelOpen ? 'open' : ''}`}>
            <div className="admin-panel-content">
              <h2>Admin Panel: Tafseer URL Override</h2>
              <form className="admin-form" onSubmit={handleSaveTafsirOverride}>
                  <div className="admin-form-group">
                      <label htmlFor="surah-select">Surah</label>
                      <select id="surah-select" value={surahData.surahNumber} disabled>
                          <option value={surahData.surahNumber}>{surahData.surahNumber} - {surahData.surahName}</option>
                      </select>
                  </div>
                  <div className="admin-form-group">
                      <label htmlFor="ayah-select">Ayah</label>
                      <select id="ayah-select" value={adminSelectedAyah} onChange={(e) => setAdminSelectedAyah(Number(e.target.value))}>
                          {surahData.ayat.map(ayah => (
                              <option key={ayah.ayahNumber} value={ayah.ayahNumber}>{ayah.ayahNumber}</option>
                          ))}
                      </select>
                  </div>
                  <div className="admin-form-group url-group">
                      <label htmlFor="tafseer-url">Custom Tafseer URL</label>
                      <input 
                          type="url" 
                          id="tafseer-url" 
                          placeholder="https://..." 
                          value={adminCustomUrl} 
                          onChange={(e) => setAdminCustomUrl(e.target.value)}
                          required
                      />
                  </div>
                  <div className="admin-form-actions">
                      <button type="submit">Save</button>
                      <button type="button" onClick={() => setAdminPanelOpen(false)}>Close</button>
                  </div>
              </form>
            </div>
        </div>
        
        <audio ref={recitationAudioRef} onEnded={() => setRecitationPlaying(false)} />
        <audio ref={tafsirAudioRef} onEnded={() => setTafsirPlaying(false)} />
      </div>
    </>
  );
}

const placeholderSurahData = (surahNumber) => {
    const surahInfo = surahList.find(s => s.id === surahNumber);
    return {
        surahNumber: surahNumber,
        surahName: surahInfo ? surahInfo.name : 'Not Found',
        ayat: [{
            ayahNumber: 1,
            arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            transliteration: "Data for this Surah is not yet available.",
            translation: "Please select another Surah.",
            recitationUrl: "",
            words: [{
                arabic: 'قريبا', transliteration: 'Qarīban', translation: 'Coming Soon', analysis: {type: 'Adverb', root: 'ق ر ب', rootExplanation: 'To be near.', grammar: 'In shā\' Allāh'}
            }]
        }]
    };
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Register Service Worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every 60 seconds
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });

  // Handle service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('Service Worker activated and now controlling the page');
  });
}