export interface IStats {
   total: number;
   draft: number;
   published: number;
   featured: number;
}

export type StatKey = keyof IStats;

export interface IStatsNumber {
   promise: Promise<IStats>;
   type: StatKey;
}