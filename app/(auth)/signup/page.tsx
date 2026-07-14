"use client";

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // নতুন স্টেটসমূহ
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!agreeTerms) return;

    setLoading(true); 

    try {
      const { data, error: authError } = await authClient.signUp.email({
          email, 
          password, 
          name, 
        //   callbackURL: "/dashboard" 
      });

      if (authError) {
        // Better Auth থেকে আসা এরর মেসেজ স্টেটে সেট করা হচ্ছে
        setError(authError.message || 'Something went wrong. Please try again.');
      } else if (data) {

        console.log("Signup success:", data);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC] px-6 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
        
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-[#10B981] text-white mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#1E293B]">Create Account</h2>
          <p className="text-sm text-slate-500">Get started with encrypted file sharing</p>
        </div>

        {/* Error Alert Block (পাসওয়ার্ড ম্যাচিং বা Better Auth এরর উভয়ই এখানে দেখাবে) */}
        {error && (
          <div className="p-3 text-xs font-semibold bg-red-50 text-[#EF4444] border border-red-100 rounded-lg flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wide mb-1">
              Full Name
            </label>
            <input 
              type="text"
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#1E293B] focus:outline-none focus:border-[#4F46E5] transition disabled:opacity-60"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wide mb-1">
              Email Address
            </label>
            <input 
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#1E293B] focus:outline-none focus:border-[#4F46E5] transition disabled:opacity-60"
              placeholder="name@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wide mb-1">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#1E293B] focus:outline-none focus:border-[#4F46E5] transition disabled:opacity-60"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-bold text-[#1E293B] uppercase tracking-wide mb-1">
              Confirm Password
            </label>
            <input 
              type={showPassword ? "text" : "password"}
              required
              disabled={loading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-[#1E293B] focus:outline-none focus:border-[#4F46E5] transition disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start space-x-2 pt-1">
            <input 
              type="checkbox"
              id="terms"
              disabled={loading}
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#10B981] focus:ring-[#10B981] disabled:opacity-60"
            />
            <label htmlFor="terms" className="text-xs text-slate-500 leading-normal">
              I agree to the{' '}
              <a href="#" className="font-semibold text-[#4F46E5] hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-[#4F46E5] hover:underline">Privacy Policy</a>.
            </label>
          </div>

          {/* Submit Button with Loading State */}
          <button 
            type="submit" 
            disabled={!agreeTerms || loading}
            className="w-full py-2.5 bg-[#10B981] hover:bg-[#059669] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition shadow-sm flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#4F46E5] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}