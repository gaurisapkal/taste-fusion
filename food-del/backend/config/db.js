import mongoose from "mongoose";

 export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://g22gaurishankar:Aniket@cluster0.viwu7.mongodb.net/food-del').then(()=>console.log("DB Connected"));
 }
 