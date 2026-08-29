"use client"
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import Heading from '@/app/utils/Heading'
import AdminSidebar from '@/app/components/Admin/AdminSidebar'
import DashboardHeader from '@/app/components/Admin/DashboardHeader'
import AdminProtected from '@/app/components/hooks/adminProtected'
import EditCategories from '@/app/components/Admin/Customization/EditCategories'
import CourseAnalytics from '@/app/components/Admin/Analytics/CourseAnalytics'
import OrderAnalytics from '@/app/components/Admin/Analytics/OrderAnalytics'

type Props = {}

const page: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return (
        <section className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
            <AdminProtected>
                <Heading
                    title="Admin Dashboard | Skillory Course Analytics"
                    description="Check what analytics says about the orders."
                    keywords="Skillory admin, LMS dashboard, manage order analytics"
                />
                <AdminSidebar user={user} />
                <div className="flex-1 flex flex-col">
                    <DashboardHeader />
                    <main className="flex-1 p-6 md:p-8">
                        <OrderAnalytics />
                    </main>
                </div>
            </AdminProtected>
        </section>
    )
}

export default page