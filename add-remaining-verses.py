#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to add remaining verses 207-225 with comprehensive grammar analysis
"""

import json

# Read existing data
with open('surah-2-grammar-verses-201-225.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Define all remaining verses with comprehensive analysis
remaining_verses = [
    {
        "verse": 207,
        "arabic": "وَمِنَ ٱلنَّاسِ مَن يَشْرِى نَفْسَهُ ٱبْتِغَآءَ مَرْضَاتِ ٱللَّهِ ۗ وَٱللَّهُ رَءُوفٌۢ بِٱلْعِبَادِ",
        "transliteration": "Wamina n-nāsi man yashrī nafsahu ibtigħāa marḍāti llāhi wa-llāhu raūfun bil-ʿibādi",
        "translation": "There are those among people who dedicate their lives seeking Allah's pleasure. Allah shows compassion to His servants.",
        "words": [
            {
                "arabic": "وَ",
                "transliteration": "wa",
                "translation": "and",
                "grammar": {
                    "type": "Harf - Conjunction",
                    "practical": "Transitions to describe the opposite type of person - contrasting with the hypocrite in verses 204-206."
                }
            },
            {
                "arabic": "مِنَ",
                "transliteration": "mina",
                "translation": "from / among",
                "grammar": {
                    "type": "Harf - Preposition",
                    "practical": "Preposition 'from' or 'among' - introduces another subset of people."
                }
            },
            {
                "arabic": "ٱلنَّاسِ",
                "transliteration": "n-nāsi",
                "translation": "the people / mankind",
                "grammar": {
                    "type": "Ism - Noun",
                    "case": "Genitive (majrūr)",
                    "practical": "'The people' in genitive case after 'min'. Same construction as verse 204, but NOW describing the OPPOSITE type."
                }
            },
            {
                "arabic": "مَن",
                "transliteration": "man",
                "translation": "who / those who",
                "grammar": {
                    "type": "Ism - Relative Pronoun",
                    "practical": "'Who' or 'those who' - introduces the characteristics of these righteous people."
                }
            },
            {
                "arabic": "يَشْرِى",
                "transliteration": "yashrī",
                "translation": "he sells / he trades / he sacrifices",
                "grammar": {
                    "type": "Fiʿl - Present Tense Verb",
                    "root": "ش-ر-ي (sh-r-y) - to buy, to sell, to trade",
                    "form": "Form I",
                    "person": "Third person masculine singular",
                    "tense": "Present/habitual",
                    "reason": "Describes the action of selling/trading. Here it means sacrificing or dedicating.",
                    "practical": "Means 'he sells' or 'he trades'. From root 'sharā' (to buy/sell). In this context, 'yashrī nafsahu' means 'he sells/sacrifices his self' - dedicating his entire life. Present tense shows it's their constant state. What does he sacrifice? His very SELF (life)..."
                }
            },
            {
                "arabic": "نَفْسَهُ",
                "transliteration": "nafsahu",
                "translation": "his self / his soul / his life",
                "grammar": {
                    "type": "Ism - Noun with Pronoun (Object)",
                    "root": "ن-ف-س (n-f-s) - self, soul",
                    "case": "Accusative (manṣūb)",
                    "components": "nafs (self/soul) + hu (his)",
                    "reason": "The object of 'yashrī' - what he sells/sacrifices. His entire self/life.",
                    "practical": "Means 'his self' or 'his soul/life'. 'Nafs' = self/soul, 'hu' = his. Accusative case (object). He sells/sacrifices HIS VERY SELF - meaning he dedicates his entire life, puts everything on the line. Beautiful contrast with the hypocrite who destroyed crops - this believer destroys his own comfort for Allah's sake!"
                }
            },
            {
                "arabic": "ٱبْتِغَآءَ",
                "transliteration": "ibtigħāa",
                "translation": "seeking / desiring",
                "grammar": {
                    "type": "Ism - Verbal Noun (Maṣdar, Mafʿūl li-ajlihi)",
                    "root": "ب-غ-ي (b-gh-y) - to seek, to desire",
                    "form": "Form VIII verbal noun",
                    "case": "Accusative (as object of reason)",
                    "reason": "Shows the PURPOSE or REASON for selling himself - he does it FOR THE PURPOSE of seeking...",
                    "practical": "Verbal noun meaning 'seeking' or 'desiring'. From root 'bagh ā' (to seek). Form VIII 'ibtaghā' intensifies: seeking earnestly. Accusative case shows REASON/PURPOSE: he sacrifices himself FOR THE SEEKING of... what? Allah's pleasure!"
                }
            },
            {
                "arabic": "مَرْضَاتِ",
                "transliteration": "marḍāti",
                "translation": "pleasure / satisfaction",
                "grammar": {
                    "type": "Ism - Noun in Genitive Construction (Muḍāf)",
                    "root": "ر-ض-ي (r-ḍ-y) - to be pleased, to be satisfied",
                    "case": "Genitive (in iḍāfah)",
                    "gender": "Feminine",
                    "reason": "First part of construct - seeking THE PLEASURE. Will be specified whose pleasure in next word.",
                    "practical": "Means 'pleasure' or 'satisfaction'. From root 'raḍiya' (to be pleased). 'Marḍāh' is the noun form. In construct form (will connect to next word): seeking THE PLEASURE of..."
                }
            },
            {
                "arabic": "ٱللَّهِ",
                "transliteration": "Allāhi",
                "translation": "Allah",
                "grammar": {
                    "type": "Ism - Proper Noun in Genitive",
                    "case": "Genitive (majrūr)",
                    "reason": "Completes the construct - whose pleasure is sought. ALLAH's pleasure!",
                    "practical": "Allah in genitive case (ends in 'i'). Completes the phrase: 'marḍāt Allāh' = 'Allah's pleasure'. Beautiful complete meaning: among people are those who SACRIFICE THEIR ENTIRE LIVES seeking ALLAH'S PLEASURE! This is the highest goal - not seeking worldly gain, but only Allah's satisfaction!"
                }
            },
            {
                "arabic": "وَ",
                "transliteration": "wa",
                "translation": "and",
                "grammar": {
                    "type": "Harf - Conjunction",
                    "practical": "Transitions to Allah's response to such dedication."
                }
            },
            {
                "arabic": "ٱللَّهُ",
                "transliteration": "Allāhu",
                "translation": "Allah",
                "grammar": {
                    "type": "Ism - Proper Noun (Subject)",
                    "case": "Nominative (marfūʿ)",
                    "practical": "Allah as the subject - now Allah's attribute is mentioned."
                }
            },
            {
                "arabic": "رَءُوفٌۢ",
                "transliteration": "raūfun",
                "translation": "Most Compassionate / Most Kind",
                "grammar": {
                    "type": "Ism - Intensive Adjective (Ṣifah Mushabbahah)",
                    "root": "ر-ء-ف / ر-أ-ف (r-'-f) - to be compassionate, to be kind",
                    "form": "Faʿūl pattern - intensive attribute",
                    "case": "Nominative with tanwīn",
                    "reason": "Describes Allah's permanent, intense quality of compassion. The 'faʿūl' pattern emphasizes the intensity.",
                    "practical": "Means 'Most Compassionate' or 'Extremely Kind'. From root 'ra'afa' (to be compassionate). The pattern 'faʿūl' (like ra'ūf) shows INTENSE, PERMANENT quality - Allah is EXTREMELY compassionate! The 'un' tanwīn adds indefiniteness and magnificence. Beautiful promise: those who sacrifice for Allah will find Him MOST COMPASSIONATE!"
                }
            },
            {
                "arabic": "بِٱلْعِبَادِ",
                "transliteration": "bil-ʿibādi",
                "translation": "to the servants / with the servants",
                "grammar": {
                    "type": "Harf + Ism - Preposition + Noun",
                    "root": "ع-ب-د (ʿ-b-d) - to worship, to serve",
                    "case": "Genitive after 'bi'",
                    "number": "Plural",
                    "reason": "'ʿIbād' is plural of 'ʿabd' (servant/worshipper). Shows WHO receives Allah's compassion - His servants.",
                    "practical": "'Bi' (to/with) + 'al-ʿibād' (the servants). 'ʿIbād' is the plural of 'ʿabd' meaning 'servants' or 'worshippers'. Complete: 'Allah is Most Compassionate TO His servants'. Beautiful ending: those who serve Allah faithfully will find Him full of compassion toward them. Perfect contrast to verse 204-206: the arrogant hypocrite earns Hell, while the humble servant finds Allah's compassion!"
                }
            }
        ]
    },
    {
        "verse": 208,
        "arabic": "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱدْخُلُوا۟ فِى ٱلسِّلْمِ كَآفَّةًۭ وَلَا تَتَّبِعُوا۟ خُطُوَٰتِ ٱلشَّيْطَـٰنِ ۚ إِنَّهُۥ لَكُمْ عَدُوٌّۭ مُّبِينٌۭ",
        "transliteration": "Yā ayyuhā alladhīna āmanū udkhulū fī s-silmi kāffatan walā tattabiʿū khuṭuwāti sh-shayṭāni innahu lakum ʿaduwwun mubīn",
        "translation": "O believers! Enter into Islam wholeheartedly and do not follow Satan's footsteps. Surely he is your sworn enemy.",
        "words": [
            {
                "arabic": "يَـٰٓأَيُّهَا",
                "transliteration": "yā ayyuhā",
                "translation": "O you / O those",
                "grammar": {
                    "type": "Harf + Ism - Vocative Particle + Pronoun",
                    "components": "yā (O) + ayyuhā (you who)",
                    "function": "Calls attention for important address",
                    "practical": "'Yā' is the vocative particle (like saying 'O!'), and 'ayyuhā' means 'you who' or 'those who'. Together: 'O you who...!' This is how the Quran addresses believers directly - calling their attention for something important!"
                }
            },
            {
                "arabic": "ٱلَّذِينَ",
                "transliteration": "alladhīna",
                "translation": "those who",
                "grammar": {
                    "type": "Ism - Relative Pronoun",
                    "number": "Plural masculine",
                    "practical": "Plural relative pronoun 'those who' - specifies WHO is being addressed."
                }
            },
            {
                "arabic": "ءَامَنُوا۟",
                "transliteration": "āmanū",
                "translation": "believed / have faith",
                "grammar": {
                    "type": "Fiʿl - Past Tense Verb",
                    "root": "أ-م-ن (a-m-n) - to believe, to have faith",
                    "form": "Form IV",
                    "person": "Third person masculine plural",
                    "practical": "Past tense verb 'they believed'. The '-ū' ending shows plural. Complete address: 'O you who have believed!' This is a direct call to all Muslims."
                }
            },
            {
                "arabic": "ٱدْخُلُوا۟",
                "transliteration": "udkhulū",
                "translation": "enter",
                "grammar": {
                    "type": "Fiʿl - Command/Imperative Verb",
                    "root": "د-خ-ل (d-kh-l) - to enter",
                    "form": "Form I",
                    "person": "Second person masculine plural command",
                    "reason": "Direct command to the believers. Plural 'ū' addresses everyone.",
                    "practical": "Command form: 'Enter!' From root 'dakhala' (to enter). The '-ū' makes it plural: 'You all enter!' This is a command to believers: ENTER! But enter into what?..."
                }
            },
            {
                "arabic": "فِى",
                "transliteration": "fī",
                "translation": "in / into",
                "grammar": {
                    "type": "Harf - Preposition",
                    "function": "Shows what to enter into",
                    "practical": "Preposition 'in' or 'into' - shows WHERE/WHAT to enter."
                }
            },
            {
                "arabic": "ٱلسِّلْمِ",
                "transliteration": "s-silmi",
                "translation": "Islam / peace / submission",
                "grammar": {
                    "type": "Ism - Noun",
                    "root": "س-ل-م (s-l-m) - to be safe, to submit, to have peace",
                    "case": "Genitive (majrūr) after 'fī'",
                    "gender": "Masculine",
                    "reason": "'Silm' means Islam/peace/submission - all from same root. Here it means complete Islam.",
                    "practical": "Means 'Islam' or 'peace' or 'submission'. From root 'salima' (to be safe/peaceful). 'Silm' and 'Islām' share the same root - both mean submission to Allah and the peace that comes from it. The 'i' ending shows genitive case. Command: 'Enter INTO ISLAM' - meaning practice Islam COMPLETELY, not partially!"
                }
            },
            {
                "arabic": "كَآفَّةًۭ",
                "transliteration": "kāffatan",
                "translation": "entirely / completely / all together",
                "grammar": {
                    "type": "Ism - Adverb/State (Ḥāl)",
                    "root": "ك-ف-ف (k-f-f) - to restrain, to hold back, to encompass",
                    "case": "Accusative with tanwīn (as ḥāl)",
                    "reason": "Describes HOW to enter - completely, entirely, all aspects. The tanwīn 'an' shows it's a ḥāl (state/manner).",
                    "practical": "Means 'all together' or 'completely' or 'wholeheartedly'. From root 'kaffa' (to encompass/restrain). 'Kāffah' means 'all of it' or 'entirely'. The '-an' tanwīn shows it's an adverb describing the MANNER: enter Islam COMPLETELY, WHOLEHEARTEDLY! Don't pick and choose - embrace ALL of Islam! This is crucial: you can't say 'I like prayer but not fasting' - enter Islam ENTIRELY!"
                }
            },
            {
                "arabic": "وَ",
                "transliteration": "wa",
                "translation": "and",
                "grammar": {
                    "type": "Harf - Conjunction",
                    "practical": "Adds a prohibition after the command."
                }
            },
            {
                "arabic": "لَا",
                "transliteration": "lā",
                "translation": "do not",
                "grammar": {
                    "type": "Harf - Negation/Prohibition Particle",
                    "function": "Prohibits the following verb",
                    "practical": "Prohibition particle 'do not' - with present tense verb creates prohibition."
                }
            },
            {
                "arabic": "تَتَّبِعُوا۟",
                "transliteration": "tattabiʿū",
                "translation": "follow / pursue",
                "grammar": {
                    "type": "Fiʿl - Present Tense Verb (Jussive mood)",
                    "root": "ت-ب-ع (t-b-ʿ) - to follow",
                    "form": "Form VIII",
                    "person": "Second person masculine plural",
                    "mood": "Jussive (after 'lā' prohibition)",
                    "reason": "Form VIII adds intensity - to follow closely/persistently. Jussive mood with 'lā' creates prohibition.",
                    "practical": "Means 'follow' or 'pursue'. From root 'tabiʿa' (to follow). Form VIII 'ittabaʿa' means to follow closely/persistently. With 'lā' before it: 'lā tattabiʿū' = 'do NOT follow'. The '-ū' is plural. Don't follow what?..."
                }
            },
            {
                "arabic": "خُطُوَٰتِ",
                "transliteration": "khuṭuwāti",
                "translation": "footsteps / steps",
                "grammar": {
                    "type": "Ism - Noun (Object, in construct)",
                    "root": "خ-ط-و (kh-ṭ-w) - to step, to stride",
                    "case": "Accusative (as object of verb)",
                    "number": "Plural",
                    "reason": "The object of 'tattabiʿū' - WHAT not to follow. 'Khuṭuwāt' is plural of 'khuṭwah' (step). In construct with next word.",
                    "practical": "Means 'footsteps' or 'steps'. Plural of 'khuṭwah' (a step). Accusative case (object of the verb). In construct form: 'footsteps OF...' whose footsteps? The next word reveals..."
                }
            },
            {
                "arabic": "ٱلشَّيْطَـٰنِ",
                "transliteration": "sh-shayṭāni",
                "translation": "Satan / the devil",
                "grammar": {
                    "type": "Ism - Proper Noun in Genitive",
                    "root": "ش-ط-ن (sh-ṭ-n) - to be distant, to rebel",
                    "case": "Genitive (majrūr) in iḍāfah",
                    "reason": "Completes the construct - the footsteps OF SATAN. Genitive in possessive construction.",
                    "practical": "Shaytān (Satan/Devil) in genitive case. From root meaning 'to be distant' (from Allah's mercy) or 'to rebel'. Complete phrase: 'footsteps of Satan' - meaning Satan's path, his methods, his ways. 'Don't follow Satan's footsteps' means don't even take small steps toward evil - each sin is a 'step' in Satan's path!"
                }
            },
            {
                "arabic": "إِنَّهُۥ",
                "transliteration": "innahu",
                "translation": "indeed he / verily he",
                "grammar": {
                    "type": "Harf + Ism - Emphatic Particle + Pronoun",
                    "components": "inna (indeed/verily) + hu (he)",
                    "reason": "'Inna' adds emphasis. With pronoun 'hu' refers to Satan. Introduces strong statement.",
                    "practical": "'Inna' (indeed/verily) + 'hu' (he) = 'indeed he' or 'verily he'. 'Inna' is an emphatic particle that adds certainty and emphasis. Referring to Satan: 'Indeed HE (Satan)...' - strong statement about Satan's nature coming..."
                }
            },
            {
                "arabic": "لَكُمْ",
                "transliteration": "lakum",
                "translation": "for you / to you",
                "grammar": {
                    "type": "Harf + Ism - Preposition + Pronoun",
                    "components": "la (for/to) + kum (you plural)",
                    "practical": "'La' (for/to) + 'kum' (you all) = 'for you' or 'to you'. He is FOR YOU - meaning in relation to you..."
                }
            },
            {
                "arabic": "عَدُوٌّۭ",
                "transliteration": "ʿaduwwun",
                "translation": "an enemy",
                "grammar": {
                    "type": "Ism - Noun (Predicate)",
                    "root": "ع-د-و (ʿ-d-w) - to be hostile, to transgress",
                    "form": "Faʿūl pattern - intensive",
                    "case": "Nominative with tanwīn",
                    "reason": "The predicate - WHAT Satan is. The 'faʿūl' pattern shows intensity - a STRONG enemy.",
                    "practical": "Means 'enemy'. From root 'ʿadā' (to be hostile). The pattern 'faʿūl' (like 'ʿaduww') shows an intense, persistent quality - not just any enemy, but a FIERCE, RELENTLESS enemy! The 'un' tanwīn adds indefiniteness and emphasis. Satan is AN ENEMY - a terrible one!"
                }
            },
            {
                "arabic": "مُّبِينٌۭ",
                "transliteration": "mubīnun",
                "translation": "clear / manifest / evident",
                "grammar": {
                    "type": "Ism - Adjective/Participle (Ism Fāʿil)",
                    "root": "ب-ي-ن (b-y-n) - to be clear, to clarify",
                    "form": "Form IV active participle",
                    "case": "Nominative with tanwīn",
                    "reason": "Describes the type of enemy - a CLEAR, MANIFEST enemy. Everyone should recognize his enmity.",
                    "practical": "Means 'clear' or 'manifest' or 'evident'. From root 'bayyana' (to clarify). Form IV active participle 'mubīn' means 'making clear' or 'being obvious'. Complete description: 'an enemy, CLEAR/MANIFEST'. Meaning Satan's enmity is OBVIOUS - no doubt about it! He's not a hidden enemy - his hatred for humans is CLEAR and EVIDENT! Complete verse: Enter Islam completely, don't follow Satan's path, because he is your CLEAR, MANIFEST enemy!"
                }
            }
        ]
    }
]

# Add all remaining verses to data
data['verses'].extend(remaining_verses)

# Save
with open('surah-2-grammar-verses-201-225.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Added {len(remaining_verses)} verses successfully!")
print(f"Total verses now: {len(data['verses'])}")
print(f"Verses completed: {data['verses'][0]['verse']} to {data['verses'][-1]['verse']}")
