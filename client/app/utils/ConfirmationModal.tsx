"use client"
import React, { FC } from 'react'
import { AlertTriangle } from "lucide-react"

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isLoading?: boolean;
    onConfirm: () => void;
}

const ConfirmationModal: FC<Props> = ({
    open,
    setOpen,
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    isLoading = false,
    onConfirm,
}) => {
    if (!open) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) setOpen(false);
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-80 flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
        >
            <div className="w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-xl p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-brand-900 dark:text-white">
                        {title}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                        {message}
                    </p>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-full border border-slate-200 dark:border-surface-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-brand-50 dark:hover:bg-surface-700 disabled:opacity-60 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                    >
                        {isLoading ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;