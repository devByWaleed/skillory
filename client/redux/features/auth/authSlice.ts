import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
    token: string;
    user: any; // or a real IUser type once you have one
};

const initialState: AuthState = {
    token: "",
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token
        },
        userLogin: (state, action: PayloadAction<{ accessToken: string, user: any }>) => {
            state.token = action.payload.accessToken
            state.user = action.payload.user
        },
        userLogout: (state) => {
            state.token = ""
            state.user = null
        },
    }
})

export const { userRegistration, userLogin, userLogout } = authSlice.actions
export default authSlice.reducer