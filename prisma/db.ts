import postgres from "@prisma/orm-postgres/runtime";

import "temporal-polyfill/global";

import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

export const db = process.env.DATABASE_URL
  ? postgres<Contract>({ contractJson, url: process.env.DATABASE_URL })
  : postgres<Contract>({ contractJson });

let connection: Promise<void> | undefined;

export function connectDatabase(): Promise<void> {
  connection ??= db.connect().then(() => undefined).catch((error: unknown) => {
    connection = undefined;
    throw error;
  });
  return connection;
}

export const ProjectStatus = db.enums.public.ProjectStatus;
export type ProjectStatus = (typeof db.enums.public.ProjectStatus.values)[number];

export const SkillLevel = db.enums.public.SkillLevel;
export type SkillLevel = (typeof db.enums.public.SkillLevel.values)[number];


