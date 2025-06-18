import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();
const uri=process.env.DB;
const app=express();
app.use(cors());
app.use(express.json());
const start=async ()=>{
    const connectDB=await mongoose.connect(uri)
    app.listen(9090,()=>{
        console.log("server is running on port 9090");
    })

}
start();