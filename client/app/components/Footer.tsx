"use client"
import React, { FC } from 'react'
import Link from "next/link"
import { FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa6';


type Props = {}

const footerLinks = [
    {
        title: "Company",
        links: [
            { label: "About us", href: "/about" },
            { label: "Careers", href: "/careers" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Explore",
        links: [
            { label: "All courses", href: "/courses" },
            { label: "Categories", href: "/categories" },
            { label: "Become an instructor", href: "/teach" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "FAQ", href: "/faq" },
            { label: "Help center", href: "/help" },
            { label: "Terms of service", href: "/terms" },
            { label: "Privacy policy", href: "/privacy" },
        ],
    },
];

const socialLinks = [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FaXTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

const Footer: FC<Props> = () => {
    return (
        <footer className="w-full bg-white dark:bg-surface-900 border-t border-slate-200 dark:border-surface-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                    {/* Brand column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <svg viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
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
                        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs">
                            Learn in-demand skills with expert-led online courses. Master new technologies at your own pace.
                        </p>

                        <div className="mt-5 flex items-center gap-3">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full flex items-center justify-center bg-brand-50 dark:bg-surface-800 text-brand-600 dark:text-slate-300 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 dark:hover:text-white transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {footerLinks.map((col) => (
                        <div key={col.title}>
                            <h4 className="text-sm font-semibold text-brand-900 dark:text-white mb-4">
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-accent-400 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-12 pt-6 border-t border-slate-200 dark:border-surface-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                        © {new Date().getFullYear()} Skillory. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5">
                        <Link href="/terms" className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-accent-400 transition-colors">
                            Terms
                        </Link>
                        <Link href="/privacy" className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-accent-400 transition-colors">
                            Privacy
                        </Link>
                        <Link href="/cookies" className="text-xs text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-accent-400 transition-colors">
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer >
    )
}

export default Footer