import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import ConnectionRequest from "../models/connections.model.js"
import bcrypt from 'bcrypt'
import crypto from "crypto";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Comment from "../models/comments.model.js"

const convertUserDataToPdf = async (userData) => {
    const doc = new PDFDocument();
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = fs.createWriteStream("uploads/" + outputPath);
    doc.pipe(stream);

    // ✅ Safe image display
    if (userData.userId?.profilePicture) {
        const imgPath = `uploads/${userData.userId.profilePicture}`;
        if (fs.existsSync(imgPath)) {
            doc.image(imgPath, { align: "center", width: 100 });
        }
    }

    // ✅ Profile details
    doc.fontSize(14).text(`Name: ${userData.userId?.name || "N/A"}`);
    doc.fontSize(14).text(`Username: ${userData.userId?.username || "N/A"}`);
    doc.fontSize(14).text(`Email: ${userData.userId?.email || "N/A"}`);
    doc.fontSize(14).text(`Bio: ${userData.bio || "N/A"}`);
    doc.fontSize(14).text(`Current Post: ${userData.currentPost || "N/A"}`);

    // ✅ Past Work
    if (userData.pastWork?.length) {
        doc.moveDown().fontSize(14).text("Past Work:");
        userData.pastWork.forEach((work, index) => {
            doc.moveDown(0.5);
            doc.fontSize(14).text(`Company: ${work.company}`);
            doc.fontSize(14).text(`Position: ${work.position}`);
            doc.fontSize(14).text(`Years: ${work.years}`);
        });
    }

    doc.end();
    return outputPath;
};

export const register=async(req,res)=>{
    try{
        const {name,email,password,username}=req.body;
        console.log("Received body:", req.body);

        if(!name|| !email||!password||!username){
            return res.status(400).json({message:"All fields are required"});
        }
        const user = await User.findOne({
            email
        })
        if(user){
            return res.status(400).json({message:"User Already Exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User(
            {
                name,
                email,
                password:hashedPassword,
                username
            }
        )
        await newUser.save();

        const profile=new Profile({userId:newUser._id});
        await profile.save();

        res.json({message:"User registered successfully"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const login= async (req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All the fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User doesn't exist"});
        }
        const  isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials"});
        const token=crypto.randomBytes(32).toString("hex");

        await User.updateOne({_id:user._id},{token});
        return res.json({token})
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const uploadProfilePicture = async(req,res)=>{
    const {token}=req.body;
    try{
        const user=await User.findOne({token:token});
        if(!user){
            return res.ststus(404).json({message:"User not found"});
        }
        user.profilePicture= req.file.filename;

        await user.save();
    }catch(error){
        return res.status(500).json({message:error.message});
    }
} 


export const updateUserProfile = async(req,res)=>{
    try{
        const {token, ...newUserData} = req.body;
      
        const user=await User.findOne({token:token});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const {username,email}=newUserData

        const existingUser=await User.findOne({$or:[{username},{email}]});

        if(existingUser){
            if(existingUser || String(existingUser._id)!= String(user._id)){
                return res.status(400).json({message:"User already exists"});
            }
        }


        Object.assign(user,newUserData);

        await user.save();
        return res.json({message:"User updated successfully"});
    }catch(error){
        return res.status(500).json({message: error.message});
    }
}

export const getUserAndProfile = async (req,res)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1]; 
        console.log(token);// Bearer <token>
        const user=await User.findOne({token:token});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const userProfile=await Profile.findOne({userId:user._id})
        .populate('userId','name email username profilePicture');
        return res.json({userProfile})
    }catch(error){
        return res.status(500).json({message:error.message})
    }

}


export const updateProfileData = async (req,res)=>{
    try{
        const {token, ...newProfileData}=req.body;

        const userProfile = await User.findOne({token:token});

        if(!userProfile){
            return res.status(404).json({message:"User not found"});
        }

        const profile_to_update=await Profile.findOne({userId:userProfile._id});
        Object.assign(profile_to_update,newProfileData);

        await profile_to_update.save();

        return res.json({message:"Profile Updated"})


    }catch(error){
        return res.status(500).json({message:error.message})
    }
}

export const getAllUserProfile = async (req,res)=>{
    try{
        const profiles = await Profile.find().populate('userId','name email username profilePicture');
        console.log(profiles)
        return res.json({profiles})
        
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}

export const downloadProfile = async (req, res) => {
    const { user_id } = req.query;

    try {
        const userProfile = await Profile.findOne({ userId: user_id }).populate(
            "userId",
            "name email username profilePicture"
        );

        if (!userProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const outputPath = await convertUserDataToPdf(userProfile);
        return res.json({ message: `/${outputPath}` }); // send full path for frontend
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};



export const sendConnectionRequest = async (req,res)=>{
    const {token , connectionId} = req.body;
    try{
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const connectionUser = await User.findOne({_id:connectionId});
        if(!connectionUser){
            return res.status(404).json({message: " Connection User not found."});
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId:user._id,
            connectionId:connectionUser._id
        })
        if(existingRequest){
            return res.status(400).json({message:"Request already sent"});
        }
        const request = new ConnectionRequest({
            userId:user._id,
            connectionId:connectionUser._id
        })
        await request.save();
        return res.status(200).json({message:"Connection request sent"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const getMyConnectionRequests = async(req,res)=>{
    const {token }=req.query;
    try{
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const connections = await ConnectionRequest.find({userId:user._id}).populate('connectionId','name username email profilePicture');
        return res.json({connections});

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const whatAreMyConnections = async (req,res)=>{
    try{
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const connections = await ConnectionRequest.find({connectionId:user._id}).populate('userId','name username email profilePicture');
        return res.json({connections});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}


export const acceptConnectionRequest = async (req,res)=>{
    const {token , requestId ,action_type}=req.body;
    try{
        const user = await User.findOne({token});
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const connection = await ConnectionRequest.findOne({_id:requestId});
        if(!connection){
            return res.status(404).json({message: "Connection not found."});
        }
        if(action_type == "accept"){
            connection.status_accepted = true;
        }else{
            connection.status_accepted = false;
        }

        await connection.save();
        return res.status(200).json({message:"Request Updated"});


    }catch(error){
        return res.status(500).json({message:error.message});
    }
}


export const getUserProfileAndUserBasedOnUsername = async (req,res)=>{
    const {username}=req.query;
    try{
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message:"User Not found"});
        }
        const userProfile = await Profile.findOne({userId:user._id})
        .populate("userId","name username email profilePicture");
        return res.json({"profile":userProfile})
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}