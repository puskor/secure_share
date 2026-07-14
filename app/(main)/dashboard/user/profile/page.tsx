"use client";

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import UserProfileCard from '@/components/secure/UserProfileCard';
import PostForm, { PostVisibility } from '@/components/secure/PostForm';

export default function ProfilePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [postType, setPostType] = useState<PostVisibility>('public');

  // Better Auth সেশন ডাটা
  const { data: session, isPending } = authClient.useSession();

  const handleCreatePost = (formData: { title: string; content: string; visibility: PostVisibility; passcode: string }) => {
    setLoading(true);
    setGeneratedUrl('');
    setCopied(false);
    setPostType(formData.visibility);

    console.log(formData)

    // সিকিউর শেয়ারিং ইউআরএল মকিং লজিক
    setTimeout(() => {
      const uniqueId = Math.random().toString(36).substring(2, 9);
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const shareUrl = `${origin}/share/${uniqueId}`;

      setGeneratedUrl(shareUrl);
      setLoading(false);
      setIsFormOpen(false); // পাবলিশ সফল হলে ফর্ম বন্ধ হবে
    }, 1200);
  };

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      
      {/* ১. সাব-কম্পোনেন্ট: প্রোফাইল কার্ড */}
      <UserProfileCard 
        name={session?.user?.name || "Guest User"} 
        email={session?.user?.email || "Not Sign In"} 
        loading={isPending} 
      />

      {/* ২. ট্রিগার বাটন এরিয়া */}
      {!isFormOpen && (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-[#4F46E5]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#1E293B]">Publish New Information</h3>
            <p className="text-xs text-slate-500 mt-1">Select layers of visibility, encrypt content, and create secure nodes.</p>
          </div>
          <button
            onClick={() => {
              setGeneratedUrl(''); 
              setIsFormOpen(true);
            }}
            className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            Create Secure Post
          </button>
        </div>
      )}

      {/* ৩. সাব-কম্পোনেন্ট: ডাইনামিক পোস্ট ফর্ম */}
      {isFormOpen && (
        <PostForm 
          onSubmit={handleCreatePost} 
          loading={loading} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {/* ৪. লিংক শেয়ারিং সাকসেস ব্লক */}
      {generatedUrl && (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 animate-in zoom-in-95 duration-300">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#10B981] uppercase tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Post Shared Successfully!</span>
          </div>
          <p className="text-xs text-slate-600">
            Anyone with this link {postType === 'private' && "and the passcode"} can access this block.
          </p>
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-emerald-100">
            <input 
              type="text" 
              readOnly 
              value={generatedUrl} 
              className="flex-1 bg-transparent border-none text-xs font-semibold text-slate-700 outline-none select-all"
            />
            <button 
              type="button" 
              onClick={copyToClipboard}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                copied 
                  ? 'bg-[#10B981] text-white' 
                  : 'bg-emerald-100 text-[#10B981] hover:bg-[#10B981] hover:text-white'
              }`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}