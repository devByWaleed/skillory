"use client"

import CourseContent from '@/app/components/Course/CourseContentList';
import Loader from '@/app/components/Loader/Loader';
import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
import { useRouter } from 'next/navigation';
import React, { FC, use, useEffect } from 'react';

type Props = {
    params: Promise<{ id: string }>;
};

const Page: FC<Props> = ({ params }) => {
    const { id } = use(params);
    const router = useRouter();

    const { isLoading, error, data } = useLoadUserQuery(undefined, {});

    const isAdmin = data?.user?.role === "admin";
    const isPurchased = data?.user?.courses?.some(
        (item: any) => (item.courseId ? item.courseId.toString() : item._id?.toString()) === id
    );

    const hasAccess = isAdmin || isPurchased;

    useEffect(() => {
        if (error || (data && !hasAccess)) {
            router.push("/");
        }
    }, [data, error, hasAccess, router]);

    if (isLoading) return <Loader />;

    // Prevent rendering CourseContent if user doesn't have access
    if (!data || !hasAccess) return null;

    return (
        <>
            <CourseContent id={id} />
        </>
    );
};

export default Page;




// "use client"
// import CourseContent from '@/app/components/Course/CourseContent';
// import Loader from '@/app/components/Loader/Loader';
// import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
// import { useRouter } from 'next/navigation';
// import React, { FC, use, useEffect } from 'react'

// type Props = {
//     params: Promise<{ id: string }>;
// }

// const Page: FC<Props> = ({ params }) => {
//     const { id } = use(params); // e.g. "6a80110a37cec50b49f22434"
//     const router = useRouter();

//     const { isLoading, error, data } = useLoadUserQuery(undefined, {});

//     useEffect(() => {
//         if (error) {
//             router.push("/");
//             return;
//         }

//         if (data?.user) {
//             const isPurchased = data.user.courses?.some((item: any) => {
//                 // Extracts courseId if present, otherwise fallback to _id or direct string
//                 const targetId =
//                     item.courseId?._id?.toString() ||
//                     item.courseId?.toString() ||
//                     item._id?.toString() ||
//                     item.toString();

//                 return targetId === id;
//             });

//             if (!isPurchased) {
//                 router.push("/");
//             }
//         }
//     }, [data, error, id, router]);

//     if (isLoading) return <Loader />;

//     return (
//         <>
//             <CourseContent id={id} />
//         </>
//     )
// }

// export default Page