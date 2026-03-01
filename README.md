
# PhonicsTrack - Local Assessment Platform

A 100% local, offline-capable reading assessment platform for elementary teachers to track student mastery of phonics skills and high-frequency words. All data is stored locally in browser storage—no external APIs or internet connection required.

## Run Locally

**Prerequisites:**  Node.js (v18+)

1. Install dependencies:
   ```
   npm install
   ```

2. Run the app:
   ```
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Data Storage

- **Local Only**: All student data and teacher profiles are stored in browser LocalStorage
- **No Cloud Sync**: Data never leaves your device
- **No Internet Required**: Works completely offline after initial setup
- **Browser Specific**: Each browser/device maintains separate data

## Building for Distribution

```
npm run build
```

This creates a production-optimized build ready for deployment as a standalone application.

## Features

- ✅ Teacher login/registration (local storage)
- ✅ Multi-student tracking
- ✅ Phonics skills assessment
- ✅ High-frequency words tracking
- ✅ Class overview reports
- ✅ 100% offline capable
- ✅ Zero external dependencies
```
