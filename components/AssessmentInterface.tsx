import React, { useState } from 'react';
import { Student, PhonicsSkill } from '../types';
import { PHONICS_DATA, HFW_SETS } from '../constants';
import { CheckCircle2, Circle, ChevronLeft, Save } from 'lucide-react';

interface Props {
  student: Student;
  onSave: (updatedStudent: Student) => void;
  onCancel: () => void;
}

const AssessmentInterface: React.FC<Props> = ({ student, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'phonics' | 'hfw'>('phonics');
  const [tempStudent, setTempStudent] = useState<Student>(JSON.parse(JSON.stringify(student)));

  const togglePhonics = (skillId: string) => {
    setTempStudent(prev => ({
      ...prev,
      phonicsMastery: {
        ...prev.phonicsMastery,
        [skillId]: !prev.phonicsMastery[skillId]
      }
    }));
  };

  const toggleHFW = (key: string) => {
    setTempStudent(prev => ({
      ...prev,
      hfwMastery: {
        ...prev.hfwMastery,
        [key]: !prev.hfwMastery[key]
      }
    }));
  };

  const handleSave = () => {
    const now = new Date();
    onSave({
      ...tempStudent,
      lastAssessmentDate: now.toISOString()
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col h-full max-h-[85vh]">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-3">
            <button onClick={onCancel} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <ChevronLeft size={20} />
            </button>
            <div>
                <h2 className="text-xl font-bold text-gray-800">Assessing: {student.name}</h2>
                <p className="text-xs text-gray-500">Click items to mark as mastered</p>
            </div>
        </div>
        <div className="flex gap-2">
             <div className="flex bg-gray-200 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('phonics')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'phonics' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Phonics
                </button>
                <button 
                    onClick={() => setActiveTab('hfw')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'hfw' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Sight Words
                </button>
            </div>
            <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
            >
                <Save size={18} />
                <span>Save</span>
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'phonics' ? (
             <div className="space-y-8">
                {PHONICS_DATA.map(category => (
                    <div key={category.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="text-indigo-900 font-bold mb-4 flex items-center justify-between">
                            {category.name}
                            <span className="text-xs font-normal bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                {category.skills.filter(s => tempStudent.phonicsMastery[s.id]).length} / {category.skills.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {category.skills.map(skill => {
                                const isMastered = tempStudent.phonicsMastery[skill.id];
                                return (
                                    <button
                                        key={skill.id}
                                        onClick={() => togglePhonics(skill.id)}
                                        className={`
                                            relative h-20 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-200
                                            ${isMastered 
                                                ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                                                : 'bg-white border-gray-200 text-gray-400 hover:border-indigo-300 hover:shadow-md'}
                                        `}
                                    >
                                        <span className="text-xl font-bold">{skill.label}</span>
                                        <div className="absolute top-2 right-2">
                                            {isMastered ? <CheckCircle2 size={16} /> : <Circle size={16} className="opacity-20" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
             </div>
        ) : (
            <div className="space-y-8">
                {HFW_SETS.map(set => (
                    <div key={set.id} className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                         <h3 className="text-orange-900 font-bold mb-4 flex items-center justify-between">
                            {set.name}
                             <span className="text-xs font-normal bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                {set.words.filter(w => tempStudent.hfwMastery[`${set.id}_${w}`]).length} / {set.words.length}
                            </span>
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
                             {set.words.map(word => {
                                const key = `${set.id}_${word}`;
                                const isMastered = tempStudent.hfwMastery[key];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => toggleHFW(key)}
                                        className={`
                                            px-3 py-2 rounded-lg border text-sm font-medium transition-all
                                            ${isMastered 
                                                ? 'bg-orange-200 border-orange-300 text-orange-900' 
                                                : 'bg-white border-gray-200 text-gray-500 hover:bg-orange-50'}
                                        `}
                                    >
                                        {word}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentInterface;
