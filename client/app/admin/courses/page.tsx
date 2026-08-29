"use client"
import AdminSidebar from '@/app/components/Admin/AdminSidebar'
import DashboardHeader from '@/app/components/Admin/DashboardHeader'
import Heading from '@/app/utils/Heading'
import AllCourses from '@/app/components/Admin/course/AllCourses'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'

type Props = {}

const page: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return (
        <section className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
            <Heading
                title="All Courses | Skillory Admin"
                description="Manage all published courses on Skillory."
                keywords="Skillory admin, courses, LMS dashboard"
            />
            <AdminSidebar user={user} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 p-6 md:p-8">
                    <AllCourses />
                </main>
            </div>
        </section>
    )
}

export default page