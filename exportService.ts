import { Student } from './types';
import { PHONICS_DATA, HFW_SETS } from './constants';

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
};
