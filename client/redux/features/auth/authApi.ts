import { apiSlice } from "../api/apiSlice";
import { userLogin, userLogout, userRegistration } from "./authSlice";

type RegistrationResponse = {
    message: string;
    activationToken: string;
};

type RegistrationData = {
    name: string;
    email: string;
    password: string;
};

type ActivationResponse = {
    message: string;
    success: boolean;
};

type ActivationData = {
    activation_token: string;
    activation_code: string;
};

type LoginResponse = {
    message: string;
    accessToken: string;
    user: any; // replace with a real IUser type once defined
};

type LoginData = {
    email: string;
    password: string;
};

type SocialAuthResponse = {
    message: string;
    accessToken: string;
    user: any;
};

type SocialAuthData = {
    email: string;
    name: string;
    avatar: string;
};

type LogoutResponse = {
    message: string;
};

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Registration
        register: builder.mutation<RegistrationResponse, RegistrationData>({
            query: (data) => ({
                url: "user/registration",
                method: "POST",
                body: data,
                credentials: "include" as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userRegistration({
                            token: result.data.activationToken
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            }
        }),

        // Activation
        activation: builder.mutation<ActivationResponse, ActivationData>({
            query: ({ activation_token, activation_code }) => ({
                url: "user/activate-user",
                method: "POST",
                body: { activation_token, activation_code },
            }),
        }),

        // Login
        login: builder.mutation<LoginResponse, LoginData>({
            query: ({ email, password }) => ({
                url: "user/login-user",
                method: "POST",
                body: { email, password },
                credentials: "include" as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLogin({
                            accessToken: result.data.accessToken,
                            user: result.data.user
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            }
        }),

        // Social auth
        socialAuth: builder.mutation<SocialAuthResponse, SocialAuthData>({
            query: ({ email, name, avatar }) => ({
                url: "user/social-auth",
                method: "POST",
                body: { email, name, avatar },
                credentials: "include" as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(
                        userLogin({
                            accessToken: result.data.accessToken,
                            user: result.data.user
                        })
                    );
                } catch (error: any) {
                    console.log(error);
                }
            }
        }),

        // Logout
        logOut: builder.mutation<LogoutResponse, void>({
            query: () => ({
                url: "user/logout-user",
                method: "POST",
                credentials: "include" as const
            }),
            async onQueryStarted(arg, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    dispatch(userLogout());
                } catch (error: any) {
                    console.log(error);
                }
            }
        }),
    }),
});

export const {
    useRegisterMutation,
    useActivationMutation,
    useLoginMutation,
    useSocialAuthMutation,
    useLogOutMutation
} = authApi;