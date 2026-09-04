"use client";

import React, { useState } from "react";
import Heading from "@/app/utils/Heading";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import FAQ from "../components/FAQ";

const Page = () => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(4); // Set active index according to header links
    const [route, setRoute] = useState("Login");

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white dark:bg-slate-900 transition-colors duration-300">
            <Heading
                title="FAQ - Elearning"
                description="Find answers to frequently asked questions about our platform, courses, and account management."
                keywords="FAQ, Help, Support, Elearning, Courses"
            />
            <Header
                open={open}
                setOpen={setOpen}
                activeItem={activeItem}
                setRoute={setRoute}
                route={route}
            />
            <main className="flex-grow pt-20">
                <FAQ />
            </main>
            <Footer />
        </div>
    );
};

export default Page;