export interface IStats {
   total: number;
   draft: number;
   published: number;
   featured: number;
}

export type StatKey = keyof IStats;

export interface IStatsNumber {
   promise: Promise<IStats> | IStats;
   type: StatKey;
}

export interface ProjectStatsProps {
   promise?: Promise<IStats> | IStats;
}