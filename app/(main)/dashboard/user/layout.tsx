"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু ওপেন/ক্লোজ স্টেট

  const navItems = [
    { href: '/dashboard/user/public', label: 'Public Files', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-.11-8.243-.318" /></svg>
    )},
    { href: '/dashboard/user/friend', label: 'Shared with Friends', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
    )},
    { href: '/dashboard/user/profile', label: 'User Profile', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )},
    { href: '/dashboard/user/private', label: 'Private Storage', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
    )},
  ];

  const NavigationLinks = () => (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsOpen(false)} // মোবাইল লিংকে ক্লিক করলে ড্রয়ার বন্ধ হবে
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
              isActive
                ? 'bg-[#EEF2FF] text-[#4F46E5]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-[#1E293B]'
            }`}
          >
            <span className={isActive ? 'text-[#4F46E5]' : 'text-slate-400'}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#F8FAFC] overflow-hidden">
      
      {/* 📱 মোবাইল হেডার (শুধুমাত্র ছোট স্ক্রিনে দেখাবে) */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 z-40">
        <div className="flex items-center space-x-3">
          {/* লোগো/ব্র্যান্ড নাম এখানে দিতে পারেন */}
          <span className="font-black text-sm text-slate-800 tracking-wide">SecureShare</span>
        </div>
        
        {/* থ্রি-ডট/হ্যামবার্গার মেনু বাটন */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </header>

      {/* 🖥️ ১. ডেস্কটপ সাইডবার (বড় স্ক্রিনে দেখাবে, মোবাইলে হিডেন) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col justify-between p-4 shrink-0 h-full">
        <div className="space-y-6">
          <div className="px-4 py-2">
            <span className="font-black text-lg text-slate-800 tracking-wide">SecureShare</span>
          </div>
          <NavigationLinks />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
          <span>Active Session</span>
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        </div>
      </aside>

      {/* 📱 মোবাইল ড্রয়ার (মোবাইলে মেনু ওপেন করলে স্লাইড হয়ে আসবে) */}
      {isOpen && (
        <>
          {/* ব্যাকড্রপ ওভারলে */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <aside className="fixed top-[57px] left-0 bottom-0 w-64 bg-white z-50 p-4 flex flex-col justify-between border-r border-slate-100 animate-in slide-in-from-left duration-200 lg:hidden">
            <div className="space-y-6">
              <NavigationLinks />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
              <span>Active Session</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>
          </aside>
        </>
      )}

      {/* ২. মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* ডাইনামিক কন্টেন্ট এরিয়া */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 min-h-full">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}