"use client";
import React, { FC } from "react";
import { Search } from "lucide-react";
import { assets } from "@/public/assets/assets";
import Image from "next/image";
import { useGetHeroDataQuery } from "@/redux/features/layout/layoutApi";


const Hero: FC = () => {
    const { data, refetch, isLoading } = useGetHeroDataQuery("Banner", {
        refetchOnMountOrArgChange: true
    });
    return (
        <section className="w-full pt-30 pb-16 md:pt-40 md:pb-24 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-8">

                {/* Image panel */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-md aspect-square rounded-[40%] overflow-hidden bg-brand-100 dark:bg-brand-900">
                        <Image
                            src={data ? data?.layout.banner.image.url : assets.hero_img}
                            // src={require("../../public/assets/hero.png")}
                            width={400}
                            height={400}
                            alt="Student learning online with a laptop"
                            className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal dark:opacity-90"
                            priority
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h1 className="font-josefin font-bold text-4xl sm:text-5xl leading-tight text-brand-900 dark:text-white">
                        {data ? data?.layout.banner.title : "Improve your online learning experience better instantly"}
                    </h1>

                    <p className="mt-5 text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto md:mx-0">
                        {data ? data?.layout.banner.subTitle : "We have 40k+ online courses and 500k+ registered students. Find your desired course from them."}
                    </p>

                    {/* Search bar */}
                    <div className="mt-8 flex items-center max-w-md mx-auto md:mx-0 rounded-full border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 shadow-sm overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="flex-1 px-5 py-3 bg-transparent text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                            aria-label="Search courses"
                            className="p-3 mr-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Trust indicator */}
                    <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                        <div className="flex -space-x-3">
                            <Image
                                src={assets.review1}
                                alt="Review 1"
                                className="w-9 h-9 rounded-full border-2 border-white dark:border-surface-900 object-cover"
                            />
                            <Image
                                src={assets.review2}
                                alt="Review 2"
                                className="w-9 h-9 rounded-full border-2 border-white dark:border-surface-900 object-cover"
                            />
                            <Image
                                src={assets.review3}
                                alt="Review 2"
                                className="w-9 h-9 rounded-full border-2 border-white dark:border-surface-900 object-cover"
                            />

                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            <span className="font-semibold text-brand-900 dark:text-white">100k+</span> people already trust us
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;