"use client"
import { useGetUsersAllCoursesQuery } from '@/redux/features/course/courseApi'
import React, { FC, useEffect, useState } from 'react'
import CourseCard from '../Course/CourseCard'
import Loader from '../Loader/Loader'

type Props = {}

const Courses: FC<Props> = () => {
    const { data, isLoading } = useGetUsersAllCoursesQuery({})
    const [courses, setCourses] = useState<any[]>([])

    useEffect(() => {
        if (data) {
            setCourses(data.allCourses || [])
        }
    }, [data])

    if (isLoading) return <Loader />;

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-josefin font-bold text-brand-900 dark:text-white">
                    Explore our courses
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Learn in-demand skills with expert-led courses.
                </p>
            </div>

            {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                    {courses.map((item: any, index: number) => (
                        <CourseCard item={item} key={item._id || index} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-sm text-slate-400 dark:text-slate-500">
                    No courses available yet.
                </p>
            )}
        </section>
    )
}

export default Courses