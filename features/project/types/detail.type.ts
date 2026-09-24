export interface ProjectSkillInfo {
   id: string
   name: string
   categoryId?: {
      name: string
      slug: string
      color: string
   }
}

export interface WebProjectDetail {
   id: string
   slug: string
   title: string
   role: string
   tagline: string
   description: string
   logo: string
   images: string[]
   featured: boolean
   githubUrl: string
   liveUrl: string
   skills: ProjectSkillInfo[]
}

export interface ProjectDetailContext {
   project: WebProjectDetail
   prevProject: WebProjectDetail | null
   nextProject: WebProjectDetail | null
}
