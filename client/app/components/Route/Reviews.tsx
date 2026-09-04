"use client"
import React, { FC } from 'react'
import ReviewCard from '../Review/ReviewCard'
import { useGetUsersAllCoursesQuery } from '@/redux/features/course/courseApi'
import Loader from '../Loader/Loader'

type Props = Record<string, never>

type Review = {
    _id?: string;
    rating: number;
    comment?: string;
    message?: string;
    name?: string;
    role?: string;
    user?: unknown;
};

type CoursesResponse = {
    allCourses?: Array<{ reviews?: Review[] }>;
};

const Reviews: FC<Props> = () => {
    const { data, isLoading } = useGetUsersAllCoursesQuery({}) as {
        data?: CoursesResponse;
        isLoading: boolean;
    };
    const reviewsData = data?.allCourses?.flatMap((course) => course.reviews || []) || [];

    if (isLoading) return <Loader />;

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-josefin font-bold text-brand-900 dark:text-white">
                    What our students say
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Real feedback from people who have taken our courses.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
                {reviewsData.map((item, index) => (
                    <ReviewCard item={item} key={index} />
                ))}
            </div>
        </section>
    )
}

export default Reviews