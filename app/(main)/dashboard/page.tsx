import { redirect } from "next/navigation";
import { getSession } from "@/lib/method/main";

const DashboardPage = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role === "admin") {
    redirect("/dashboard/admin");
  }

  redirect("/dashboard/user");
};

export default DashboardPage;