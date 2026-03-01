import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Student, PhonicsCategory } from '../types';
import { PHONICS_DATA, ALL_SKILLS, HFW_SETS } from '../constants';
import { TrendingUp, AlertCircle, BookOpen, Users, Trash2, Download } from 'lucide-react';
import { exportService } from '../exportService';

interface Props {
  student: Student;
  allStudents: Student[];
  onAssess: () => void;
  onDelete?: () => void;
}

const StudentSnapshot: React.FC<Props> = ({ student, allStudents, onAssess, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      setShowDeleteConfirm(false);
    }
  };
  
  // Calculate Progress per category
  const chartData = PHONICS_DATA.map(category => {
    const total = category.skills.length;
    const mastered = category.skills.filter(s => student.phonicsMastery[s.id]).length;
    return {
      name: category.id.toUpperCase(),
      fullLabel: category.name,
      score: (mastered / total) * 100,
      mastered,
      total
    };
  });

  // Compute chart height dynamically based on number of categories to avoid cramping
  const chartHeight = Math.min(700, Math.max(240, chartData.length * 28));
  const CARD_MAX_HEIGHT = 720;

  // Determine Learning Goal (First unmastered skill)
  const getLearningGoal = () => {
    for (const category of PHONICS_DATA) {
      for (const skill of category.skills) {
        if (!student.phonicsMastery[skill.id]) {
          return {
            type: 'Phonics',
            label: `Decoding: "${skill.label}"`,
            category: category.name
          };
        }
      }
    }
    // If all phonics done, check HFW
    for (const set of HFW_SETS) {
      for (const word of set.words) {
        if (!student.hfwMastery[`${set.id}_${word}`]) {
           return {
            type: 'HFW',
            label: `Sight Word: "${word}"`,
            category: set.name
          };
        }
      }
    }
    return { type: 'Done', label: 'All competencies mastered!', category: 'Extension' };
  };

  const learningGoal = getLearningGoal();

  // Find similar students (Same specific learning goal)
  const similarStudents = allStudents.filter(s => {
    if (s.id === student.id) return false;
    // Simple logic: matches if they are missing the same first item
    const sGoal = (() => {
       for (const category of PHONICS_DATA) {
        for (const skill of category.skills) {
            if (!s.phonicsMastery[skill.id]) return skill.id;
        }
       }
       return 'done';
    })();
    
    // Check if current student has same missing first item
    const currentStudentMissingId = (() => {
        for (const category of PHONICS_DATA) {
        for (const skill of category.skills) {
            if (!student.phonicsMastery[skill.id]) return skill.id;
        }
       }
       return 'done';
    })();

    return sGoal === currentStudentMissingId;
  });

  // Days since last assessment
  const daysSince = Math.floor((new Date().getTime() - new Date(student.lastAssessmentDate).getTime()) / (1000 * 3600 * 24));
  const isPriority = daysSince > 14;

  return (
    <>
    <div className="space-y-6 animate-fadeIn relative">
      {/* Action Buttons */}
      <div className="absolute top-0 right-0 flex gap-2">
        <button
          onClick={() => exportService.exportAndDownloadStudent(student)}
          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="Export to CSV"
        >
          <Download size={18} />
        </button>
        {onDelete && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete student"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Learning Goal Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 flex flex-col justify-between">
            <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={16} /> Current Learning Goal
                </h3>
                <div className="mt-4">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-2">
                        {learningGoal.category}
                    </span>
                    <p className="text-2xl font-bold text-gray-800">{learningGoal.label}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Focus on explicit instruction for this pattern.</p>
            </div>
        </div>

        {/* Assessment Status */}
        <div className={`p-6 rounded-xl shadow-sm border flex flex-col justify-between ${isPriority ? 'bg-red-50 border-red-100' : 'bg-white border-green-100'}`}>
            <div>
                <h3 className={`text-sm font-medium uppercase tracking-wider flex items-center gap-2 ${isPriority ? 'text-red-600' : 'text-green-600'}`}>
                    <AlertCircle size={16} /> Assessment Status
                </h3>
                <div className="mt-4">
                    <p className="text-3xl font-bold text-gray-800">{daysSince} <span className="text-base font-normal text-gray-500">days ago</span></p>
                    <p className="text-sm text-gray-600 mt-1">Last seen: {new Date(student.lastAssessmentDate).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="mt-4">
                 <button 
                    onClick={onAssess}
                    className="w-full py-2 px-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                 >
                    Assess Now
                 </button>
            </div>
        </div>

        {/* Grouping Opportunities */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 flex flex-col justify-between">
             <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Grouping Strategy
                </h3>
                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Students at similar level:</p>
                    {similarStudents.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {similarStudents.slice(0, 4).map(s => (
                                <span key={s.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200">
                                    {s.name}
                                </span>
                            ))}
                            {similarStudents.length > 4 && <span className="text-xs text-gray-400">+{similarStudents.length - 4} more</span>}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic text-sm">No peers at exact same step.</p>
                    )}
                </div>
            </div>
             <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Pair for peer learning on {learningGoal.category}.</p>
            </div>
        </div>
      </div>

      {/* Charts & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-800 font-bold mb-6">Code Mastery Profile</h3>
            <div className="overflow-y-auto" style={{ maxHeight: CARD_MAX_HEIGHT }}>
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f3f4f6'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.score === 100 ? '#10b981' : entry.score > 50 ? '#f59e0b' : '#ef4444'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Detailed Grid */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-y-auto" style={{ maxHeight: CARD_MAX_HEIGHT }}>
            <h3 className="text-gray-800 font-bold mb-4">Skill Breakdown</h3>
            <div className="space-y-4">
                {PHONICS_DATA.map(cat => (
                    <div key={cat.id}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">{cat.name}</h4>
                        <div className="flex flex-wrap gap-2">
                            {cat.skills.map(skill => {
                                const mastered = student.phonicsMastery[skill.id];
                                return (
                                    <span 
                                        key={skill.id}
                                        className={`px-3 py-1 text-xs rounded-full border ${mastered ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}
                                    >
                                        {skill.label}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>

    {/* Delete Confirmation Dialog */}
    {showDeleteConfirm && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-xl max-w-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Student?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{student.name}</strong> from your class list? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default StudentSnapshot;
