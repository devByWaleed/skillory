"use client"
import React, { FC } from 'react'
import { Check } from "lucide-react"

type Props = {
    active: number;
    setActive: (index: number) => void;
}

const steps = ["Course Information", "Course Options", "Course Content", "Course Preview"];

const CourseOptions: FC<Props> = ({ active, setActive }) => {
    return (
        <div className="flex md:flex-col gap-0 overflow-x-auto md:overflow-visible">
            {steps.map((label, index) => {
                const isCompleted = index < active;
                const isCurrent = index === active;
                const isClickable = index <= active; // only allow jumping back to visited steps

                return (
                    <div
                        key={index}
                        className="flex md:flex-col items-center md:items-start shrink-0"
                    >
                        <div className="flex items-center gap-3 md:flex-row">
                            <button
                                type="button"
                                disabled={!isClickable}
                                onClick={() => isClickable && setActive(index)}
                                aria-label={`Go to ${label}`}
                                className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${isCompleted
                                        ? "bg-brand-600 text-white"
                                        : isCurrent
                                            ? "bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900"
                                            : "bg-slate-200 dark:bg-surface-700 text-slate-400 dark:text-slate-500"
                                    } ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}`}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                            </button>
                            <span
                                className={`text-sm font-medium whitespace-nowrap ${isCurrent || isCompleted
                                        ? "text-brand-900 dark:text-white"
                                        : "text-slate-400 dark:text-slate-500"
                                    }`}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {index < steps.length - 1 && (
                            <div
                                className={`hidden md:block w-px h-6 ml-3.5 ${isCompleted ? "bg-brand-600" : "bg-slate-200 dark:bg-surface-700"
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    )
}

export default CourseOptions