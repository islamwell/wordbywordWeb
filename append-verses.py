#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to append remaining verses 206-225 to surah-2-grammar-verses-201-225.json
"""

import json

# Read existing data
with open('surah-2-grammar-verses-201-225.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Verse 206 data
verse_206 = {
    "verse": 206,
    "arabic": "وَإِذَا قِيلَ لَهُ ٱتَّقِ ٱللَّهَ أَخَذَتْهُ ٱلْعِزَّةُ بِٱلْإِثْمِ ۚ فَحَسْبُهُۥ جَهَنَّمُ ۚ وَلَبِئْسَ ٱلْمِهَادُ",
    "transliteration": "Wa-idhā qīla lahu ittaqi l-laha akhadhathu l-ʿizatu bil-ithmi faḥasbuhu jahannamu walabi'sa l-mihādu",
    "translation": "When it is said to them, 'Fear Allah,' pride carries them off to sin. Hell will be their proper place. What an evil place to rest!",
    "words": [
        {
            "arabic": "وَ",
            "transliteration": "wa",
            "translation": "and",
            "grammar": {
                "type": "Harf - Conjunction",
                "practical": "Continues the description of the hypocrite from verses 204-205."
            }
        },
        {
            "arabic": "إِذَا",
            "transliteration": "idhā",
            "translation": "when",
            "grammar": {
                "type": "Harf - Conditional/Temporal Particle",
                "function": "Introduces time condition",
                "practical": "Temporal particle 'when' - sets up another scenario about this hypocrite."
            }
        },
        {
            "arabic": "قِيلَ",
            "transliteration": "qīla",
            "translation": "it is said / it was said",
            "grammar": {
                "type": "Fiʿl - Past Passive Verb (Fiʿl Māḍī Majhūl)",
                "root": "ق-و-ل (q-w-l) - to say",
                "form": "Form I passive",
                "person": "Third person masculine singular passive",
                "tense": "Past passive",
                "reason": "Passive voice - 'it is said' (by someone unspecified). Describes when advice is given to him.",
                "practical": "Passive form meaning 'it was said' or 'it is said'. From root 'qāla' (to say). Passive pattern makes the sayer unspecified - the focus is on what is SAID to him, not who says it. When advice is given to this hypocrite..."
            }
        },
        {
            "arabic": "لَهُ",
            "transliteration": "lahu",
            "translation": "to him",
            "grammar": {
                "type": "Harf + Ism - Preposition + Pronoun",
                "components": "la (to/for) + hu (him)",
                "practical": "'La' (to) + 'hu' (him) = 'to him'. Shows WHO the advice is directed to - to this hypocrite."
            }
        },
        {
            "arabic": "ٱتَّقِ",
            "transliteration": "ittaqi",
            "translation": "fear / be conscious of / have taqwa",
            "grammar": {
                "type": "Fiʿl - Command/Imperative Verb",
                "root": "و-ق-ي (w-q-y) - to protect, to fear, to be conscious",
                "form": "Form VIII imperative",
                "person": "Second person masculine singular command",
                "reason": "Direct command to have taqwā - the actual words spoken to him. Imperative form shows it's advice/command.",
                "practical": "Command form: 'Fear!' or 'Have taqwā!' From root 'waqā'. Form VIII 'ittaqā' means 'to have taqwā/God-consciousness'. This is the sincere advice given to him: 'Fear Allah!' But watch his reaction..."
            }
        },
        {
            "arabic": "ٱللَّهَ",
            "transliteration": "Allāha",
            "translation": "Allah",
            "grammar": {
                "type": "Ism - Proper Noun (Object)",
                "case": "Accusative",
                "practical": "Allah in accusative case - the object of taqwā. 'Fear ALLAH!' Complete advice: when someone tells him 'Fear Allah!'..."
            }
        },
        {
            "arabic": "أَخَذَتْهُ",
            "transliteration": "akhadhathu",
            "translation": "it seizes him / it takes him",
            "grammar": {
                "type": "Fiʿl - Past Tense Verb with Pronoun",
                "root": "أ-خ-ذ (a-kh-dh) - to take, to seize",
                "form": "Form I",
                "person": "Third person feminine singular with object pronoun",
                "components": "akhadhat (she/it took) + hu (him)",
                "tense": "Past",
                "reason": "Describes what happens to him when advised. The feminine 't' refers to 'izzah (pride) which comes next. The 'hu' is the object - pride takes HIM.",
                "practical": "Means 'it seized him' or 'it took him'. From 'akhadha' (to take/seize). 'Akhadhat' = 'she/it took' (feminine), 'hu' = 'him'. Together: 'it seized him'. What seizes him? Explained next..."
            }
        },
        {
            "arabic": "ٱلْعِزَّةُ",
            "transliteration": "l-ʿizatu",
            "translation": "the pride / the arrogance",
            "grammar": {
                "type": "Ism - Noun (Subject/Fāʿil)",
                "root": "ع-ز-ز (ʿ-z-z) - to be mighty, to be proud",
                "case": "Nominative (marfūʿ)",
                "gender": "Feminine",
                "reason": "The subject - PRIDE is what seizes him. Normally 'ʿizzah' means honor/might, but here with sin it means false pride/arrogance. Nominative as the doer.",
                "practical": "Means 'the pride' or 'the arrogance'. From root 'ʿazza' (to be mighty/proud). 'ʿIzzah' normally means honor or might, but here it's FALSE pride - arrogance. When told to fear Allah, instead of accepting the advice humbly, PRIDE seizes him! The 'u' ending shows it's the subject - pride is the doer."
            }
        },
        {
            "arabic": "بِٱلْإِثْمِ",
            "transliteration": "bil-ithmi",
            "translation": "with the sin / unto sin",
            "grammar": {
                "type": "Harf + Ism - Preposition + Noun",
                "root": "أ-ث-م (a-th-m) - to sin",
                "case": "Genitive after preposition 'bi'",
                "components": "bi (with/by) + al-ithm (the sin)",
                "reason": "'Bi' here means 'with' or 'leading to'. His pride leads him WITH/TO sin. Describes the consequence of his arrogance.",
                "practical": "'Bi' (with/by/to) + 'al-ithm' (the sin). 'Ithm' means sin or wrongdoing. The 'i' ending shows genitive (after 'bi'). This phrase shows the RESULT: pride takes him WITH SIN or LEADS him TO sin. Instead of fearing Allah when advised, his arrogance drives him deeper into sin! 'Bi' here indicates accompaniment or result."
            }
        },
        {
            "arabic": "فَحَسْبُهُۥ",
            "transliteration": "faḥasbuhu",
            "translation": "then sufficient for him / so enough for him",
            "grammar": {
                "type": "Harf + Ism - Particle + Noun with Pronoun",
                "root": "ح-س-ب (ḥ-s-b) - to suffice, to be enough",
                "components": "fa (so/then) + ḥasb (sufficiency) + hu (his/him)",
                "case": "Nominative (as mubtada')",
                "reason": "'Fa' introduces consequence. 'Ḥasb' means sufficiency/enough. With pronoun: 'sufficient for him'. This introduces his punishment.",
                "practical": "'Fa' (so/then) + 'ḥasb' (sufficiency/enough) + 'hu' (his/for him) = 'so sufficient for him' or 'then enough for him'. 'Ḥasb' comes from the root meaning 'to suffice'. This phrase introduces the consequence: 'So SUFFICIENT for him is...' What? The punishment mentioned next!"
            }
        },
        {
            "arabic": "جَهَنَّمُ",
            "transliteration": "jahannamu",
            "translation": "Hell / Hellfire",
            "grammar": {
                "type": "Ism - Proper Noun (Predicate/Khabar)",
                "case": "Nominative (marfūʿ)",
                "reason": "The predicate - WHAT is sufficient for him. Jahannam (Hell) is enough as his punishment. Nominative as the khabar.",
                "practical": "Jahannam - the name of Hell in Arabic. The 'u' ending shows nominative case as the predicate. Complete meaning: 'So sufficient for him is HELL' or 'Hell is enough for him'. Powerful statement: his arrogance when advised to fear Allah earns him Hell!"
            }
        },
        {
            "arabic": "وَ",
            "transliteration": "wa",
            "translation": "and",
            "grammar": {
                "type": "Harf - Conjunction",
                "practical": "Adds further emphasis about Hell."
            }
        },
        {
            "arabic": "لَبِئْسَ",
            "transliteration": "labi'sa",
            "translation": "indeed how evil / what a terrible",
            "grammar": {
                "type": "Harf + Fiʿl - Particle + Verb of Blame (Fiʿl Dhamm)",
                "root": "ب-ء-س (b-'-s) - to be evil, to be bad",
                "components": "la (indeed/certainly) + bi'sa (how evil)",
                "form": "Verb of blame - special construction",
                "reason": "'La' adds emphasis. 'Bi'sa' is a special verb used only for expressing blame/condemnation. Means 'how evil' or 'what a terrible'.",
                "practical": "'La' (indeed/verily) + 'bi'sa' (how evil/how terrible). 'Bi'sa' is a unique Arabic verb used ONLY to express condemnation - it's never used in any other context! It means 'How EVIL!' or 'What a TERRIBLE!' The 'la' at the beginning adds extra emphasis. Together: 'INDEED how evil!' or 'What a TERRIBLE!'. What is terrible? Explained next..."
            }
        },
        {
            "arabic": "ٱلْمِهَادُ",
            "transliteration": "l-mihādu",
            "translation": "the resting place / the bed / the abode",
            "grammar": {
                "type": "Ism - Noun (Tamyīz/Specification)",
                "root": "م-هـ-د (m-h-d) - to prepare, to make smooth, to cradle",
                "case": "Nominative (marfūʿ)",
                "gender": "Masculine",
                "reason": "Specifies WHAT is evil - the resting place (i.e., Hell). 'Mihād' literally means a prepared bed/resting place, ironically used for Hell.",
                "practical": "Means 'the resting place' or 'the bed' or 'the abode'. From root 'mahada' (to prepare/smooth out). 'Mihād' is a prepared, smooth bed - a place of rest. But here it's used IRONICALLY for Hell! Complete statement: 'What an EVIL resting place!' or 'How TERRIBLE a bed (Hell is)!' The irony is powerful: instead of a comfortable bed, his 'resting place' is the torment of Hell! This verse paints a complete picture: arrogant when advised, Hell as his reward, and what a terrible 'bed' he'll rest in!"
            }
        }
    ]
}

# Add verse 206
data['verses'].append(verse_206)

# Save the file
with open('surah-2-grammar-verses-201-225.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Verse 206 added successfully!")
print(f"Total verses now: {len(data['verses'])}")
