"use client"

import { FC, useTransition } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/toast"
import { updateProfileAction } from "../actions"
import { profileSchema, DEFAULT_PROFILE, type ProfileData, type ProfileFormValues } from "../schema"

import { ProfileFormHeader } from "./form-header"
import { ProfileAvailabilityCard } from "./availability-card"
import { ProfileBioCard } from "./bio-card"
import { ProfileSocialsCard } from "./socials-card"
import { ProfileStatsCard } from "./stats-card"

interface ProfileFormProps {
   initialData?: ProfileData
}

export const ProfileForm: FC<ProfileFormProps> = ({ initialData }) => {
   const [isPending, startTransition] = useTransition()

   const defaultValues: ProfileFormValues = {
      name: initialData?.name || DEFAULT_PROFILE.name,
      role: initialData?.role || DEFAULT_PROFILE.role,
      tagline: initialData?.tagline ?? DEFAULT_PROFILE.tagline,
      bio: initialData?.bio ?? DEFAULT_PROFILE.bio,
      status: initialData?.status || DEFAULT_PROFILE.status,
      location: initialData?.location ?? DEFAULT_PROFILE.location,
      timezone: initialData?.timezone ?? DEFAULT_PROFILE.timezone,
      email: initialData?.email || DEFAULT_PROFILE.email,
      socials: {
         github: initialData?.socials?.github ?? DEFAULT_PROFILE.socials.github,
         linkedin: initialData?.socials?.linkedin ?? DEFAULT_PROFILE.socials.linkedin,
         twitter: initialData?.socials?.twitter ?? DEFAULT_PROFILE.socials.twitter,
         cal: initialData?.socials?.cal ?? DEFAULT_PROFILE.socials.cal ?? "",
         email: initialData?.socials?.email ?? initialData?.email ?? DEFAULT_PROFILE.socials.email ?? "",
      },
      stats: initialData?.stats && initialData.stats.length > 0
         ? initialData.stats
         : DEFAULT_PROFILE.stats,
   }

   const {
      register,
      control,
      handleSubmit,
      watch,
      setValue,
      formState: { errors, isSubmitting },
   } = useForm<ProfileFormValues>({
      resolver: zodResolver(profileSchema),
      defaultValues,
   })

   const { fields, append, remove } = useFieldArray({
      control,
      name: "stats",
   })

   const handleAddStat = () => {
      append({ label: "New Metric", value: "10+", subtext: "Metric description" })
   }

   const handleRemoveStat = (index: number) => {
      if (fields.length <= 1) {
         toast.add({
            type: "warning",
            title: "Cannot delete",
            description: "You must keep at least one stat card for your portfolio hero section.",
         })
         return
      }
      remove(index)
   }

   const onSubmit = (data: ProfileFormValues) => {
      startTransition(async () => {
         const res = await updateProfileAction(data)
         if (res.success) {
            toast.add({
               type: "success",
               title: "Profile updated",
               description: "Profile settings and social links were saved successfully.",
            })
         } else {
            toast.add({
               type: "error",
               title: "Update failed",
               description: res.error || "Failed to update profile",
            })
         }
      })
   }

   const isLoading = isPending || isSubmitting

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-16">
         <ProfileFormHeader isLoading={isLoading} />

         <ProfileAvailabilityCard
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
         />

         <ProfileBioCard register={register} errors={errors} />

         <ProfileSocialsCard register={register} watch={watch} />

         <ProfileStatsCard
            fields={fields}
            register={register}
            watch={watch}
            errors={errors}
            onAddStat={handleAddStat}
            onRemoveStat={handleRemoveStat}
         />
      </form>
   )
}

export default ProfileForm
