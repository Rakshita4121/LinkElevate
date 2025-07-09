import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import bcrypt from 'bcrypt'
import Post from "../models/posts.model.js"
import Comment from "../models/comments.model.js"
import webpush from "../utils/push.js"; // make sure this is your configured web-push
import path from "path";

export const activeCheck=async (req,res)=>{
    res.status(200).json({message:"Running"});
}



export const createPost = async (req, res) => {
  const { token, body } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) return res.status(404).json({ message: "User not found" });

    const newPost = new Post({
      userId: user._id,
      body: body,
      media: req.file ? req.file.filename : "",
      fileType: req.file ? req.file.mimetype.split("/")[1] : ""
    });

    await newPost.save();

    const payload = JSON.stringify({
      title: "📢 New Post!",
      message: `${user.name} just posted: "${body.substring(0, 50)}..."`,
      url: "http://localhost:3000/dashboard"
    });

    const usersWithSubscription = await User.find({ "subscription.endpoint": { $exists: true } });

    for (const u of usersWithSubscription) {
      if (u.subscription) {
        try {
          await webpush.sendNotification(u.subscription, payload);
        } catch (err) {
          console.error("❌ Push error:", {
            statusCode: err.statusCode,
            body: err.body,
            message: err.message
          });

          // Clean up invalid subscription
          if (err.statusCode === 410 || err.statusCode === 404) {
            u.subscription = undefined;
            await u.save();
          }
        }
      }
    }

    return res.status(200).json({ message: "Post created and notifications sent!" });
  } catch (error) {
    console.error("❌ Error in createPost:", error.message);
    return res.status(500).json({ message: error.message });
  }
};


export const getAllPosts = async (req,res)=>{
    try{
        const posts = await Post.find().populate('userId','name username email profilePicture');
        return res.json({posts});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}


// controllers/postController.js
export const deletePost = async (req, res) => {
    const { token, post_id } = req.body;
    console.log(req.body)
  
    try {
      const user = await User.findOne({ token }).select("_id"); // ❗ Added await here
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const post = await Post.findById(post_id); // ❗ Corrected from post._id to post_id
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      if (post.userId.toString() !== user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      await Post.deleteOne({ _id: post_id });
      return res.json({ message: "Post deleted" });
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const getCommentsByPost = async(req,res)=>{
    const { post_id } = req.query;
    console.log(post_id);
    try{
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        const comments = await Comment.find({postId:post_id}).populate("userId","username name profilePicture");
        console.log(comments)
        return res.json(comments.reverse());

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const deleteCommentOfUser = async(req,res)=>{
    const {token,comment_id}=req.body;
    try{
        const user = await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const comment = await Comment.findOne({"_id":comment_id});
        if(!comment){
            return res.status(404).json({message:"Comment not found"})
        }
        if(comment.userId.toString() !== user._id.toString()){
            return res.status(401).json({message:"Unauthorized"});
        }
        await Comment.findByIdAndDelete(comment_id);
        return res.json({message:"Comment deleted"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const incrementLikes = async(req,res)=>{
    const {post_id}=req.body;
    try{
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(404).json({message:"Post not found"})
        }
        post.likes=post.likes+1;
        await post.save();

        return res.json({message:"Likes incremented"});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

export const commentPost = async (req,res)=>{
    const {token , post_id , commentBody}=req.body;
    
    try{
        const user = await User.findOne({token:token}).select("_id");
        if(!user){
            return res.status(404).json({message: "User not found."});
        }
        const post = await Post.findOne({ _id:post_id});
        if(!post){
            return res.status(404).json({message:"Post not found"});
        } 
        const comment =new Comment({
            userId:user._id,
            postId:post_id,
            body:commentBody
        })
        await comment.save();
        return res.status(200).json({message:"Comment added"})
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}