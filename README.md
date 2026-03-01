
# PhonicsTrack - Local Assessment Platform

A 100% local, offline-capable reading assessment platform for elementary teachers to track student mastery of phonics skills and high-frequency words. All data is stored locally—no external APIs or internet connection required.

## Quick Start

### Web Browser
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Desktop App (Electron)
```bash
npm install
npm run electron:dev          # Development mode
npm run make                  # Build distributable
```

## Core Features

- ✅ **Passcode-only authentication** (no email/password needed)
- ✅ **Multi-student tracking** per teacher
- ✅ **Phonics skills assessment** (SATPIN through Long Vowels)
- ✅ **Sight words (HFW)** tracking
- ✅ **Student dashboards** with progress visualization
- ✅ **Class matrix overview** with priority sorting
- ✅ **CSV export** (summary, detailed, per-student)
- ✅ **Remove/delete students** from class list
- ✅ **100% offline capable** 
- ✅ **Bundled PDF resources** (Word Lists & Flashcards)
- ✅ Zero external dependencies

## Data Storage

### Current: Browser LocalStorage

- **All data stored locally** in browser cache (~5-10 MB available)
- **Persists automatically** across sessions and restarts
- **Survives** logout and app closure
- **Data loss only if** user manually clears browser cache/data

**Advantages:**
- Works in any web browser with zero setup
- No file management needed
- Simple, proven, reliable approach
- Suitable for most classroom deployments

**Limitations:**
- Browser-specific (can't sync to other devices)
- Cleared if user clears browser cache/cookies
- No built-in multi-device sync

**For Multi-Device Use:** Export data to CSV and transfer to other computers.

### File-Based Storage (Not Currently Implemented)

Could add JSON file persistence for Electron version if needed in future. Would store data in `~/Documents/PhonicsTrack/`. Not needed now as LocalStorage is adequate.

## Export & Backup

### CSV Export Options

1. **Student Export** - Individual student's complete assessment record
2. **Class Summary** - One row per student with mastery %
3. **Detailed Export** - All students × all skills grid

### Manual Backup

Open DevTools (F12) → Console:
```javascript
copy(JSON.stringify(localStorage, null, 2))
// Paste into text file to save
```

## Authentication

### First Use: Set Passcode
1. Enter your name
2. Create 4+ character passcode
3. Confirm → Access granted

### Regular Login
Simply enter your passcode.

**Note:** No email needed. Passcode stored in LocalStorage.

## Curriculum

### Phonics Categories
- SATPIN (8 skills)
- MDGOCF (7 skills)
- KERU (7 skills)
- Digraphs 1 (7 skills)
- Long Vowels (8 skills)

### High-Frequency Words
- 4 word sets (~40 words total)

**To expand:** Edit `src/constants.ts`

## Building

```bash
npm run dev                  # Web development
npm run build               # Web production
npm run electron:dev        # Electron development
npm run make                # Build installers
```

## Project Structure

```
components/
  - AuthView.tsx
  - StudentSnapshot.tsx
  - AssessmentInterface.tsx
  - ClassOverview.tsx
  - AboutView.tsx

src/
  - App.tsx
  - types.ts
  - constants.ts
  - localStorageService.ts
  - exportService.ts
```

---

**Created:** Aaron Johnson | **Last Updated:** March 2026
