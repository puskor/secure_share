
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F8FAFC] border-t h-56 px-20 border-slate-100 px-6 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        
        {/* Left Side: Logo & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-[#4F46E5] text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <span className="text-base font-bold text-[#1E293B]">SecureShare</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            &copy; {currentYear} SecureShare. All rights reserved.
          </p>
        </div>

        {/* Center/Right Side: Quick Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#1E293B]">
          <a href="#about" className="hover:text-[#4F46E5] transition">About</a>
          <a href="#security" className="hover:text-[#4F46E5] transition">Security</a>
          <a href="#pricing" className="hover:text-[#4F46E5] transition">Pricing</a>
          <a href="#contact" className="hover:text-[#4F46E5] transition">Contact</a>
        </div>

        {/* Right Side: Tech Badge */}
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Built with TypeScript
          </span>
        </div>

      </div>
    </footer>
  );
}