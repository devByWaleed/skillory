"use client"
import React, { FC, useState } from 'react'
import Image from "next/image"
import { Plus, Trash2, Upload, Link as LinkIcon } from "lucide-react"

type Props = {}

type CourseInfo = {
    name: string;
    description: string;
    price: string;
    estimatedPrice: string;
    tags: string;
    level: string;
    demoURL: string;
    thumbnail: string | null;
};

type Benefit = { title: string };
type Prerequisite = { title: string };

type CourseLink = { title: string; url: string };

type CourseContentItem = {
    title: string;
    description: string;
    videoURL: string;
    videoSection: string;
    videoLength: string;
    suggestion: string;
    links: CourseLink[];
};

const CreateCourse: FC<Props> = () => {
    const [courseInfo, setCourseInfo] = useState<CourseInfo>({
        name: "",
        description: "",
        price: "",
        estimatedPrice: "",
        tags: "",
        level: "",
        demoURL: "",
        thumbnail: null,
    });

    const [benefits, setBenefits] = useState<Benefit[]>([{ title: "" }]);
    const [prerequisites, setPrerequisites] = useState<Prerequisite[]>([{ title: "" }]);

    const [courseContentData, setCourseContentData] = useState<CourseContentItem[]>([
        {
            title: "",
            description: "",
            videoURL: "",
            videoSection: "",
            videoLength: "",
            suggestion: "",
            links: [{ title: "", url: "" }],
        },
    ]);

    // ---- Course info handlers ----
    const handleCourseInfoChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setCourseInfo({ ...courseInfo, [name]: value });
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setCourseInfo({ ...courseInfo, thumbnail: reader.result as string });
            }
        };
        reader.readAsDataURL(file);
    };

    // ---- Benefits handlers ----
    const handleBenefitChange = (index: number, value: string) => {
        const updated = [...benefits];
        updated[index] = { title: value };
        setBenefits(updated);
    };
    const addBenefit = () => setBenefits([...benefits, { title: "" }]);
    const removeBenefit = (index: number) => setBenefits(benefits.filter((_, i) => i !== index));

    // ---- Prerequisites handlers ----
    const handlePrerequisiteChange = (index: number, value: string) => {
        const updated = [...prerequisites];
        updated[index] = { title: value };
        setPrerequisites(updated);
    };
    const addPrerequisite = () => setPrerequisites([...prerequisites, { title: "" }]);
    const removePrerequisite = (index: number) =>
        setPrerequisites(prerequisites.filter((_, i) => i !== index));

    // ---- Course content handlers ----
    const handleContentChange = (
        index: number,
        field: keyof Omit<CourseContentItem, "links">,
        value: string
    ) => {
        const updated = [...courseContentData];
        updated[index] = { ...updated[index], [field]: value };
        setCourseContentData(updated);
    };

    const handleLinkChange = (
        contentIndex: number,
        linkIndex: number,
        field: keyof CourseLink,
        value: string
    ) => {
        const updated = [...courseContentData];
        const links = [...updated[contentIndex].links];
        links[linkIndex] = { ...links[linkIndex], [field]: value };
        updated[contentIndex] = { ...updated[contentIndex], links };
        setCourseContentData(updated);
    };

    const addLink = (contentIndex: number) => {
        const updated = [...courseContentData];
        updated[contentIndex].links = [...updated[contentIndex].links, { title: "", url: "" }];
        setCourseContentData(updated);
    };

    const removeLink = (contentIndex: number, linkIndex: number) => {
        const updated = [...courseContentData];
        updated[contentIndex].links = updated[contentIndex].links.filter((_, i) => i !== linkIndex);
        setCourseContentData(updated);
    };

    const addCourseContent = () => {
        setCourseContentData([
            ...courseContentData,
            {
                title: "",
                description: "",
                videoURL: "",
                videoSection: "",
                videoLength: "",
                suggestion: "",
                links: [{ title: "", url: "" }],
            },
        ]);
    };

    const removeCourseContent = (index: number) => {
        setCourseContentData(courseContentData.filter((_, i) => i !== index));
    };

    const inputClass =
        "mt-1.5 w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors";

    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-200";

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-josefin font-bold text-brand-900 dark:text-white">
                Create a new course
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Fill in the details below to publish a new course to Skillory.
            </p>

            {/* ---------- Basic info ---------- */}
            <section className="mt-8 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5 sm:p-6">
                <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Course information</h2>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                        <label htmlFor="name" className={labelClass}>Course name</label>
                        <input
                            id="name"
                            name="name"
                            value={courseInfo.name}
                            onChange={handleCourseInfoChange}
                            placeholder="Full Stack Web Development Masterclass"
                            className={inputClass}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="description" className={labelClass}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={courseInfo.description}
                            onChange={handleCourseInfoChange}
                            placeholder="What will students learn in this course?"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className={labelClass}>Price ($)</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            value={courseInfo.price}
                            onChange={handleCourseInfoChange}
                            placeholder="99"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="estimatedPrice" className={labelClass}>Estimated price ($)</label>
                        <input
                            id="estimatedPrice"
                            name="estimatedPrice"
                            type="number"
                            value={courseInfo.estimatedPrice}
                            onChange={handleCourseInfoChange}
                            placeholder="149"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="tags" className={labelClass}>Tags</label>
                        <input
                            id="tags"
                            name="tags"
                            value={courseInfo.tags}
                            onChange={handleCourseInfoChange}
                            placeholder="React, Node.js, MongoDB"
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label htmlFor="level" className={labelClass}>Level</label>
                        <select
                            id="level"
                            name="level"
                            value={courseInfo.level}
                            onChange={handleCourseInfoChange}
                            className={inputClass}
                        >
                            <option value="">Select level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Beginner to Advanced">Beginner to Advanced</option>
                        </select>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="demoURL" className={labelClass}>Demo video URL</label>
                        <input
                            id="demoURL"
                            name="demoURL"
                            value={courseInfo.demoURL}
                            onChange={handleCourseInfoChange}
                            placeholder="https://..."
                            className={inputClass}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className={labelClass}>Thumbnail</label>
                        <label
                            htmlFor="thumbnail"
                            className="mt-1.5 flex flex-col items-center justify-center gap-2 w-full h-40 rounded-lg border-2 border-dashed border-slate-200 dark:border-surface-700 cursor-pointer hover:border-brand-400 transition-colors overflow-hidden relative"
                        >
                            {courseInfo.thumbnail ? (
                                <Image
                                    src={courseInfo.thumbnail}
                                    alt="Course thumbnail preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <>
                                    <Upload className="w-6 h-6 text-slate-400" />
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        Click to upload thumbnail
                                    </span>
                                </>
                            )}
                        </label>
                        <input
                            id="thumbnail"
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleThumbnailChange}
                            className="hidden"
                        />
                    </div>
                </div>
            </section>

            {/* ---------- Benefits ---------- */}
            <section className="mt-6 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Benefits</h2>
                    <button
                        type="button"
                        onClick={addBenefit}
                        className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-accent-400"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                value={benefit.title}
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                placeholder="Build production-ready applications"
                                className={inputClass + " mt-0!"}
                            />
                            {benefits.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeBenefit(index)}
                                    aria-label="Remove benefit"
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- Prerequisites ---------- */}
            <section className="mt-6 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Prerequisites</h2>
                    <button
                        type="button"
                        onClick={addPrerequisite}
                        className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-accent-400"
                    >
                        <Plus className="w-4 h-4" /> Add
                    </button>
                </div>

                <div className="mt-4 space-y-3">
                    {prerequisites.map((prerequisite, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                value={prerequisite.title}
                                onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                                placeholder="Basic understanding of JavaScript"
                                className={inputClass + " mt-0!"}
                            />
                            {prerequisites.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePrerequisite(index)}
                                    aria-label="Remove prerequisite"
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- Course content ---------- */}
            <section className="mt-6 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5 sm:p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Course content</h2>
                    <button
                        type="button"
                        onClick={addCourseContent}
                        className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-accent-400"
                    >
                        <Plus className="w-4 h-4" /> Add lecture
                    </button>
                </div>

                <div className="mt-5 space-y-6">
                    {courseContentData.map((content, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-200 dark:border-surface-700 p-4 sm:p-5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                                    Lecture {index + 1}
                                </span>
                                {courseContentData.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCourseContent(index)}
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
                                        value={content.title}
                                        onChange={(e) => handleContentChange(index, "title", e.target.value)}
                                        placeholder="Introduction to the course"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Video section</label>
                                    <input
                                        value={content.videoSection}
                                        onChange={(e) => handleContentChange(index, "videoSection", e.target.value)}
                                        placeholder="Getting Started"
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Video length (minutes)</label>
                                    <input
                                        type="number"
                                        value={content.videoLength}
                                        onChange={(e) => handleContentChange(index, "videoLength", e.target.value)}
                                        placeholder="10"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Video URL</label>
                                    <input
                                        value={content.videoURL}
                                        onChange={(e) => handleContentChange(index, "videoURL", e.target.value)}
                                        placeholder="https://..."
                                        className={inputClass}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Description</label>
                                    <textarea
                                        rows={3}
                                        value={content.description}
                                        onChange={(e) => handleContentChange(index, "description", e.target.value)}
                                        placeholder="What does this lecture cover?"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className={labelClass}>Suggestion</label>
                                    <input
                                        value={content.suggestion}
                                        onChange={(e) => handleContentChange(index, "suggestion", e.target.value)}
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
                                        onClick={() => addLink(index)}
                                        className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-accent-400"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add link
                                    </button>
                                </div>

                                <div className="mt-2 space-y-2">
                                    {content.links.map((link, linkIndex) => (
                                        <div key={linkIndex} className="flex flex-col sm:flex-row gap-2">
                                            <div className="flex-1 relative">
                                                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    value={link.title}
                                                    onChange={(e) =>
                                                        handleLinkChange(index, linkIndex, "title", e.target.value)
                                                    }
                                                    placeholder="Source Code"
                                                    className={inputClass + " mt-0! pl-9"}
                                                />
                                            </div>
                                            <input
                                                value={link.url}
                                                onChange={(e) =>
                                                    handleLinkChange(index, linkIndex, "url", e.target.value)
                                                }
                                                placeholder="https://github.com"
                                                className={inputClass + " mt-0! flex-1"}
                                            />
                                            {content.links.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLink(index, linkIndex)}
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
                </div>
            </section>

            <div className="mt-6 flex justify-end">
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

export default CreateCourse