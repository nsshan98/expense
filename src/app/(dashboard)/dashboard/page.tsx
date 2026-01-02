import { DashboardContent } from "@/components/features/dashboard/home/dashboard-content";
import { getCurrentUser } from "@/services/user";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your expenses and manage your budget
        </p>
      </div>

      <DashboardContent hasApiKey={user.hasGeminiKey} />
    </div>
  );
}
