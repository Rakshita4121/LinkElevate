"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getAllPosts } from "@/config/redux/action/postAction";
import { getAboutUser ,getAllUsers} from "@/config/redux/action/authentication";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from './style.module.css'
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { Base_URL } from "@/config";
export default function Dashboard() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [postContent,setPostContent] = useState("");
  const [fileContent,setFileContent] = useState()
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/login");
  //   } else {
  //     dispatch(setTokenIsThere()) 
  //   }
  // });

  useEffect(() => {
    if (authState.isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
    if(!authState.all_profiles_fetched){
      dispatch(getAllUsers());
  }
  }, [authState.isTokenThere]);
  const handleUpload = async ()=>{
    console.log(fileContent)
    console.log(postContent)
    dispatch(createPost({ file: fileContent, body: postContent }))
    setFileContent(null);
    setPostContent("")
  }
  if(authState.user){
    return (
      <UserLayout>
        
  
       <DashboardLayout>
         <div className={styles.scrollComponent}>
           <div className={styles.createPostContainer}>
              <img className={styles.userProfile} width={100} src={`${Base_URL}/${authState.user.userId.profilePicture}`}></img>
              <textarea onChange={(e)=> setPostContent(e.target.value)} className={styles.textAreaContent} value={postContent} name="" id="" placeholder="What's in your mind"></textarea>
              <label htmlFor="fileUpload">
              <div className={styles.Fab}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
</div>
              </label>
              <input onChange={(e)=>setFileContent(e.target.files[0])} type="file" hidden id='fileUpload'></input>
              {
                postContent.length>0 && <div className={styles.uploadButton} onClick={handleUpload}>Post</div>

              }
           </div>
         </div>
       </DashboardLayout>
  
      </UserLayout>
    );
  }else{
    return(
      <UserLayout>
        <DashboardLayout>
          <h1>Loading...</h1>
        </DashboardLayout>
      </UserLayout>
    )
  }
  
}
