import React, { useState, useEffect } from 'react';
import { Student, AppView, User } from './types';
import { PHONICS_DATA, HFW_SETS } from './constants';
import StudentSnapshot from './components/StudentSnapshot';
import AssessmentInterface from './components/AssessmentInterface';
import ClassOverview from './components/ClassOverview';
import AboutView from './components/AboutView';
import { LayoutDashboard, Users, GraduationCap, ArrowRight, Plus, FileText, X, Info, LogOut, User as UserIcon } from 'lucide-react';
import { localStorageService } from './localStorageService';
import ImportExport from './components/ImportExport';

// --- MOCK DATA GENERATOR (can be removed if not needed) ---

const generateMockStudents = (): Omit<Student, 'id' | 'userId'>[] => {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ian', 'Jack'];
    return names.map((name, i) => {
      const level = 1 - (i * 0.1);
      const phonicsMastery: Record<string, boolean> = {};
      PHONICS_DATA.forEach((cat, catIdx) => {
         cat.skills.forEach(skill => {
            const difficulty = (catIdx + 1) * 0.2;
            phonicsMastery[skill.id] = Math.random() < (level + 0.2 - difficulty);
         });
      });
      const hfwMastery: Record<string, boolean> = {};
      HFW_SETS.forEach((set, setIdx) => {
          set.words.forEach(word => {
              const difficulty = (setIdx + 1) * 0.15;
              hfwMastery[`${set.id}_${word}`] = Math.random() < (level + 0.2 - difficulty);
          });
      });
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      return {
        name,
        lastAssessmentDate: date.toISOString(),
        phonicsMastery,
        hfwMastery,
      };
    });
  };

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // App State
  const [students, setStudents] = useState<Student[]>([]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

    // 1. Initialize local-only user and start with empty students
    useEffect(() => {
        // remove any stored students so app starts empty per request
        localStorageService.clearStudents();

        const name = localStorageService.getTeacherName() || 'Teacher';
        const uid = 'teacher_local';
        const userObj = { uid, name, isAuthenticated: true } as any;

        // persist current user so other helpers (imports) can read it
        localStorage.setItem('phonicstrack_current_user', JSON.stringify(userObj));
        setCurrentUser(userObj);
        setIsLoading(false);
    }, []);

    // 2. Load User Data from Local Storage when User is set
    useEffect(() => {
        if (currentUser) {
            setIsLoading(true);
            const userStudents = localStorageService.getStudentsByUserId(currentUser.uid);
            setStudents(userStudents);
            setCurrentView(AppView.DASHBOARD);
            setSelectedStudentId(null);
            setIsLoading(false);
        } else {
            setStudents([]);
            setSelectedStudentId(null);
        }
    }, [currentUser]);

  // Determine current student object
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  // Auto-select first student if none is selected
  useEffect(() => {
    if(students.length > 0 && !selectedStudentId) {
        setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  // --- HANDLERS ---

  const handleLogout = () => {
    localStorageService.logout();
    setCurrentUser(null);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    if (!currentUser) return;
    localStorageService.updateStudent(updatedStudent);
    const newStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(newStudents);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim() || !currentUser) return;

    const newStudentData = {
        name: newStudentName.trim(),
        lastAssessmentDate: new Date(new Date().setDate(new Date().getDate() - 365)).toISOString(),
        phonicsMastery: {},
        hfwMastery: {},
        userId: currentUser.uid,
    };

    const newStudent = localStorageService.addStudent(newStudentData);
    
    const newStudents = [...students, newStudent];
    setStudents(newStudents);

    setSelectedStudentId(newStudent.id);
    setNewStudentName('');
    setIsAddStudentModalOpen(false);
    setCurrentView(AppView.ASSESSMENT);
  };

  const handleDeleteStudent = (studentId: string) => {
    localStorageService.deleteStudent(studentId);
    const newStudents = students.filter(s => s.id !== studentId);
    setStudents(newStudents);
    
    // Switch to another student or dashboard
    if (selectedStudentId === studentId) {
      setSelectedStudentId(newStudents.length > 0 ? newStudents[0].id : null);
      setCurrentView(AppView.DASHBOARD);
    }
  };

  // Find priority student (longest time since assessment)
  const priorityStudent = [...students].sort((a,b) => new Date(a.lastAssessmentDate).getTime() - new Date(b.lastAssessmentDate).getTime())[0];

    // Open a PDF file either via Electron API (when available) or fallback to browser new tab
    const openLocalPDF = (fileName: string, fallbackHref?: string) => {
        const api = (window as any).electronAPI;
        if (api && typeof api.openLocalFile === 'function') {
            api.openLocalFile(fileName).catch(() => {
                // fallback to browser if electron API fails
                window.open(fallbackHref || `/${fileName}`, '_blank', 'noopener');
            });
        } else {
            window.open(fallbackHref || `/${fileName}`, '_blank', 'noopener');
        }
    };


  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Loading Teacher Profile...</div>;
  }
  if (!currentUser) {
    return <AuthView />;
  }

  const renderMainContent = () => {
     if (students.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="bg-indigo-50 p-6 rounded-full mb-4">
                    <Users size={48} className="text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No students found</h2>
                <p className="text-gray-500 mb-6 max-w-md">Your class list is empty. Add your first student to start tracking their phonics journey.</p>
                <button
                    onClick={() => setIsAddStudentModalOpen(true)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg flex items-center gap-2"
                >
                    <Plus size={20} /> Add First Student
                </button>
             </div>
        );
     }

     return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
            {currentView === AppView.DASHBOARD && selectedStudent && (
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">{selectedStudent.name}</h2>
                            <p className="text-gray-500">Dashboard & Achievement Snapshot</p>
                        </div>
                        <div className="flex items-center gap-3">
                             <select
                                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={selectedStudentId || ''}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                             >
                                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                             </select>
                        </div>
                    </div>

                    <StudentSnapshot
                        student={selectedStudent}
                        allStudents={students}
                        onAssess={() => setCurrentView(AppView.ASSESSMENT)}
                        onDelete={() => handleDeleteStudent(selectedStudent.id)}
                    />
                </div>
            )}

            {currentView === AppView.ASSESSMENT && selectedStudent && (
                <div className="max-w-6xl mx-auto h-full pb-10">
                    <AssessmentInterface
                        student={selectedStudent}
                        onSave={handleUpdateStudent}
                        onCancel={() => setCurrentView(AppView.DASHBOARD)}
                    />
                </div>
            )}

            {currentView === AppView.CLASS_OVERVIEW && (
                <div className="max-w-6xl mx-auto">
                     <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Class Matrix</h2>
                        <p className="text-gray-500">Overview of all student achievements aligned to SATPIN.</p>
                    </div>
                    <ClassOverview
                        students={students}
                        onSelectStudent={(id) => {
                            setSelectedStudentId(id);
                            setCurrentView(AppView.DASHBOARD);
                        }}
                        onDeleteStudent={handleDeleteStudent}
                    />
                </div>
            )}

            {currentView === AppView.ABOUT && (
               <AboutView />
            )}
        </div>
     );
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm hidden md:flex shrink-0">
        <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-indigo-700 flex items-center gap-2">
                <GraduationCap /> Phonics<span className="text-gray-800">Track</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Assessment & Monitoring</p>
        </div>



        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <button
                onClick={() => setCurrentView(AppView.DASHBOARD)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === AppView.DASHBOARD ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <LayoutDashboard size={20} /> Dashboard
            </button>
            <button
                onClick={() => setCurrentView(AppView.CLASS_OVERVIEW)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === AppView.CLASS_OVERVIEW ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Users size={20} /> Class Matrix
            </button>
             <button
                onClick={() => setCurrentView(AppView.ABOUT)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentView === AppView.ABOUT ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Info size={20} /> About
            </button>

            {/* Resources Section */}
            <div className="pt-6 px-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Teacher Resources</p>
                <div className="space-y-3">
                    <button
                        onClick={() => openLocalPDF('word-lists.pdf', '/word-lists.pdf')}
                        className="w-full text-left flex items-start gap-2 text-sm text-gray-600 hover:text-indigo-600 group"
                    >
                        <FileText size={16} className="mt-0.5 group-hover:text-indigo-500" />
                        <span>Download Word Lists</span>
                    </button>
                    <button
                        onClick={() => openLocalPDF('flashcards.pdf', '/flashcards.pdf')}
                        className="w-full text-left flex items-start gap-2 text-sm text-gray-600 hover:text-indigo-600 group"
                    >
                        <FileText size={16} className="mt-0.5 group-hover:text-indigo-500" />
                        <span>Download Flashcards</span>
                    </button>
                    <button
                        onClick={() => setIsImportExportOpen(true)}
                        className="w-full text-left flex items-start gap-2 text-sm text-gray-600 hover:text-indigo-600 group"
                    >
                        <FileText size={16} className="mt-0.5 group-hover:text-indigo-500" />
                        <span>Import / Export</span>
                    </button>
                </div>
            </div>

            <div className="pt-6 px-4">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Student Quick Pick</p>
                    <button
                        onClick={() => setIsAddStudentModalOpen(true)}
                        className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors"
                        title="Add New Student"
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                    {students.map(s => (
                        <div
                            key={s.id}
                            className="flex items-center group"
                        >
                            <button
                                onClick={() => {
                                    setSelectedStudentId(s.id);
                                    setCurrentView(AppView.DASHBOARD);
                                }}
                                className={`flex-1 text-left px-3 py-2 text-sm rounded-md truncate transition-colors ${selectedStudentId === s.id ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {s.name}
                            </button>
                            <button
                                onClick={() => {
                                    if (confirm(`Delete ${s.name}?`)) {
                                        handleDeleteStudent(s.id);
                                    }
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-all hover:bg-red-50 rounded"
                                title="Delete student"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </nav>

        <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
            {students.length > 0 && priorityStudent && (
                 <div className="bg-indigo-600 rounded-lg p-4 text-white mb-2">
                    <p className="text-xs opacity-75 uppercase">Next to Assess</p>
                    <p className="font-bold text-lg mb-2">{priorityStudent.name}</p>
                    <button
                        onClick={() => {
                            setSelectedStudentId(priorityStudent.id);
                            setCurrentView(AppView.ASSESSMENT);
                        }}
                        className="w-full bg-white/20 hover:bg-white/30 text-xs py-2 rounded transition-colors flex items-center justify-center gap-2"
                    >
                        Assess Now <ArrowRight size={12} />
                    </button>
                </div>
            )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-6 md:hidden">
             <span className="font-bold text-lg">PhonicsTrack</span>
             <div className="flex items-center gap-2">
                 <button onClick={() => setIsAddStudentModalOpen(true)} className="text-indigo-600 p-2"><Plus size={24} /></button>
                 <button onClick={() => setCurrentView(AppView.CLASS_OVERVIEW)} className="text-gray-600 p-2"><Users size={24} /></button>
             </div>
        </header>

        {/* Render Dynamic Content */}
        {renderMainContent()}

        {/* Footer/Help Link removed per request */}

        {/* Add Student Modal */}
        {isAddStudentModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-lg text-gray-800">Add New Student</h3>
                        <button
                            onClick={() => setIsAddStudentModalOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                        <input
                            autoFocus
                            type="text"
                            value={newStudentName}
                            onChange={(e) => setNewStudentName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddStudent()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="e.g., Sarah Smith"
                        />
                        <p className="text-xs text-gray-500 mt-2">New students will be marked as "Needs Assessment" immediately.</p>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                onClick={() => setIsAddStudentModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStudent}
                                disabled={!newStudentName.trim()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Student
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

                {/* Import/Export Modal */}
                {isImportExportOpen && (
                    <ImportExport
                        students={students}
                        selectedStudent={selectedStudent}
                        onClose={() => setIsImportExportOpen(false)}
                        onImported={() => {
                            // Refresh students after import
                            const user = localStorageService.getCurrentUser();
                            if (user) {
                                const updated = localStorageService.getStudentsByUserId(user.uid);
                                setStudents(updated);
                            }
                            setIsImportExportOpen(false);
                        }}
                    />
                )}

      </main>
    </div>
  );
};

export default App;
