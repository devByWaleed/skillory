"use client"
import CourseDetailsPage from '@/app/components/Course/CourseDetailsPage';
import Heading from '@/app/utils/Heading';
import React, { FC, use } from 'react'

type Props = {
    params: Promise<{ id: string }>;
}

const page: FC<Props> = ({ params }) => {
    const { id } = use(params);

    return (
        <>
            <Heading
                title={`Course Details Page | Skillory`}

                description="Skillory is an online learning platform offering expert-led courses in web development, programming, and tech skills. Learn at your own pace, track your progress, and turn skills into real-world results."

                keywords="Skillory, online courses, learn programming, web development courses, online learning platform, e-learning, tech courses, LMS, buy courses online, video courses"
            />
            <div>
                <CourseDetailsPage id={id} />
            </div>
        </>
    )
}

export default page