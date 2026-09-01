"use client"
import { useGetCourseContentQuery } from '@/redux/features/course/courseApi';
import React, { FC, useState } from 'react';
import Loader from '../Loader/Loader';
import Heading from '@/app/utils/Heading';
import CourseContentMedia from './CourseContentMedia';
import Header from '../Header';

type Props = {
    id: string;
}

const CourseContent: FC<Props> = ({ id }) => {
    const { data: contentData, isLoading, refetch } = useGetCourseContentQuery(id, {
        refetchOnMountOrArgChange: true,
    });
    const data = contentData?.content;

    const [activeVideo, setActiveVideo] = useState(0);
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");

    if (isLoading) return <Loader />;

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
            />
        </>
    );
};

export default CourseContent;