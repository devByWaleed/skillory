"use client"
import React, { FC, useState } from 'react'
import Link from "next/link"
import Image from "next/image"
import {
    LayoutDashboard,
    Users,
    Receipt,
    PlusCircle,
    Video,
    Image as ImageIcon,
    HelpCircle,
    Tags,
    UserCog,
    BarChart3,
    ShoppingCart,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown
} from "lucide-react"
import { assets } from "@/public/assets/assets"

type Props = {
    user?: any;
}

type NavLink = { label: string; href: string; icon: any };
type NavGroup = { id: string; label: string; links: NavLink[] };

const standaloneLinks: NavLink[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
];

const navGroups: NavGroup[] = [
    {
        id: "data",
        label: "Data",
        links: [
            { label: "Users", href: "/admin/users", icon: Users },
            { label: "Invoices", href: "/admin/invoices", icon: Receipt },
        ],
    },
    {
        id: "content",
        label: "Content",
        links: [
            { label: "Create Course", href: "/admin/courses/create", icon: PlusCircle },
            { label: "Live Courses", href: "/admin/courses/live", icon: Video },
        ],
    },
    {
        id: "customization",
        label: "Customization",
        links: [
            { label: "Hero", href: "/admin/customization/hero", icon: ImageIcon },
            { label: "FAQ", href: "/admin/customization/faq", icon: HelpCircle },
            { label: "Categories", href: "/admin/customization/categories", icon: Tags },
        ],
    },
    {
        id: "controllers",
        label: "Controllers",
        links: [
            { label: "Manage Team", href: "/admin/team", icon: UserCog },
        ],
    },
    {
        id: "analytics",
        label: "Analytics",
        links: [
            { label: "Courses Analytics", href: "/admin/analytics/courses", icon: BarChart3 },
            { label: "Orders Analytics", href: "/admin/analytics/orders", icon: ShoppingCart },
            { label: "Users Analytics", href: "/admin/analytics/users", icon: Users },
        ],
    },
    {
        id: "extras",
        label: "Extras",
        links: [
            { label: "Settings", href: "/admin/settings", icon: Settings },
        ],
    },
];

const AdminSidebar: FC<Props> = ({ user }) => {
    const [active, setActive] = useState("/admin");
    const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        data: true,
        content: true,
        customization: true,
        controllers: true,
        analytics: true,
        extras: true,
    });

    const toggleGroup = (id: string) => {
        setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const linkClass = (href: string) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active === href
            ? "bg-brand-50 dark:bg-surface-700 text-brand-600 dark:text-accent-400"
            : "text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-surface-700"
        }`;

    const content = (
        <>
            {/* Profile header */}
            <div className="flex items-center gap-3 px-2 pb-5 mb-4 border-b border-slate-200 dark:border-surface-700">
                <Image
                    src={user?.avatar ? user.avatar.url : assets.default_avatar}
                    alt={user?.name || "Admin"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-surface-700"
                />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-brand-900 dark:text-white truncate">
                        {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || "admin@skillory.com"}
                    </p>
                </div>
            </div>

            {/* Standalone links */}
            <nav className="flex flex-col gap-1 mb-4">
                {standaloneLinks.map(({ label, href, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        onClick={() => {
                            setActive(href);
                            setOpenMobileSidebar(false);
                        }}
                        className={linkClass(href)}
                    >
                        <Icon className="w-4 h-4 shrink-0" />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Grouped, collapsible sections */}
            <div className="flex flex-col gap-4">
                {navGroups.map((group) => (
                    <div key={group.id}>
                        <button
                            onClick={() => toggleGroup(group.id)}
                            className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500"
                        >
                            {group.label}
                            <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${openGroups[group.id] ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {openGroups[group.id] && (
                            <nav className="mt-1 flex flex-col gap-1">
                                {group.links.map(({ label, href, icon: Icon }) => (
                                    <Link
                                        key={href}
                                        href={href}
                                        onClick={() => {
                                            setActive(href);
                                            setOpenMobileSidebar(false);
                                        }}
                                        className={linkClass(href)}
                                    >
                                        <Icon className="w-4 h-4 shrink-0" />
                                        {label}
                                    </Link>
                                ))}
                            </nav>
                        )}
                    </div>
                ))}
            </div>

            {/* Logout pinned at bottom */}
            <button
                className="mt-6 flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
                <LogOut className="w-4 h-4 shrink-0" />
                Logout
            </button>
        </>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setOpenMobileSidebar(true)}
                aria-label="Open admin menu"
                className="md:hidden fixed top-4 left-4 z-40 p-2.5 rounded-full bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 shadow-sm"
            >
                <Menu className="w-5 h-5 text-brand-900 dark:text-white" />
            </button>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-64 shrink-0 bg-white dark:bg-surface-800 border-r border-slate-200 dark:border-surface-700 min-h-screen p-4 overflow-y-auto">
                {content}
            </aside>

            {/* Mobile drawer */}
            {openMobileSidebar && (
                <div
                    onClick={(e) => e.target === e.currentTarget && setOpenMobileSidebar(false)}
                    className="fixed inset-0 z-70 bg-black/40 backdrop-blur-[2px] md:hidden"
                >
                    <aside className="fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white dark:bg-surface-900 shadow-xl p-4 overflow-y-auto">
                        <button
                            onClick={() => setOpenMobileSidebar(false)}
                            aria-label="Close menu"
                            className="mb-4 p-1.5 rounded-full hover:bg-brand-50 dark:hover:bg-surface-800"
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

export default AdminSidebar