import { Suspense } from "react"
import { profileQueries } from "@/features/profile/db/queries"
import ProfileForm from "@/features/profile/components/form"
import ProfileFormSkeleton from "@/features/profile/skeleton/form-skeleton"

export const dynamic = "force-dynamic"

export const metadata = {
   title: "Profile & Social Links — Console",
   description: "Manage your personal bio, live availability status, fixed social links, and hero metric cards.",
}

const ProfilePageContent = async () => {
   const profile = await profileQueries.getProfile()
   return <ProfileForm initialData={profile} />
}

const Page = () => {
   return (
      <div className="w-full">
         <Suspense fallback={<ProfileFormSkeleton />}>
            <ProfilePageContent />
         </Suspense>
      </div>
   )
}

export default Page
