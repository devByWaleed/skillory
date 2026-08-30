"use client"
import React, { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Users } from "lucide-react"

type Props = {
    item: any;
    isProfile?: boolean;
}

const CourseCard: FC<Props> = ({ item, isProfile }) => {
    return (
        <Link
            href={isProfile ? `/course/${item._id}` : `course-access/${item._id}`}
            className="group block bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl overflow-hidden hover:shadow-lg dark:hover:shadow-black/20 transition-shadow"
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video overflow-hidden bg-brand-100 dark:bg-brand-900">
                {item.thumbnail?.url && (
                    <Image
                        src={item.thumbnail.url}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                )}
                {item.level && (
                    <span className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 dark:bg-surface-900/90 text-brand-600 dark:text-accent-400">
                        {item.level}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base font-semibold text-brand-900 dark:text-white line-clamp-2">
                    {item.name}
                </h3>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
                        {item.ratings?.toFixed ? item.ratings.toFixed(1) : item.ratings || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {item.purchased || 0} students
                    </span>
                    <span className="flex items-center gap-1">
                        {item.courseData.length || 0} videos
                    </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-brand-900 dark:text-white">
                        ${item.price}
                    </span>
                    {item.estimatedPrice > item.price && (
                        <span className="text-sm text-slate-400 line-through">
                            ${item.estimatedPrice}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CourseCard