export interface IEducationStats {
   total: number;
   published: number;
   degrees: number;
   certifications: number;
}

export type EducationStatKey = keyof IEducationStats;

export interface IEducationStatsNumber {
   promise: Promise<IEducationStats> | IEducationStats;
   type: EducationStatKey;
}

export interface EducationStatsProps {
   promise?: Promise<IEducationStats> | IEducationStats;
}
