import React, { useState, useEffect } from 'react';
import { Lock, User as UserIcon, ArrowRight, GraduationCap, AlertCircle } from 'lucide-react';
import { localStorageService } from '../localStorageService';

interface AuthViewProps {
  onAuthSuccess?: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [passcodeConfirm, setPasscodeConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Check if passcode is already set
  useEffect(() => {
    const hasPasscode = localStorageService.isPasscodeSet();
    setIsSetupMode(!hasPasscode);
    setLoading(false);
  }, []);

  const handleSetupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teacherName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!passcode) {
      setError('Please enter a passcode');
      return;
    }

    if (passcode.length < 4) {
      setError('Passcode must be at least 4 characters');
      return;
    }

    if (passcode !== passcodeConfirm) {
      setError('Passcodes do not match');
      return;
    }

    try {
      localStorageService.setPasscode(teacherName.trim(), passcode);
      window.location.reload();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!passcode) {
      setError('Please enter your passcode');
      return;
    }

    try {
      localStorageService.login(passcode);
      window.location.reload();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 flex items-center justify-center gap-3">
          <GraduationCap size={48} /> Phonics<span className="text-gray-800">Track</span>
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Student Achievement Monitor</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {isSetupMode ? 'Welcome! Set Your Passcode' : 'Enter Passcode'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {isSetupMode ? (
            // Setup Mode - First Time
            <form onSubmit={handleSetupSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Your Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Sarah Smith"
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Create Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="4+ characters"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Confirm Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={passcodeConfirm}
                    onChange={(e) => setPasscodeConfirm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSetupSubmit(e as any)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="Confirm passcode"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">You'll use this passcode each time you sign in.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-md"
              >
                Set Passcode <ArrowRight size={18} />
              </button>
            </form>
          ) : (
            // Login Mode - Passcode Already Set
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Passcode</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLoginSubmit(e as any)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-lg tracking-widest"
                    placeholder="Enter passcode"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-md"
              >
                Sign In <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;
