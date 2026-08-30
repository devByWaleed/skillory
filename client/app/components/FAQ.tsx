"use client"
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react'
import Loader from '../components/Loader/Loader'


type Props = {}

const FAQ: FC<Props> = () => {
    const { data, isLoading } = useGetHeroDataQuery("FAQ");
    const [questions, setQuestions] = useState<any[]>([]);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        if (data) {
            setQuestions(data.layout.faq);
        }
    }, [data]);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    }

    if (isLoading) return <Loader />;

    return (
        <section className='w-full flex flex-col items-center justify-center py-16 px-4'>
            <div className='w-full max-w-5xl'>
                <div className='mb-10'>
                    <h2 className='text-2xl sm:text-3xl font-josefin font-bold text-brand-900 dark:text-white text-center mb-3'>
                        Most asked FAQ's
                    </h2>
                    <p className='text-slate-600 dark:text-slate-300 max-w-md text-sm text-center mx-auto'>
                        We're here to help you and solve doubts. Find answers to the most common questions below.
                    </p>
                </div>

                {questions.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4'>
                        {questions.map((faq, index) => (
                            <div
                                key={index}
                                onClick={() => toggleFAQ(index)}
                                className={`bg-white dark:bg-surface-800 p-3.5 rounded-lg cursor-pointer transition-all duration-300 border border-slate-200 dark:border-surface-700 hover:bg-brand-50 dark:hover:bg-surface-700 ${openIndex === index ? 'row-span-2' : ''
                                    }`}
                            >
                                <div className='flex items-center justify-between gap-3'>
                                    <span className='text-sm font-medium text-brand-900 dark:text-white'>
                                        {faq.question}
                                    </span>
                                    <div
                                        className={`shrink-0 p-1 rounded transition-colors ${openIndex === index
                                                ? 'bg-brand-100 dark:bg-surface-600 text-brand-600 dark:text-accent-400'
                                                : 'text-slate-400 dark:text-slate-500 hover:bg-brand-100 dark:hover:bg-surface-600'
                                            }`}
                                    >
                                        {openIndex === index ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                        )}
                                    </div>
                                </div>
                                <div className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className='overflow-hidden'>
                                        <p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-center text-sm text-slate-400 dark:text-slate-500'>
                        No FAQs available yet.
                    </p>
                )}
            </div>
        </section>
    )
}

export default FAQ