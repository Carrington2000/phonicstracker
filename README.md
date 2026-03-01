
# PhonicsTrack - Local Assessment Platform

A 100% local, offline-capable reading assessment platform for elementary teachers to track student mastery of phonics skills and high-frequency words. All data is stored locally in browser storage—no external APIs or internet connection required.

## Run Locally
- Locate the .exe and Run

## Data Storage

- **Local Only**: All student data and teacher profiles are stored in browser LocalStorage
- **No Cloud Sync**: Data never leaves your device
- **No Internet Required**: Works completely offline after initial setup
- **Browser Specific**: Each browser/device maintains separate data

## Features

- ✅ Teacher login/registration (local storage)
- ✅ Multi-student tracking
- ✅ Phonics skills assessment
- ✅ High-frequency words tracking
- ✅ Class overview reports
- ✅ 100% offline capable
- ✅ Zero external dependencies

## Bundled Teacher Resources

- **Local PDFs:** This project includes two placeholder PDF assets in the `public/` folder: `word-lists.pdf` and `flashcards.pdf`.
- **Replace with real files:** To use your official Word Lists and Flashcards, replace the placeholder files in `public/word-lists.pdf` and `public/flashcards.pdf` with the real PDFs (keep the same filenames).

```


## Prerequisites
- Node.js (v18+) for development only; end users of the packaged desktop app need nothing installed.

1. Install dependencies:
   ```
   npm install
   ```

2. Run the app:
   ```
   npm run dev
   ```

3. Open http://localhost:3000 in your browser