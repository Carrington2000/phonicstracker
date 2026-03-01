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
  const [recoveryQuestion, setRecoveryQuestion] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [forgotFlow, setForgotFlow] = useState(false);
  const [forgotAnswer, setForgotAnswer] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [newPasscodeConfirm, setNewPasscodeConfirm] = useState('');
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

    if (!recoveryQuestion.trim() || !recoveryAnswer.trim()) {
      setError('Please provide a recovery question and answer');
      return;
    }

    try {
      localStorageService.setPasscodeWithRecovery(teacherName.trim(), passcode, recoveryQuestion.trim(), recoveryAnswer.trim());
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

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!forgotAnswer) {
      setError('Please enter your recovery answer');
      return;
    }

    if (!newPasscode || newPasscode.length < 4) {
      setError('New passcode must be at least 4 characters');
      return;
    }

    if (newPasscode !== newPasscodeConfirm) {
      setError('New passcodes do not match');
      return;
    }

    try {
      localStorageService.resetPasscodeWithRecovery(forgotAnswer, newPasscode);
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

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Recovery Question</label>
                <input
                  type="text"
                  value={recoveryQuestion}
                  onChange={(e) => setRecoveryQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. What is your school mascot?"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Recovery Answer</label>
                <input
                  type="text"
                  value={recoveryAnswer}
                  onChange={(e) => setRecoveryAnswer(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Answer to your recovery question"
                />
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
            <div>
              {!forgotFlow ? (
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
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block">Recovery Question</label>
                    <div className="mt-1 text-sm text-gray-600">{localStorageService.getRecoveryQuestion() || 'No recovery question set'}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">Your Answer</label>
                    <input
                      type="text"
                      value={forgotAnswer}
                      onChange={(e) => setForgotAnswer(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Answer to recovery question"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">New Passcode</label>
                    <input
                      type="password"
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Enter new passcode"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">Confirm New Passcode</label>
                    <input
                      type="password"
                      value={newPasscodeConfirm}
                      onChange={(e) => setNewPasscodeConfirm(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      placeholder="Confirm new passcode"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setForgotFlow(false)}
                      className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Reset Passcode
                    </button>
                  </div>
                </form>
              )}

              {/* Forgotten link */}
              {!forgotFlow && (
                <div className="mt-3 text-center">
                  <button
                    onClick={() => setForgotFlow(true)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Forgotten Passcode?
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;
