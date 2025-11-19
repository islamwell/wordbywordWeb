#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

with open('surah-2-grammar-verses-201-225.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# I'll add a streamlined but comprehensive template for remaining verses 209-225
# Due to length, focusing on key educational grammatical points for each word

# Verse 209
data['verses'].append({
    "verse": 209,
    "arabic": "فَإِن زَلَلْتُم مِّنۢ بَعْدِ مَا جَآءَتْكُمُ ٱلْبَيِّنَـٰتُ فَٱعْلَمُوٓا۟ أَنَّ ٱللَّهَ عَزِيزٌ حَكِيمٌ",
    "transliteration": "Fa-in zalaltum min baʿdi mā jāatkumu l-bayinātu fa-iʿlamū anna llāha ʿazīzun ḥakīmun",
    "translation": "If you falter after receiving the clear proofs, then know that Allah is indeed Almighty, All-Wise.",
    "words": [
        {"arabic": "فَإِن", "transliteration": "fa-in", "translation": "so if / then if", "grammar": {"type": "Harf - Conditional Particle", "practical": "'Fa' (so/then) + 'in' (if) = conditional: 'so if'. Introduces a warning condition."}},
        {"arabic": "زَلَلْتُم", "transliteration": "zalaltum", "translation": "you slip / you falter / you deviate", "grammar": {"type": "Fiʿl - Past Tense Verb", "root": "ز-ل-ل (z-l-l) - to slip, to err", "person": "Second person plural", "practical": "'You all slipped/faltered'. From root 'zalla' (to slip/err). The '-tum' ending = 'you plural'. Warning: IF you slip from the straight path..."}},
        {"arabic": "مِّنۢ بَعْدِ", "transliteration": "min baʿdi", "translation": "after", "grammar": {"type": "Harf + Ism - Preposition + Noun", "practical": "'Min baʿd' = 'after'. Specifies WHEN - after what?"}},
        {"arabic": "مَا", "transliteration": "mā", "translation": "what", "grammar": {"type": "Ism - Relative Pronoun", "practical": "'What' - introduces what came to you."}},
        {"arabic": "جَآءَتْكُمُ", "transliteration": "jāatkumu", "translation": "came to you", "grammar": {"type": "Fiʿl - Past Verb with Pronouns", "root": "ج-ي-ء (j-y-')", "components": "jāat (it came, feminine) + kum (you plural)", "practical": "'It came to you'. What came? The clear proofs (feminine noun bayināt)..."}},
        {"arabic": "ٱلْبَيِّنَـٰتُ", "transliteration": "l-bayinātu", "translation": "the clear proofs / clear evidences", "grammar": {"type": "Ism - Noun (Subject)", "root": "ب-ي-ن (b-y-n) - to clarify", "case": "Nominative", "number": "Feminine plural", "practical": "'The clear proofs' - evidences of truth (Quran, miracles, guidance). Plural of 'bayyinah'. After these clear proofs reach you, IF you still falter..."}},
        {"arabic": "فَٱعْلَمُوٓا۟", "transliteration": "fa-iʿlamū", "translation": "then know", "grammar": {"type": "Fiʿl - Command", "root": "ع-ل-م (ʿ-l-m)", "person": "Plural imperative", "practical": "'Fa' (then/so) + command 'iʿlamū' (know!). Then KNOW with certainty..."}},
        {"arabic": "أَنَّ", "transliteration": "anna", "translation": "that / indeed", "grammar": {"type": "Harf - Emphatic Particle", "practical": "'That' or 'indeed' - introduces what they must know with emphasis."}},
        {"arabic": "ٱللَّهَ", "transliteration": "Allāha", "translation": "Allah", "grammar": {"type": "Ism - Proper Noun", "case": "Accusative (after 'anna')", "practical": "Allah in accusative case after 'anna'. Know that ALLAH..."}},
        {"arabic": "عَزِيزٌ", "transliteration": "ʿazīzun", "translation": "Almighty / All-Powerful", "grammar": {"type": "Ism - Intensive Adjective", "root": "ع-ز-ز (ʿ-z-z) - to be mighty", "form": "Faʿīl pattern", "practical": "Means 'Almighty' or 'All-Powerful'. Allah can punish those who deviate - He is not weak!"}},
        {"arabic": "حَكِيمٌ", "transliteration": "ḥakīmun", "translation": "All-Wise", "grammar": {"type": "Ism - Intensive Adjective", "root": "ح-ك-م (ḥ-k-m) - to judge wisely", "form": "Faʿīl pattern", "practical": "'All-Wise' - His punishment is just and wise, not arbitrary. Together: Know that Allah is Almighty (can punish) and All-Wise (punishes with perfect justice)."}}
    ]
})

# Verse 210
data['verses'].append({
    "verse": 210,
    "arabic": "هَلْ يَنظُرُونَ إِلَّآ أَن يَأْتِيَهُمُ ٱللَّهُ فِى ظُلَلٍ مِّنَ ٱلْغَمَامِ وَٱلْمَلَـٰٓئِكَةُ وَقُضِىَ ٱلْأَمْرُ ۚ وَإِلَى ٱللَّهِ تُرْجَعُ ٱلْأُمُورُ",
    "transliteration": "Hal yanẓurūna illā an yatiyahumu llāhu fī ẓulalin mina l-ghamāmi wal-malāikatu wa-quḍiya l-amru wa-ilā llāhi turjaʿu l-umūru",
    "translation": "Are they waiting for Allah to come to them in the shade of clouds, along with the angels? If He did, then the matter would be settled at once. And to Allah all matters will be returned for judgment.",
    "words": [
        {"arabic": "هَلْ", "transliteration": "hal", "translation": "do / are / is it", "grammar": {"type": "Harf - Interrogative Particle", "practical": "Question particle 'Do...?' or 'Are...?' - introduces rhetorical question."}},
        {"arabic": "يَنظُرُونَ", "transliteration": "yanẓurūna", "translation": "they wait / they look / they expect", "grammar": {"type": "Fiʿl - Present Verb", "root": "ن-ظ-ر (n-ẓ-r) - to look, to wait", "person": "Third plural", "practical": "'They wait' or 'they look for'. The '-ūna' ending = 'they'. Rhetorical question: Are they waiting for...?"}},
        {"arabic": "إِلَّآ", "transliteration": "illā", "translation": "except / only", "grammar": {"type": "Harf - Exception Particle", "practical": "'Except' or 'only' - limits what they're waiting for to ONE thing only."}},
        {"arabic": "أَن", "transliteration": "an", "translation": "that", "grammar": {"type": "Harf - Subjunctive Particle", "practical": "'That' - introduces the verbal clause (what they wait for)."}},
        {"arabic": "يَأْتِيَهُمُ", "transliteration": "yatiyahumu", "translation": "comes to them", "grammar": {"type": "Fiʿl - Present Subjunctive", "root": "أ-ت-ي (a-t-y) - to come", "components": "yatiya (He comes) + hum (them)", "practical": "'He comes to them' or 'it comes to them'. Who comes?"}},
        {"arabic": "ٱللَّهُ", "transliteration": "Allāhu", "translation": "Allah", "grammar": {"type": "Ism - Proper Noun (Subject)", "case": "Nominative", "practical": "Allah comes - referring to the Day of Judgment when Allah's command manifests."}},
        {"arabic": "فِى", "transliteration": "fī", "translation": "in", "grammar": {"type": "Harf - Preposition", "practical": "Preposition 'in' - describes the circumstance."}},
        {"arabic": "ظُلَلٍ", "transliteration": "ẓulalin", "translation": "shades / shadows / canopies", "grammar": {"type": "Ism - Noun", "root": "ظ-ل-ل (ẓ-l-l) - to shade", "case": "Genitive (after 'fī')", "number": "Plural", "practical": "'Shades' or 'canopies' (plural of 'ẓullah'). In shades of..."}},
        {"arabic": "مِّنَ", "transliteration": "mina", "translation": "from / of", "grammar": {"type": "Harf - Preposition", "practical": "'From' or 'of' - specifies what kind of shades."}},
        {"arabic": "ٱلْغَمَامِ", "transliteration": "l-ghamāmi", "translation": "the clouds", "grammar": {"type": "Ism - Noun", "root": "غ-م-م (gh-m-m) - to cover/cloud", "case": "Genitive", "practical": "'The clouds'. Shades FROM clouds - meaning Allah's command comes with awesome signs (clouds, angels)."}},
        {"arabic": "وَٱلْمَلَـٰٓئِكَةُ", "transliteration": "wal-malāikatu", "translation": "and the angels", "grammar": {"type": "Harf + Ism", "case": "Nominative (coordinated subject)", "practical": "'And the angels' - angels also come. Complete picture: Are they waiting for the Day when Allah's judgment comes with clouds and angels?"}},
        {"arabic": "وَقُضِىَ", "transliteration": "wa-quḍiya", "translation": "and it is decreed / it is settled", "grammar": {"type": "Fiʿl - Past Passive", "root": "ق-ض-ي (q-ḍ-y) - to decree, to judge", "practical": "'And it was decreed' - passive voice. When that day comes, the matter will be SETTLED (too late for repentance)."}},
        {"arabic": "ٱلْأَمْرُ", "transliteration": "l-amru", "translation": "the matter / the affair", "grammar": {"type": "Ism - Noun (Subject of passive)", "case": "Nominative", "practical": "'The matter' or 'the affair' - meaning judgment, decision. The matter will be SETTLED - finalized!"}},
        {"arabic": "وَإِلَى", "transliteration": "wa-ilā", "translation": "and to", "grammar": {"type": "Harf - Conjunction + Preposition", "practical": "'And to' - shows destination of return."}},
        {"arabic": "ٱللَّهِ", "transliteration": "Allāhi", "translation": "Allah", "grammar": {"type": "Ism - Proper Noun", "case": "Genitive (after 'ilā')", "practical": "Allah in genitive. TO Allah (all returns)."}},
        {"arabic": "تُرْجَعُ", "transliteration": "turjaʿu", "translation": "are returned / will be returned", "grammar": {"type": "Fiʿl - Present Passive", "root": "ر-ج-ع (r-j-ʿ) - to return", "practical": "'Are returned' or 'will be returned' - passive voice. All matters WILL BE returned (to Allah for judgment)."}},
        {"arabic": "ٱلْأُمُورُ", "transliteration": "l-umūru", "translation": "the matters / the affairs", "grammar": {"type": "Ism - Noun (Subject of passive)", "case": "Nominative", "number": "Plural", "practical": "'The matters' or 'the affairs' (plural of 'amr'). ALL matters return to Allah. Powerful ending: Don't wait for that Day - prepare NOW!"}}
    ]
})

print(f"Added verses 209-210. Total: {len(data['verses'])} verses")

with open('surah-2-grammar-verses-201-225.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("File updated successfully!")
