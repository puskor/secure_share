"use client";

import React, { useState, useRef } from "react";
import { useUploadThing } from "@/lib/uploadthing"; // হেল্পার ইম্পোর্ট করুন
import { useSession } from "@/lib/auth-client";

export type PostVisibility = "public" | "friend" | "private";

interface PostFormProps {
  onSubmit: (data: {
    content: string;
    visibility: PostVisibility;
    passcode: string;
    mediaUrls: string[]; // আপলোড হওয়া ফাইলের URL গুলো এখানে যাবে
  }) => void;
  loading: boolean;
  onClose: () => void;
}

export default function PostForm({
  onSubmit,
  loading: externalLoading,
  onClose,
}: PostFormProps) {
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<PostVisibility>("public");
  const [passcode, setPasscode] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // লোকাল মিডিয়া ফাইল ও প্রিভিউ স্টেট
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ১. UploadThing হুক ইনিশিয়েলাইজেশন
  const { startUpload } = useUploadThing("mediaUploader", {
    onClientUploadComplete: (res) => {
      console.log("Files uploaded successfully!", res);
    },
    onUploadError: (error: Error) => {
      alert(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const previewsArray = filesArray.map((file) => URL.createObjectURL(file));
      setFilePreviews((prev) => [...prev, ...previewsArray]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const { data: session } = useSession();

  const userId = session?.user?.id;
  //   console.log(userId)

  // ২. সাবমিট হ্যান্ডলার (প্রথমে ফাইল UploadThing-এ আপলোড করবে, তারপর এক্সপ্রেস এপিআই-তে ডেটা পাঠাবে)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (visibility === "private" && !passcode) {
      alert("Please provide a passcode!");
      return;
    }

    setIsUploading(true);
    let uploadedUrls: string[] = [];

    try {
      // ১. যদি ইউজার কোনো ফাইল সিলেক্ট করে থাকে, তবে আগে UploadThing-এ আপলোড হবে
      if (selectedFiles.length > 0) {
        const uploadResponse = await startUpload(selectedFiles);
        if (uploadResponse) {
          uploadedUrls = uploadResponse.map((file) => file.url);
        }
      }

      const url = process.env.NEXT_PUBLIC_SERVER_URL 

      // ২. ফাইল আপলোড শেষ হলে সরাসরি আমাদের Express.js এপিআই কল হবে
      const response = await fetch(`${url}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          mediaUrls: uploadedUrls, // UploadThing থেকে পাওয়া রিড-অনলি URLs
          visibility,
          passcode: visibility === "private" ? passcode : null,
          postManId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Post created successfully in MongoDB!");

        // যদি প্যারেন্ট কম্পোনেন্টকে ডেটা পাস করতে চান
        onSubmit({
          content,
          visibility,
          passcode,
          mediaUrls: uploadedUrls,
        });

        // ফর্ম রিসেট এবং ক্লোজ করা
        setContent("");
        setSelectedFiles([]);
        setFilePreviews([]);
        setPasscode("");
        onClose();
      } else {
        alert(result.message || "Failed to create post.");
      }
    } catch (err) {
      console.error("Error connecting to backend:", err);
      alert("Could not connect to the Express server.");
    } finally {
      setIsUploading(false);
    }
  };

  const getGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    return "grid-cols-3";
  };

  const isLoading = externalLoading || isUploading;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wide">
          Create Secure Post
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-slate-400 hover:text-slate-600"
        >
          Cancel
        </button>
      </div>

      {/* Description Content */}
      <textarea
        required
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind? Add descriptions, links, or text..."
        className="w-full px-4 py-3 bg-slate-50/50 border text-black font-bold border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-[#4F46E5] transition resize-none placeholder:text-slate-400"
      />

      {/* Photo/Video Selector */}
      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
            Add to your post
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-indigo-50 rounded-full text-[#4F46E5] transition flex items-center space-x-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span className="text-xs font-bold hidden sm:inline">
              Photo/Video
            </span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Grid Preview */}
        {filePreviews.length > 0 && (
          <div className={`grid gap-2 ${getGridClass(filePreviews.length)}`}>
            {filePreviews.map((src, index) => {
              const isVideo = selectedFiles[index]?.type.startsWith("video/");
              return (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden bg-black border border-slate-200 group"
                >
                  {isVideo ? (
                    <video src={src} className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Visibility */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setVisibility("public")}
          className={`py-2 rounded-lg border text-xs font-bold transition ${visibility === "public" ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]" : "bg-white border-slate-200 text-slate-600"}`}
        >
          Public
        </button>
        <button
          type="button"
          onClick={() => setVisibility("friend")}
          className={`py-2 rounded-lg border text-xs font-bold transition ${visibility === "friend" ? "bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]" : "bg-white border-slate-200 text-slate-600"}`}
        >
          Friends
        </button>
        <button
          type="button"
          onClick={() => setVisibility("private")}
          className={`py-2 rounded-lg border text-xs font-bold transition ${visibility === "private" ? "bg-red-50 border-[#EF4444] text-[#EF4444]" : "bg-white border-slate-200 text-slate-600"}`}
        >
          Private
        </button>
      </div>

      {/* Passcode for Private Mode */}
      {visibility === "private" && (
        <input
          type="password"
          required
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Set secure encryption passcode"
          className="w-full px-4 py-2 bg-white border border-red-200 focus:border-[#EF4444] rounded-lg text-sm focus:outline-none transition"
        />
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2.5 text-xs font-bold text-white rounded-lg shadow-sm transition uppercase tracking-wider ${visibility === "private" ? "bg-[#EF4444] hover:bg-[#DC2626]" : "bg-[#4F46E5] hover:bg-[#4338CA]"}`}
      >
        {isLoading ? "Uploading Files & Publishing..." : "Publish Post"}
      </button>
    </form>
  );
}
