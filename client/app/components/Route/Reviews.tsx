"use client"
import React, { FC } from 'react'
import ReviewCard from '../Review/ReviewCard'

type Props = {}

const reviewsData = [
    {
        name: "Sarah Johnson",
        role: "Frontend Developer",
        rating: 5,
        avatar: null,
        message: "This course completely changed how I approach building web applications. The instructor breaks down complex concepts into digestible pieces, and the projects felt genuinely relevant to real jobs I've since applied for.",
    },
    {
        name: "Ahmed Khan",
        role: "Computer Science Student",
        rating: 5,
        avatar: null,
        message: "Best investment I've made in my learning journey. The pacing is perfect for beginners but doesn't feel dumbed down at all.",
    },
    {
        name: "Maria Gonzalez",
        role: "Career Switcher",
        rating: 4,
        avatar: null,
        message: "I switched careers from marketing to development after finishing this. Some sections could use more depth, but overall an excellent foundation that got me my first junior role within three months.",
    },
    {
        name: "David Park",
        role: "Backend Engineer",
        rating: 5,
        avatar: null,
        message: "Clear explanations, well-structured curriculum, and the community support made all the difference when I got stuck.",
    },
    {
        name: "Priya Patel",
        role: "Full Stack Developer",
        rating: 5,
        avatar: null,
        message: "Hands down the most practical course I've taken. Every module builds on the last, and by the end I had a portfolio project I was actually proud to show employers.",
    },
    {
        name: "James Wilson",
        role: "Bootcamp Graduate",
        rating: 4,
        avatar: null,
        message: "Solid content and great instructor energy. Would have liked a bit more coverage on testing, but that's a minor gap in an otherwise excellent course.",
    },
];

const Reviews: FC<Props> = () => {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-josefin font-bold text-brand-900 dark:text-white">
                    What our students say
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Real feedback from people who've taken our courses.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
                {reviewsData.map((item, index) => (
                    <ReviewCard item={item} key={index} />
                ))}
            </div>
        </section>
    )
}

export default Reviews