import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
 async(user,thunkAPI)=>{
     try{
         const response = await clientServer.post("/login",{
             email:user.email,
             password:user.password        
         });
         if(response.data.token)
              localStorage.setItem("token",response.data.token)
        else{
            return thunkAPI.rejectWithValue({message:"token not provided"})
        }
        return response.data;
     }catch(error){
         return thunkAPI.rejectWithValue(error.response.data);
     }
 })


 export const registerUser = createAsyncThunk(
     "user/register",
     async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post("/register",{
                username:user.username,
                name:user.name,
                email:user.email,
                password:user.password        
            });
            return response.data;
            
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
 )

 export const getAboutUser =createAsyncThunk(
     "user/getAboutUser",
     async(user,thunkAPI)=>{
         try{
             const response = await clientServer.get("/get_user_and_profile",{
                headers: {
                  Authorization: `Bearer ${user.token}`,
                }});
             return thunkAPI.fulfillWithValue(response.data);
         }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
     }
 )

 export const getAllUsers = createAsyncThunk(
     "user/getAllUsers",
     async(_,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/get_all_users");
            console.log(response.data);
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
     }
 )