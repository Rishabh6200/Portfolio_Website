export interface IExperienceStats {
   total: number;
   current: number;
   remote: number;
   fullTime: number;
}

export type ExperienceStatKey = keyof IExperienceStats;

export interface IExperienceStatsNumber {
   promise: Promise<IExperienceStats> | IExperienceStats;
   type: ExperienceStatKey;
}

export interface ExperienceStatsProps {
   promise?: Promise<IExperienceStats> | IExperienceStats;
}
