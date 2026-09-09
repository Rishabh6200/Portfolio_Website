import mongoose, { Schema, Document, Model } from "mongoose"

export interface ICategory extends Document {
  name: string
  slug: string
  description?: string
  icon?: string
  order: number
  color?: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    icon: {
      type: String,
      default: "Server",
    },
    order: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: "#6366f1",
    },
  },
  {
    timestamps: true,
  }
)

export const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)
