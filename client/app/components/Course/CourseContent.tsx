"use client"

import { useGetCourseContentQuery, useGetCourseDetailsQuery } from '@/redux/features/course/courseApi';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import React, { FC, useState } from 'react';
import Loader from '../Loader/Loader';
import Heading from '@/app/utils/Heading';
import CourseContentMedia from './CourseContentMedia';
import Header from '../Header';

type Props = {
    id: string;
}

const CourseContent: FC<Props> = ({ id }) => {
    const { data: userData } = useLoadUserQuery(undefined, {});
    const { data: contentData, isLoading, refetch, error } = useGetCourseContentQuery(id, {
        refetchOnMountOrArgChange: true,
    });

    // Fetch course details for review management
    const { data: courseDetailsData } = useGetCourseDetailsQuery(id, {});

    const data = contentData?.content;
    const [activeVideo, setActiveVideo] = useState(0);
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    if (isLoading) return <Loader />;

    // Fallback UI if backend returns no content or an error
    if (error || !data || data.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
                <Header activeItem={1} open={open} setOpen={setOpen} route={route} setRoute={setRoute} />
                <div className="text-center mt-20">
                    <h2 className="text-xl font-bold">No Content Available</h2>
                    <p className="text-slate-400 text-sm mt-2">
                        You may not have access to this course content or the course dataset is empty.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header
                activeItem={1}
                open={open}
                setOpen={setOpen}
                route={route}
                setRoute={setRoute}
            />
            <Heading
                title={data?.[activeVideo]?.title || "Course content"}
                description="Video Tutorial"
                keywords={data?.[activeVideo]?.tags || "Learning"}
            />
            <CourseContentMedia
                data={data}
                id={id}
                activeVideo={activeVideo}
                setActiveVideo={setActiveVideo}
                refetch={refetch}
                courseData={courseDetailsData?.course}
                user={userData?.user}
            />
        </>
    );
};

export default CourseContent;