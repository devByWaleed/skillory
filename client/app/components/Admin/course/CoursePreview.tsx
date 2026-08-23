"use client"
import React, { FC } from 'react'
import Image from "next/image"

type Props = {
    courseInfo: any;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    sections: any[];
    active: number;
    setActive: (index: number) => void;
}

const CoursePreview: FC<Props> = ({ courseInfo, benefits, prerequisites, sections, active, setActive }) => {
    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Course preview</h2>

            <div className="mt-5 space-y-6">
                {courseInfo.thumbnail && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden">
                        <Image src={courseInfo.thumbnail} alt="Thumbnail" fill className="object-cover" />
                    </div>
                )}

                <div>
                    <h3 className="text-xl font-bold text-brand-900 dark:text-white">{courseInfo.name}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{courseInfo.description}</p>
                    <p className="mt-2 text-sm font-semibold text-brand-600 dark:text-accent-400">
                        ${courseInfo.price} <span className="text-slate-400 line-through ml-2">${courseInfo.estimatedPrice}</span>
                    </p>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-brand-900 dark:text-white mb-2">Benefits</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        {benefits.map((b, i) => <li key={i}>{b.title}</li>)}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-brand-900 dark:text-white mb-2">Prerequisites</h4>
                    <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                        {prerequisites.map((p, i) => <li key={i}>{p.title}</li>)}
                    </ul>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-brand-900 dark:text-white mb-2">
                        Content ({sections.reduce((sum, s) => sum + s.lectures.length, 0)} lectures across {sections.length} sections)
                    </h4>
                    {sections.map((section, i) => (
                        <div key={i} className="mb-2">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{section.sectionName}</p>
                            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1 ml-2">
                                {section.lectures.map((l, j) => <li key={j}>{l.title}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                <button
                    type="button"
                    onClick={() => setActive(active - 1)}
                    className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-surface-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
                >
                    Previous
                </button>
                <button
                    type="button"
                    className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
                >
                    Create course
                </button>
            </div>
        </div>
    )
}

export default CoursePreview