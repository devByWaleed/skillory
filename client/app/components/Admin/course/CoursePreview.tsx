"use client"
import React, { FC } from 'react'
import Image from "next/image"
import CoursePlayer from '@/app/utils/CoursePlayer';


type Props = {
    courseInfo: any;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    sections: any[];
    active: number;
    setActive: (index: number) => void;
    handleCreateCourse: () => void;
    isLoading?: boolean;
    isEdit: boolean
}

const CoursePreview: FC<Props> = ({ courseInfo, benefits, prerequisites, sections, active, setActive, handleCreateCourse, isLoading, isEdit }) => {
    const totalLectures = sections.reduce((sum, s) => sum + s.lectures.length, 0);

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Course preview</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Review everything before publishing.
            </p>

            {/* Video / demo preview */}
            <div className="mt-5">
                <CoursePlayer
                    videoUrl={courseInfo?.demoURL}
                    title={courseInfo?.name}
                />
            </div>

            <div className="mt-6 space-y-6">
                {/* Thumbnail */}
                {courseInfo.thumbnail && (
                    <div>
                        <h4 className="text-sm font-semibold text-brand-900 dark:text-white mb-2">Thumbnail</h4>
                        <div className="relative w-full h-48 rounded-xl overflow-hidden">
                            <Image src={courseInfo.thumbnail} alt="Thumbnail" fill className="object-cover" />
                        </div>
                    </div>
                )}

                {/* Core info */}
                <div>
                    <h3 className="text-xl font-bold text-brand-900 dark:text-white">
                        {courseInfo.name || "Untitled course"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {courseInfo.description || "No description provided."}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <p className="text-sm font-semibold text-brand-600 dark:text-accent-400">
                            ${courseInfo.price || 0}
                            {courseInfo.estimatedPrice && (
                                <span className="text-slate-400 line-through ml-2 font-normal">
                                    ${courseInfo.estimatedPrice}
                                </span>
                            )}
                        </p>
                        {courseInfo.level && (
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-50 dark:bg-surface-700 text-brand-600 dark:text-accent-400">
                                {courseInfo.level}
                            </span>
                        )}
                        {courseInfo.tags && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {courseInfo.tags}
                            </span>
                        )}
                    </div>
                </div>

                {/* Benefits */}
                <div>
                    <h4 className="text-sm font-semibold text-brand-900 dark:text-white mb-2">Benefits</h4>
                    {benefits.filter(b => b.title).length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            {benefits.map((b, i) => b.title && <li key={i}>{b.title}</li>)}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500">None added yet.</p>
                    )}
                </div>

                {/* Prerequisites */}
                <div>
                    <h4 className="text-sm font-semibold text-brand-900 dark:text-white mb-2">Prerequisites</h4>
                    {prerequisites.filter(p => p.title).length > 0 ? (
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                            {prerequisites.map((p, i) => p.title && <li key={i}>{p.title}</li>)}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500">None added yet.</p>
                    )}
                </div>

                {/* Course content */}
                <div>
                    <h4 className="text-sm font-semibold text-brand-900 dark:text-white mb-2">
                        Content ({totalLectures} lecture{totalLectures !== 1 ? "s" : ""} across {sections.length} section{sections.length !== 1 ? "s" : ""})
                    </h4>
                    <div className="space-y-3">
                        {sections.map((section, i) => (
                            <div
                                key={i}
                                className="rounded-lg border border-slate-200 dark:border-surface-700 p-3"
                            >
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {section.sectionName || `Section ${i + 1}`}
                                </p>
                                <ul className="mt-1.5 list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1 ml-2">
                                    {section.lectures.map((l: any, j: number) => (
                                        <li key={j}>{l.title || `Lecture ${j + 1}`}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button
                    type="button"
                    onClick={() => setActive(active - 1)}
                    className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-surface-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
                >
                    Previous
                </button>

                {isEdit ? (
                    <button
                        type="button"
                        onClick={handleCreateCourse}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                    >
                        {isLoading ? "Editing..." : "Edit course"}
                    </button>
                ) : (

                    <button
                        type="button"
                        onClick={handleCreateCourse}
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                    >
                        {isLoading ? "Creating..." : "Create course"}
                    </button>
                )}

            </div>
        </div>
    )
}

export default CoursePreview