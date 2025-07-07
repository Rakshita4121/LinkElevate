import { getAllUsers } from '@/config/redux/action/authentication'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react/cjs/react.development'

export default function Discover() {
    const authState = useSelector((state)=>state.auth)
    const dispatch= useDispatch();
    useEffect(()=>{
        if(!authState.all_profiles_fetched){
            dispatch(getAllUsers());
        }
    },[])

  return (
      <UserLayout>
          <DashboardLayout>
          <div>
              <h1>Discover</h1>
          </div>
          </DashboardLayout>
      </UserLayout>
    
  )
}
