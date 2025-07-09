import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";
import notification from './routes/notifications.js'
dotenv.config();
const uri=process.env.DB;
const app=express();
app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(notification);
app.use(express.static('uploads'))





const start=async ()=>{
    const connectDB=await mongoose.connect(uri)
    app.listen(9090,()=>{
        console.log("server is running on port 9090");
    })

}
start();

