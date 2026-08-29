"use client"
import AdminSidebar from '@/app/components/Admin/AdminSidebar'
import DashboardHeader from '@/app/components/Admin/DashboardHeader'
import Heading from '@/app/utils/Heading'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import AllUsers from '@/app/components/Admin/Users/AllUsers'

type Props = {}

const page: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return (
        <section className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
            <Heading
                title="Team Members | Skillory Admin"
                description="Add users to Admin panel on Skillory."
                keywords="Skillory admin, team, LMS dashboard"
            />
            <AdminSidebar user={user} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 p-6 md:p-8">
                    <AllUsers isTeam={true} />
                </main>
            </div>
        </section>
    )
}

export default page