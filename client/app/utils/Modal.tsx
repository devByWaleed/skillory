"use client";
import React, { FC, useEffect } from "react";
import { X } from "lucide-react";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    setRoute?: (route: string) => void;
    children: React.ReactNode;
};

const Modal: FC<Props> = ({ open, setOpen, children, setRoute }) => {
    // Close on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [setOpen]);

    // Lock body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "unset";
    }, [open]);

    // Reset route back to Login shortly after closing
    useEffect(() => {
        if (!open) {
            const timer = setTimeout(() => setRoute?.("Login"), 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) setOpen(false);
    };

    if (!open) return null;

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
        >
            <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-2xl shadow-xl">
                <button
                    onClick={() => setOpen(false)}
                    aria-label="Close modal"
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-brand-50 dark:hover:bg-surface-800 transition-colors"
                >
                    <X className="w-5 h-5 text-brand-900 dark:text-white" />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;