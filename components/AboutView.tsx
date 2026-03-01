import React from 'react';
import { BookOpen, User, CheckCircle, ExternalLink } from 'lucide-react';

const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">About PhonicsTrack</h2>
        <p className="text-gray-500 mt-2">Empowering educators with actionable data.</p>
      </div>

      {/* About App Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-indigo-50">
            <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                <BookOpen className="text-indigo-600" /> About this App
            </h3>
        </div>
        <div className="p-6 space-y-4 text-gray-700 leading-relaxed">
            <p className="font-medium text-lg">
                Monitor student achievement in decoding and identify explicit teaching & learning opportunities.
            </p>
            <p>
                Aligns with 'Phonics Plus' from DET (or any SATPIN sequenced S.S.P.P).
            </p>
        </div>
      </div>

      {/* About Me Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-orange-50">
            <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
                <User className="text-orange-600" /> About Me
            </h3>
        </div>
        <div className="p-6 space-y-4 text-gray-700 leading-relaxed">
            <p>I am a teacher in the Victorian public education system.</p>
            <p>I make digital tools that empower teachers to achieve greater impact using actionable data and lightening workload.</p>
            <p>I have taught across every primary grade level over 15 years and have experience in a range of leadership roles.</p>
            <p>As an employee of Victoria DET, they maintain the intellectual property to my work, which I choose to share freely to support fellow educators.</p>
            
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mt-4 text-blue-900">
                <p className="italic">
                    If my work has been valuable to you, I’d love to hear how you’ve used it. Otherwise, a brief acknowledgment to credit the original work is always appreciated.
                </p>
            </div>
            
            <div className="pt-4 flex justify-center">
                <a 
                    href="https://carrington2000.github.io" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-900 transition-colors shadow-md"
                >
                    Visit carrington2000.github.io <ExternalLink size={16} />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;