"use client"
import React, { FC, useEffect, useState } from 'react'
import CourseOptions from './CourseOptions'
import CourseInformation from './CourseInformation'
import CourseData from './CourseData'
import CourseContent from './CourseContent'
import CoursePreview from './CoursePreview'
import { useEditCourseMutation, useGetAllCoursesQuery } from '@/redux/features/course/courseApi'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'


type Props = {
    id: string
}

const EditCourse: FC<Props> = ({ id }) => {

    const router = useRouter();

    const [editCourse, { isSuccess, error, isLoading: isEditing }] = useEditCourseMutation();

    const { isLoading, data, refetch } = useGetAllCoursesQuery({}, { refetchOnMountOrArgChange: true });

    useEffect(() => {
        if (isSuccess) {
            toast.success("Course updated Successfully!");
            router.push("/admin/courses");
        }

        if (error) {
            if ("data" in error) {
                const errorMessage = error as any
                toast.error(errorMessage.data.message)
            }
        }

    }, [isLoading, isSuccess, error])

    const editCourseData = data && data.allCourses.find((i: any) => i._id === id);


    const [active, setActive] = useState(0);

    const [courseInfo, setCourseInfo] = useState({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        demoURL: "",
        thumbnail: null as string | null,
    });

    const [benefits, setBenefits] = useState([{ title: "" }]);
    const [prerequisites, setPrerequisites] = useState([{ title: "" }]);

    const [sections, setSections] = useState([
        {
            sectionName: "",
            collapsed: false,
            lectures: [
                {
                    title: "",
                    description: "",
                    videoURL: "",
                    videoLength: "",
                    suggestion: "",
                    links: [{ title: "", url: "" }],
                },
            ],
        },
    ]);

    useEffect(() => {
        if (editCourseData) {
            setCourseInfo({
                name: editCourseData.name,
                description: editCourseData.description,
                categories: editCourseData.categories,
                price: String(editCourseData.price ?? ""),
                estimatedPrice: String(editCourseData.estimatedPrice ?? ""),
                tags: editCourseData.tags,
                level: editCourseData.level,
                demoURL: editCourseData.demoURL,
                thumbnail: editCourseData.thumbnail?.url ?? null,
            });
            setBenefits(editCourseData.benefits?.length ? editCourseData.benefits : [{ title: "" }]);
            setPrerequisites(editCourseData.prerequisites?.length ? editCourseData.prerequisites : [{ title: "" }]);

            // Rebuild sections from the flat courseData array
            if (editCourseData.courseData?.length) {
                const grouped: Record<string, any> = {};

                editCourseData.courseData.forEach((lecture: any) => {
                    const sectionName = lecture.videoSection || "Untitled section";
                    if (!grouped[sectionName]) {
                        grouped[sectionName] = {
                            sectionName,
                            collapsed: false,
                            lectures: [],
                        };
                    }
                    grouped[sectionName].lectures.push({
                        title: lecture.title,
                        description: lecture.description,
                        videoURL: lecture.videoURL,
                        videoLength: String(lecture.videoLength ?? ""),
                        suggestion: lecture.suggestion,
                        links: lecture.links?.length ? lecture.links : [{ title: "", url: "" }],
                    });
                });

                setSections(Object.values(grouped));
            }
        }
    }, [editCourseData])

    useEffect(() => {
        if (data && !editCourseData) {
            toast.error("Course not found");
            router.push("/admin/courses");
        }
    }, [data, editCourseData]);


    const handleCreateCourse = async () => {
        // Flatten sections → flat courseData array matching CourseDataSchema,
        // re-attaching each lecture's parent section name as videoSection
        const formattedCourseData = sections.flatMap((section) =>
            section.lectures.map((lecture) => ({
                title: lecture.title,
                description: lecture.description,
                videoURL: lecture.videoURL,
                videoSection: section.sectionName,
                videoLength: Number(lecture.videoLength) || 0,
                suggestion: lecture.suggestion,
                links: lecture.links,
            }))
        );

        const data = {
            ...courseInfo,
            price: Number(courseInfo.price) || 0,
            estimatedPrice: Number(courseInfo.estimatedPrice) || 0,
            benefits,
            prerequisites,
            courseData: formattedCourseData,
        };

        if (!isEditing) {
            await editCourse({ id, data });
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col-reverse md:flex-row gap-8">
                {/* Active step content */}
                <div className="flex-1 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5 sm:p-6">
                    {active === 0 && (
                        <CourseInformation
                            courseInfo={courseInfo}
                            setCourseInfo={setCourseInfo}
                            active={active}
                            setActive={setActive}
                        />
                    )}
                    {active === 1 && (
                        <CourseData
                            benefits={benefits}
                            setBenefits={setBenefits}
                            prerequisites={prerequisites}
                            setPrerequisites={setPrerequisites}
                            active={active}
                            setActive={setActive}
                        />
                    )}
                    {active === 2 && (
                        <CourseContent
                            sections={sections}
                            setSections={setSections}
                            active={active}
                            setActive={setActive}
                        />
                    )}
                    {active === 3 && (
                        <CoursePreview
                            courseInfo={courseInfo}
                            benefits={benefits}
                            prerequisites={prerequisites}
                            sections={sections}
                            active={active}
                            setActive={setActive}
                            handleCreateCourse={handleCreateCourse}
                            isLoading={isEditing}
                            isEdit={true}
                        />
                    )}
                </div>

                {/* Stepper */}
                <div className="md:w-64 shrink-0">
                    <div className="md:sticky md:top-24 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5">
                        <CourseOptions active={active} setActive={setActive} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCourse