import { apiSlice } from "../api/apiSlice";


export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Registration
        updateAvatar: builder.mutation({
            query: (avatar) => ({
                url: "user/update-user-avatar",
                method: "PUT",
                body: { avatar },
                credentials: "include" as const
            }),
        }),
        editProfile: builder.mutation({
            query: ({ name }) => ({
                url: "user/update-user-info",
                method: "PUT",
                body: { name },
                credentials: "include" as const
            }),
            // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
            //     try {
            //         const result = await queryFulfilled;
            //         dispatch(
            //             userRegistration({
            //                 token: result.data.activationToken
            //             })
            //         );
            //     } catch (error: any) {
            //         console.log(error);
            //     }
            // }
        }),
        updatePassword: builder.mutation({
            query: ({ oldPassword, newPassword }) => ({
                url: "user/update-user-password",
                method: "PUT",
                body: { oldPassword, newPassword },
                credentials: "include" as const
            }),
            // async onQueryStarted(arg, { queryFulfilled, dispatch }) {
            //     try {
            //         const result = await queryFulfilled;
            //         dispatch(
            //             userRegistration({
            //                 token: result.data.activationToken
            //             })
            //         );
            //     } catch (error: any) {
            //         console.log(error);
            //     }
            // }
        }),
    }),
});

export const { useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation } = userApi;