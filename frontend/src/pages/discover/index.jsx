import { getAboutUser, getAllUsers } from '@/config/redux/action/authentication'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Base_URL } from '@/config'
import styles from './style.module.css'
import { useRouter } from 'next/router'

export default function Discover() {
    const authState = useSelector((state)=>state.auth)
    const router = useRouter();
    const dispatch= useDispatch();
    useEffect(()=>{
        dispatch(getAboutUser({ token : localStorage.getItem("token") }));

        if(!authState.all_profiles_fetched){
             dispatch(getAllUsers());
        }
    },[])

  return (
      <UserLayout>
          <DashboardLayout>
          <div>
              <h1>Discover</h1>
              <div className={styles.allUserProfile}>
                  {
                      authState.all_profiles_fetched && authState.all_profiles.map((profile)=>{
                          return(

                              <div key={profile._id} className={styles.userCard} onClick={()=>{
                                  router.push(`/view_profile/${profile.userId.username}`)
                              }}>
                                  <img src={`${Base_URL}/${profile.userId.profilePicture}`} alt="profile"></img>
                                  <div>
                                  <h1>{profile.userId.name}</h1>
                                  <p>{profile.userId.username}</p>
                                  </div>
                                </div>
                          )
                      })
                  }

              </div>
          </div>
          </DashboardLayout>
      </UserLayout>
    
  )
}
