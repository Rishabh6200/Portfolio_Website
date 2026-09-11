import { profileService } from "@/services"
import { ProfileForm } from "./_components/profile-form"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Profile & Social Links — Admin",
}

export default async function AdminProfilePage() {
  const profile = await profileService.getProfile()

  return (
    <div className="max-w-5xl mx-auto">
      <ProfileForm initialData={profile} />
    </div>
  )
}
