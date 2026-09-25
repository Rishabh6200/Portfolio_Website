import type { MetadataRoute } from "next"
import { projectQueries } from "@/features/project/db/queries"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

  let projects: { slug: string; updatedAt?: Date | string }[] = []
  try {
    projects = await projectQueries.getProjectsForSitemap()
  } catch (error) {
    console.error("Sitemap: Failed to load published projects", error)
  }

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...projectRoutes,
  ]
}
