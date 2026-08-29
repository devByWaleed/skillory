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

    }),
});

export const { useGetOrdersDataQuery } = orderApi;