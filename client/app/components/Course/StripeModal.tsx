"use client"
import React, { FC } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { X } from "lucide-react"
import CheckoutForm from './CheckoutForm'

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    stripePromise: any;
    clientSecret: string;
    courseId: string;
    courseName: string;
}

const StripeModal: FC<Props> = ({ open, setOpen, stripePromise, clientSecret, courseId, courseName }) => {
    if (!open || !clientSecret) return null;

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            className="fixed inset-0 z-80 flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4 py-6"
        >
            <div className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-surface-900 rounded-2xl shadow-xl flex flex-col">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                    <h2 className="text-lg font-semibold text-brand-900 dark:text-white">
                        Complete your payment
                    </h2>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                        className="p-1.5 rounded-full hover:bg-brand-50 dark:hover:bg-surface-800"
                    >
                        <X className="w-5 h-5 text-brand-900 dark:text-white" />
                    </button>
                </div>

                <div className="px-6 pb-6 overflow-y-auto">
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: { theme: "stripe" },
                        }}
                    >
                        <CheckoutForm courseId={courseId} courseName={courseName} onSuccess={() => setOpen(false)} />
                    </Elements>
                </div>
            </div>
        </div>
    )
}

export default StripeModal