"use client"
import React from 'react'
import Heading from '@/app/utils/Heading'
import AdminSidebar from '@/app/components/Admin/AdminSidebar'
import CreateCourse from '@/app/components/Admin/course/Create-Course'
import DashboardHeader from '@/app/components/Admin/DashboardHeader'


type Props = {}

const page = (props: Props) => {
    return (
        <section className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
            <Heading
                title="Create Course | Skillory Admin"
                description="Create and publish a new course on Skillory."
                keywords="Skillory admin, create course, LMS"
            />

            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <CreateCourse />
            </div>
        </section>
    )
}

export default page