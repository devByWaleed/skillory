import { apiSlice } from "../api/apiSlice";


export const userApi = apiSlice.injectEndpoints({
    endpoints: (builders) => ({
        // Registration
        updateAvatar: builders.mutation({
            query: (avatar) => ({
                url: "user/update-user-avatar",
                method: "PUT",
                body: { avatar },
                credentials: "include" as const
            }),
        }),
        editProfile: builders.mutation({
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
        updatePassword: builders.mutation({
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
        getAllUsers: builders.query({
            query: () => ({
                url: "user/get-users",
                method: "GET",
                credentials: "include" as const
            }),

        }),
        updateUserRole: builders.mutation({
            query: ({ email, role }) => ({
                url: "user/update-user-role",
                method: "PUT",
                body: { email, role },
                credentials: "include" as const,
            }),
        }),
        deleteUser: builders.mutation({
            query: (id) => ({
                url: `user/delete-user/${id}`,
                method: "DELETE",
                credentials: "include" as const
            })
        }),
    }),
});

export const { useUpdateAvatarMutation, useEditProfileMutation, useUpdatePasswordMutation, useGetAllUsersQuery, useUpdateUserRoleMutation, useDeleteUserMutation } = userApi;