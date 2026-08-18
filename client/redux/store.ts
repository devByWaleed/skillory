"use client";
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from "./api/apiSlice"

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer
        // user: userReducer,
    },
    // Redux Toolkit automatically adds thunk middleware and devTools
    devTools: false,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

// export default store;