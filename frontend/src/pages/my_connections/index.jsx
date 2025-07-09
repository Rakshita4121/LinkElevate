import { getMyConnectionRequests ,acceptConnection,getConnectionsRequests} from '@/config/redux/action/authentication'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Base_URL } from '@/config'
import styles from './style.module.css'
import { useRouter } from 'next/router'

export default function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter()
  useEffect(() => {
    dispatch(getConnectionsRequests({ token: localStorage.getItem("token") }));

    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequests && authState.connectionRequests.length !== 0) {
      console.log(authState.connectionRequests);
    }
  }, [authState.connectionRequests]);

  return (
    <UserLayout>
      <DashboardLayout>
        <h1>My Connections</h1>
        {
           authState.connectionRequests?.length == 0 && <h2>No Connection Requests</h2>
        }
        {
          authState.connectionRequests?.length !== 0 && authState.connectionRequests.filter((connection)=> connection.status_accepted === null).map((user, index) => {
            return(
            <div className={styles.userCard} key={index} >
              <div style={{ display: "flex", alignItems: "center",gap:"2rem" }}>
                <div className={styles.profilePicture}>
                  <img src={`${Base_URL}/${user.userId.profilePicture}`} alt="profile" />
                </div>
                <div className={styles.userInfo} onClick={()=>{
              router.push(`/view_profile/${user.userId.username}`)
            }}>
                  <h3>{user.userId.name}</h3>
                  <p>@{user.userId.username}</p>
                </div>
                <button onClick={()=>{
                  dispatch(acceptConnection({
                    connectionId:user._id,
                    token:localStorage.getItem("token"),
                    action:"accept"
                  })).then(() => {
                    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
                    dispatch(getConnectionsRequests({ token: localStorage.getItem("token") }));
                  })

                }}
                className={styles.connectedButton}>Accept</button>
              </div>
            </div>
          )})
        }
        <h2 style={{marginTop:"30px"}}>My Network</h2>

        {
          authState.connectionRequests.filter((connection)=> connection.status_accepted != null).map((user,index)=>{
            return(
              <div className={styles.userCard} key={index} >
                <div style={{ display: "flex", alignItems: "center",gap:"2rem" }}>
                  <div className={styles.profilePicture}>
                    <img src={`${Base_URL}/${user.userId.profilePicture}`} alt="profile" />
                  </div>
                  <div className={styles.userInfo} onClick={()=>{
                router.push(`/view_profile/${user.userId.username}`)
              }}>
                    <h3>{user.userId.name}</h3>
                    <p>@{user.userId.username}</p>
                  </div>
                  
                </div>
              </div>
            )
          })
        }
        {
          authState.connections.filter((connection)=> connection.status_accepted != null).map((user,index)=>{
            return(
              <div className={styles.userCard} key={index} >
                <div style={{ display: "flex", alignItems: "center",gap:"2rem" }}>
                  <div className={styles.profilePicture}>
                    <img src={`${Base_URL}/${user.connectionId.profilePicture}`} alt="profile" />
                  </div>
                  <div className={styles.userInfo} onClick={()=>{
                router.push(`/view_profile/${user.connectionId.username}`)
              }}>
                    <h3>{user.connectionId.name}</h3>
                    <p>@{user.connectionId.username}</p>
                  </div>
                  
                </div>
              </div>
            )
          })
        }
      </DashboardLayout>
    </UserLayout>
  );
}
