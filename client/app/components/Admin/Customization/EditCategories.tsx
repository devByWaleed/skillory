"use client"
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Plus, Trash2 } from "lucide-react"
import Loader from '../../Loader/Loader';

type Props = {}

const EditCategories: FC<Props> = () => {
    const { data, refetch, isLoading } = useGetHeroDataQuery("Categories", {
        refetchOnMountOrArgChange: true
    });
    const [editLayout, { isSuccess, error, isLoading: isUpdating }] = useEditLayoutMutation();

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setCategories(data.layout.categories);
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Categories updated successfully!");
            refetch();
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message);
            }
        }
    }, [isSuccess, error]);

    const handleCategoryChange = (index: number, value: string) => {
        const updated = [...categories];
        updated[index] = { ...updated[index], title: value };
        setCategories(updated);
    };

    const newCategoryHandler = () => {
        setCategories([...categories, { title: "" }]);
    };

    const removeCategoryHandler = (index: number) => {
        setCategories(categories.filter((_, i) => i !== index));
    };

    const areCategoriesUnchanged = (originalCategories: any[], newCategories: any[]) => {
        return JSON.stringify(originalCategories) === JSON.stringify(newCategories);
    };

    const isAnyCategoryEmpty = (categories: any[]) => {
        return categories.some((c) => c.title === "");
    };

    const isUnchanged = data ? areCategoriesUnchanged(data.layout.categories, categories) : true;
    const hasEmpty = isAnyCategoryEmpty(categories);

    const handleEdit = async () => {
        if (!isUnchanged && !hasEmpty) {
            await editLayout({
                type: "Categories",
                categories,
            });
        }
    };

    if (isLoading) return <Loader />;

    return (
        <section className="w-full max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-josefin font-bold text-brand-900 dark:text-white">
                    Manage categories
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Add, edit, or remove course categories shown across the site.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl p-3"
                    >
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                            {index + 1}
                        </span>
                        <input
                            value={category.title}
                            onChange={(e) => handleCategoryChange(index, e.target.value)}
                            placeholder="Category name"
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                        />
                        {categories.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeCategoryHandler(index)}
                                aria-label="Remove category"
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={newCategoryHandler}
                className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-accent-400"
            >
                <Plus className="w-4 h-4" /> Add category
            </button>

            <div className="mt-8 flex justify-end">
                <button
                    type="button"
                    onClick={handleEdit}
                    disabled={isUnchanged || hasEmpty || isUpdating}
                    className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                    {isUpdating ? "Saving..." : "Save changes"}
                </button>
            </div>
        </section>
    );
};

export default EditCategories;