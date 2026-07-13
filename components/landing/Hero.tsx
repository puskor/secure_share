import React from 'react';

export default function Hero() {
  return (
    <section className="px-6 py-12 md:py-20 mx-auto bg-[#F8FAFC]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:px-20 items-center ">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1E293B] leading-tight">
            Share Files Securely.<br />Zero Exposure.
          </h1>
          <p className="text-base text-slate-600 max-w-md leading-relaxed">
            Meet SecureShare, the reliable way to share sensitive files without risking public access. 
            Simple, fast, and end-to-end encrypted.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button className="px-6 py-3 font-semibold text-white rounded bg-[#10B981] hover:bg-[#059669] transition shadow-sm">
              Start Sharing Now
            </button>
            <button className="px-6 py-3 font-semibold text-[#1E293B] bg-white rounded border border-slate-200 hover:bg-slate-50 transition shadow-sm">
              Learn How E2EE Works
            </button>
          </div>
        </div>

        {/* Right Illustration Placeholder */}
        <div className="flex justify-center items-center p-8 bg-white rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden h-[300px] md:h-[350px]">
          {/* এখানে আপনার ডিজাইন ইমেজ বা ইলাস্ট্রেশন বসবে */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-[#4F46E5] animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-xs font-mono text-slate-500">[ Secure Vector Illustration Area ]</p>
          </div>
        </div>
      </div>
    </section>
  );
}