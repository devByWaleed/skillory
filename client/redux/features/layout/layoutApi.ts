import { apiSlice } from "../api/apiSlice";


export const layoutApi = apiSlice.injectEndpoints({
    endpoints: (builders) => ({
        getHeroData: builders.query({
            query: (type) => ({
                url: `layout/get-layout-by-type/${type}`,
                method: "GET",
                credentials: "include" as const
            }),
        }),
        editLayout: builders.mutation({
            query: ({ type, image, title, subTitle, faq, categories }) => ({
                url: `layout/edit-layout`,
                body: { type, image, title, subTitle, faq, categories },
                method: "PUT",
                credentials: "include" as const
            }),
        }),

    }),
});

export const { useGetHeroDataQuery, useEditLayoutMutation } = layoutApi;