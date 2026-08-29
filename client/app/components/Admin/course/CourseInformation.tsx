"use client"
import React, { FC } from 'react'
import Image from "next/image"
import { Upload } from "lucide-react"
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'

type CourseInfo = {
    name: string;
    description: string;
    categories: string;
    price: string;
    estimatedPrice: string;
    tags: string;
    level: string;
    demoURL: string;
    thumbnail: string | null;
};

type Props = {
    courseInfo: CourseInfo;
    setCourseInfo: (info: CourseInfo) => void;
    active: number;
    setActive: (index: number) => void;
}

const CourseInformation: FC<Props> = ({ courseInfo, setCourseInfo, active, setActive }) => {
    const { data: categoriesData } = useGetHeroDataQuery("Categories");

    const inputClass =
        "mt-1.5 w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors";
    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-200";

    const handleChange = (
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

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setActive(active + 1);
    };

    return (
        <form onSubmit={handleNext} className="w-full">
            <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Course information</h2>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                    <label htmlFor="name" className={labelClass}>Course name</label>
                    <input
                        id="name"
                        name="name"
                        required
                        value={courseInfo.name}
                        onChange={handleChange}
                        placeholder="Full Stack Web Development Masterclass"
                        className={inputClass}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="description" className={labelClass}>Description</label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={4}
                        value={courseInfo.description}
                        onChange={handleChange}
                        placeholder="What will students learn in this course?"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="categories" className={labelClass}>Category</label>
                    <select
                        id="categories"
                        name="categories"
                        required
                        value={courseInfo.categories}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="">Select category</option>
                        {categoriesData?.layout?.categories?.map((item: any, index: number) => (
                            <option value={item.title} key={index}>
                                {item.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="price" className={labelClass}>Price ($)</label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        required
                        value={courseInfo.price}
                        onChange={handleChange}
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
                        onChange={handleChange}
                        placeholder="149"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="tags" className={labelClass}>Tags</label>
                    <input
                        id="tags"
                        name="tags"
                        required
                        value={courseInfo.tags}
                        onChange={handleChange}
                        placeholder="React, Node.js, MongoDB"
                        className={inputClass}
                    />
                </div>

                <div>
                    <label htmlFor="level" className={labelClass}>Level</label>
                    <select
                        id="level"
                        name="level"
                        required
                        value={courseInfo.level}
                        onChange={handleChange}
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
                        required
                        value={courseInfo.demoURL}
                        onChange={handleChange}
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
                                sizes="(max-width: 640px) 100vw, 600px"
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

            <div className="mt-6 flex justify-end">
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

export default CourseInformation;