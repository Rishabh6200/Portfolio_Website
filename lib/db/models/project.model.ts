import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IProject extends Document {
  title: string
  slug: string
  tagline: string
  description: string
  role: string
  skills: Types.ObjectId[]
  logo?: string
  images: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  status: "published" | "draft"
  order: number
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Project slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    tagline: {
      type: String,
      required: [true, "Project tagline is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    role: {
      type: String,
      default: "Full-Stack Developer",
      trim: true,
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    logo: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: "",
    },
    githubUrl: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

mongoose.set("strictPopulate", false)

// In Next.js dev server/HMR, clear stale cached model if it lacks the new 'skills' field
if (mongoose.models && mongoose.models.Project) {
  if (!mongoose.models.Project.schema?.path("skills")) {
    delete (mongoose.models as Record<string, unknown>).Project
  }
}

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
