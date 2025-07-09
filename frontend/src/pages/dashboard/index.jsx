"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { createPost, getAllPosts ,deletePost,incrementLike, getAllCOmments ,postComment} from "@/config/redux/action/postAction";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authentication";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from './style.module.css';
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { Base_URL } from "@/config";
import { TrashIcon, HeartIcon, ChatBubbleOvalLeftIcon, ShareIcon } from "@heroicons/react/24/outline";
import { resetPostId } from "@/config/redux/reducer/postReducer";

export default function Dashboard() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const router = useRouter();
  const dispatch = useDispatch();
  const [commentText,setCommentText] = useState("")

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);

  useEffect(() => {
    if (authState.isTokenThere) {
      const token = localStorage.getItem("token");
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isTokenThere]);

  const handleUpload = async() => {
    await dispatch(createPost({
      token: localStorage.getItem("token"),
      file: fileContent,
      body: postContent
    }));
    setFileContent(null);
    setPostContent("");
   await dispatch(getAllPosts())
  };

  if (!authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <h1>Loading...</h1>
        </DashboardLayout>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.wrapper}>
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                width={100}
                src={`${Base_URL}/${authState.user.userId?.profilePicture || "default-avatar.png"}`}
                alt="User Profile"
              />
              <textarea
                onChange={(e) => setPostContent(e.target.value)}
                className={styles.textAreaContent}
                value={postContent}
                placeholder="What's in your mind?"
              />
              <label htmlFor="fileUpload">
                <div  className={styles.Fab}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              </label>
              <input
                onChange={(e) => setFileContent(e.target.files[0])}
                type="file"
                hidden
                id="fileUpload"
              />
              {postContent.length > 0 && (
                <div className={styles.uploadButton} onClick={handleUpload}>
                  Post
                </div>
              )}
            </div>

            <div className={styles.postsContainer}>
              {postState.posts.map((post) => {
                const user = post.userId;
                return (
                  <div key={post._id} className={styles.singleCard}>
                    {user ? (
                      <div className={styles.singleCard_profileContainer}>
                        <img
                          className={styles.userProfile}
                          width={100}
                          src={`${Base_URL}/${user.profilePicture || "default-avatar.png"}`}
                          alt={`${user.name}'s profile`}
                        />
                        <div>
                          <div style={{display:"flex" , gap:"1.2rem" ,justifyContent:"space-between",cursor:"pointer"}}>
                          <p style={{ fontWeight: "bold" }}>{user.name}</p>
                         {
                           post.userId._id ===authState.user.userId._id &&  <div>
                           <svg onClick={async ()=>{ await dispatch(deletePost({post_id:post._id}))
                           await dispatch(getAllPosts())
                          }} style={{height:"1.4em",color:"red"}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                           </svg>
                           </div>
                         }
                          </div>
                          <p style={{ color: "gray" }}>@{user.username}</p>
                          <p>{post.body}</p>
                          {post.media && (
                            <div className={styles.singleCard_image}>
                              <img
                                src={`${Base_URL}/${post.media}`}
                                alt="Post media"
                              />
                            </div>
                          )}
                          <div className={styles.optionsContainer}>
                          <div className={styles.singleOption_optionsContainer} style={{width:"45px"}} onClick={async()=>{
                            await dispatch(incrementLike({post_id:post._id}))
                            await dispatch(getAllPosts())
                          }}>
  <HeartIcon
    className={styles.heartIcon} 
  />
  <span>{post.likes || 0}</span>
</div>
  <div className={styles.singleOption_optionsContainer} style={{width:"25px"}} onClick={async()=>{
    await dispatch(getAllCOmments({post_id:post._id}))
  }}>
    <ChatBubbleOvalLeftIcon className={styles.chat} />
  </div>
  <div className={styles.singleOption_optionsContainer}style={{width:"25px"}} onClick={()=>{
    const text = encodeURIComponent(post.body)
    const url= encodeURIComponent('apnacollege.in')
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl,"_blank")
  }}>
    <ShareIcon className={styles.shareIcon} />
  </div>
</div>

                        </div>
                      </div>
                    ) : (
                      <p style={{ padding: "10px", color: "gray" }}>
                        Unknown user
                      </p>
                    )}
                    

                  </div>

                );
              })}

            </div>
          </div>
        </div>
        {
          

          postState.postId !== "" &&
          <div  onClick={()=>{
            dispatch(resetPostId())
          }}
          className={styles.commentsContainer}>
            <div onClick={(e)=>{
              e.stopPropagation()
            }}
            className={styles.allCommentsContainer}>
                  {
                    postState.comments.length ===0 && <h2>No Comments Yet</h2> 
                  }
                  <div style={{display:"flex",gap:"1.2rem",flexDirection:"column"}}>
                  {
                    postState.comments.length != 0 && 
                      postState.comments.map((postComment,index) => {
                        return(
                          <div className={styles.singleComment} key={postComment._id} style={{border:"1px solid blueviolet",borderRadius:"10px"}} >
                              <div className={styles.singleComment_profileContainer} style={{display:"flex",gap:"1.2rem"}}>
                                <img src={`${Base_URL}/${postComment.userId.profilePicture}`} style={{height:"20px",width:"20px",borderRadius:"50%"}}></img>
                                <div>
                                <p style={{fontWeight:"bold"}}>{postComment.userId.name}</p>
                                <p style={{color:"gray"}}>{postComment.userId.username}</p>
                                </div>
                              </div>
                              <p style={{paddingLeft:"2rem"}}>{postComment.body}</p>
                          </div>
                        )
                      })
                   
                  }
                  </div>
                  <div className={styles.postCommentContainer}>
                      <input type="" value={commentText} onChange={(e)=>setCommentText(e.target.value)} placeholder="comment"></input>
                      <div className={styles.postCommentContainer_commentBtn} onClick={async ()=>{
                        await dispatch(postComment({post_id:postState.postId , body:commentText}))
                        await dispatch(getAllCOmments({post_id:postState.postId}))
                        setCommentText("")
                      }} style={{cursor:"pointer"}}>
                        <p >Comment</p>
                      </div>
                  </div>
            </div>
          </div>
        }
      </DashboardLayout>
    </UserLayout>
  );
}

