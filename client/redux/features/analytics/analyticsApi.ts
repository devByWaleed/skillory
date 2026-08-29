import { apiSlice } from "../api/apiSlice"


export const analyticsApi = apiSlice.injectEndpoints({
    endpoints: (builders) => ({
        getCoursesAnalytics: builders.query({
            query: () => ({
                url: "analytics/get-courses-analytics",
                method: "GET",
                credentials: "include" as const
            })
        }),
        getUsersAnalytics: builders.query({
            query: () => ({
                url: "analytics/get-users-analytics",
                method: "GET",
                credentials: "include" as const
            })
        }),
        getOrdersAnalytics: builders.query({
            query: () => ({
                url: "analytics/get-orders-analytics",
                method: "GET",
                credentials: "include" as const
            })
        }),
    })
})

export const { useGetCoursesAnalyticsQuery, useGetUsersAnalyticsQuery, useGetOrdersAnalyticsQuery } = analyticsApi;