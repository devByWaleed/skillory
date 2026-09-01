"use client"
import { useGetCourseDetailsQuery } from '@/redux/features/course/courseApi';
import React, { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import { Star, Users, Clock, PlayCircle, Check, Calendar, Loader2 } from "lucide-react";
import Header from '../Header';
import Footer from '../Footer';
import Loader from '../Loader/Loader';
import CoursePlayer from '@/app/utils/CoursePlayer';
import Modal from '@/app/utils/Modal';
import Login from '../Auth/Login';
import SignUp from '../Auth/SignUp';
import ReviewCard from '../Review/ReviewCard';
import CourseContentList from './CourseContentList';
import StripeModal from './StripeModal';
import {
    useGetStripePublishableKeyQuery,
    useCreatePaymentIntentMutation,
} from '@/redux/features/orders/orderApi';

type Props = {
    id: string;
}

const CourseDetailsPage: FC<Props> = ({ id }) => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");
    const [activeItem] = useState(0);

    const [openStripe, setOpenStripe] = useState(false);
    const [stripePromise, setStripePromise] = useState<any>(null);
    const [clientSecret, setClientSecret] = useState("");

    const { data, isLoading } = useGetCourseDetailsQuery(id);
    const { data: config } = useGetStripePublishableKeyQuery({});
    const [createPaymentIntent, { isLoading: isCheckingOut }] = useCreatePaymentIntentMutation();

    const { user } = useSelector((state: any) => state.auth);
    const course = data?.course;

    useEffect(() => {
        if (config?.publishableKey) {
            setStripePromise(loadStripe(config.publishableKey));
        }
    }, [config]);

    const handleBuyNow = async () => {
        try {
            const result: any = await createPaymentIntent(course._id).unwrap();
            setClientSecret(result.clientSecret);
            setOpenStripe(true);
        } catch (err: any) {
            toast.error(err?.data?.message || "Could not start checkout");
        }
    };

    const handleBuyNowClick = () => {
        if (!user) {
            setOpen(true);
            return;
        }
        handleBuyNow();
    };

    if (isLoading) return <Loader />;

    if (!course) {
        return (
            <>
                <Header open={open} setOpen={setOpen} activeItem={activeItem} />
                <div className="min-h-screen flex items-center justify-center px-4">
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        This course could not be found.
                    </p>
                </div>
                <Footer />
            </>
        );
    }

    const price = Number(course.price) || 0;
    const estimatedPrice = Number(course.estimatedPrice) || 0;
    const discountPercent = estimatedPrice > price
        ? Math.round(((estimatedPrice - price) / estimatedPrice) * 100)
        : 0;

    const totalLectures = course.courseData?.length || 0;
    const totalMinutes = course.courseData?.reduce((sum: number, l: any) => sum + (Number(l.videoLength) || 0), 0) || 0;

    const isPurchased = user?.courses?.some((item: any) => {
        if (!item) return false;

        const courseIdStr =
            item.courseId?._id?.toString() ||
            item.courseId?.toString() ||
            item._id?.toString() ||
            (typeof item === 'string' ? item : null);

        return courseIdStr === course?._id;
    });

    const lastUpdated = course.updatedAt
        ? new Date(course.updatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : null;

    return (
        <>
            <Header open={open} setOpen={setOpen} activeItem={activeItem} />

            <main className="w-full pt-24 pb-16">
                {/* Title band */}
                <div className="w-full bg-brand-900 dark:bg-surface-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="flex flex-wrap items-center gap-2">
                            {course.categories && (
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent-500/20 text-accent-400">
                                    {course.categories}
                                </span>
                            )}
                            {course.level && (
                                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white">
                                    {course.level}
                                </span>
                            )}
                        </div>

                        <h1 className="mt-3 text-2xl sm:text-3xl font-josefin font-bold max-w-2xl">
                            {course.name}
                        </h1>
                        <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                            {course.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-300">
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
                                {course.ratings?.toFixed ? course.ratings.toFixed(1) : course.ratings || 0}
                                <span className="text-slate-400">({course.reviews?.length || 0} reviews)</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                {course.purchased || 0} students
                            </span>
                            <span className="flex items-center gap-1.5">
                                <PlayCircle className="w-4 h-4" />
                                {totalLectures} lectures
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {totalMinutes} min
                            </span>
                            {lastUpdated && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    Updated {lastUpdated}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8">
                    {/* Left content */}
                    <div className="flex-1 min-w-0 space-y-8">
                        <CoursePlayer videoUrl={course.demoURL} title={course.name} />

                        {course.benefits?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-semibold text-brand-900 dark:text-white mb-3">
                                    What you'll learn
                                </h2>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                                    {course.benefits.map((b: any, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <Check className="w-4 h-4 text-brand-600 dark:text-accent-400 shrink-0 mt-0.5" />
                                            {b.title}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {course.courseData?.length > 0 && (
                            <section>
                                <h2 className="text-lg font-semibold text-brand-900 dark:text-white mb-3">
                                    Course content
                                </h2>
                                <CourseContentList data={course.courseData} />
                            </section>
                        )}

                        <section>
                            <h2 className="text-lg font-semibold text-brand-900 dark:text-white mb-3">
                                Student reviews
                            </h2>
                            {course.reviews?.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                                    {course.reviews.map((review: any, i: number) => (
                                        <ReviewCard
                                            key={i}
                                            item={{
                                                name: review.user?.name || "Anonymous",
                                                rating: review.rating,
                                                message: review.comment,
                                                avatar: review.user?.avatar?.url || null,
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                    No reviews yet. Be the first to review this course.
                                </p>
                            )}
                        </section>
                    </div>

                    {/* Right side purchase card */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="lg:sticky lg:top-24 bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl overflow-hidden">
                            <div className="relative w-full aspect-video bg-brand-100 dark:bg-brand-900">
                                {course.thumbnail?.url && (
                                    <Image
                                        src={course.thumbnail.url}
                                        alt={course.name}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 320px"
                                        className="object-cover"
                                    />
                                )}
                                {discountPercent > 0 && (
                                    <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500 text-white">
                                        {discountPercent}% off
                                    </span>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-brand-900 dark:text-white">
                                        ${price}
                                    </span>
                                    {discountPercent > 0 && (
                                        <span className="text-sm text-slate-400 line-through">
                                            ${estimatedPrice}
                                        </span>
                                    )}
                                </div>

                                {isPurchased ? (
                                    <Link
                                        href={`/course-access/${course._id}`}
                                        className="mt-4 w-full py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
                                    >
                                        Enter Course
                                    </Link>
                                ) : (
                                    <button
                                        onClick={handleBuyNowClick}
                                        disabled={isCheckingOut}
                                        className="mt-4 w-full py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isCheckingOut ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Starting checkout...
                                            </>
                                        ) : (
                                            "Buy now"
                                        )}
                                    </button>
                                )}

                                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-surface-700 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                                    <p className="flex items-center gap-2">
                                        <PlayCircle className="w-4 h-4 text-slate-400 shrink-0" />
                                        {totalLectures} lectures
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                        {totalMinutes} minutes of content
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-slate-400 shrink-0" />
                                        {course.level || "All levels"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />

            <Modal open={open} setOpen={setOpen} setRoute={setRoute}>
                {route === "Login" && <Login setOpen={setOpen} setRoute={setRoute} />}
                {route === "Sign-Up" && <SignUp setRoute={setRoute} />}
            </Modal>

            <StripeModal
                open={openStripe}
                setOpen={setOpenStripe}
                stripePromise={stripePromise}
                clientSecret={clientSecret}
                courseId={course._id}
            />
        </>
    );
};

export default CourseDetailsPage;