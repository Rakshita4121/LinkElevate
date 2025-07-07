import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React from 'react'

export default function MyConnections() {
  return (
    <UserLayout>
        <DashboardLayout>
            <div>MyConnections</div>
        </DashboardLayout>
    </UserLayout>
  )
}
