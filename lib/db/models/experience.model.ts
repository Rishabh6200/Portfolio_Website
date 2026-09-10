import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IExperience extends Document {
  company: string
  role: string
  period: string
  location: string
  locationType?: string
  type: string
  description: string
  achievements: string[]
  skills: Types.ObjectId[]
  order: number
  createdAt: Date
  updatedAt: Date
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role title is required"],
      trim: true,
    },
    period: {
      type: String,
      required: [true, "Period is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    locationType: {
      type: String,
      default: "Remote",
      trim: true,
    },
    type: {
      type: String,
      default: "Full-Time",
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    achievements: {
      type: [String],
      default: [],
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Experience: Model<IExperience> =
  mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema)
