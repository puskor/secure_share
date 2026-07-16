"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

interface Post {
  _id: string;
  title?: string;
  content: string;
  mediaUrls?: string[];
  visibility: string;
  createdAt: string;
}

export default function PrivatePage() {
  const [privatePosts, setPrivatePosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 🔐 আনলক হওয়া সম্পূর্ণ পোস্ট ডাটা ট্র্যাক করার জন্য অবজেক্ট স্টেট
  const [decryptedPosts, setDecryptedPosts] = useState<{ [key: string]: Post }>({});
  const [passcodeInput, setPasscodeInput] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // 📋 শেয়ারিং স্টেট ট্র্যাকিং (কোন পোস্টের লিংক কপি হয়েছে তা সাময়িক দেখানোর জন্য)
  const [shareCopiedId, setShareCopiedId] = useState<string | null>(null);

  // Better Auth সেশন
  const { data: session, isPending } = authClient.useSession();
  const currentUserId = session?.user?.id;
  const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001';

  // ডাটাবেজ থেকে শুধুমাত্র নিজের প্রাইভেট পোস্টগুলো লোড করা
  useEffect(() => {
    if (!currentUserId) return;

    const fetchPrivatePosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${serverBaseUrl}/api/posts/my-posts?userId=${currentUserId}`);
        const result = await res.json();
        
        if (result.success) {
          const privateOnly = result.data.filter((post: Post) => post.visibility === 'private');
          setPrivatePosts(privateOnly);
        }
      } catch (error) {
        console.error("Error fetching private nodes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivatePosts();
  }, [currentUserId, serverBaseUrl]);

  // পাসকোড ভেরিফাই করার লোকাল হ্যান্ডলার
  const handleVerifyPasscode = async (postId: string) => {
    const inputCode = passcodeInput[postId];
    if (!inputCode) return;

    setErrors(prev => ({ ...prev, [postId]: '' }));

    try {
      const res = await fetch(`${serverBaseUrl}/api/posts/verify-private`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, passcode: inputCode })
      });

      const result = await res.json();

      if (result.success) {
        setDecryptedPosts(prev => ({ ...prev, [postId]: result.data }));
      } else {
        setErrors(prev => ({ ...prev, [postId]: result.message || 'Incorrect Passcode!' }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, [postId]: 'Verification failed.' }));
    }
  };

  // 🚀 ডাইনামিক শেয়ার হ্যান্ডলার (লিংক ও পাসকোড একসাথে ক্লিপবোর্ডে কপি করার জন্য)
  const handleShareSecureNode = (postId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const shareUrl = `${origin}/share/${postId}`;
    const activePasscode = passcodeInput[postId] || '';

    // টেক্সট ফরম্যাট যা ইউজারের ক্লিপবোর্ডে সেভ হবে
    const shareMessage = `🔐 Secure Node Shared With You!\n\n🔗 Link: ${shareUrl}\n🔑 Passcode: ${activePasscode}`;

    navigator.clipboard.writeText(shareMessage).then(() => {
      setShareCopiedId(postId);
      alert(`🎉 Link and Passcode copied to clipboard!\n\nNow you can send it to your friends.`);
      setTimeout(() => setShareCopiedId(null), 3000);
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  if (isPending) return <div className="text-center py-10 text-xs text-slate-400">Loading vault...</div>;
  if (!session) return <div className="text-center py-10 text-xs text-rose-500 font-bold">Access Denied. Please log in.</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      {/* হেডার */}
      <div>
        <h1 className="text-xl font-black text-[#1E293B] mb-1">Zero-Knowledge Private Vault</h1>
        <p className="text-xs text-slate-500">Your highly restricted, locally encrypted secure space.</p>
      </div>

      <hr className="border-slate-200/60" />

      {/* প্রাইভেট পোস্ট লিস্ট */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400 animate-pulse">Scanning secure database...</div>
        ) : privatePosts.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-2xl text-center text-xs text-slate-400">
            No encrypted posts found in your vault.
          </div>
        ) : (
          <div className="space-y-4">
            {privatePosts.map((post) => {
              const decryptedData = decryptedPosts[post._id];
              const isUnlocked = !!decryptedData;

              return (
                <div key={post._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 transition-all">
                  
                  {/* পোস্ট হেডার */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase flex items-center gap-1 ${
                      isUnlocked ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7 0v3h7z" clipRule="evenodd" />
                      </svg>
                      {isUnlocked ? "Decrypted Node" : "Encrypted"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* কন্ডিশনাল কন্টেন্ট ডিসপ্লে */}
                  {isUnlocked ? (
                    // 🔓 স্টেট ১: আনলকড কন্টেন্ট (সম্পূর্ণ ডেসক্রিপশন, ইমেজ ও শেয়ার বাটন)
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                        {decryptedData.content}
                      </p>
                      
                      {decryptedData.mediaUrls && decryptedData.mediaUrls.length > 0 && (
                        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-64 flex items-center justify-center">
                          <img
                            src={decryptedData.mediaUrls[0]}
                            alt="Vault attached file"
                            className="w-full h-full object-cover max-h-64"
                          />
                        </div>
                      )}

                      {/* 🔗 ডাইনামিক শেয়ার সেকশন (শুধুমাত্র আনলক হলেই দেখা যাবে) */}
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleShareSecureNode(post._id)}
                          className={`px-4 py-2 text-[11px] font-bold rounded-xl transition flex items-center space-x-1.5 shadow-sm ${
                            shareCopiedId === post._id 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-indigo-50 text-[#4F46E5] hover:bg-indigo-100'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                          </svg>
                          <span>{shareCopiedId === post._id ? 'Copied Securely!' : 'Share Node'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 🔒 স্টেট ২: লকড কন্টেন্ট (আংশিক কন্টেন্ট প্রিভিউ + পাসকোড ফর্ম)
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-slate-400 line-clamp-2 italic bg-slate-50/30 p-2.5 border border-slate-100 border-dashed rounded-xl select-none">
                        {post.content.slice(0, 50)}
                        {post.content.length > 50 ? "..." : ""}
                      </p>

                      <div className="py-1 flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex-1 w-full">
                          <input
                            type="password"
                            placeholder="Enter passcode to decrypt content"
                            value={passcodeInput[post._id] || ''}
                            onChange={(e) => setPasscodeInput(prev => ({ ...prev, [post._id]: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-center tracking-wide outline-none focus:border-rose-400 transition text-black"
                          />
                          {errors[post._id] && (
                            <p className="text-[10px] text-rose-500 font-bold mt-1 text-left pl-1">{errors[post._id]}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleVerifyPasscode(post._id)}
                          className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition shadow-sm whitespace-nowrap"
                        >
                          Decrypt Node
                        </button>
                      </div>
                    </div>
                  )}
                  
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}