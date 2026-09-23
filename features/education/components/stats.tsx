import { Suspense } from 'react';
import { Award, CheckCircle2, GraduationCap, Sparkles, type LucideIcon } from 'lucide-react';
import { educationQueries } from '../db/queries';
import type { IEducationStatsNumber, EducationStatKey, EducationStatsProps } from '../types/stats.type';

type StatConfig = {
   type: EducationStatKey;
   label: string;
   description: string;
   icon: LucideIcon;
   iconClassName?: string;
};

const statConfig: StatConfig[] = [
   {
      type: 'total',
      label: 'Total Credentials',
      description: 'Degrees & certs',
      icon: GraduationCap,
   },
   {
      type: 'published',
      label: 'Published',
      description: 'Active on portfolio',
      icon: CheckCircle2,
      iconClassName: 'text-emerald-500',
   },
   {
      type: 'degrees',
      label: 'Degrees',
      description: 'Formal qualifications',
      icon: Award,
      iconClassName: 'text-indigo-500',
   },
   {
      type: 'certifications',
      label: 'Certifications',
      description: 'Industry certified',
      icon: Sparkles,
      iconClassName: 'text-amber-500',
   },
];

const StatsNumber = async ({ promise, type }: IEducationStatsNumber) => {
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

const Stats = ({ promise }: EducationStatsProps = {}) => {
   const statsPromise = promise ?? educationQueries.getStat();

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

