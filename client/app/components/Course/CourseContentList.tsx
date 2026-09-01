"use client"
import React, { FC, useState } from 'react'
import { ChevronDown, PlayCircle, Link as LinkIcon, Lightbulb, Lock } from "lucide-react"

type Props = {
    data: any[];
    activeVideo?: number;
    setActiveVideo?: (index: number) => void;
}

const CourseContentList: FC<Props> = ({ data, activeVideo, setActiveVideo }) => {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

    // Find unique video sections, in the order they first appear
    const videoSections: string[] = Array.from(
        new Set((data || []).map((item: any) => item.videoSection))
    );

    const toggleSection = (section: string) => {
        const newVisibleSections = new Set(visibleSections);

        if (newVisibleSections.has(section)) {
            newVisibleSections.delete(section);
        } else {
            newVisibleSections.add(section);
        }

        setVisibleSections(newVisibleSections);
    };

    let totalCount = 0;

    return (
        <div className="border border-slate-200 dark:border-surface-700 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-surface-700">
            {videoSections.map((section, sectionIndex) => {
                const sectionLectures = (data || []).filter((item: any) => item.videoSection === section);
                const isOpen = visibleSections.has(section);
                const sectionStartIndex = totalCount;
                totalCount += sectionLectures.length;

                return (
                    <div key={sectionIndex}>
                        <button
                            type="button"
                            onClick={() => toggleSection(section)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-brand-50/60 dark:bg-surface-800 text-left"
                        >
                            <span className="text-sm font-medium text-brand-900 dark:text-white">
                                {section}
                            </span>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {sectionLectures.length} lecture{sectionLectures.length !== 1 ? "s" : ""}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </div>
                        </button>

                        {isOpen && (
                            <ul className="divide-y divide-slate-100 dark:divide-surface-700">
                                {sectionLectures.map((lecture: any, i: number) => {
                                    const globalIndex = sectionStartIndex + i;
                                    const isActive = activeVideo === globalIndex;

                                    return (
                                        <li
                                            key={i}
                                            onClick={() => setActiveVideo?.(globalIndex)}
                                            className={`px-4 py-3 ${setActiveVideo ? "cursor-pointer" : ""
                                                } ${isActive
                                                    ? "bg-brand-50 dark:bg-surface-700"
                                                    : "hover:bg-brand-50/50 dark:hover:bg-surface-700/50"
                                                } transition-colors`}
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <span className={`flex items-center gap-2 text-sm ${isActive
                                                    ? "text-brand-600 dark:text-accent-400 font-medium"
                                                    : "text-slate-700 dark:text-slate-200"
                                                    }`}>
                                                    {setActiveVideo ? (
                                                        <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                                                    ) : (
                                                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    )}
                                                    {lecture.title}
                                                </span>
                                                <span className="text-xs text-slate-400 shrink-0">
                                                    {lecture.videoLength} min
                                                </span>
                                            </div>

                                            {lecture.description && (
                                                <p className="mt-1.5 ml-5.5 text-xs text-slate-500 dark:text-slate-400">
                                                    {lecture.description}
                                                </p>
                                            )}

                                            {lecture.suggestion && (
                                                <p className="mt-1.5 ml-5.5 flex items-start gap-1.5 text-xs text-brand-600 dark:text-accent-400">
                                                    <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                                    {lecture.suggestion}
                                                </p>
                                            )}

                                            {lecture.links?.length > 0 && (
                                                <div className="mt-1.5 ml-5.5 flex flex-wrap gap-3">
                                                    {lecture.links.map((link: any, k: number) => (
                                                        <a
                                                            key={k}
                                                            href={link.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-accent-400 transition-colors"
                                                        >
                                                            <LinkIcon className="w-3 h-3" />
                                                            {link.title}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CourseContentList;