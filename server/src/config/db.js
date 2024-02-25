import mongoose from "mongoose";

export const connectDatabase = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Database Connected')
    } catch (error) {
        console.log('Database Error:', error)
    }
}