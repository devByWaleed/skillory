"use client"
import React, { FC } from 'react'
import { Star, Quote } from "lucide-react"

type Props = {
    item: any;
}

const ReviewCard: FC<Props> = ({ item }) => {
    return (
        <div className="h-full flex flex-col bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5 sm:p-6">
            <Quote className="w-6 h-6 text-brand-100 dark:text-surface-700 shrink-0" />

            {/* Rating */}
            <div className="mt-3 flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < item.rating
                                ? "fill-accent-400 text-accent-400"
                                : "text-slate-200 dark:text-surface-700"
                            }`}
                    />
                ))}
            </div>

            {/* Review text — grows to fill available space so cards in a row match height */}
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
                {item.message}
            </p>

            {/* Avatar + name */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-surface-700 flex items-center gap-3">
                {item.avatar ? (
                    <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0">
                        <span className="text-sm font-semibold text-brand-600 dark:text-accent-400">
                            {item.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-900 dark:text-white truncate">
                        {item.name}
                    </p>
                    {item.role && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {item.role}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ReviewCard