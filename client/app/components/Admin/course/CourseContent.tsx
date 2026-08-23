"use client"
import React, { FC } from 'react'
import { Plus, Trash2, Link as LinkIcon, ChevronDown } from "lucide-react"

type CourseLink = { title: string; url: string };

type Lecture = {
    title: string;
    description: string;
    videoURL: string;
    videoLength: string;
    suggestion: string;
    links: CourseLink[];
};

type Section = {
    sectionName: string;
    collapsed: boolean;
    lectures: Lecture[];
};

type Props = {
    sections: Section[];
    setSections: (sections: Section[]) => void;
    active: number;
    setActive: (index: number) => void;
}

const emptyLecture = (): Lecture => ({
    title: "",
    description: "",
    videoURL: "",
    videoLength: "",
    suggestion: "",
    links: [{ title: "", url: "" }],
});

const emptySection = (): Section => ({
    sectionName: "",
    collapsed: false,
    lectures: [emptyLecture()],
});

const CourseContent: FC<Props> = ({ sections, setSections, active, setActive }) => {
    const inputClass =
        "mt-1.5 w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors";
    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-200";

    // ---- Section-level handlers ----
    const handleSectionNameChange = (sectionIndex: number, value: string) => {
        const updated = [...sections];
        updated[sectionIndex] = { ...updated[sectionIndex], sectionName: value };
        setSections(updated);
    };

    const toggleSectionCollapse = (sectionIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex] = { ...updated[sectionIndex], collapsed: !updated[sectionIndex].collapsed };
        setSections(updated);
    };

    const addSection = () => {
        setSections([...sections, emptySection()]);
    };

    const removeSection = (sectionIndex: number) => {
        setSections(sections.filter((_, i) => i !== sectionIndex));
    };

    // ---- Lecture-level handlers ----
    const handleLectureChange = (
        sectionIndex: number,
        lectureIndex: number,
        field: keyof Omit<Lecture, "links">,
        value: string
    ) => {
        const updated = [...sections];
        const lectures = [...updated[sectionIndex].lectures];
        lectures[lectureIndex] = { ...lectures[lectureIndex], [field]: value };
        updated[sectionIndex] = { ...updated[sectionIndex], lectures };
        setSections(updated);
    };

    const addLecture = (sectionIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex] = {
            ...updated[sectionIndex],
            lectures: [...updated[sectionIndex].lectures, emptyLecture()],
        };
        setSections(updated);
    };

    const removeLecture = (sectionIndex: number, lectureIndex: number) => {
        const updated = [...sections];
        updated[sectionIndex] = {
            ...updated[sectionIndex],
            lectures: updated[sectionIndex].lectures.filter((_, i) => i !== lectureIndex),
        };
        setSections(updated);
    };

    // ---- Link-level handlers ----
    const handleLinkChange = (
        sectionIndex: number,
        lectureIndex: number,
        linkIndex: number,
        field: keyof CourseLink,
        value: string
    ) => {
        const updated = [...sections];
        const lectures = [...updated[sectionIndex].lectures];
        const links = [...lectures[lectureIndex].links];
        links[linkIndex] = { ...links[linkIndex], [field]: value };
        lectures[lectureIndex] = { ...lectures[lectureIndex], links };
        updated[sectionIndex] = { ...updated[sectionIndex], lectures };
        setSections(updated);
    };

    const addLink = (sectionIndex: number, lectureIndex: number) => {
        const updated = [...sections];
        const lectures = [...updated[sectionIndex].lectures];
        lectures[lectureIndex] = {
            ...lectures[lectureIndex],
            links: [...lectures[lectureIndex].links, { title: "", url: "" }],
        };
        updated[sectionIndex] = { ...updated[sectionIndex], lectures };
        setSections(updated);
    };

    const removeLink = (sectionIndex: number, lectureIndex: number, linkIndex: number) => {
        const updated = [...sections];
        const lectures = [...updated[sectionIndex].lectures];
        lectures[lectureIndex] = {
            ...lectures[lectureIndex],
            links: lectures[lectureIndex].links.filter((_, i) => i !== linkIndex),
        };
        updated[sectionIndex] = { ...updated[sectionIndex], lectures };
        setSections(updated);
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setActive(active + 1);
    };

    return (
        <form onSubmit={handleNext} className="w-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Course content</h2>
                <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-accent-400"
                >
                    <Plus className="w-4 h-4" /> Add section
                </button>
            </div>

            <div className="mt-5 space-y-5">
                {sections.map((section, sectionIndex) => (
                    <div
                        key={sectionIndex}
                        className="rounded-xl border border-slate-200 dark:border-surface-700 overflow-hidden"
                    >
                        {/* Section header — name input + collapse toggle */}
                        <div className="flex items-center gap-2 p-4 bg-brand-50/50 dark:bg-surface-700/50">
                            <button
                                type="button"
                                onClick={() => toggleSectionCollapse(sectionIndex)}
                                aria-label={section.collapsed ? "Expand section" : "Collapse section"}
                                className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-surface-800 transition-colors shrink-0"
                            >
                                <ChevronDown
                                    className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${section.collapsed ? "-rotate-90" : ""
                                        }`}
                                />
                            </button>

                            <input
                                required
                                value={section.sectionName}
                                onChange={(e) => handleSectionNameChange(sectionIndex, e.target.value)}
                                placeholder={`Section ${sectionIndex + 1} name (e.g. Getting Started)`}
                                className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                            />

                            <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 hidden sm:inline">
                                {section.lectures.length} lecture{section.lectures.length !== 1 ? "s" : ""}
                            </span>

                            {sections.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSection(sectionIndex)}
                                    aria-label="Remove section"
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Section body — lectures, hidden when collapsed */}
                        {!section.collapsed && (
                            <div className="p-4 sm:p-5 space-y-6">
                                {section.lectures.map((lecture, lectureIndex) => (
                                    <div
                                        key={lectureIndex}
                                        className="rounded-xl border border-slate-200 dark:border-surface-700 p-4 sm:p-5"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                                Lecture {lectureIndex + 1}
                                            </span>
                                            {section.lectures.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLecture(sectionIndex, lectureIndex)}
                                                    aria-label="Remove lecture"
                                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>Title</label>
                                                <input
                                                    required
                                                    value={lecture.title}
                                                    onChange={(e) =>
                                                        handleLectureChange(sectionIndex, lectureIndex, "title", e.target.value)
                                                    }
                                                    placeholder="Introduction to the course"
                                                    className={inputClass}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Video length (minutes)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={lecture.videoLength}
                                                    onChange={(e) =>
                                                        handleLectureChange(sectionIndex, lectureIndex, "videoLength", e.target.value)
                                                    }
                                                    placeholder="10"
                                                    className={inputClass}
                                                />
                                            </div>

                                            <div>
                                                <label className={labelClass}>Video URL</label>
                                                <input
                                                    required
                                                    value={lecture.videoURL}
                                                    onChange={(e) =>
                                                        handleLectureChange(sectionIndex, lectureIndex, "videoURL", e.target.value)
                                                    }
                                                    placeholder="https://..."
                                                    className={inputClass}
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>Description</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    value={lecture.description}
                                                    onChange={(e) =>
                                                        handleLectureChange(sectionIndex, lectureIndex, "description", e.target.value)
                                                    }
                                                    placeholder="What does this lecture cover?"
                                                    className={inputClass}
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>Suggestion</label>
                                                <input
                                                    value={lecture.suggestion}
                                                    onChange={(e) =>
                                                        handleLectureChange(sectionIndex, lectureIndex, "suggestion", e.target.value)
                                                    }
                                                    placeholder="Make sure Node.js v18+ is installed"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        {/* Links */}
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between">
                                                <label className={labelClass}>Links</label>
                                                <button
                                                    type="button"
                                                    onClick={() => addLink(sectionIndex, lectureIndex)}
                                                    className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-accent-400"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add link
                                                </button>
                                            </div>

                                            <div className="mt-2 space-y-2">
                                                {lecture.links.map((link, linkIndex) => (
                                                    <div key={linkIndex} className="flex flex-col sm:flex-row gap-2">
                                                        <div className="flex-1 relative">
                                                            <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                            <input
                                                                value={link.title}
                                                                onChange={(e) =>
                                                                    handleLinkChange(sectionIndex, lectureIndex, linkIndex, "title", e.target.value)
                                                                }
                                                                placeholder="Source Code"
                                                                className={inputClass + " !mt-0 pl-9"}
                                                            />
                                                        </div>
                                                        <input
                                                            value={link.url}
                                                            onChange={(e) =>
                                                                handleLinkChange(sectionIndex, lectureIndex, linkIndex, "url", e.target.value)
                                                            }
                                                            placeholder="https://github.com"
                                                            className={inputClass + " !mt-0 flex-1"}
                                                        />
                                                        {lecture.links.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeLink(sectionIndex, lectureIndex, linkIndex)}
                                                                aria-label="Remove link"
                                                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 self-start sm:self-auto"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => addLecture(sectionIndex)}
                                    className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-accent-400"
                                >
                                    <Plus className="w-4 h-4" /> Add lecture to this section
                                </button>
                            </div>
                        )}
                    </div>
                ))}
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
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
                >
                    Next
                </button>
            </div>
        </form>
    )
}

export default CourseContent