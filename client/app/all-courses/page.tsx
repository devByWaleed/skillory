"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import { useGetUsersAllCoursesQuery } from '@/redux/features/course/courseApi';
import Loader from '../components/Loader/Loader';
import Header from '../components/Header';
import CourseCard from '../components/Course/CourseCard';
import Footer from '../components/Footer';
import Heading from '../utils/Heading';
import { Search } from 'lucide-react';

function AllCoursesContent() {
    const searchParams = useSearchParams();
    const searchParamQuery = searchParams.get("title");

    const { data, isLoading } = useGetUsersAllCoursesQuery(undefined, {});
    const { data: categoryData } = useGetHeroDataQuery("Categories", {});

    const [route, setRoute] = useState("Login");
    const [open, setOpen] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [category, setCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState(searchParamQuery || "");

    // Handle course filtering logic based on Category & Title Search
    useEffect(() => {
        let filtered = data?.allCourses || [];

        // 1. Filter by category (checking item.categories first)
        if (category !== "All") {
            filtered = filtered.filter((item: any) => {
                const itemCategory = item.categories || item.category;
                return itemCategory?.trim().toLowerCase() === category.trim().toLowerCase();
            });
        }

        // 2. Filter by search query
        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((item: any) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setCourses(filtered);
    }, [data, category, searchQuery]);

    // Keep internal search state synchronized if URL search parameter changes
    useEffect(() => {
        if (searchParamQuery !== null) {
            setSearchQuery(searchParamQuery);
        }
    }, [searchParamQuery]);

    const categories = categoryData?.layout?.categories || [];

    if (isLoading) return <Loader />;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Heading
                title="All Courses - Elearning"
                description="Explore top-rated online courses and learn from industry experts."
                keywords="Programming, Web Development, Software Engineering, Next.js, React"
            />

            <Header
                open={open}
                setOpen={setOpen}
                activeItem={1}
                setRoute={setRoute}
                route={route}
            />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

                {/* Search & Category Filter Section */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                                {searchQuery ? `Search Results for "${searchQuery}"` : "Explore All Courses"}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Showing {courses?.length || 0} available courses
                            </p>
                        </div>

                        {/* Search Input Bar */}
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by course title..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 dark:focus:border-brand-500 transition"
                            />
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
                        <button
                            onClick={() => setCategory("All")}
                            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${category === "All"
                                ? "bg-brand-600 text-white"
                                : "bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-800"
                                }`}
                        >
                            All Categories
                        </button>

                        {categories.map((cat: any, index: number) => (
                            <button
                                key={cat._id || index}
                                onClick={() => setCategory(cat.title)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${category === cat.title
                                    ? "bg-brand-600 text-white"
                                    : "bg-slate-200 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-800"
                                    }`}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid Results */}
                <div className="mt-8">
                    {courses && courses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {courses.map((item: any, index: number) => (
                                <CourseCard item={item} key={item._id || index} />
                            ))}
                        </div>
                    ) : (
                        <div className="min-h-75 flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                No Courses Found
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                                We couldn't find any courses matching your criteria. Try adjusting your search term or selecting a different category.
                            </p>
                            <button
                                onClick={() => {
                                    setCategory("All");
                                    setSearchQuery("");
                                }}
                                className="mt-4 px-4 py-2 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Loader />}>
            <AllCoursesContent />
        </Suspense>
    );
}