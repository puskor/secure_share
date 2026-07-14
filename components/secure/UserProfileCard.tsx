"use client";

import React from 'react';

interface UserProfileCardProps {
  name: string;
  email: string;
  loading: boolean;
}

export default function UserProfileCard({ name, email, loading }: UserProfileCardProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl p-6 text-slate-400 animate-pulse flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-slate-400" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-400 rounded" />
            <div className="h-3 w-48 bg-slate-400 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#4F46E5] to-[#6366F1] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center space-x-4">
        <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black text-xl text-white">
          {name ? name.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <h2 className="text-lg font-black tracking-wide">{name || 'Guest User'}</h2>
          <p className="text-xs text-indigo-100">{email || 'No email configured'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10 self-start md:self-center">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-bold uppercase tracking-wider">Verified Node</span>
      </div>
    </div>
  );
}