import mongoose, { Schema, Document, Model } from "mongoose"

export interface IProject extends Document {
  slug: string
  title: string
  tagline: string
  description: string
  category: string
  role: string
  timeline?: string
  accentColor?: string
  coverImage?: string
  architectureDiagram?: string
  technologies: string[]
  highlights: string[]
  architectureOverview?: string
  challenge?: string
  solution?: string
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
    slug: {
      type: String,
      required: [true, "Project slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
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
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      default: "Full-Stack",
      index: true,
    },
    role: {
      type: String,
      default: "Full-Stack Engineer",
    },
    timeline: {
      type: String,
      default: "Recent",
    },
    accentColor: {
      type: String,
      default: "#6366f1",
    },
    coverImage: {
      type: String,
      default: "",
    },
    architectureDiagram: {
      type: String,
      default: "",
    },
    technologies: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    architectureOverview: {
      type: String,
      default: "",
    },
    challenge: {
      type: String,
      default: "",
    },
    solution: {
      type: String,
      default: "",
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

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
