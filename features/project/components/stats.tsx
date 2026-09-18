import { Suspense } from 'react';
import { CheckCircle2, Clock, FolderGit2, Sparkles, type LucideIcon } from 'lucide-react';
import { projectQueries } from '../db/queries';
import type { IStats, IStatsNumber, StatKey } from '../types/stats.type';

type StatConfig = {
   type: StatKey;
   label: string;
   description: string;
   icon: LucideIcon;
   iconClassName?: string;
};

const statConfig: StatConfig[] = [
   {
      type: 'total',
      label: 'Total',
      description: 'Systems in DB',
      icon: FolderGit2,
   },
   {
      type: 'published',
      label: 'Live',
      description: 'Published to site',
      icon: CheckCircle2,
      iconClassName: 'text-emerald-500',
   },
   {
      type: 'draft',
      label: 'Drafts',
      description: 'Hidden from public',
      icon: Clock,
   },
   {
      type: 'featured',
      label: 'Featured',
      description: 'Spotlight systems',
      icon: Sparkles,
      iconClassName: 'text-amber-500',
   },
];

const StatsNumber = async ({ promise, type }: IStatsNumber) => {
   const stats = await promise;

   return (
      <div className="text-xl font-bold text-foreground font-mono">
         {stats[type]}
      </div>
   );
};

const NumberSkeleton = () => (
   <div className="h-7 w-5 animate-pulse rounded bg-muted" />
);

const Stats = () => {
   const statsPromise = projectQueries.getStat();

   return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
         {statConfig.map((stat) => {
            const Icon = stat.icon;

            return (
               <div
                  key={stat.type}
                  className="space-y-1 rounded-xl border border-border bg-card p-4"
               >
                  <div className="flex items-center justify-between text-muted-foreground">
                     <span className="text-xs font-medium">
                        {stat.label}
                     </span>

                     <Icon
                        className={`h-3.5 w-3.5 ${stat.iconClassName ?? ''}`}
                     />
                  </div>

                  <Suspense fallback={<NumberSkeleton />}>
                     <StatsNumber
                        promise={statsPromise}
                        type={stat.type}
                     />
                  </Suspense>

                  <p className="text-[11px] text-muted-foreground">
                     {stat.description}
                  </p>
               </div>
            );
         })}
      </div>
   );
};

export default Stats;