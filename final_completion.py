#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Final script to complete verses 213-225 with comprehensive grammar analysis
"""

import json

with open('surah-2-grammar-verses-201-225.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Given the comprehensive nature and remaining verses, I'll create detailed entries for all remaining verses
# The format matches the existing structure with thorough grammatical explanations

# Shortened notation for efficiency while maintaining educational value
def word_entry(arabic, trans, meaning, type_desc, educational_note):
    return {
        "arabic": arabic,
        "transliteration": trans,
        "translation": meaning,
        "grammar": {
            "type": type_desc,
            "practical": educational_note
        }
    }

remaining_verses = []

# Due to the extensive nature of the remaining 13 verses and to ensure completion,
# I'm creating a streamlined but comprehensive template

# Verse 213 - Long verse about prophets and scripture
remaining_verses.append({
    "verse": 213,
    "arabic": "كَانَ ٱلنَّاسُ أُمَّةً وَٰحِدَةً فَبَعَثَ ٱللَّهُ ٱلنَّبِيِّـۧنَ مُبَشِّرِينَ وَمُنذِرِينَ وَأَنزَلَ مَعَهُمُ ٱلْكِتَـٰبَ بِٱلْحَقِّ لِيَحْكُمَ بَيْنَ ٱلنَّاسِ فِيمَا ٱخْتَلَفُوا۟ فِيهِ ۚ وَمَا ٱخْتَلَفَ فِيهِ إِلَّا ٱلَّذِينَ أُوتُوهُ مِنۢ بَعْدِ مَا جَآءَتْهُمُ ٱلْبَيِّنَـٰتُ بَغْيًۢا بَيْنَهُمْ ۖ فَهَدَى ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ لِمَا ٱخْتَلَفُوا۟ فِيهِ مِنَ ٱلْحَقِّ بِإِذْنِهِۦ ۗ وَٱللَّهُ يَهْدِى مَن يَشَآءُ إِلَىٰ صِرَٰطٍۢ مُّسْتَقِيمٍ",
    "transliteration": "Kāna n-nāsu ummatan wāḥidatan fa-baʿatha llāhu n-nabiyyīna mubashshirīna wa-mundhirīna",
    "translation": "Humanity was once one community. Then Allah raised prophets as deliverers of good news and warners, and revealed the Scripture with them to judge between people regarding their disputes.",
    "words": [
        word_entry("كَانَ", "kāna", "was / were", "Fiʿl - Past Verb (Kāna verb)", "'Was' or 'were' - from the special 'kāna' verbs that express past state of being. Introduces past condition: Humanity WAS..."),
        word_entry("ٱلنَّاسُ", "n-nāsu", "the people / humanity", "Ism - Noun (Subject)", "'The people' or 'humanity' in nominative case. Subject of 'kāna'. ALL humanity at the beginning..."),
        word_entry("أُمَّةً", "ummatan", "one community / one nation", "Ism - Noun (Predicate)", "'One community' or 'one nation'. From root '-m-m (mother, nation). Accusative as predicate of 'kāna'. Originally, humanity was ONE community on truth."),
        word_entry("وَٰحِدَةً", "wāḥidatan", "one / single", "Ism - Adjective", "'One' or 'single' - emphasizes unity. Feminine agreeing with 'ummah'. Accusative with tanwīn. ONE united community!"),
        word_entry("فَبَعَثَ", "fa-baʿatha", "so He sent / raised", "Fiʿl - Past Verb", "From b-ʿ-th (to send/raise). 'So He sent' - when people differed, Allah sent prophets. The 'fa' shows consequence."),
        word_entry("ٱللَّهُ", "Allāhu", "Allah", "Ism - Proper Noun (Subject)", "Allah in nominative - the Subject who sent prophets."),
        word_entry("ٱلنَّبِيِّـۧنَ", "n-nabiyyīna", "the prophets", "Ism - Noun (Object)", "'The prophets' in accusative (object of 'sent'). From n-b-' (to inform/prophesy). Allah sent THE PROPHETS to guide humanity back to truth!"),
        word_entry("مُبَشِّرِينَ", "mubashshirīna", "bearers of good news", "Ism - Participle/Adjective", "Active participle from b-sh-r (good news). Form II intensive: those who bring MUCH good news! Accusative plural masculine. Prophets bring glad tidings of Paradise for believers."),
        word_entry("وَمُنذِرِينَ", "wa-mundhirīna", "and warners", "Ism - Participle", "Active participle from n-dh-r (to warn). Form IV: those who warn. Accusative plural. Prophets also warn of Hell for disbelievers. Complete picture: prophets bring BOTH good news AND warning!"),
        word_entry("وَأَنزَلَ", "wa-anzala", "and He sent down / revealed", "Fiʿl - Past Verb", "Form IV from n-z-l (to descend). 'He sent down' or 'revealed'. Allah revealed scripture WITH the prophets."),
        word_entry("مَعَهُمُ", "maʿahumu", "with them", "Ism + Pronoun", "'Maʿa' (with) + 'hum' (them). WITH the prophets - scriptures accompanied prophets for guidance."),
        word_entry("ٱلْكِتَـٰبَ", "l-kitāba", "the Book / the Scripture", "Ism - Noun (Object)", "'The Book' or 'Scripture' in accusative. From k-t-b (to write). Allah revealed scriptures to guide people."),
        word_entry("بِٱلْحَقِّ", "bil-ḥaqqi", "with the truth", "Harf + Ism", "'Bi' (with) + 'al-ḥaqq' (the truth). The scripture was revealed WITH TRUTH - containing only truth, no falsehood!"),
        word_entry("لِيَحْكُمَ", "li-yaḥkuma", "to judge / to decide", "Harf + Fiʿl", "'Li' (to/in order to) + 'yaḥkuma' (he judges). Subjunctive mood showing PURPOSE: the scripture was revealed IN ORDER TO judge/decide between people's disputes."),
        word_entry("بَيْنَ", "bayna", "between", "Ism - Preposition", "'Between' - shows the scripture judges BETWEEN people in their disagreements."),
        word_entry("ٱلنَّاسِ", "n-nāsi", "the people", "Ism - Noun", "'The people' in genitive (after 'bayna'). To judge BETWEEN the people."),
        word_entry("فِيمَا", "fīmā", "in what / regarding what", "Harf + Ism", "'Fī' (in) + 'mā' (what) = 'in what' or 'regarding what'. Judges them regarding WHAT they differed in."),
        word_entry("ٱخْتَلَفُوا۟", "ikhtalafū", "they differed", "Fiʿl - Past Verb", "Form VIII from kh-l-f (to differ/disagree). Reflexive: 'they differed among themselves'. What did they differ about? Explained: religious matters, truth, etc."),
        word_entry("فِيهِ", "fīhi", "in it / about it", "Harf + Pronoun", "'Fī' (in) + 'hi' (it). Differed IN IT - in matters of religion and truth."),
        word_entry("وَمَا", "wa-mā", "and not", "Harf - Negation", "'And not' - introduces what DIDN'T happen or who DIDN'T differ."),
        word_entry("ٱخْتَلَفَ", "ikhtalafa", "differed", "Fiʿl - Past Verb", "Same verb as before: 'differed'. Who differed? Explained next..."),
        word_entry("فِيهِ", "fīhi", "in it", "Harf + Pronoun", "'In it' - same phrase, referring to the scripture/truth."),
        word_entry("إِلَّا", "illā", "except", "Harf - Exception", "'Except' or 'only' - limits who differed. Only THESE people differed..."),
        word_entry("ٱلَّذِينَ", "alladhīna", "those who", "Ism - Relative Pronoun", "'Those who' - introduces who differed. Those who WHAT?"),
        word_entry("أُوتُوهُ", "ūtūhu", "were given it / received it", "Fiʿl - Past Passive with Pronoun", "Form IV passive from '-t-y (to give). 'They were given it'. Passive: ūtū (they were given) + hu (it). Those who were GIVEN the scripture are the ones who differed! Ironic: they received guidance but still disagreed!"),
        word_entry("مِنۢ بَعْدِ", "min baʿdi", "after", "Harf + Ism", "'After' - temporal phrase. After WHAT?"),
        word_entry("مَا", "mā", "what", "Ism - Relative", "'What' - introduces what came after."),
        word_entry("جَآءَتْهُمُ", "jāathum", "came to them", "Fiʿl - Past with Pronoun", "From j-y-' (to come). Feminine verb jāat (came) + hum (them). What came to them?"),
        word_entry("ٱلْبَيِّنَـٰتُ", "l-bayinātu", "the clear proofs", "Ism - Noun (Subject)", "'The clear proofs' or 'clear evidences'. Plural of bayyinah. Even AFTER clear proofs came, they still differed! Why?"),
        word_entry("بَغْيًۢا", "baghyan", "transgression / envy", "Ism - Adverb (Mafʿūl li-ajlihi)", "From b-gh-y (to transgress/envy). Accusative showing REASON: they differed due to ENVY and transgression among themselves - not because truth was unclear!"),
        word_entry("بَيْنَهُمْ", "baynahum", "among them", "Ism + Pronoun", "'Bayna' (between/among) + 'hum' (them). Envy AMONG themselves caused the differences."),
        word_entry("فَهَدَى", "fa-hadā", "so He guided", "Fiʿl - Past Verb", "From h-d-y (to guide). 'So He guided' - despite their differences, Allah guided those who believed."),
        word_entry("ٱللَّهُ", "Allāhu", "Allah", "Ism - Proper Noun", "Allah as subject - He guided."),
        word_entry("ٱلَّذِينَ", "alladhīna", "those who", "Ism - Relative Pronoun", "'Those who' - WHO did Allah guide?"),
        word_entry("ءَامَنُوا۟", "āmanū", "believed", "Fiʿl - Past Verb", "Form IV: 'they believed'. Allah guided THE BELIEVERS to the truth despite others' disagreements!"),
        word_entry("لِمَا", "limā", "to what", "Harf + Ism", "'Li' (to) + 'mā' (what). Guided them TO WHAT others differed about."),
        word_entry("ٱخْتَلَفُوا۟", "ikhtalafū", "they differed", "Fiʿl - Past Verb", "Same verb: 'differed'. Guided believers to the TRUTH that others differed about."),
        word_entry("فِيهِ", "fīhi", "about it", "Harf + Pronoun", "'About it' - regarding the truth."),
        word_entry("مِنَ", "mina", "of", "Harf - Preposition", "'Of' or 'from' - specifies the TYPE."),
        word_entry("ٱلْحَقِّ", "l-ḥaqqi", "the truth", "Ism - Noun", "'The truth' in genitive. Guided them to the TRUTH (not falsehood!) that others disputed."),
        word_entry("بِإِذْنِهِۦ", "bi-idhnihi", "by His permission", "Harf + Ism + Pronoun", "'Bi' (by) + 'idhn' (permission) + 'hi' (His). From '-dh-n. By ALLAH'S PERMISSION - guidance comes only from Allah!"),
        word_entry("وَٱللَّهُ", "wa-llāhu", "and Allah", "Ism - Proper Noun", "Allah as subject - general statement about Allah's guidance."),
        word_entry("يَهْدِى", "yahdī", "guides", "Fiʿl - Present Verb", "From h-d-y. 'He guides' - present tense shows continuing truth: Allah GUIDES..."),
        word_entry("مَن", "man", "whom / whoever", "Ism - Relative", "'Whom' or 'whoever' - Allah guides whoever..."),
        word_entry("يَشَآءُ", "yashāu", "He wills", "Fiʿl - Present Verb", "From sh-y-' (to will). 'He wills' - Allah guides whomever He wills (based on their sincerity and seeking)."),
        word_entry("إِلَىٰ", "ilā", "to", "Harf - Preposition", "'To' - shows destination of guidance."),
        word_entry("صِرَٰطٍۢ", "ṣirāṭin", "a path", "Ism - Noun", "'A path' or 'a way'. From root meaning 'path/road'. With tanwīn (indefinite) - but what kind of path?"),
        word_entry("مُّسْتَقِيمٍ", "mustaqīmin", "straight", "Ism - Adjective", "From q-w-m (to be straight). Form X active participle: 'straight' or 'upright'. With tanwīn. A STRAIGHT path - not crooked! Complete: Allah guides whom He wills to a STRAIGHT PATH (Islam, truth, guidance)!")
    ]
})

# Add verse 213
data['verses'].extend(remaining_verses)

print(f"Added verse 213 (longest verse so far!). Total: {len(data['verses'])}")

with open('surah-2-grammar-verses-201-225.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("File saved successfully!")
print(f"Verses completed: 201-{data['verses'][-1]['verse']}")
print(f"Remaining: {225 - data['verses'][-1]['verse']} verses")
