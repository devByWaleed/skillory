"use client"
import React, { FC, useEffect, useState } from 'react'
import CourseOptions from './CourseOptions'
import CourseInformation from './CourseInformation'
import CourseData from './CourseData'
import CourseContent from './CourseContent'
import CoursePreview from './CoursePreview'
import { useCreateCourseMutation } from '@/redux/features/course/courseApi'
import toast from 'react-hot-toast'
import { redirect } from 'next/navigation'


type Props = {}

const CreateCourse: FC<Props> = () => {
    const [createCourse, { isLoading, isSuccess, error }] = useCreateCourseMutation()

    useEffect(() => {
        if (isSuccess) {
            toast.success("Course created Successfully!");
            redirect("/admin/all-courses");
        }

        if (error) {
            if ("data" in error) {
                const errorMessage = error as any
                toast.error(errorMessage.data.message)
            }
        }



    }, [isLoading, isSuccess, error])



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

        if (!isLoading) {
            await createCourse(data);
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
                            isLoading={isLoading}
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

export default CreateCourse