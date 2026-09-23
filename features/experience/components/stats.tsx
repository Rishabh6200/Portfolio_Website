import { Suspense } from 'react';
import { Briefcase, Clock, Globe, Sparkles, type LucideIcon } from 'lucide-react';
import { experienceQueries } from '../db/queries';
import type { IExperienceStatsNumber, ExperienceStatKey, ExperienceStatsProps } from '../types/stats.type';

type StatConfig = {
   type: ExperienceStatKey;
   label: string;
   description: string;
   icon: LucideIcon;
   iconClassName?: string;
};

const statConfig: StatConfig[] = [
   {
      type: 'total',
      label: 'Total Roles',
      description: 'Career positions',
      icon: Briefcase,
   },
   {
      type: 'current',
      label: 'Current / Active',
      description: 'Ongoing positions',
      icon: Sparkles,
      iconClassName: 'text-emerald-500',
   },
   {
      type: 'remote',
      label: 'Remote',
      description: 'Distributed roles',
      icon: Globe,
      iconClassName: 'text-sky-500',
   },
   {
      type: 'fullTime',
      label: 'Full-Time',
      description: 'Primary employment',
      icon: Clock,
      iconClassName: 'text-indigo-500',
   },
];

const StatsNumber = async ({ promise, type }: IExperienceStatsNumber) => {
   const stats = await promise;

   return (
      <div className="text-xl font-bold text-foreground font-mono">
         {stats[type]}
      </div>
   );
};

export const NumberSkeleton = () => (
   <div className="h-7 w-6 animate-pulse rounded bg-muted" />
);

export const StatsSkeleton = () => (
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

               <NumberSkeleton />

               <p className="text-[11px] text-muted-foreground">
                  {stat.description}
               </p>
            </div>
         );
      })}
   </div>
);

const Stats = ({ promise }: ExperienceStatsProps = {}) => {
   const statsPromise = promise ?? experienceQueries.getStat();

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

