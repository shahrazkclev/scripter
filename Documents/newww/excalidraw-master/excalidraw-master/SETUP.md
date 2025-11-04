# Quick Setup Guide

## Prerequisites

1. Supabase project: `cleverbot` (qykhelmsirldtvwjixuo)
   - URL: `https://qykhelmsirldtvwjixuo.supabase.co`
   - Anon key: Get from Supabase dashboard

2. Create Storage Bucket in Supabase:
   - Go to Supabase Dashboard → Storage
   - Create bucket: `excalidraw-files`
   - Set to public or configure RLS policies

## Environment Variables

Create a `.env` file in `excalidraw-app/` directory:

```env
VITE_SUPABASE_URL=https://qykhelmsirldtvwjixuo.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Installation

```bash
cd excalidraw-app
yarn install
```

## Development

```bash
yarn start
```

## Build for Production

```bash
yarn build
```

## Deployment to Netlify

1. Connect your GitHub repository (`shahrazkclev/scripter`)
2. Set build command: `yarn build`
3. Set publish directory: `excalidraw-app/build`
4. Add environment variables in Netlify dashboard (see `.env.example`)

## What's Changed

- ✅ Supabase database integration added
- ✅ Storage abstraction layer (Supabase + Firebase fallback)
- ✅ Netlify configuration added
- ✅ All Firebase calls now use abstraction layer
- ✅ Database schema created in Supabase
- ✅ Ready for deployment

## Next Steps

1. Get your Supabase anon key from dashboard
2. Create the `excalidraw-files` storage bucket
3. Add environment variables to Netlify
4. Deploy!
