
# PhonicsTrack - Local Assessment Platform

A 100% local, offline-capable reading assessment platform for elementary teachers to track student mastery of phonics skills and high-frequency words. All data is stored locally in browser storage—no external APIs or internet connection required.

## Run Locally

**Prerequisites:**  Node.js (v18+) for development only; end users of the packaged desktop app need nothing installed.

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

For web deployment simply run:

```
npm run build
```

This creates a production-optimized build ready for static hosting.

### Electron Standalone (Windows `.exe`)

PhonicsTrack can be packaged as a desktop app using Electron. The UI is identical to the browser version and uses the same localStorage backend.

1. Install the additional dependencies (already listed in `package.json`):
   ```bash
   npm install
   ```
2. To run in development with live reload:
   ```bash
   npm run electron:dev
   ```
   This starts the vite dev server and opens an Electron window pointed at `http://localhost:3000`.
3. To build a platform-specific installer (e.g. Windows `.exe`) use Electron Forge:
   ```bash
   npm run make
   ```
   Forge will place artifacts in the `out/` directory by default. On Windows you will see an installer named like `PhonicsTrack Setup 0.0.0.exe`.

You can also simply start the packaged app with:

```
npm start
```

The `electron-main.js` file in the project root handles switching between development and production modes.


## Features

- ✅ Teacher login/registration (local storage)
- ✅ Multi-student tracking
- ✅ Phonics skills assessment
- ✅ High-frequency words tracking
- ✅ Class overview reports
- ✅ 100% offline capable
- ✅ Zero external dependencies
```
