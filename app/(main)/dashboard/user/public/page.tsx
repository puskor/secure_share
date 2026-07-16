"use client";

import React, { useEffect, useState } from 'react';

interface Author {
  name: string;
  image?: string;
}

interface PostData {
  _id: string;
  content: string;
  mediaUrls: string[];
  visibility: string;
  postManId: string;
  createdAt: string;
  authorDetails?: Author; // ব্যাকএন্ড থেকে আসা ইউজারের ডিটেইলস
}

export default function PublicPage() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts?visibility=public`);
        const result = await req.json();
        console.log(result)
        if (result.success) {
          setPosts(result.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // মিডিয়া ফাইলের এক্সটেনশন চেক করার হেল্পার
  const isVideoFile = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-xl font-black text-[#1E293B] mb-1">Public Cloud Feed</h1>
        <p className="text-xs text-slate-500">Discover and explore shared files instantly.</p>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-slate-400 animate-pulse">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-sm text-slate-400">No posts shared yet.</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const authorName = post.authorDetails?.name || "Anonymous User";
            const authorImg = post.authorDetails?.image || "https://api.dicebear.com/7.x/adventurer/svg?seed=user";
            const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div key={post._id} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-4">
                
                {/* ১. পোস্টের হেডার (ইউজার ইনফো ও টাইম) */}
                <div className="flex items-center space-x-3">
                  <img 
                    src={authorImg} 
                    alt={authorName} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{authorName}</h4>
                    <span className="text-[10px] font-medium text-slate-400 flex items-center space-x-1">
                      <span>{formattedDate}</span>
                      <span>•</span>
                      <span className="capitalize">{post.visibility}</span>
                    </span>
                  </div>
                </div>

                {/* ২. পোস্ট ডেসক্রিপশন */}
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>

                {/* ৩. পোস্ট মিডিয়া গ্রিড (ফটো/ভিডিও) */}
                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className={`grid gap-2 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 ${
                    post.mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                  }`}>
                    {post.mediaUrls.map((url, i) => {
                      const isVideo = isVideoFile(url);
                      return (
                        <div key={i} className="relative aspect-video w-full overflow-hidden bg-black flex items-center justify-center">
                          {isVideo ? (
                            <video 
                              src={url} 
                              controls 
                              className="w-full h-full object-contain max-h-96" 
                            />
                          ) : (
                            <img 
                              src={url} 
                              alt="Post media" 
                              className="w-full h-full object-cover max-h-96" 
                              loading="lazy"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                e
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}