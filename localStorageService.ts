import { Student, User } from './types';

const STORAGE_KEY_USERS = 'phonicstrack_users';
const STORAGE_KEY_STUDENTS = 'phonicstrack_students';
const STORAGE_KEY_CURRENT_USER = 'phonicstrack_current_user';

export interface StoredUser {
  uid: string;
  name: string;
  email: string;
  password: string; // hashed in production, plain for MVP
}

// Simple in-memory store for current user (cleared on browser refresh)
let currentUser: User | null = null;

// Initialize stored data if needed
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY_USERS)) {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEY_STUDENTS)) {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify([]));
  }
};

export const localStorageService = {
  // Auth methods
  register: (name: string, email: string, password: string): User => {
    initializeStorage();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]') as StoredUser[];
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: StoredUser = { uid, name, email, password };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

    currentUser = { uid, name, email };
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(currentUser));
    return currentUser;
  },

  login: (email: string, password: string): User => {
    initializeStorage();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY_USERS) || '[]') as StoredUser[];
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

    currentUser = { uid: user.uid, name: user.name, email: user.email };
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
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_STUDENTS);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    currentUser = null;
  }
};
