"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    router.refresh();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-10 py-2 rounded text-white bg-[#4F46E5] hover:bg-[#4338CA] transition"
    >
      Logout
    </button>
  );
}