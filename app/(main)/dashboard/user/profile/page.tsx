"use client";

import React, { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import UserProfileCard from '@/components/secure/UserProfileCard';
import PostForm, { PostVisibility } from '@/components/secure/PostForm';

// ইন্টারফেস ডেফিনিশন
interface SimpleUser {
  _id: string;
  name: string;
  image?: string;
}

interface Post {
  _id: string;
  title?: string;
  content: string;
  mediaUrls?: string[]; // 📸 আপনার ডাটাবেজ অনুযায়ী mediaUrls অ্যারে যুক্ত করা হলো
  visibility: PostVisibility;
  createdAt: string;
  authorDetails?: {
    name: string;
    image?: string;
  };
}

export default function ProfilePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [postType, setPostType] = useState<PostVisibility>('public');

  // ফ্রেন্ড ও পোস্ট ফিচারের ট্যাব স্টেট (ডিফল্ট: 'my_posts')
  const [activeTab, setActiveTab] = useState<string>('my_posts');
  const [usersList, setUsersList] = useState<SimpleUser[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [tabLoading, setTabLoading] = useState(false);

  // Better Auth সেশন ডাটা
  const { data: session, isPending } = authClient.useSession();
  const currentUserId = session?.user?.id;
  const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001';

  // ট্যাব পরিবর্তনের সাথে সাথে ডাটা লোড করার useEffect
  useEffect(() => {
    if (!currentUserId || !activeTab) return;

    const fetchTabData = async () => {
      setTabLoading(true);
      try {
        let endpoint = '';
        
        // ১. নিজের পোস্টগুলো নেওয়ার এপিআই এন্ডপয়েন্ট
        if (activeTab === 'my_posts') {
          endpoint = `${serverBaseUrl}/api/posts/my-posts?userId=${currentUserId}`;
          const res = await fetch(endpoint);
          const result = await res.json();
          if (result.success) {
            setMyPosts(result.data);
          }
          return;
        }
        
        // ফ্রেন্ডস ম্যানেজমেন্ট ট্যাবগুলোর জন্য এন্ডপয়েন্ট
        if (activeTab === 'add_friend') {
          endpoint = `${serverBaseUrl}/api/users/unfriends?userId=${currentUserId}`;
        } else if (activeTab === 'my_friends') {
          endpoint = `${serverBaseUrl}/api/users/friends?userId=${currentUserId}`;
        } else if (activeTab === 'my_requests') {
          endpoint = `${serverBaseUrl}/api/users/requests?userId=${currentUserId}`;
        }

        const res = await fetch(endpoint);
        const result = await res.json();
        if (result.success) {
          setUsersList(result.data);
        }
      } catch (error) {
        console.error("Error fetching tab data:", error);
      } finally {
        setTabLoading(false);
      }
    };

    fetchTabData();
  }, [activeTab, currentUserId, serverBaseUrl]);

  // ফ্রেন্ডস অ্যাকশন ফাংশনসমূহ
  const handleFollowUser = async (targetUserId: string) => {
    try {
      const res = await fetch(`${serverBaseUrl}/api/user/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, friendId: targetUserId })
      });
      const result = await res.json();
      if (result.success) {
        setUsersList(prev => prev.filter(user => user._id !== targetUserId));
        alert("Friend Request Sent!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAcceptRequest = async (targetUserId: string) => {
    try {
      const res = await fetch(`${serverBaseUrl}/api/user/accept-friend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, friendId: targetUserId })
      });
      const result = await res.json();
      if (result.success) {
        setUsersList(prev => prev.filter(user => user._id !== targetUserId));
        alert("Friend request accepted!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfriendUser = async (targetUserId: string) => {
    try {
      const res = await fetch(`${serverBaseUrl}/api/user/unfriend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, friendId: targetUserId })
      });
      const result = await res.json();
      if (result.success) {
        setUsersList(prev => prev.filter(user => user._id !== targetUserId));
        alert("Unfriended successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🎯 🌟 টাইপস্ক্রিপ্ট এরর ফিক্সড ফাংশন (PostForm এর onSubmit এর সাথে টাইপ এলাইন করা হয়েছে)
  const handleCreatePost = async (formData: { 
    content: string; 
    visibility: PostVisibility; 
    passcode: string; 
    mediaUrls: string[]; 
  }) => {
    setLoading(true);
    setGeneratedUrl('');
    setCopied(false);
    setPostType(formData.visibility);

    try {
      // ব্যাকএন্ড এপিআই-তে ডাটা পাঠানো হচ্ছে
      const res = await fetch(`${serverBaseUrl}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postManId: currentUserId, // আপনার ব্যাকএন্ড এই ফিল্ড দিয়ে কুয়েরি করে
          content: formData.content,
          visibility: formData.visibility,
          passcode: formData.visibility === 'private' ? formData.passcode : null,
          mediaUrls: formData.mediaUrls || [],
          createdAt: new Date()
        })
      });

      const result = await res.json();

      if (result.success) {
        // ইউনিক আইডি ও শেয়ারিং লিংক জেনারেশন
        const uniqueId = result.insertedId || Math.random().toString(36).substring(2, 9);
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const shareUrl = `${origin}/share/${uniqueId}`;

        setGeneratedUrl(shareUrl);
        setIsFormOpen(false);
        
        // পোস্ট সফল হলে My Posts ট্যাব রিফ্রেশ লজিক
        if (activeTab === 'my_posts') {
          setActiveTab('');
          setTimeout(() => setActiveTab('my_posts'), 10);
        }
      } else {
        alert("Failed to save post in database.");
      }
    } catch (error) {
      console.error("Error creating secure post:", error);
      alert("Something went wrong while uploading the post.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      
      {/* ১. প্রোফাইলカード */}
      <UserProfileCard 
        name={session?.user?.name || "Guest User"} 
        email={session?.user?.email || "Not Sign In"} 
        loading={isPending} 
      />

      {/* ২. নতুন পোস্ট তৈরি করার এরিয়া (ট্যাব বোতামগুলোর উপরে) */}
      {!isFormOpen && (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-sm font-bold text-[#1E293B]">Publish New Information</h3>
              <p className="text-xs text-slate-500 mt-0.5">Encrypt content, control visibility layers, and manage secure nodes.</p>
            </div>
            <button
              onClick={() => {
                setGeneratedUrl(''); 
                setIsFormOpen(true);
              }}
              className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap"
            >
              Create Secure Post
            </button>
          </div>
        </div>
      )}

      {/* ৩. ডাইনামিক পোস্ট ফর্ম */}
      {isFormOpen && (
        <PostForm 
          onSubmit={handleCreatePost} 
          loading={loading} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {/* ৪. লিংক শেয়ারিং সাকসেস ব্লক */}
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

      {/* --- ৫. ৪-ট্যাব ম্যানেজমেন্ট নেভিগেশন --- */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60">
        <button
          onClick={() => setActiveTab('my_posts')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'my_posts' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          My Posts
        </button>
        <button
          onClick={() => setActiveTab('add_friend')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'add_friend' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          Add Friend
        </button>
        <button
          onClick={() => setActiveTab('my_friends')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'my_friends' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          My Friends
        </button>
        <button
          onClick={() => setActiveTab('my_requests')}
          className={`py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'my_requests' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          My Requests
        </button>
      </div>

      {/* --- 🌍 ৬. ডাইনামিক কন্টেন্ট রেন্ডারিং প্যানেল --- */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        
        {/* কন্টেন্ট লোডিং স্টেট */}
        {tabLoading && (
          <div className="text-center py-10 text-xs text-slate-400 animate-pulse">Loading content...</div>
        )}

        {/* --- কন্ডিশন ১: MY POSTS ট্যাব রেন্ডারিং --- */}
        {!tabLoading && activeTab === 'my_posts' && (
          <div className="space-y-4">
            {myPosts.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">You haven't created any posts yet.</div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {myPosts.map((post) => (
                  <div key={post._id} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        post.visibility === 'public' ? 'bg-emerald-50 text-emerald-600' :
                        post.visibility === 'friend' ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {post.visibility}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-xs font-semibold text-slate-700 leading-relaxed">{post.content}</p>
                    
                    {post.mediaUrls && post.mediaUrls.length > 0 && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-64 flex items-center justify-center">
                        <img 
                          src={post.mediaUrls[0]} 
                          alt="Post Content Attachment" 
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
        )}

        {/* --- কন্ডিশন ২: ফ্রেন্ডস সম্পর্কিত ৩টি ট্যাব রেন্ডারিং --- */}
        {!tabLoading && activeTab !== 'my_posts' && (
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {activeTab === 'add_friend' && 'Find New People'}
                {activeTab === 'my_friends' && 'All Connections'}
                {activeTab === 'my_requests' && 'Incoming Friend Requests'}
              </h3>
            </div>

            {usersList.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">List is empty.</div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
                {usersList.map((user) => (
                  <div key={user._id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-100"
                      />
                      <span className="text-xs font-semibold text-slate-700">{user.name}</span>
                    </div>

                    {activeTab === 'add_friend' && (
                      <button
                        onClick={() => handleFollowUser(user._id)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#4F46E5] text-[10px] font-bold rounded-lg transition"
                      >
                        Follow
                      </button>
                    )}

                    {activeTab === 'my_friends' && (
                      <button
                        onClick={() => handleUnfriendUser(user._id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold rounded-lg transition"
                      >
                        Unfriend
                      </button>
                    )}

                    {activeTab === 'my_requests' && (
                      <button
                        onClick={() => handleAcceptRequest(user._id)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-lg transition"
                      >
                        Accept
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}