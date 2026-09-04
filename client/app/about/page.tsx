"use client"
import React, { FC, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Target, Users, Award, BookOpen, Heart, Rocket } from "lucide-react"
import Header from '../components/Header'
import Footer from '../components/Footer'
import Modal from '../utils/Modal'
import Login from '../components/Auth/Login'
import SignUp from '../components/Auth/SignUp'
import Heading from '../utils/Heading'

type Props = {}

const values = [
    {
        icon: Target,
        title: "Practical learning",
        description: "Every course is built around real projects, not just theory — so what you learn is what you can actually ship.",
    },
    {
        icon: Users,
        title: "Community-driven",
        description: "Ask questions, get replies from instructors, and learn alongside thousands of other students.",
    },
    {
        icon: Award,
        title: "Expert instructors",
        description: "Courses are taught by working developers and industry professionals, not just career educators.",
    },
    {
        icon: Rocket,
        title: "Built for progress",
        description: "Track your progress, revisit lessons anytime, and learn at whatever pace fits your life.",
    },
];

const stats = [
    { label: "Students taught", value: "50K+" },
    { label: "Courses available", value: "200+" },
    { label: "Expert instructors", value: "80+" },
    { label: "Countries reached", value: "120+" },
];

const page: FC<Props> = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState("Login");
    const [activeItem] = useState(0);

    return (
        <>
            <Heading
                title="About Us | Skillory"
                description="Learn about Skillory's mission to make expert-led online education accessible to everyone."
                keywords="Skillory, about us, online learning platform, LMS, our mission"
            />

            <Header open={open} setOpen={setOpen} activeItem={activeItem} />

            <main className="w-full pt-24 pb-16">
                {/* Hero */}
                <section className="w-full bg-brand-900 dark:bg-surface-900 text-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent-500/20 text-accent-400">
                            Our story
                        </span>
                        <h1 className="mt-4 text-3xl sm:text-4xl font-josefin font-bold">
                            Learning shouldn't be complicated.
                        </h1>
                        <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
                            Skillory was built on a simple idea: anyone, anywhere, should be able to learn
                            in-demand skills from people who actually use them every day — without noise,
                            without fluff, and without breaking the bank.
                        </p>
                    </div>
                </section>

                {/* Stats */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                    <div className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl shadow-lg grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 dark:divide-surface-700">
                        {stats.map((stat, i) => (
                            <div key={i} className="p-6 text-center">
                                <p className="text-2xl sm:text-3xl font-bold text-brand-900 dark:text-white">
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mission */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-accent-400">
                            Our mission
                        </span>
                        <h2 className="mt-2 text-2xl sm:text-3xl font-josefin font-bold text-brand-900 dark:text-white">
                            Making expert-led education accessible to everyone
                        </h2>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            We started Skillory because too much online learning felt like watching someone
                            read slides at you. We wanted something different — courses built by people who
                            actually work in the field, structured around real projects, and priced so that
                            cost was never the reason someone couldn't learn.
                        </p>
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Today, thousands of students use Skillory to learn web development, data,
                            design, and more — at their own pace, with instructors who reply, and a
                            community that shows up.
                        </p>
                    </div>
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-brand-100 dark:bg-brand-900">
                        <Image
                            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3R1ZGVudCUyMGxlYXJuaW5nfGVufDB8fDB8fHww"
                            alt="Student learning online"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                        />
                    </div>
                </section>

                {/* Values */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-josefin font-bold text-brand-900 dark:text-white">
                            What we stand for
                        </h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            The principles behind every course we publish.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map(({ icon: Icon, title, description }, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5"
                            >
                                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-surface-700 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-brand-600 dark:text-accent-400" />
                                </div>
                                <h3 className="mt-4 text-sm font-semibold text-brand-900 dark:text-white">
                                    {title}
                                </h3>
                                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="bg-brand-600 rounded-2xl px-6 sm:px-12 py-12 text-center text-white">
                        <BookOpen className="w-10 h-10 mx-auto text-accent-400" />
                        <h2 className="mt-4 text-2xl sm:text-3xl font-josefin font-bold">
                            Ready to start learning?
                        </h2>
                        <p className="mt-2 text-sm text-brand-100 max-w-md mx-auto">
                            Join thousands of students building real skills with Skillory today.
                        </p>
                        <Link
                            href="/courses"
                            className="inline-block mt-6 px-6 py-2.5 rounded-full bg-white text-brand-700 text-sm font-semibold hover:bg-brand-50 transition-colors"
                        >
                            Explore courses
                        </Link>
                    </div>
                </section>
            </main>

            <Footer />

            <Modal open={open} setOpen={setOpen} setRoute={setRoute}>
                {route === "Login" && <Login setOpen={setOpen} setRoute={setRoute} />}
                {route === "Sign-Up" && <SignUp setRoute={setRoute} />}
            </Modal>
        </>
    )
}

export default page