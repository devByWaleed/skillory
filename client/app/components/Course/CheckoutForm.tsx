"use client"
import React, { FC, useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useCreateOrderMutation } from '@/redux/features/orders/orderApi'
import toast from 'react-hot-toast'
import { Loader2 } from "lucide-react"
import { useLoadUserQuery } from '@/redux/features/api/apiSlice'
import { socketId } from "@/app/utils/socketId";

type Props = {
    courseId: string;
    courseName: string;
    onSuccess: () => void;
}

const CheckoutForm: FC<Props> = ({ courseId, courseName, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const [createOrder] = useCreateOrderMutation();
    const { refetch: refetchUser } = useLoadUserQuery({});
    const [isProcessing, setIsProcessing] = useState(false);

    const { user } = useSelector((state: any) => state.auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            toast.error(error.message || "Payment failed");
            setIsProcessing(false);
            return;
        }

        if (paymentIntent?.status === "succeeded") {
            try {
                await createOrder({
                    courseID: courseId,
                    payment_info: { id: paymentIntent.id },
                }).unwrap();

                await refetchUser();

                toast.success("Payment successful! You're enrolled.");
                onSuccess();

                socketId.emit("notification", {
                    title: "New Order",
                    message: `You have a new order for ${courseName}`,
                    userId: user?._id,
                });

                router.push(`/course-access/${courseId}`);
            } catch (err: any) {
                toast.error(err?.data?.message || "Order could not be recorded");
            }
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <PaymentElement options={{
                layout: {
                    type: "tabs",
                    defaultCollapsed: false,
                },
            }}
            />
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="mt-5 w-full py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Pay now"
                )}
            </button>
        </form>
    )
}

export default CheckoutForm