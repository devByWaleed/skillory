"use client"
import React, { FC, useEffect, useState } from 'react'
import SidebarProfile from './SidebarProfile';
import { useLogOutMutation } from '@/redux/auth/authApi';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

type Props = {
    user: any;
}

const Profile: FC<Props> = ({ user }) => {
    const [scroll, setScroll] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [active, setActive] = useState(1);
    const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

    const [logOut, { }] = useLogOutMutation();

    const logoutHandler = async () => {
        await logOut();
        await signOut();
    };

    useEffect(() => {
        const handleScroll = () => setScroll(window.scrollY > 85);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="w-full min-h-screen bg-surface-50 dark:bg-surface-900 pt-24 pb-16 px-4 md:px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

                {/* Mobile toggle */}
                <button
                    onClick={() => setOpenMobileSidebar(true)}
                    className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                    Account menu
                </button>

                <SidebarProfile
                    user={user}
                    active={active}
                    avatar={avatar}
                    setActive={setActive}
                    logoutHandler={logoutHandler}
                    openMobileSidebar={openMobileSidebar}
                    setOpenMobileSidebar={setOpenMobileSidebar}
                />

                {/* Main content area */}
                <div className="flex-1 bg-white dark:bg-surface-800 rounded-2xl border border-slate-200 dark:border-surface-700 p-6 md:p-8">
                    {active === 1 && (
                        <div>
                            <h2 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                                My account
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Manage your personal information and preferences.
                            </p>
                        </div>
                    )}
                    {active === 2 && (
                        <div>
                            <h2 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                                Change password
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Update your password to keep your account secure.
                            </p>
                        </div>
                    )}
                    {active === 3 && (
                        <div>
                            <h2 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                                Enrolled courses
                            </h2>
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                                Courses you've purchased will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Profile