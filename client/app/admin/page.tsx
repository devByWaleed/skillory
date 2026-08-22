"use client"
import React, { FC } from 'react'
import Heading from '../utils/Heading'
import AdminSidebar from '../components/Admin/AdminSidebar'
import DashboardHeader from '../components/Admin/DashboardHeader'

type Props = {
    user: any;
}

const page: FC<Props> = ({ user }) => {
    return (
        <section className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
            <Heading
                title="Admin Dashboard | Skillory"
                description="Manage courses, orders, users, and analytics for Skillory."
                keywords="Skillory admin, LMS dashboard, manage courses"
            />
            <AdminSidebar user={user} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 p-6 md:p-8">
                    {/* dashboard content */}
                </main>
            </div>
        </section>
    )
}

export default page