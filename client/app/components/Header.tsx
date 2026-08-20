import React, { FC, useEffect, useRef, useState } from "react";
import { Menu, Sun, Moon, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import Image from "next/image";
import { assets } from "@/public/assets/assets";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useLogOutMutation, useSocialAuthMutation } from "@/redux/auth/authApi";
import toast from "react-hot-toast";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    activeItem: number;
};

const navItems = ["Home", "Courses", "About", "FAQ"];

const Header: FC<Props> = ({ open, setOpen, activeItem }) => {
    const [active, setActive] = useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const { user } = useSelector((state: any) => state.auth);
    const { data } = useSession();
    const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();
    const socialAuthAttempted = useRef(false);

    const [logOut] = useLogOutMutation();

    const logoutHandler = async () => {
        socialAuthAttempted.current = false; // allow re-auth if a different user signs in later
        await logOut();
        await signOut();
    };

    // Trigger social auth exactly once when a NextAuth session exists but no app user yet
    useEffect(() => {
        if (!user && data && !socialAuthAttempted.current) {
            socialAuthAttempted.current = true;
            socialAuth({
                email: data?.user?.email ?? "",
                name: data?.user?.name ?? "",
                avatar: data?.user?.image ?? "",
            });
        }
    }, [data, user, socialAuth]);

    // React to the mutation's own result, not to data/user
    useEffect(() => {
        if (isSuccess) {
            toast.success("Login successful!");
        }
        if (error && "data" in error) {
            const errorData = error as any;
            toast.error(errorData?.data?.message || "Social login failed");
        }
    }, [isSuccess, error]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => setActive(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = openSidebar ? "hidden" : "unset";
    }, [openSidebar]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) setOpenSidebar(false);
    };

    return (
        <header
            className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${active
                ? "bg-white/80 dark:bg-surface-900/80 backdrop-blur-md shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                <div className="flex items-center gap-2 cursor-pointer">
                    <svg viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg" className="h-9 w-auto">
                        <g>
                            <path d="M8 14 C8 11 10 9 13 9 L26 9 C28 9 30 10.5 30 13 L30 44 C30 42 28 40.5 26 40.5 L13 40.5 C10 40.5 8 42.5 8 45 Z" fill="#4F46E5" />
                            <path d="M52 14 C52 11 50 9 47 9 L34 9 C32 9 30 10.5 30 13 L30 44 C30 42 32 40.5 34 40.5 L47 40.5 C50 40.5 52 42.5 52 45 Z" fill="#6366F1" />
                            <circle cx="30" cy="26" r="13" fill="#F59E0B" />
                            <path d="M26 20 L37 26 L26 32 Z" fill="#FFFFFF" />
                        </g>
                        <text
                            x="64"
                            y="35"
                            fontFamily="var(--font-Poppins), sans-serif"
                            fontWeight="700"
                            fontSize="26"
                            style={{ fill: "var(--logo-text)" }}
                        >
                            Skillory
                        </text>
                    </svg>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item, i) => (
                        <span
                            key={i}
                            className={`cursor-pointer text-[16px] font-medium transition-colors duration-200 ${activeItem === i
                                ? "text-brand-600 dark:text-accent-400"
                                : "text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-accent-400"
                                }`}
                        >
                            {item}
                        </span>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        aria-label="Toggle theme"
                        className="p-2 rounded-full hover:bg-brand-50 dark:hover:bg-surface-800 transition-colors"
                    >
                        {!mounted ? (
                            <div className="w-5 h-5" />
                        ) : theme === "dark" ? (
                            <Sun className="w-5 h-5 text-accent-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-brand-700" />
                        )}
                    </button>

                    {user ? (
                        <Link href="/profile">
                            <Image
                                src={user.avatar ? user.avatar.url : assets.default_avatar}
                                alt="User Profile Avatar"
                                className="w-7.5 h-7.5 rounded-full cursor-pointer"
                                width={30}
                                height={30}
                            />
                        </Link>
                    ) : (
                        <button
                            onClick={() => setOpen(true)}
                            className="hidden md:inline-block px-5 py-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
                        >
                            Login
                        </button>
                    )}

                    <button
                        onClick={() => setOpenSidebar(true)}
                        aria-label="Open menu"
                        className="md:hidden p-2 rounded-full dark:hover:bg-surface-800"
                    >
                        <Menu className="w-6 h-6 dark:text-white text-brand-900" />
                    </button>
                </div>
            </div>

            {openSidebar && (
                <div
                    onClick={handleBackdropClick}
                    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
                >
                    <aside className="fixed top-0 right-0 h-full w-[75%] max-w-sm bg-white dark:bg-surface-900 shadow-xl flex flex-col px-6 py-6 animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <svg width="30" height="30" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 20 C14 17 16.5 15 19.5 15 L30 15 C32 15 34 16.5 34 19 L34 46 C34 44 32 42.5 30 42.5 L19.5 42.5 C16.5 42.5 14 44.5 14 47 Z" fill="#4F46E5" />
                                    <path d="M50 20 C50 17 47.5 15 44.5 15 L34 15 C32 15 30 16.5 30 19 L30 46 C30 44 32 42.5 34 42.5 L44.5 42.5 C47.5 42.5 50 44.5 50 47 Z" fill="#6366F1" />
                                    <circle cx="32" cy="30" r="12" fill="#F59E0B" />
                                    <path d="M28.5 24.5 L38.5 30 L28.5 35.5 Z" fill="#FFFFFF" />
                                </svg>
                                <span className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                                    Skillory
                                </span>
                            </div>
                            <button
                                onClick={() => setOpenSidebar(false)}
                                aria-label="Close menu"
                                className="p-2 rounded-full hover:bg-brand-50 dark:hover:bg-surface-800"
                            >
                                <X className="w-5 h-5 text-brand-900 dark:text-white" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-6">
                            {navItems.map((item, i) => (
                                <span
                                    key={i}
                                    onClick={() => setOpenSidebar(false)}
                                    className={`cursor-pointer text-lg font-medium ${activeItem === i
                                        ? "text-brand-600 dark:text-accent-400"
                                        : "text-slate-700 dark:text-slate-300"
                                        }`}
                                >
                                    {item}
                                </span>
                            ))}
                        </nav>

                        {!user && (
                            <button
                                onClick={() => {
                                    setOpen(true);
                                    setOpenSidebar(false);
                                }}
                                className="mt-auto w-full py-3 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
                            >
                                Login
                            </button>
                        )}
                    </aside>
                </div>
            )}
        </header>
    );
};

export default Header;