export interface PhonicsSkill {
  id: string;
  label: string;
  category: string; // e.g., "satpin", "mdgocf"
}

export interface HFWSet {
  id: string;
  name: string;
  words: string[];
}

export interface Student {
  id: string;
  name: string;
  lastAssessmentDate: string; // ISO date string
  phonicsMastery: Record<string, boolean>; // key is PhonicsSkill.id
  hfwMastery: Record<string, boolean>; // key is "set_word"
}

export interface User {
  name: string;
  email: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ASSESSMENT = 'ASSESSMENT',
  HFW = 'HFW',
  CLASS_OVERVIEW = 'CLASS_OVERVIEW',
  ABOUT = 'ABOUT'
}

export interface PhonicsCategory {
  id: string;
  name: string;
  skills: PhonicsSkill[];
}