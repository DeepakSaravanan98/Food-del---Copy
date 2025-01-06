// to connect with the database
import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://sdeepakvlr:687698@cluster0.2tj0e.mongodb.net/food-del").then(()=>console.log("DB connected"))
}