# Copilot Instructions for PhonicsTrack

## Project Overview

PhonicsTrack is a 100% local reading assessment platform for elementary teachers to track student mastery of phonics skills and high-frequency words (HFW). It's a React/TypeScript SPA with Vite build system and LocalStorage backend.

**Key features:**
- Completely offline—no external APIs or internet required
- All data stored locally in browser LocalStorage
- Zero Firebase or Gemini dependencies

**Key commands:**
- `npm run dev` - Start Vite dev server on port 3000
- `npm run build` - Production build
- `npm run preview` - Preview built app

## Architecture

### Core Data Model

Three core entity types (all defined in [types.ts](types.ts)):
- **PhonicsCategory**: Groups phonics skills by learning progression (e.g., "SATPIN", "MDGOCF", "Digraphs1")
- **Student**: `phonicsMastery` and `hfwMastery` are keyed objects (not arrays) where keys are skill IDs and values are booleans
- **User**: Teacher profile; stored locally with email/password; students are filtered by `userId` for isolation

### Storage Architecture

**LocalStorage-based persistence** via [localStorageService.ts](localStorageService.ts):
- `phonicstrack_users` - Teacher accounts (email, hashed password, name)
- `phonicstrack_students` - All student records (scoped by `userId`)
- `phonicstrack_current_user` - Active session (cleared on logout)

All reads/writes are synchronous; no async networking calls.

### View Architecture (AppView Enum)

App.tsx manages a single `currentView` state that switches between 5 main views:
- `DASHBOARD` - Class overview with student cards
- `ASSESSMENT` - Modal interface for marking skills mastered/not mastered
- `HFW` - High-frequency words assessment tab
- `CLASS_OVERVIEW` - Aggregate class data visualization
- `ABOUT` - Info/help screen

Navigation driven by icon buttons in top UI bar; view-specific components in `components/` directory map 1:1 to most enum values.

## Data Persistence Pattern

**Assessment flow**: User toggles skills in AssessmentInterface → temporary state clone (via `JSON.parse(JSON.stringify())`) → onSave callback → parent calls `localStorageService.updateStudent()` → localStorage updated → UI re-renders.

**Loading pattern**: 
1. On mount: Check `localStorageService.getCurrentUser()` for existing session
2. If logged in → fetch `localStorageService.getStudentsByUserId(userId)`
3. First-time users auto-populated with mock data via `generateMockStudents()`
4. Data persisted to localStorage on every student change

**Key: Always include `userId` field when saving to ensure multi-teacher isolation.**

## Critical Conventions

### Mastery Objects as Maps
Phonics/HFW mastery stored as `Record<string, boolean>`, not arrays. Skill ID is the key:
```typescript
phonicsMastery: { 'sat': true, 'pin': false, 'pat': true }
hfwMastery: { 'satpin_set1_the': true, 'satpin_set1_a': false }
```
When adding new skills: extend constants.ts PHONICS_DATA/HFW_SETS, then seed new students with mock data that auto-generates mastery maps.

### Component Props Pattern
Assessment/view components receive:
- Complete student object (not just ID)
- Callback handlers: `onSave(updatedStudent)`, `onCancel()`
- Parent owns localStorage write logic

Avoid passing just IDs; fetch data upstream in App.tsx.

### UI Library Stack
- **Icons**: lucide-react (`import { IconName } from 'lucide-react'`)
- **Charts**: recharts (used in ClassOverview for progress visualization)
- **Styling**: Tailwind CSS utility classes (no separate CSS files)
- **React version**: 19.2.3 with React DOM
- **No external APIs or CDNs**: Everything bundled locally

### Constants Organization
- [constants.ts](constants.ts): Master phonics categories/HFW sets used to build mastery maps
- Changes to phonics curriculum → update PHONICS_DATA array structure
- All skill IDs must be unique and match keys in mastery objects

## Common Tasks

**Add a new view**: 
1. Add enum to AppView in types.ts
2. Create component in components/ folder
3. Add route logic in App.tsx (handle view toggle + pass required props)
4. Add navigation button in top bar

**Track new skill type**:
1. Extend Student interface (e.g., `ordeepMastery: Record<string, boolean>`)
2. Expand generateMockStudents() to populate it
3. Update relevant assessment components to toggle new property

**Debug local data**: Open browser DevTools → Application → LocalStorage → Check `phonicstrack_*` keys. All data is human-readable JSON.

**Export/backup data**: Call `JSON.stringify(localStorage)` in console to backup all app data.

## File Structure Reference

- `App.tsx` - Main app component, view routing, localStorage syncing
- `localStorageService.ts` - LocalStorage persistence API (auth + student CRUD)
- `types.ts` - TypeScript interfaces (Student, User, PhonicsCategory, AppView)
- `constants.ts` - Phonics categories, HFW sets curricula data
- `components/AssessmentInterface.tsx` - Assessment modal; handles toggling phonics/HFW mastery
- `components/AuthView.tsx` - Local auth UI (register/login with email/password)
- `components/ClassOverview.tsx` - Aggregate visualizations (uses recharts)
- `components/StudentSnapshot.tsx` - Individual student card/preview
- `vite.config.ts` - Build config; serves port 3000, Vite React plugin

## Deployment & Distribution

Since PhonicsTrack is 100% local with no external dependencies:
- Use `npm run build` to create optimized static bundle
- Bundle can be deployed as a standalone web app, Electron app, or PWA
- Electron packaging is supported using **Electron Forge** (see `electron-main.js` and scripts `electron:dev`/`make`)
- No backend server required—just serve the static assets
- Works offline immediately after loading in browser or Electron window

