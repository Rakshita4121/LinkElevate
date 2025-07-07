import { reset } from '@/config/redux/reducer/authReducer';
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.css'
export default function NavbarComponent() {
    const authState = useSelector((state) => state.auth);
    const dispatch= useDispatch()
    const router=useRouter();
  return (
    <div className={styles.container}>
        <nav className={styles.navBar}>
            <h1 onClick={()=>{router.push("/")}} style={{cursor:"pointer"}} className={styles.brandName}>LinkElevate</h1>
            <div className={styles.navBarOptionsContainer}>
                {authState.profileFetched && <div>
                    <div style={{display:"flex",gap:"1.25rem"}}>
                        <p>Hey, {authState.user.userId?.name}</p>
                        <p style={{fontWeight:"bold",cursor:"pointer"}}>Profile</p>
                        <p onClick={
                            ()=>{
                                localStorage.removeItem("token")
                                router.push("/login");
                                dispatch(reset())
                            }
                        } style={{fontWeight:"bold",cursor:"pointer"}}>Logout</p>
                    </div>
                </div>}
               {!authState.profileFetched && <div className={styles.buttonJoin} onClick={()=>{router.push("/login")}}>
                    <p>Be a part</p>
                </div>  }
            </div>
        </nav>
    </div>
  )
}
