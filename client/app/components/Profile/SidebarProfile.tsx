"use client"
import React, { FC } from 'react'
import { User, Lock, BookOpen, LogOut, X } from "lucide-react"
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import Link from "next/link";


type Props = {
    user: any;
    active: number;
    avatar: string | null;
    setActive: (active: number) => void;
    logoutHandler: any;
    openMobileSidebar: boolean;
    setOpenMobileSidebar: (open: boolean) => void;
}


const SidebarProfile: FC<Props> = ({ user, avatar, active, setActive, logoutHandler, openMobileSidebar, setOpenMobileSidebar }) => {
    const navItems = [
        { id: 1, label: "My account", icon: User, roles: ["user", "admin"], type: "tab" },
        { id: 2, label: "Change password", icon: Lock, roles: ["user", "admin"], type: "tab" },
        { id: 3, label: "Enrolled courses", icon: BookOpen, roles: ["user", "admin"], type: "tab" },
        { id: 4, label: "Admin Dashboard", icon: MdOutlineAdminPanelSettings, roles: ["admin"], type: "link", href: "/admin" },
    ];

    const content = (
        <>
            {/* User info */}
            <div className="flex flex-col items-center text-center pb-6 mb-6 border-b border-slate-200 dark:border-surface-700">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                    {avatar || user?.avatar?.url ? (
                        <img
                            src={avatar || user?.avatar?.url}
                            alt={user?.name || "User avatar"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-2xl font-semibold text-brand-600 dark:text-accent-400">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </span>
                    )}
                </div>
                <p className="mt-3 text-sm font-semibold text-brand-900 dark:text-white">
                    {user?.name || "Guest User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email || "guest@skillory.com"}
                </p>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
                {navItems.map(({ id, label, icon: Icon, roles, type, href }) => (
                    type === "link" ? (
                        <Link
                            key={id}
                            href={href!}
                            onClick={() => setOpenMobileSidebar(false)}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ) : (

                        <button
                            key={id}
                            onClick={() => {
                                setActive(id);
                                setOpenMobileSidebar(false);
                            }}
                            style={{ display: !roles.includes(user?.role) ? "none" : "flex" }}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${active === id
                                ? "bg-brand-50 dark:bg-surface-700 text-brand-600 dark:text-accent-400"
                                : "text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-surface-700"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    )
                ))}

                <button
                    onClick={logoutHandler}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-2"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </nav>
        </>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden md:block w-64 shrink-0 bg-white dark:bg-surface-800 rounded-2xl border border-slate-200 dark:border-surface-700 p-6 h-fit">
                {content}
            </aside>

            {/* Mobile drawer */}
            {openMobileSidebar && (
                <div
                    onClick={(e) => e.target === e.currentTarget && setOpenMobileSidebar(false)}
                    className="fixed inset-0 z-70 bg-black/40 backdrop-blur-[2px] md:hidden"
                >
                    <aside className="fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white dark:bg-surface-900 shadow-xl p-6 overflow-y-auto">
                        <button
                            onClick={() => setOpenMobileSidebar(false)}
                            aria-label="Close menu"
                            className="mb-4 p-2 rounded-full hover:bg-brand-50 dark:hover:bg-surface-800"
                        >
                            <X className="w-5 h-5 text-brand-900 dark:text-white" />
                        </button>
                        {content}
                    </aside>
                </div>
            )}
        </>
    )
}

export default SidebarProfile