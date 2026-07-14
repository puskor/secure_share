import { redirect } from "next/navigation";

export default function UserDefaultPage() {
  // ইউজার /user-এ ঢুকলে সরাসরি /user/private-এ চলে যাবে
  redirect("/dashboard/user/public");
}