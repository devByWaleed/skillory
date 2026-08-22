"use client"
import React, { FC, useEffect, useState } from 'react'
import { Sun, Moon, Bell } from "lucide-react"
import { useTheme } from "next-themes"

type Props = {}

const DashboardHeader: FC<Props> = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="w-full flex items-center justify-end gap-3 px-6 py-4 border-b border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800">

            {/* Theme toggle */}
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="p-2 rounded-full hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
            >
                {!mounted ? (
                    <div className="w-5 h-5" />
                ) : theme === "dark" ? (
                    <Sun className="w-5 h-5 text-accent-400" />
                ) : (
                    <Moon className="w-5 h-5 text-brand-700" />
                )}
            </button>

            {/* Notifications */}
            <div className="relative">
                <button
                    onClick={() => setOpenNotifications(!openNotifications)}
                    aria-label="Toggle notifications"
                    className="relative p-2 rounded-full hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
                >
                    <Bell className="w-5 h-5 text-brand-900 dark:text-white" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                </button>

                {openNotifications && (
                    <>
                        {/* Backdrop to close on outside click */}
                        <div
                            onClick={() => setOpenNotifications(false)}
                            className="fixed inset-0 z-40"
                        />

                        <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl shadow-lg z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-surface-700">
                                <p className="text-sm font-semibold text-brand-900 dark:text-white">
                                    Notifications
                                </p>
                            </div>

                            <div className="p-3">
                                <div className="flex gap-3 p-3 rounded-lg hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors cursor-pointer">
                                    <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0">
                                        <Bell className="w-4 h-4 text-brand-600 dark:text-accent-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-brand-900 dark:text-white">
                                            New course enrollment
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                            Sarah Johnson just enrolled in "Full Stack Web Development Masterclass"
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                            2 minutes ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}

export default DashboardHeader