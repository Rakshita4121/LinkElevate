const { createSlice } = require("@reduxjs/toolkit")
import { getAboutUser, getAllUsers, getMyConnectionRequests, loginUser, registerUser,getConnectionsRequests } from "../../action/authentication/index.js"

const initialState = {
    user:undefined,
    isError:false,
    isSuccess:false,
    isLoading:false,
    loggedIn:false,
    message:"",
    isTokenThere:false,
    profileFetched:false,
    connections:[],
    connectionRequests:[],
    all_profiles:[],
    all_profiles_fetched:false
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message="hello"
        },
        emptyMessage :(state)=>{
            state.message=""
        },
        setTokenIsThere:(state)=>{
            state.isTokenThere = true;
        },
        setTokenIsNotThere:(state)=>{
            state.isTokenThere = false;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true,
            state.message="Logging you in ...."
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.loggedIn=true;
            state.message="Log in Succesful";
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.isError=true;
            state.message=action.payload
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading = true;
            state.message= "Registering you ..."
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.isSuccess=true;
            state.message="Registration is Succesful . Please login";

        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload?.message || action.payload || "Registration failed";
          })
        .addCase(getAboutUser.fulfilled , (state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.profileFetched=true;
            state.user=action.payload.userProfile;
        })
        .addCase(getAllUsers.fulfilled ,(state,action)=>{
            state.isLoading=false;
            state.isError=false;
            state.all_profiles_fetched=true;
            state.all_profiles=action.payload.profiles;
        })
        .addCase(getConnectionsRequests.fulfilled,(state,action)=>{
            state.connections=action.payload
        })
        .addCase(getConnectionsRequests.rejected,(state,action)=>{
            state.message=action.payload
        })
        .addCase(getMyConnectionRequests.fulfilled,(state,action)=>{
            state.connectionRequests=action.payload
        })
        .addCase(getMyConnectionRequests.rejected,(state,action)=>{
            state.message=action.payload
        })
    }
})
export const {reset , handleLoginUser , emptyMessage,setTokenIsNotThere,setTokenIsThere}=authSlice.actions;
export default authSlice.reducer;