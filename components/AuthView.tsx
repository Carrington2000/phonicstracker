import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, GraduationCap, AlertCircle } from 'lucide-react';

interface Props {
  onLogin: (user: User) => void;
}

const AuthView: React.FC<Props> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegistering && !name)) {
      setError('Please fill in all fields');
      return;
    }

    const usersStr = localStorage.getItem('pt_users');
    const users = usersStr ? JSON.parse(usersStr) : {};

    if (isRegistering) {
      if (users[email]) {
        setError('An account with this email already exists.');
        return;
      }
      
      // Register new user
      const newUser = { name, email, password }; // Note: In a real app, never store passwords in plain text
      users[email] = newUser;
      localStorage.setItem('pt_users', JSON.stringify(users));
      
      // Auto login
      onLogin({ name, email });
    } else {
      // Login
      const user = users[email];
      if (user && user.password === password) {
        onLogin({ name: user.name, email: user.email });
      } else {
        setError('Invalid email or password.');
      }
    }
  };

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
            {isRegistering ? 'Create Teacher Profile' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 block">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Sarah Smith"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="name@school.edu"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-md"
            >
              {isRegistering ? 'Create Profile' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
          <p className="text-gray-600 text-sm">
            {isRegistering ? "Already have a profile?" : "New to PhonicsTrack?"}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
              }}
              className="text-indigo-600 font-bold ml-2 hover:underline focus:outline-none"
            >
              {isRegistering ? 'Sign In' : 'Register Now'}
            </button>
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-gray-400 max-w-sm text-center">
        Note: This is a demo application. User data is stored locally on your device's browser storage.
      </p>
    </div>
  );
};

export default AuthView;
