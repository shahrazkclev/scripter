# Excalidraw with Supabase Integration

This Excalidraw app has been integrated with Supabase for database and file storage, with automatic fallback to Firebase for backward compatibility.

## Setup

### 1. Supabase Configuration

The app uses your existing Supabase project (`cleverbot` - qykhelmsirldtvwjixuo).

**Environment Variables:**
```env
VITE_SUPABASE_URL=https://qykhelmsirldtvwjixuo.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Schema

The following table has been created in Supabase:

- **excalidraw_scenes**: Stores encrypted collaboration room scenes
  - `room_id` (TEXT, PRIMARY KEY)
  - `scene_version` (INTEGER)
  - `iv` (BYTEA) - Initialization vector for encryption
  - `ciphertext` (BYTEA) - Encrypted scene data
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

### 3. Storage Bucket

You need to create a Supabase Storage bucket named `excalidraw-files`:

1. Go to Supabase Dashboard → Storage
2. Create a new bucket: `excalidraw-files`
3. Make it public or configure appropriate policies
4. The bucket will store files in these paths:
   - `/files/shareLinks/{id}` - Shareable link files
   - `/files/rooms/{roomId}` - Collaboration room files
   - `/migrations/files/scenes/{id}` - Excalidraw+ export files

### 4. Row Level Security (RLS)

RLS has been enabled on `excalidraw_scenes` with a permissive policy. For production, you may want to add more restrictive policies based on `room_id` and user authentication.

## How It Works

### Storage Abstraction Layer

The app uses a storage abstraction layer (`excalidraw-app/data/storage.ts`) that:
- Automatically uses Supabase if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured
- Falls back to Firebase if Supabase is not available
- Provides seamless switching between backends

### Integration Points

1. **Scene Storage**: `saveScene()` / `loadScene()` - Stores encrypted collaboration room data
2. **File Storage**: `saveFiles()` / `loadFiles()` - Stores image files in Supabase Storage
3. **Version Tracking**: `isSceneSaved()` - Checks if scene is already saved

### Files Modified

- `excalidraw-app/data/supabase.ts` - New Supabase integration module
- `excalidraw-app/data/storage.ts` - Storage abstraction layer
- `excalidraw-app/data/index.ts` - Updated to use storage abstraction
- `excalidraw-app/collab/Collab.tsx` - Updated to use storage abstraction
- `excalidraw-app/App.tsx` - Updated to use storage abstraction
- `excalidraw-app/components/ExportToExcalidrawPlus.tsx` - Updated to use storage abstraction
- `excalidraw-app/package.json` - Added `@supabase/supabase-js` dependency
- `excalidraw-app/vite-env.d.ts` - Added Supabase environment variable types

## Deployment

### Netlify

The app is configured for Netlify deployment with `netlify.toml`:

```bash
# Build command
yarn build

# Publish directory
excalidraw-app/build
```

### Environment Variables in Netlify

Add these environment variables in Netlify dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_FIREBASE_CONFIG` (optional, for fallback)
- `VITE_APP_WS_SERVER_URL` (for collaboration)
- `VITE_APP_BACKEND_V2_GET_URL` (for shareable links)
- `VITE_APP_BACKEND_V2_POST_URL` (for shareable links)

## Migration from Firebase

The app maintains backward compatibility with Firebase. To fully migrate:

1. Set Supabase environment variables
2. Create the storage bucket in Supabase
3. Optionally migrate existing Firebase data to Supabase
4. Remove Firebase configuration once migration is complete

## Notes

- The encryption/decryption logic remains the same as Firebase implementation
- Real-time collaboration still uses Socket.IO WebSocket (unchanged)
- Local storage (IndexedDB/localStorage) remains unchanged
- Shareable links backend API remains unchanged
