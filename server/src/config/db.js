import mongoose from "mongoose";

export const connectDatabase = async ()=>{
    try {
        await mongoose.connect('mongodb://127.0.0.1/portfolioDatabase')
        console.log('Database Connected')
    } catch (error) {
        console.log('Database Error:', error)
    }
}