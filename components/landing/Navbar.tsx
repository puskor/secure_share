import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 md:px-20 mx-auto  bg-white">
      {/* Logo & Rating */}
      <Link href={"/"} className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-8 h-8 rounded bg-[#4F46E5] text-white">
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
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <span className="text-xl font-bold text-[#1E293B]">SecureShare</span>
        <span className="text-sm hidden md:block text-[#F59E0B]">
          ⭐⭐⭐⭐⭐
        </span>
      </Link>

      {/* Nav Links */}
      <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-[#1E293B]">
        <a href="#features" className="hover:text-[#4F46E5] transition">
          Features
        </a>
        <a href="#security" className="hover:text-[#4F46E5] transition">
          Security
        </a>
        <a href="#pricing" className="hover:text-[#4F46E5] transition">
          Pricing
        </a>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-3 text-sm font-medium">
        <button className="px-10 py-2 rounded text-white bg-[#4F46E5] hover:bg-[#4338CA] transition">
          Start
        </button>
        <Link href={"/signup"}>
          <button className="px-4 py-2 rounded text-white bg-[#10B981] hover:bg-[#059669] transition">
            Create Account
          </button>
        </Link>
      </div>
    </nav>
  );
}
