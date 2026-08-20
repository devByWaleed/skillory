import React from 'react'

type Props = {}

const Loader = (props: Props) => {
    return (
        <div className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-5 bg-white dark:bg-surface-900">
            {/* Spinner */}
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-brand-100 dark:border-surface-800" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-600 dark:border-t-accent-400 animate-spin" />
            </div>

            {/* Brand text */}
            <p className="text-sm font-josefin font-semibold text-brand-900 dark:text-white tracking-wide animate-pulse">
                Skillory
            </p>
        </div>
    )
}

export default Loader