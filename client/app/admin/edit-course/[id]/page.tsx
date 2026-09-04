"use client"
import React, { FC, use } from 'react'
import { useSelector } from 'react-redux'
import Heading from '@/app/utils/Heading'
import AdminSidebar from '@/app/components/Admin/AdminSidebar'
import DashboardHeader from '@/app/components/Admin/DashboardHeader'
import EditCourse from '@/app/components/Admin/course/Edit-Course'

type Props = {
    params: Promise<{ id: string }>;
}

const page: FC<Props> = ({ params }: Props) => {
    const { user } = useSelector((state: any) => state.auth);
    const { id } = use(params);

    return (
        <section className="flex min-h-screen bg-surface-50 dark:bg-surface-900">
            <Heading
                title="Edit Course | Skillory Admin"
                description="Edit an existing course on Skillory."
                keywords="Skillory admin, edit course, LMS"
            />
            <AdminSidebar user={user} />
            <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <EditCourse id={id} />
            </div>
        </section>
    )
}

export default page