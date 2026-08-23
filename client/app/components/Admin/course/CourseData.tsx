"use client"
import React, { FC } from 'react'
import { Plus, Trash2 } from "lucide-react"

type Benefit = { title: string };
type Prerequisite = { title: string };

type Props = {
    benefits: Benefit[];
    setBenefits: (benefits: Benefit[]) => void;
    prerequisites: Prerequisite[];
    setPrerequisites: (prerequisites: Prerequisite[]) => void;
    active: number;
    setActive: (index: number) => void;
}

const CourseData: FC<Props> = ({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive }) => {
    const inputClass =
        "w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors";

    const handleBenefitChange = (index: number, value: string) => {
        const updated = [...benefits];
        updated[index] = { title: value };
        setBenefits(updated);
    };
    const addBenefit = () => setBenefits([...benefits, { title: "" }]);
    const removeBenefit = (index: number) => setBenefits(benefits.filter((_, i) => i !== index));

    const handlePrerequisiteChange = (index: number, value: string) => {
        const updated = [...prerequisites];
        updated[index] = { title: value };
        setPrerequisites(updated);
    };
    const addPrerequisite = () => setPrerequisites([...prerequisites, { title: "" }]);
    const removePrerequisite = (index: number) =>
        setPrerequisites(prerequisites.filter((_, i) => i !== index));

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setActive(active + 1);
    };

    return (
        <form onSubmit={handleNext} className="w-full">
            {/* Benefits */}
            <div>
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
                                required
                                value={benefit.title}
                                onChange={(e) => handleBenefitChange(index, e.target.value)}
                                placeholder="Build production-ready applications"
                                className={inputClass}
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
            </div>

            {/* Prerequisites */}
            <div className="mt-8">
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
                                required
                                value={prerequisite.title}
                                onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                                placeholder="Basic understanding of JavaScript"
                                className={inputClass}
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

export default CourseData