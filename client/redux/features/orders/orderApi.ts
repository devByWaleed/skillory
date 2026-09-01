import { apiSlice } from "../api/apiSlice";


export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builders) => ({
        getOrdersData: builders.query({
            query: () => ({
                url: `order/get-orders`,
                method: "GET",
                credentials: "include" as const
            }),
        }),
        getStripePublishableKey: builders.query({
            query: () => ({
                url: `order/payment/stripe-publishable-key`,
                method: "GET",
                credentials: "include" as const
            }),
        }),
        createPaymentIntent: builders.mutation({
            query: (courseId) => ({
                url: `order/payment/create-intent`,
                method: "POST",
                body: { courseId },
                credentials: "include" as const
            }),
        }),
        createOrder: builders.mutation({
            query: ({ courseID, payment_info }) => ({
                url: `order/create-order`,
                method: "POST",
                body: { courseID, payment_info },
                credentials: "include" as const
            }),
        }),


    }),
});

export const { useGetOrdersDataQuery, useGetStripePublishableKeyQuery, useCreatePaymentIntentMutation, useCreateOrderMutation } = orderApi;