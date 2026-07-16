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
  authorDetails?: {
    name: string;
    image?: string;
  };
}

export default function FriendPage() {
  const [friendPosts, setFriendPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Better Auth সেশন ডাটা থেকে কারেন্ট ইউজার আইডি নেওয়া
  const { data: session, isPending } = authClient.useSession();
  const currentUserId = session?.user?.id;
  const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001';

  useEffect(() => {
    if (!currentUserId) return;

    const fetchFriendPosts = async () => {
      setLoading(true);
      try {
        // আপনার ব্যাকএন্ডের ফ্রেন্ডস পোস্ট এপিআই এন্ডপয়েন্ট
        const res = await fetch(`${serverBaseUrl}/api/posts/friends?userId=${currentUserId}`);
        const result = await res.json();
        
        if (result.success) {
          setFriendPosts(result.data);
        }
      } catch (error) {
        console.error("Error fetching friend posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendPosts();
  }, [currentUserId, serverBaseUrl]);

  // সেশন লোড হওয়ার স্টেট
  if (isPending) {
    return <div className="text-center py-10 text-xs text-slate-400">Loading profile data...</div>;
  }

  // ইউজার যদি লগইন না থাকে
  if (!session) {
    return <div className="text-center py-10 text-xs text-rose-500 font-bold">Please log in to see friend circle posts.</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      {/* হেডার সেকশন */}
      <div>
        <h1 className="text-xl font-black text-[#1E293B] mb-1">Friends Circle</h1>
        <p className="text-xs text-slate-500">Secure files shared directly with your verified contacts.</p>
      </div>

      <hr className="border-slate-200/60" />

      {/* পোস্ট ডিসপ্লে এরিয়া */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400 animate-pulse">Loading secure node data...</div>
        ) : friendPosts.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 p-8 rounded-2xl text-center text-xs text-slate-400">
            No friend posts available. Add some friends or wait for them to publish!
          </div>
        ) : (
          <div className="space-y-4">
            {friendPosts.map((post) => (
              <div key={post._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                
                {/* অথর (বন্ধু) ডিটেইলস */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={post.authorDetails?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorDetails?.name || 'Friend'}`}
                      alt="Author"
                      className="w-7 h-7 rounded-full object-cover border border-slate-100"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{post.authorDetails?.name || "Verified Contact"}</h4>
                      <p className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* ভিজিবিলিটি ব্যাজ */}
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold capitalize ${
                    post.visibility === 'public' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {post.visibility}
                  </span>
                </div>

                {/* পোস্টের মেইন টেক্সট */}
                <p className="text-xs font-semibold text-slate-700 leading-relaxed pl-1">
                  {post.content}
                </p>

                {/* 📸 ইমেজ রেন্ডারিং (mediaUrls থেকে ১ম ইমেজ) */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-64 flex items-center justify-center">
                    <img
                      src={post.mediaUrls[0]}
                      alt="Friend shared media"
                      className="w-full h-full object-cover max-h-64"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}