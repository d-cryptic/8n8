import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentWorkflows } from "@/components/dashboard/RecentWorkflows";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <DashboardStats />
          <div className="mt-8">
            <RecentWorkflows />
          </div>
        </div>
      </main>
    </div>
  );
}
