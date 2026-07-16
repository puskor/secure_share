"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

interface PostData {
  _id: string;
  content: string;
  mediaUrls?: string[];
  visibility: string;
  createdAt: string;
}

export default function SharePostPage() {
  const params = useParams();
  // ইউআরএল থেকে ডাইনামিক postId (যেমন: 6a58507e3bc742c6d64d9a4b) নেওয়া হচ্ছে
  const postId = params.postId as string;
  
  const [passcode, setPasscode] = useState('');
  const [post, setPost] = useState<PostData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001';

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ব্যাকএন্ডের ভেরিফিকেশন এপিআই কল করা হচ্ছে
      const res = await fetch(`${serverBaseUrl}/api/posts/verify-private`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, passcode })
      });

      const result = await res.json();

      if (result.success) {
        setPost(result.data);
      } else {
        setError(result.message || 'Failed to unlock post');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 🎉 স্টেট ১: পোস্ট আনলক হলে ফুল কন্টেন্ট ও ইমেজ দেখাবে
  if (post) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 text-black">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 tracking-wide">
            🔓 Decrypted Secure Node
          </span>
          <span className="text-[10px] text-slate-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          {post.content}
        </p>

        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-64 flex items-center justify-center">
            <img 
              src={post.mediaUrls[0]} 
              alt="Secure attached media" 
              className="w-full h-full object-cover max-h-64"
            />
          </div>
        )}
      </div>
    );
  }

  // 🔒 স্টেট ২: লকড স্টেট (পাসকোড ফর্ম)
  return (
    <div className="max-w-sm mx-auto mt-24 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm text-center space-y-4 text-black">
      <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>

      <div>
        <h2 className="text-sm font-bold text-slate-800">Encrypted Information</h2>
        <p className="text-[11px] text-slate-400 mt-1">This node is private. Enter the correct decryption passcode to view.</p>
      </div>

      <form onSubmit={handleUnlock} className="space-y-3">
        <input
          type="password"
          required
          placeholder="Enter Passcode"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-rose-500 transition text-center tracking-widest text-black"
        />

        {error && <p className="text-[10px] text-rose-500 font-bold">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Decrypting...' : 'Unlock Node'}
        </button>
      </form>
    </div>
  );
}