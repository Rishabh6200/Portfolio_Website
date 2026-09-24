import { overviewQueries } from "@/features/overview/db/queries"
import { OverviewHeader } from "@/features/overview/components/overview-header"
import { KpiCards } from "@/features/overview/components/kpi-cards"
import { RecentProjectsCard } from "@/features/overview/components/recent-projects-card"
import { CategoryDistributionCard } from "@/features/overview/components/category-distribution-card"
import { QuickActionsCard } from "@/features/overview/components/quick-actions-card"
import { SystemStatusCard } from "@/features/overview/components/system-status-card"

export const dynamic = "force-dynamic"

export default async function AdminOverviewPage() {
   const data = await overviewQueries.getOverviewData()

   return (
      <div className="space-y-6">
         {/* Welcome & Live Status Header */}
         <OverviewHeader profile={data.profile} />

         {/* Top Metric KPI Cards */}
         <KpiCards data={data} />

         {/* Main Overview Grid */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 7 Columns: Projects & Tech Distribution */}
            <div className="lg:col-span-7 space-y-6">
               <RecentProjectsCard projects={data.recentProjects} />
               <CategoryDistributionCard
                  categories={data.categories}
                  skillsCount={data.skillsCount}
                  skillsByLevel={data.skillsByLevel}
               />
            </div>

            {/* Right 5 Columns: Shortcuts, System Health & Profile */}
            <div className="lg:col-span-5 space-y-6">
               <QuickActionsCard />
               <SystemStatusCard profile={data.profile} />
            </div>
         </div>
      </div>
   )
}
