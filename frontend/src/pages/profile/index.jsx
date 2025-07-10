import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css'
import { getAboutUser } from '@/config/redux/action/authentication'
import { getAllPosts } from '@/config/redux/action/postAction'
import { Base_URL, clientServer } from '@/config'

export default function Profile() {
  const dispatch = useDispatch()
  const authState = useSelector((state) => state.auth)
  const postState = useSelector((state) => state.posts)
  const [userProfile, setUserProfile] = useState({})
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }))
    dispatch(getAllPosts())
  }, [])

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user)
    }
  }, [authState.user])

  useEffect(() => {
    if (authState?.user?.userId?.username) {
      const posts = postState.posts.filter((post) => {
        return post?.userId?.username === authState.user.userId.username
      })
      setUserPosts(posts)
    }
  }, [postState.posts, authState.user])

  const updateProfilePicture = async(file)=>{
      const formData = new FormData();
      formData.append('profile_picture',file);
      formData.append("token",localStorage.getItem("token"));
      const response= await clientServer.post("/update_profile_picture",formData,{
          headers:{
              "Content-Type":"multipart/form-data"
          }
      })

  }
  const updateProfileData = async ()=>{
      const request = await clientServer.post("/user_update",{
          token:localStorage.getItem("token"),
          name:userProfile.userId.name
      })
      const response= await clientServer.post("/update_profile_data",{
          token:localStorage.getItem("token"),
          
          bio:userProfile.bio,
          currentPost:userProfile.currentPost,
          pastWork:userProfile.pastWork,
          education:userProfile.education
          

      })
  }
  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile?.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
            <div className={styles.backDrop_overlay}>
  <label htmlFor="profilePictureUpload">
    <p >Edit</p>
  </label>
  <input onChange={(e)=>{
      updateProfilePicture(e.target.files[0])
      dispatch(getAboutUser({token:localStorage.getItem("token")}))

  }}
    type="file"
    id="profilePictureUpload"
    className={styles.hiddenFileInput}
  />
</div>
                <img
                className={styles.backDrop}
                src={`${Base_URL}/${userProfile.userId.profilePicture}`}
                alt="backdrop"
              />
            </div>

            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "1.2rem" }}>
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem"
                    }}
                  >
                    <input className={styles.nameEdit} type="text" value={userProfile.userId.name} onChange={(e)=>{
                        setUserProfile({...userProfile,userId:{...userProfile.userId,name:e.target.value}})
                    }}></input>
                    <p style={{ color: "grey" }}>
                      @{userProfile.userId.username}
                    </p>
                  </div>

                  <div>
                      <textarea value={userProfile.bio} rows={Math.max(3,Math.ceil(userProfile.bio.length / 80))}
                      onChange={(e)=>{
                          setUserProfile({...userProfile,bio:e.target.value})
                      }}>

                      </textarea>
                  </div>
                </div>

                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>
                  {userPosts.map((post) => (
                    <div key={post._id} className={styles.postCard}>
                      <div className={styles.card}>
                        <div className={styles.card_profileContainer}>
                          {post.media ? (
                            <img src={`${Base_URL}/${post.media}`} />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            ></div>
                          )}
                        </div>
                        <p>{post.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.workHistory}>
              <h4>Work History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile?.pastWork?.length > 0 ? (
                  userProfile.pastWork.map((work, index) => (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem"
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years} Years</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "lightgray", paddingTop: "0.5rem" }}>
                    No work history added.
                  </p>
                )}
                                <button className={styles.addWorkButton}>Add Work</button>

              </div>
            </div>
            <div className={styles.workHistory}>
              <h4>Education History</h4>
              <div className={styles.workHistoryContainer}>
                {userProfile?.education?.length > 0 ? (
                  userProfile.education.map((work, index) => (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem"
                        }}
                      >
                        {work.school} - {work.degree}
                      </p>
                      <p>{work.fieldOfStudy}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "lightgray", paddingTop: "0.5rem" }}>
                    No education history added.
                  </p>
                )}

                <button className={styles.addWorkButton}>Add Education</button>
              </div>
            </div>
            {
                userProfile != authState.user && <div className={styles.connectButton} onClick={
                    async ()=>{
                       await updateProfileData();
                       await dispatch(getAboutUser({token:localStorage.getItem("token")}))
                    }
                }>
                    UpdateProfile
                </div>
            }
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  )
}
