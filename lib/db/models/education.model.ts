import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface IEducation extends Document {
  institution: string
  degree: string
  fieldOfStudy?: string
  period: string
  location: string
  type: string
  grade?: string
  description: string
  highlights: string[]
  skills: Types.ObjectId[]
  status: "published" | "draft"
  order: number
  createdAt: Date
  updatedAt: Date
}

const EducationSchema = new Schema<IEducation>(
  {
    institution: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
    },
    degree: {
      type: String,
      required: [true, "Degree / Certification title is required"],
      trim: true,
    },
    fieldOfStudy: {
      type: String,
      trim: true,
      default: "",
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
    type: {
      type: String,
      default: "Degree",
      trim: true,
    },
    grade: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    skills: [
      {
        type: Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
      index: true,
    },
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

export const Education: Model<IEducation> =
  mongoose.models.Education ||
  mongoose.model<IEducation>("Education", EducationSchema)
