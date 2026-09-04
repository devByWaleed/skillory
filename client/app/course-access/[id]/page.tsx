"use client"

import CourseContent from '@/app/components/Course/CourseContent';
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

    const user = data?.user;
    const isAdmin = user?.role === "admin";

    const isPurchased = user?.courses?.some((item: any) => {
        if (!item) return false;
        const targetId =
            item.courseId?._id?.toString() ||
            item.courseId?.toString() ||
            item._id?.toString() ||
            (typeof item === 'string' ? item : null);

        return targetId === id;
    });

    const hasAccess = isAdmin || isPurchased;

    useEffect(() => {
        if (!isLoading && (error || !data || !hasAccess)) {
            router.push("/");
        }
    }, [data, error, hasAccess, isLoading, router]);

    if (isLoading) return <Loader />;

    if (!data || !hasAccess) return null;

    return (
        <>
            <CourseContent id={id} />
        </>
    );
};

export default Page;















// "use client"

// import CourseContent from '@/app/components/Course/CourseContentList';
// import Loader from '@/app/components/Loader/Loader';
// import { useLoadUserQuery } from '@/redux/features/api/apiSlice';
// import { useRouter } from 'next/navigation';
// import React, { FC, use, useEffect } from 'react';

// type Props = {
//     params: Promise<{ id: string }>;
// };

// const Page: FC<Props> = ({ params }) => {
//     const { id } = use(params);
//     const router = useRouter();

//     const { isLoading, error, data } = useLoadUserQuery(undefined, {});

//     const isAdmin = data?.user?.role === "admin";
//     const isPurchased = data?.user?.courses?.some(
//         (item: any) => (item.courseId ? item.courseId.toString() : item._id?.toString()) === id
//     );

//     const hasAccess = isAdmin || isPurchased;

//     useEffect(() => {
//         if (error || (data && !hasAccess)) {
//             router.push("/");
//         }
//     }, [data, error, hasAccess, router]);

//     if (isLoading) return <Loader />;

//     // Prevent rendering CourseContent if user doesn't have access
//     if (!data || !hasAccess) return null;

//     return (
//         <>
//             <CourseContent id={id} />
//         </>
//     );
// };

// export default Page;