# Airtable Integration Setup

This app can sync word grammar data to Airtable for cloud backup and cross-device access.

## Features

- **Cloud Backup**: All word edits are automatically backed up to Airtable
- **Cross-Device Sync**: Edit on one device, access from another
- **Offline-First**: App works offline using PWA cache, syncs when online
- **Optional**: Works without Airtable configuration (local-only mode)

## Setup Instructions

### 1. Create an Airtable Account

1. Go to [airtable.com](https://airtable.com) and sign up
2. Create a new base (workspace)

### 2. Create the Table Structure

Create a table named `Quran_Words` with these fields:

| Field Name | Type | Description |
|------------|------|-------------|
| `surah_number` | Number | Surah number (1-114) |
| `ayah_number` | Number | Ayah number within the surah |
| `word_index` | Number | Word position in the ayah (0-based) |
| `arabic` | Single line text | Arabic word text |
| `transliteration` | Single line text | Romanized pronunciation |
| `translation` | Single line text | English meaning |
| `root` | Single line text | Arabic root letters |
| `root_explanation` | Long text | Root meaning explanation |
| `grammar_type` | Long text | Word type (verb, noun, etc.) |
| `grammar_details` | Long text | Detailed grammar analysis |
| `recitation_url` | URL | Audio recitation URL (optional) |
| `last_modified` | Date | Last edit timestamp |

### 3. Get Your API Credentials

#### Get API Key:
1. Go to [airtable.com/account](https://airtable.com/account)
2. Scroll down to "Personal access tokens"
3. Click "Generate token"
4. Give it a name (e.g., "Quran App")
5. Select scopes: `data.records:read` and `data.records:write`
6. Select your base
7. Click "Create token" and copy the token

#### Get Base ID:
1. Go to [airtable.com/api](https://airtable.com/api)
2. Select your base
3. In the URL, you'll see something like `https://airtable.com/appXXXXXXXXXXXXXX/api/docs`
4. The `appXXXXXXXXXXXXXX` part is your Base ID

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```
   VITE_AIRTABLE_API_KEY=your_personal_access_token_here
   VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
   ```

3. **IMPORTANT**: Never commit `.env` to git (it's in `.gitignore`)

### 5. Build and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## How It Works

### Automatic Sync
- When you edit a word using the "Word Editor", changes save locally first
- If Airtable is configured, changes automatically sync to the cloud
- A sync status indicator shows: "Syncing...", "✓ Synced", or "✗ Sync failed"

### Offline Mode
- App works 100% offline with PWA cache
- Edits are saved locally
- When online, they sync to Airtable automatically

### Visual Indicators
- **📊 Airtable enabled**: Shows when Airtable is properly configured
- **Sync status**: Shows during and after each save operation

## Troubleshooting

### "Airtable not configured"
- Check that `.env` file exists and has correct values
- Restart dev server after changing `.env`
- Make sure you're using `VITE_` prefix for environment variables

### "Sync failed: 401"
- Your API token is invalid or expired
- Generate a new personal access token

### "Sync failed: 404"
- Base ID is incorrect
- Make sure the table name is exactly `Quran_Words`

### Data Not Showing
- Airtable integration only stores new edits
- Existing hardcoded data stays in the app
- To migrate existing data, you'd need to export and import manually

## Security Notes

- **Never share your API key** publicly
- Keep `.env` file private
- For production deployment, use secure environment variable management
- Consider using Airtable's built-in sharing features for team access

## Alternative: Softr

Instead of direct Airtable API, you can use [Softr](https://softr.io) which provides:
- No-code admin interface built on top of Airtable
- User authentication
- Pre-built forms and views
- Easier for non-technical users

To use Softr:
1. Connect your Airtable base to Softr
2. Build a custom admin panel
3. Use Softr's API or forms for data entry
4. Keep the app's offline functionality intact

## Support

For issues or questions about Airtable integration, check:
- [Airtable API Documentation](https://airtable.com/developers/web/api/introduction)
- [Softr Documentation](https://docs.softr.io/)
