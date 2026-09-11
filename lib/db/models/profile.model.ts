import mongoose, { Schema, Document, Model } from "mongoose"
import { DEFAULT_PROFILE } from "@/lib/constants/profile"

export interface ISocials {
  github: string
  linkedin: string
  twitter: string
  cal?: string
  email?: string
}

export interface IStatItem {
  label: string
  value: string
  subtext: string
}

export interface IProfile extends Document {
  name: string
  role: string
  tagline: string
  bio: string
  status: string
  location: string
  timezone: string
  email: string
  socials: ISocials
  stats: IStatItem[]
  createdAt: Date
  updatedAt: Date
}

const ProfileSchema = new Schema<IProfile>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      default: DEFAULT_PROFILE.name,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      default: DEFAULT_PROFILE.role,
    },
    tagline: {
      type: String,
      default: DEFAULT_PROFILE.tagline,
      trim: true,
    },
    bio: {
      type: String,
      default: DEFAULT_PROFILE.bio,
      trim: true,
    },
    status: {
      type: String,
      default: DEFAULT_PROFILE.status,
      trim: true,
    },
    location: {
      type: String,
      default: DEFAULT_PROFILE.location,
      trim: true,
    },
    timezone: {
      type: String,
      default: DEFAULT_PROFILE.timezone,
      trim: true,
    },
    email: {
      type: String,
      default: DEFAULT_PROFILE.email,
      trim: true,
    },
    socials: {
      github: { type: String, default: DEFAULT_PROFILE.socials.github },
      linkedin: { type: String, default: DEFAULT_PROFILE.socials.linkedin },
      twitter: { type: String, default: DEFAULT_PROFILE.socials.twitter },
      cal: { type: String, default: DEFAULT_PROFILE.socials.cal || "" },
      email: { type: String, default: DEFAULT_PROFILE.socials.email || "" },
    },
    stats: {
      type: [
        {
          label: { type: String, required: true },
          value: { type: String, required: true },
          subtext: { type: String, default: "" },
        },
      ],
      default: () => DEFAULT_PROFILE.stats,
    },
  },

  {
    timestamps: true,
  }
)

export const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema)
