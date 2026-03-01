import React, { useRef, useState } from 'react';
import { X, Download, UploadCloud, FileText } from 'lucide-react';
import { Student } from '../types';
import { exportService } from '../exportService';

interface Props {
  students: Student[];
  onClose: () => void;
  onImported?: (imported: Student[] | Student) => void;
}

const ImportExport: React.FC<Props> = ({ students, onClose, onImported }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleExportAll = () => {
    exportService.exportAndDownloadAllStudents(students);
  };

  const handleExportAllJSON = () => {
    exportService.exportAndDownloadAllStudentsJSON(students);
  };

  const handleExportStudentJSON = () => {
    if (!students[0]) return;
    exportService.exportAndDownloadStudentJSON(students[0]);
  };

  const handleExportSummary = () => {
    exportService.exportAndDownloadClassSummary(students);
  };

  const handleExportStudent = () => {
    if (!students[0]) return;
    exportService.exportAndDownloadStudent(students[0]);
  };

  const handleImport = (asClass: boolean) => {
    setMessage('');
    fileRef.current?.click();
    // on file change, we'll read and process
    const onFileSelected = async (e: Event) => {
      const input = e.target as HTMLInputElement;
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        if (asClass) {
          const imported = exportService.importClassJSON(text);
          setMessage(`Imported ${imported.length} students`);
          onImported && onImported(imported);
        } else {
          const imported = exportService.importStudentJSON(text);
          setMessage(`Imported student ${imported.name}`);
          onImported && onImported(imported);
        }
      } catch (err: any) {
        setMessage(`Import failed: ${err.message || err}`);
      } finally {
        // reset file input
        if (fileRef.current) fileRef.current.value = '';
        fileRef.current?.removeEventListener('change', onFileSelected as any);
      }
    };

    fileRef.current?.addEventListener('change', onFileSelected as any);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-lg">Import / Export</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={handleExportAll} className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg">
              <Download /> Export All Students (CSV)
            </button>
            <button onClick={handleExportSummary} className="flex items-center gap-2 px-4 py-3 bg-indigo-500 text-white rounded-lg">
              <FileText /> Export Class Summary (CSV)
            </button>
            <button onClick={handleExportStudent} className="flex items-center gap-2 px-4 py-3 bg-indigo-400 text-white rounded-lg">
              <Download /> Export First Student (CSV)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
            <button onClick={handleExportAllJSON} className="flex items-center gap-2 px-4 py-3 bg-sky-600 text-white rounded-lg">
              <Download /> Export All Students (JSON)
            </button>
            <button onClick={handleExportStudentJSON} className="flex items-center gap-2 px-4 py-3 bg-sky-500 text-white rounded-lg">
              <Download /> Export First Student (JSON)
            </button>
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">JSON exports are exact student objects suitable for re-import.</div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Import from JSON or CSV. JSON imports are exact student objects; CSV should be the app's exported CSV format.</p>
            <div className="flex gap-3">
              <button onClick={() => handleImport(false)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
                <UploadCloud /> Import Single (JSON)
              </button>
              <button onClick={() => handleImport(true)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg">
                <UploadCloud /> Import Class (JSON)
              </button>
              <button onClick={() => {
                // reuse fileRef but handle as CSV
                setMessage('');
                fileRef.current?.click();
                const onFileSelected = async (e: Event) => {
                  const input = e.target as HTMLInputElement;
                  const file = input.files && input.files[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const imported = exportService.importCSVClass(text);
                    setMessage(`Imported ${imported.length} students from CSV`);
                    onImported && onImported(imported);
                  } catch (err: any) {
                    setMessage(`CSV import failed: ${err.message || err}`);
                  } finally {
                    if (fileRef.current) fileRef.current.value = '';
                    fileRef.current?.removeEventListener('change', onFileSelected as any);
                  }
                };
                fileRef.current?.addEventListener('change', onFileSelected as any);
              }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg">
                <UploadCloud /> Import Class (CSV)
              </button>
            </div>
            <input ref={fileRef} type="file" accept="application/json,text/json,text/csv" className="hidden" />
            {message && <div className="mt-3 text-sm text-gray-700">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
