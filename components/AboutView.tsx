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
            
            <h4 className="font-bold text-gray-900 pt-4 text-lg">What can you do with this tool?</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {[
                    "Instantly see a clear snapshot of each student’s decoding knowledge, saving time on assessment.",
                    "Confidently track individual progress to inform timely teaching decisions.",
                    "Stay effortlessly updated on priority students without extra admin work.",
                    "Pinpoint each learner’s strengths and growth areas to guide targeted instruction.",
                    "Match students with the most appropriate decodable readers to accelerate progress.",
                    "Spot gaps early and act quickly with focused intervention strategies.",
                    "Group or pair students at similar achievement levels to maximise peer learning opportunities.",
                    "Ensure students have mastered key pre-code high-frequency words for a strong start in reading."
                ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{item}</span>
                    </li>
                ))}
            </ul>
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
            <p>I enjoy developing tools that empower teachers to achieve greater impact by delivering actionable data while lightening workload.</p>
            <p>With 15 years experience, I’ve taught across every primary grade level and have a range of leadership responsibilities.</p>
            <p>As an employee of DET, they maintain the intellectual property to my work, which I share freely to support fellow educators.</p>
            
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