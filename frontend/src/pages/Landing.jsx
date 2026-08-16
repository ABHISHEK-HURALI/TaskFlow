import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Clock, Shield, ArrowRight } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-6">
          <CheckSquare className="h-12 w-12 text-indigo-600" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Manage your tasks with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">TaskFlow</span>
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Organize your work. Track your progress. Stay on top of your daily goals with our intuitive task management platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Create Account
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center"
          >
            Login to TaskFlow
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Organization</h3>
              <p className="text-slate-600">Categorize tasks by priority and status. Filter and sort to find exactly what you need.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Never Miss a Deadline</h3>
              <p className="text-slate-600">Set due dates and easily spot overdue tasks to ensure everything gets done on time.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Secure & Private</h3>
              <p className="text-slate-600">Your data is yours. Secure authentication ensures only you can access your tasks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
