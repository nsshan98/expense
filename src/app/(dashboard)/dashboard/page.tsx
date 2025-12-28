import { DashboardContent } from "@/components/features/dashboard/home/dashboard-content";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your expenses and manage your budget
        </p>
      </div>

      <DashboardContent />
    </div>
  );
}
