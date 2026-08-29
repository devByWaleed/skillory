"use client"
import React, { FC } from 'react'
import Heading from '../../utils/Heading'
import AdminSidebar from '../../components/Admin/AdminSidebar'
import DashboardHeader from '../../components/Admin/DashboardHeader'
import AdminProtected from '@/app/components/hooks/adminProtected'
import EditFaq from '@/app/components/Admin/Customization/EditFaq'
import { useSelector } from 'react-redux'

type Props = {}

const page: FC<Props> = () => {
    const { user } = useSelector((state: any) => state.auth);

    return (
        <section className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
            <AdminProtected>
                <Heading
                    title="Admin Dashboard | Skillory FAQs"
                    description="Edit the frequently asked questions for the course platform according to the requirement"
                    keywords="Skillory admin, LMS dashboard, manage faqs"
                />
                <AdminSidebar user={user} />
                <div className="flex-1 flex flex-col">
                    <DashboardHeader />
                    <main className="flex-1 p-6 md:p-8">
                        {/* dashboard content */}
                        <EditFaq />
                    </main>
                </div>
            </AdminProtected>
        </section>
    )
}

export default page