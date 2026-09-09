import mongoose, { Schema, Document, Model, Types } from "mongoose"

export interface ISkill extends Document {
  name: string
  categoryId: Types.ObjectId
  level: "Proficient" | "Advanced" | "Expert"
  highlight: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

const SkillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category reference is required"],
      index: true,
    },
    level: {
      type: String,
      enum: ["Proficient", "Advanced", "Expert"],
      default: "Advanced",
    },
    highlight: {
      type: Boolean,
      default: false,
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

// Prevent duplicate skill names within the same category
SkillSchema.index({ categoryId: 1, name: 1 }, { unique: true })

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>("Skill", SkillSchema)
