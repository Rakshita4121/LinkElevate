
// steps for state management 
// submit action
// handle action in its reducer
// register reducer

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";


export const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postReducer
    }
})