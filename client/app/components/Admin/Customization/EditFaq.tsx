"use client"
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Plus, Trash2 } from "lucide-react"
import Loader from '../../Loader/Loader';

type Props = {}

const EditFaq: FC<Props> = () => {
    const { data, refetch, isLoading } = useGetHeroDataQuery("FAQ", {
        refetchOnMountOrArgChange: true
    });
    const [editLayout, { isSuccess, error, isLoading: isUpdating }] = useEditLayoutMutation();

    const [questions, setQuestions] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setQuestions(data.layout.faq);
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("FAQ updated successfully!");
            refetch();
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message);
            }
        }
    }, [isSuccess, error]);

    const handleQuestionChange = (index: number, value: string) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], question: value };
        setQuestions(updated);
    };

    const handleAnswerChange = (index: number, value: string) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], answer: value };
        setQuestions(updated);
    };

    const newFaqHandler = () => {
        setQuestions([
            ...questions,
            { question: "", answer: "" },
        ]);
    };

    const removeFaqHandler = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    // Function to check if FAQ array is changed or not
    const areQuestionsUnchanged = (originalQuestions: any[], newQuestions: any[]) => {
        return JSON.stringify(originalQuestions) === JSON.stringify(newQuestions);
    };

    const isAnyQuestionEmpty = (questions: any[]) => {
        return questions.some((q) => q.question === "" || q.answer === "");
    };

    const isUnchanged = data ? areQuestionsUnchanged(data.layout.faq, questions) : true;
    const hasEmpty = isAnyQuestionEmpty(questions);

    const handleEdit = async () => {
        if (!isUnchanged && !hasEmpty) {
            await editLayout({
                type: "FAQ",
                faq: questions
            });
        }
    };

    if (isLoading) return <Loader />;

    return (
        <section className="w-full max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-josefin font-bold text-brand-900 dark:text-white">
                    Manage FAQs
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Add, edit, or remove frequently asked questions shown to students.
                </p>
            </div>

            <div className="space-y-4">
                {questions.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl p-4 sm:p-5"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <span className="mt-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                                Q{index + 1}
                            </span>
                            {questions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeFaqHandler(index)}
                                    aria-label="Remove FAQ"
                                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0 order-last"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            <div className="flex-1 space-y-3">
                                <input
                                    value={item.question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder="Question"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                                />
                                <textarea
                                    value={item.answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    placeholder="Answer"
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={newFaqHandler}
                className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-accent-400"
            >
                <Plus className="w-4 h-4" /> Add question
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

export default EditFaq;