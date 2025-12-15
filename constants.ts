import { PhonicsCategory, HFWSet } from './types';

export const PHONICS_DATA: PhonicsCategory[] = [
  {
    id: 'satpin',
    name: 'SATPIN (Foundation)',
    skills: [
      { id: 'sat', label: 'sat', category: 'satpin' },
      { id: 'pin', label: 'pin', category: 'satpin' },
      { id: 'pat', label: 'pat', category: 'satpin' },
      { id: 'tap', label: 'tap', category: 'satpin' },
      { id: 'sip', label: 'sip', category: 'satpin' },
      { id: 'tip', label: 'tip', category: 'satpin' },
      { id: 'nap', label: 'nap', category: 'satpin' },
      { id: 'ant', label: 'ant', category: 'satpin' },
    ]
  },
  {
    id: 'mdgocf',
    name: 'MDGOCF',
    skills: [
      { id: 'map', label: 'map', category: 'mdgocf' },
      { id: 'mat', label: 'mat', category: 'mdgocf' },
      { id: 'dam', label: 'dam', category: 'mdgocf' },
      { id: 'dip', label: 'dip', category: 'mdgocf' },
      { id: 'dig', label: 'dig', category: 'mdgocf' },
      { id: 'dog', label: 'dog', category: 'mdgocf' },
      { id: 'cat', label: 'cat', category: 'mdgocf' },
    ]
  },
  {
    id: 'keru',
    name: 'KERU',
    skills: [
      { id: 'pen', label: 'pen', category: 'keru' },
      { id: 'ten', label: 'ten', category: 'keru' },
      { id: 'net', label: 'net', category: 'keru' },
      { id: 'men', label: 'men', category: 'keru' },
      { id: 'red', label: 'red', category: 'keru' },
      { id: 'sun', label: 'sun', category: 'keru' },
      { id: 'run', label: 'run', category: 'keru' },
    ]
  },
  {
    id: 'digraphs1',
    name: 'Digraphs 1 (ck, th, wh)',
    skills: [
      { id: 'back', label: 'back', category: 'digraphs1' },
      { id: 'sack', label: 'sack', category: 'digraphs1' },
      { id: 'thick', label: 'thick', category: 'digraphs1' },
      { id: 'thin', label: 'thin', category: 'digraphs1' },
      { id: 'that', label: 'that', category: 'digraphs1' },
      { id: 'whip', label: 'whip', category: 'digraphs1' },
      { id: 'when', label: 'when', category: 'digraphs1' },
    ]
  },
  {
    id: 'longvowels',
    name: 'Long Vowels (ai, ee, ie, oa)',
    skills: [
      { id: 'play', label: 'play', category: 'longvowels' },
      { id: 'rain', label: 'rain', category: 'longvowels' },
      { id: 'see', label: 'see', category: 'longvowels' },
      { id: 'tree', label: 'tree', category: 'longvowels' },
      { id: 'pie', label: 'pie', category: 'longvowels' },
      { id: 'light', label: 'light', category: 'longvowels' },
      { id: 'boat', label: 'boat', category: 'longvowels' },
      { id: 'snow', label: 'snow', category: 'longvowels' },
    ]
  }
];

export const HFW_SETS: HFWSet[] = [
  {
    id: 'set1',
    name: 'Set 1',
    words: ['and', 'for', 'the', 'is', 'of', 'a', 'I', 'my', 'are', 'was']
  },
  {
    id: 'set2',
    name: 'Set 2',
    words: ['all', 'to', 'said', 'says', 'she', 'he', 'we', 'me', 'with', 'what', 'you', 'your']
  },
  {
    id: 'set3',
    name: 'Set 3',
    words: ["I'm", 'have', 'went', 'be', 'like', 'so', 'were', 'go', 'little', 'as', 'no', 'one']
  },
  {
    id: 'set4',
    name: 'Set 4',
    words: ['into', 'now', 'came', 'oh', 'about', 'there', 'their', 'these', 'people', 'put']
  }
];

// Helper to flatten skills for easy lookup
export const ALL_SKILLS = PHONICS_DATA.flatMap(c => c.skills);
