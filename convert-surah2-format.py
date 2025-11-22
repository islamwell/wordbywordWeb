#!/usr/bin/env python3
"""
Convert Surah 2 grammar JSON to the app's format
"""
import json

# Read verses 1-3
with open('surah-2-grammar.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Read verses 4-10
with open('surah-2-verses-4-25.json', 'r', encoding='utf-8') as f:
    verses_4_plus = json.load(f)

# Get verses 4-10 only
verses_4_to_10 = [v for v in verses_4_plus if v['verse'] <= 10]

# Combine all verses 1-10
all_verses = data['verses'] + verses_4_to_10

# Convert to app format
app_format_ayat = []

for verse in all_verses:
    ayah = {
        'ayahNumber': verse['verse'],
        'arabic': verse['arabic'],
        'transliteration': verse['transliteration'],
        'translation': verse['translation'],
        'recitationUrl': f'https://everyayah.com/data/Nasser_Alqatami_128kbps/002{verse["verse"]:03d}.mp3',
        'words': []
    }

    for word in verse['words']:
        grammar_obj = word['grammar']

        # Combine reason and practical for comprehensive explanation
        full_grammar = grammar_obj.get('practical', '') or grammar_obj.get('reason', '')

        word_formatted = {
            'arabic': word['arabic'],
            'transliteration': word['transliteration'],
            'translation': word['translation'],
            'analysis': {
                'type': grammar_obj.get('type', ''),
                'root': grammar_obj.get('root', 'N/A'),
                'rootExplanation': grammar_obj.get('reason', ''),
                'grammar': full_grammar
            }
        }
        ayah['words'].append(word_formatted)

    app_format_ayat.append(ayah)

# Create the surah object
surah_2_data = {
    'surahNumber': 2,
    'surahName': 'Al-Baqarah',
    'ayat': app_format_ayat
}

# Output as formatted JavaScript
print("    2: {")
print(f"        surahNumber: {surah_2_data['surahNumber']},")
print(f"        surahName: \"{surah_2_data['surahName']}\",")
print("        ayat: [")

for i, ayah in enumerate(surah_2_data['ayat']):
    print(f"            {{ ayahNumber: {ayah['ayahNumber']}, ", end='')
    print(f"arabic: '{ayah['arabic']}', ", end='')
    print(f"transliteration: '{ayah['transliteration']}', ", end='')
    print(f"translation: '{ayah['translation']}', ", end='')
    print(f"recitationUrl: '{ayah['recitationUrl']}', ", end='')
    print("words: [")

    for j, word in enumerate(ayah['words']):
        # Escape single quotes in strings
        word_str = json.dumps(word).replace('"', "'").replace("'", "\\'")
        # Convert back to use single quotes for the object
        word_str = word_str.replace("\\'", "'")
        word_str = "{" + word_str[1:-1] + "}"  # Keep object brackets

        comma = "," if j < len(ayah['words']) - 1 else ""
        print(f"                {word_str}{comma}")

    closing_comma = "," if i < len(surah_2_data['ayat']) - 1 else ""
    print(f"            ]}}{closing_comma}")

print("        ]")
print("    },")
