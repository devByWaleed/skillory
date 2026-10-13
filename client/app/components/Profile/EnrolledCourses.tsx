"use client"
import React, { FC } from 'react'
import Link from 'next/link'
import { BookOpen } from "lucide-react"
import { useGetUsersAllCoursesQuery } from '@/redux/features/course/courseApi'
import CourseCard from '../Course/CourseCard'
import Loader from '../Loader/Loader'

type Props = {
    user: any;
}

const EnrolledCourses: FC<Props> = ({ user }) => {
    const { data, isLoading } = useGetUsersAllCoursesQuery({});

    // user.courses holds items like { _id, courseId }, so compare courseId first
    const purchasedIds: string[] = (user?.courses || []).map((item: any) =>
        String(item.courseId ?? item._id ?? item)
    );

    const enrolledCourses = (data?.allCourses || []).filter((course: any) =>
        purchasedIds.includes(String(course._id))
    );

    if (isLoading) return <Loader />;

    return (
        <div className="w-full">
            <h2 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                Enrolled courses
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Pick up where you left off.
            </p>

            {enrolledCourses.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {enrolledCourses.map((item: any) => (
                        <CourseCard key={item._id} item={item} isProfile={true} />
                    ))}
                </div>
            ) : (
                <div className="mt-8 flex flex-col items-center text-center py-10">
                    <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-surface-700 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-brand-600 dark:text-accent-400" />
                    </div>
                    <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                        You haven't enrolled in any courses yet.
                    </p>
                    <Link
                        href="/courses"
                        className="mt-4 px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
                    >
                        Browse courses
                    </Link>
                </div>
            )}
        </div>
    )
}

export default EnrolledCourses