import { Student } from './types';
import { PHONICS_DATA, HFW_SETS } from './constants';
import { localStorageService } from './localStorageService';

export const exportService = {
  // Export single student to CSV
  exportStudentToCSV: (student: Student): string => {
    const headers = ['Student Name', 'Last Assessment Date'];
    const data: string[] = [student.name, new Date(student.lastAssessmentDate).toLocaleDateString()];

    // Add phonics headers and data
    PHONICS_DATA.forEach(category => {
      category.skills.forEach(skill => {
        headers.push(`${category.name} - ${skill.label}`);
        data.push(student.phonicsMastery[skill.id] ? '✓ Mastered' : 'Not Yet');
      });
    });

    // Add HFW headers and data
    HFW_SETS.forEach(set => {
      set.words.forEach(word => {
        headers.push(`${set.name} - ${word}`);
        data.push(student.hfwMastery[`${set.id}_${word}`] ? '✓ Mastered' : 'Not Yet');
      });
    });

    // Create CSV string with proper escaping
    const csvHeaders = headers.map(h => `"${h}"`).join(',');
    const csvData = data.map(d => `"${d}"`).join(',');
    
    return `${csvHeaders}\n${csvData}`;
  },

  // Export all students to CSV
  exportAllStudentsToCSV: (students: Student[]): string => {
    if (students.length === 0) {
      return 'No student data to export';
    }

    const headers = ['Student Name', 'Last Assessment Date'];

    // Add phonics headers
    PHONICS_DATA.forEach(category => {
      category.skills.forEach(skill => {
        headers.push(`${category.name} - ${skill.label}`);
      });
    });

    // Add HFW headers
    HFW_SETS.forEach(set => {
      set.words.forEach(word => {
        headers.push(`${set.name} - ${word}`);
      });
    });

    // Build rows
    const rows: string[][] = [headers.map(h => `"${h}"`)];
    
    students.forEach(student => {
      const row: string[] = [
        student.name,
        new Date(student.lastAssessmentDate).toLocaleDateString()
      ];

      // Add phonics data
      PHONICS_DATA.forEach(category => {
        category.skills.forEach(skill => {
          row.push(student.phonicsMastery[skill.id] ? '✓ Mastered' : 'Not Yet');
        });
      });

      // Add HFW data
      HFW_SETS.forEach(set => {
        set.words.forEach(word => {
          row.push(student.hfwMastery[`${set.id}_${word}`] ? '✓ Mastered' : 'Not Yet');
        });
      });

      rows.push(row.map(r => `"${r}"`));
    });

    return rows.map(row => row.join(',')).join('\n');
  },

  // Export class summary (one row per student with progress percentages)
  exportClassSummaryToCSV: (students: Student[]): string => {
    const headers = ['Student Name', 'Last Assessment', 'Days Since Assessment', 'Phonics Mastery %', 'HFW Mastery %'];
    const rows: string[][] = [headers.map(h => `"${h}"`)];

    students.forEach(student => {
      const lastAssessDate = new Date(student.lastAssessmentDate);
      const daysSince = Math.floor((new Date().getTime() - lastAssessDate.getTime()) / (1000 * 3600 * 24));
      
      // Calculate phonics mastery %
      const totalPhonicsSkills = PHONICS_DATA.reduce((sum, cat) => sum + cat.skills.length, 0);
      const masteredPhonics = Object.values(student.phonicsMastery).filter(m => m).length;
      const phonicsPercent = totalPhonicsSkills > 0 ? Math.round((masteredPhonics / totalPhonicsSkills) * 100) : 0;

      // Calculate HFW mastery %
      const totalHFW = HFW_SETS.reduce((sum, set) => sum + set.words.length, 0);
      const masteredHFW = Object.values(student.hfwMastery).filter(m => m).length;
      const hfwPercent = totalHFW > 0 ? Math.round((masteredHFW / totalHFW) * 100) : 0;

      const row = [
        student.name,
        lastAssessDate.toLocaleDateString(),
        daysSince.toString(),
        `${phonicsPercent}%`,
        `${hfwPercent}%`
      ];

      rows.push(row.map(r => `"${r}"`));
    });

    return rows.map(row => row.join(',')).join('\n');
  },

  // Trigger file download
  downloadCSV: (csvContent: string, filename: string): void => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export with automatic download
  exportAndDownloadAllStudents: (students: Student[]): void => {
    const csv = exportService.exportAllStudentsToCSV(students);
    const timestamp = new Date().toISOString().split('T')[0];
    exportService.downloadCSV(csv, `phonicstrack-detailed-${timestamp}.csv`);
  },

  exportAndDownloadClassSummary: (students: Student[]): void => {
    const csv = exportService.exportClassSummaryToCSV(students);
    const timestamp = new Date().toISOString().split('T')[0];
    exportService.downloadCSV(csv, `phonicstrack-summary-${timestamp}.csv`);
  },

  exportAndDownloadStudent: (student: Student): void => {
    const csv = exportService.exportStudentToCSV(student);
    exportService.downloadCSV(csv, `phonicstrack-${student.name.replace(/\s+/g, '-').toLowerCase()}.csv`);
  }
  ,

  // JSON export helpers for exact round-trip
  exportStudentToJSON: (student: Student): string => {
    return JSON.stringify(student, null, 2);
  },

  exportAllStudentsToJSON: (students: Student[]): string => {
    return JSON.stringify(students, null, 2);
  },

  downloadJSON: (jsonContent: string, filename: string): void => {
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportAndDownloadAllStudentsJSON: (students: Student[]): void => {
    const json = exportService.exportAllStudentsToJSON(students);
    const timestamp = new Date().toISOString().split('T')[0];
    exportService.downloadJSON(json, `phonicstrack-class-${timestamp}.json`);
  },

  exportAndDownloadStudentJSON: (student: Student): void => {
    const json = exportService.exportStudentToJSON(student);
    exportService.downloadJSON(json, `phonicstrack-${student.name.replace(/\s+/g, '-').toLowerCase()}.json`);
  },

  // CSV import helpers (expecting CSV format produced by this app)
  importCSVClass: (csvText: string): Student[] => {
    const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) throw new Error('CSV contains no data rows');

    const headerLine = lines[0];
    const parseLine = (line: string) => {
      // split on commas not inside quotes
      const parts = line.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
      return parts.map(p => p.replace(/^"|"$/g, '').replace(/""/g, '"'));
    };

    const headers = parseLine(headerLine);

    const current = localStorageService.getCurrentUser();
    if (!current) throw new Error('No active user');

    const rows = lines.slice(1);
    const studentsPayload: any[] = rows.map(row => {
      const cells = parseLine(row);
      const name = cells[0] || 'Imported Student';
      const lastDateCell = cells[1] || '';
      let lastAssessmentDate = new Date().toISOString();
      const parsed = new Date(lastDateCell);
      if (!isNaN(parsed.getTime())) {
        lastAssessmentDate = parsed.toISOString();
      }

      const phonicsMastery: Record<string, boolean> = {};
      PHONICS_DATA.forEach(category => {
        category.skills.forEach(skill => {
          const header = `${category.name} - ${skill.label}`;
          const idx = headers.indexOf(header);
          const val = idx >= 0 ? (cells[idx] || '') : '';
          phonicsMastery[skill.id] = /✓|Mastered/i.test(val);
        });
      });

      const hfwMastery: Record<string, boolean> = {};
      HFW_SETS.forEach(set => {
        set.words.forEach(word => {
          const header = `${set.name} - ${word}`;
          const idx = headers.indexOf(header);
          const val = idx >= 0 ? (cells[idx] || '') : '';
          hfwMastery[`${set.id}_${word}`] = /✓|Mastered/i.test(val);
        });
      });

      return {
        name,
        lastAssessmentDate,
        phonicsMastery,
        hfwMastery,
        userId: current.uid
      };
    });

    return localStorageService.addMultipleStudents(studentsPayload);
  },

  importCSVStudent: (csvText: string): Student => {
    const students = exportService.importCSVClass(csvText);
    if (!students || students.length === 0) throw new Error('No student parsed from CSV');
    return students[0];
  },

  // Import helpers (JSON format expected)
  importStudentJSON: (data: string | object): Student => {
    let obj: any = typeof data === 'string' ? JSON.parse(data) : data;
    if (!obj) throw new Error('Invalid student data');

    const current = localStorageService.getCurrentUser();
    if (!current) throw new Error('No active user');

    const studentPayload: Omit<Student, 'id'> = {
      name: obj.name || 'Imported Student',
      lastAssessmentDate: obj.lastAssessmentDate || new Date().toISOString(),
      phonicsMastery: obj.phonicsMastery || {},
      hfwMastery: obj.hfwMastery || {},
      userId: current.uid
    };

    return localStorageService.addStudent(studentPayload);
  },

  importClassJSON: (data: string | object[]): Student[] => {
    const arr = typeof data === 'string' ? JSON.parse(data) : data;
    if (!Array.isArray(arr)) throw new Error('Expected an array of students for class import');

    const current = localStorageService.getCurrentUser();
    if (!current) throw new Error('No active user');

    const studentsPayload: Omit<Student, 'id'>[] = arr.map((obj: any) => ({
      name: obj.name || 'Imported Student',
      lastAssessmentDate: obj.lastAssessmentDate || new Date().toISOString(),
      phonicsMastery: obj.phonicsMastery || {},
      hfwMastery: obj.hfwMastery || {},
      userId: current.uid
    }));

    return localStorageService.addMultipleStudents(studentsPayload);
  }
};
