import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useRouter } from 'next/router';
import {React} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import styles from './style.module.css'
import { subscribeUserToPush } from '../../../utils/usePushNotification';
import { getAllUsers } from '@/config/redux/action/authentication';
export default function DashboardLayout ({children}){
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const authState = useSelector((state) => state.auth);
const dispatch=useDispatch()
    const router = useRouter();
    useEffect(()=>{

        if(localStorage.getItem("token") == null){
            router.push("/login");
        }
        dispatch(setTokenIsThere())
        dispatch(getAllUsers())
       
        subscribeUserToPush(token)
    },[])
    return(
        <>
         <div className="container">
          <div className={styles.homeContainer}>
              <div className={styles.homeContainer_leftBar}>
                <div className={styles.sideBarOption} onClick={()=>{router.push("/dashboard")}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <p>Home</p>

                </div>
                <div className={styles.sideBarOption} onClick={()=>{router.push("/discover")}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <p>Discover</p>

                </div>
                <div className={styles.sideBarOption} onClick={()=>{router.push("/my_connections")}}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <p>My Connections</p>
                </div>
              </div>
              
          
          <div className="feedContainer">
              {children}
          </div>
          <div className={styles.extraContainer}>
  <div className={styles.rightSidebar}>
    <div className={styles.card}>
      <h3 className={styles.title}>LinkElevate News</h3>
      <ul className={styles.newsList}>
        <li>📢 New jobs from Google and TCS</li>
        <li>🚀 Web3 market sees a 15% surge</li>
        <li>🧠 AI: Career revolution begins</li>
        <li>💼 Startup hiring boost post recession</li>
        <li>🌐 Remote work trends 2025</li>
      </ul>
      <p className={styles.showMore}>Show more</p>
    </div>

    <div className={styles.card}>
      <h4 className={styles.puzzleTitle}>🎯 Today’s Puzzle</h4>
      <p className={styles.puzzleText}>Solve in 60s or less!</p>
      <p className={styles.connectionsPlayed}>3 connections played</p>
    </div>
  </div>
</div>

          </div>
        </div>
        </>
    )
}