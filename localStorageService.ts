import { Student, User } from './types';

const STORAGE_KEY_PASSCODE = 'phonicstrack_passcode';
const STORAGE_KEY_TEACHER_NAME = 'phonicstrack_teacher_name';
const STORAGE_KEY_RECOVERY_Q = 'phonicstrack_recovery_question';
const STORAGE_KEY_RECOVERY_A = 'phonicstrack_recovery_answer';
const STORAGE_KEY_STUDENTS = 'phonicstrack_students';
const STORAGE_KEY_CURRENT_USER = 'phonicstrack_current_user';

// Simple in-memory store for current user (cleared on browser refresh)
let currentUser: User | null = null;

// Initialize stored data if needed
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY_STUDENTS)) {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify([]));
  }
};

export const localStorageService = {
  // Check if passcode has been set
  isPasscodeSet: (): boolean => {
    return localStorage.getItem(STORAGE_KEY_PASSCODE) !== null;
  },

  // Set passcode (first time use)
  setPasscode: (name: string, passcode: string): User => {
    initializeStorage();
    
    if (localStorageService.isPasscodeSet()) {
      throw new Error('Passcode already set');
    }

    if (!passcode || passcode.length < 4) {
      throw new Error('Passcode must be at least 4 characters');
    }

    localStorage.setItem(STORAGE_KEY_PASSCODE, passcode);
    localStorage.setItem(STORAGE_KEY_TEACHER_NAME, name);

    const uid = `teacher_${Date.now()}`;
    currentUser = { uid, name, isAuthenticated: true };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    return currentUser;
  },

  // Set passcode with recovery question and answer (first-time setup)
  setPasscodeWithRecovery: (name: string, passcode: string, recoveryQuestion: string, recoveryAnswer: string): User => {
    initializeStorage();

    if (localStorageService.isPasscodeSet()) {
      throw new Error('Passcode already set');
    }

    if (!passcode || passcode.length < 4) {
      throw new Error('Passcode must be at least 4 characters');
    }

    localStorage.setItem(STORAGE_KEY_PASSCODE, passcode);
    localStorage.setItem(STORAGE_KEY_TEACHER_NAME, name);
    localStorage.setItem(STORAGE_KEY_RECOVERY_Q, recoveryQuestion || '');
    localStorage.setItem(STORAGE_KEY_RECOVERY_A, recoveryAnswer || '');

    const uid = `teacher_${Date.now()}`;
    currentUser = { uid, name, isAuthenticated: true };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    return currentUser;
  },

  // Login with passcode
  login: (passcode: string): User => {
    initializeStorage();
    
    if (!localStorageService.isPasscodeSet()) {
      throw new Error('No passcode set yet');
    }

    const storedPasscode = localStorage.getItem(STORAGE_KEY_PASSCODE);
    if (passcode !== storedPasscode) {
      throw new Error('Incorrect passcode');
    }

    const name = localStorage.getItem(STORAGE_KEY_TEACHER_NAME) || 'Teacher';
    const uid = `teacher_${Date.now()}`;
    currentUser = { uid, name, isAuthenticated: true };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    return currentUser;
  },

  // Recovery helpers
  isRecoverySet: (): boolean => {
    return localStorage.getItem(STORAGE_KEY_RECOVERY_Q) !== null && localStorage.getItem(STORAGE_KEY_RECOVERY_A) !== null;
  },

  getRecoveryQuestion: (): string | null => {
    return localStorage.getItem(STORAGE_KEY_RECOVERY_Q);
  },

  verifyRecoveryAnswer: (answer: string): boolean => {
    const stored = localStorage.getItem(STORAGE_KEY_RECOVERY_A);
    if (!stored) return false;
    return answer === stored;
  },

  // Reset passcode when recovery answer is validated
  resetPasscodeWithRecovery: (answer: string, newPasscode: string): User => {
    initializeStorage();
    if (!localStorageService.isRecoverySet()) {
      throw new Error('No recovery data set');
    }

    if (!localStorageService.verifyRecoveryAnswer(answer)) {
      throw new Error('Incorrect recovery answer');
    }

    if (!newPasscode || newPasscode.length < 4) {
      throw new Error('Passcode must be at least 4 characters');
    }

    localStorage.setItem(STORAGE_KEY_PASSCODE, newPasscode);

    const name = localStorage.getItem(STORAGE_KEY_TEACHER_NAME) || 'Teacher';
    const uid = `teacher_${Date.now()}`;
    currentUser = { uid, name, isAuthenticated: true };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    return currentUser;
  },

  logout: (): void => {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    if (currentUser) return currentUser;
    
    const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (stored) {
      try {
        currentUser = JSON.parse(stored);
        return currentUser;
      } catch {
        return null;
      }
    }
    return null;
  },

  // Get teacher name
  getTeacherName: (): string => {
    return localStorage.getItem(STORAGE_KEY_TEACHER_NAME) || 'Teacher';
  },

  // Update teacher name
  updateTeacherName: (name: string): void => {
    localStorage.setItem(STORAGE_KEY_TEACHER_NAME, name);
  },

  // Student methods
  getStudentsByUserId: (userId: string): Student[] => {
    initializeStorage();
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]') as Student[];
    return students.filter(s => s.userId === userId);
  },

  addStudent: (student: Omit<Student, 'id'>): Student => {
    initializeStorage();
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]') as Student[];
    const id = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newStudent: Student = { ...student, id };
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    return newStudent;
  },

  updateStudent: (student: Student): Student => {
    initializeStorage();
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]') as Student[];
    const index = students.findIndex(s => s.id === student.id);
    
    if (index === -1) {
      throw new Error('Student not found');
    }

    students[index] = student;
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    return student;
  },

  deleteStudent: (studentId: string): void => {
    initializeStorage();
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]') as Student[];
    const filtered = students.filter(s => s.id !== studentId);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(filtered));
  },

  // Batch operations
  addMultipleStudents: (studentsData: Omit<Student, 'id'>[]): Student[] => {
    initializeStorage();
    const students = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]') as Student[];
    
    const newStudents = studentsData.map(data => ({
      ...data,
      id: `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }));

    students.push(...newStudents);
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    return newStudents;
  },

  // Clear all data (for dev/testing)
  clearAllData: (): void => {
    localStorage.removeItem(STORAGE_KEY_PASSCODE);
    localStorage.removeItem(STORAGE_KEY_TEACHER_NAME);
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    currentUser = null;
  }
};
