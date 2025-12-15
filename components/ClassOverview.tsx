import React from 'react';
import { Student } from '../types';
import { PHONICS_DATA } from '../constants';
import { AlertCircle, Check } from 'lucide-react';

interface Props {
  students: Student[];
  onSelectStudent: (id: string) => void;
}

const ClassOverview: React.FC<Props> = ({ students, onSelectStudent }) => {
  // Sort priority students to top
  const sortedStudents = [...students].sort((a, b) => {
    return new Date(a.lastAssessmentDate).getTime() - new Date(b.lastAssessmentDate).getTime();
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-bold text-gray-800">Class Progress Matrix</h2>
            <p className="text-sm text-gray-500">Priority ordered by time since last assessment.</p>
        </div>
        <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Mastered</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Partial</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Needs Work</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th className="px-6 py-3 sticky left-0 bg-gray-50 z-10">Student</th>
                    <th className="px-6 py-3">Last Assess</th>
                    {PHONICS_DATA.map(cat => (
                        <th key={cat.id} className="px-2 py-3 text-center min-w-[80px] border-l border-gray-200">{cat.id}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedStudents.map(student => {
                     const daysSince = Math.floor((new Date().getTime() - new Date(student.lastAssessmentDate).getTime()) / (1000 * 3600 * 24));
                     const isPriority = daysSince > 14;

                    return (
                        <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onSelectStudent(student.id)}>
                            <td className="px-6 py-4 font-medium text-gray-900 sticky left-0 bg-white z-10 border-r border-gray-100 flex items-center gap-2">
                                {isPriority && <AlertCircle size={14} className="text-red-500" />}
                                {student.name}
                            </td>
                            <td className={`px-6 py-4 ${isPriority ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                {daysSince} days
                            </td>
                            {PHONICS_DATA.map(cat => {
                                const total = cat.skills.length;
                                const mastered = cat.skills.filter(s => student.phonicsMastery[s.id]).length;
                                const percentage = (mastered / total) * 100;
                                
                                let color = 'bg-gray-100';
                                if (percentage === 100) color = 'bg-green-500 text-white';
                                else if (percentage > 0) color = 'bg-yellow-400 text-white';

                                return (
                                    <td key={cat.id} className="px-2 py-4 border-l border-gray-100 text-center">
                                        <div className={`w-full py-1 rounded text-xs font-bold ${color}`}>
                                            {percentage === 100 ? <Check size={14} className="mx-auto" /> : `${Math.round(percentage)}%`}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassOverview;
