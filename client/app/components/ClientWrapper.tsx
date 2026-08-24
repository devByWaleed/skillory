"use client";
import React, { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useLoadUserQuery } from "@/redux/api/apiSlice";
import Loader from "./Loader/Loader";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Custom>{children}</Custom>
        </SessionProvider>
    );
}

const Custom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoading } = useLoadUserQuery({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return <>{isLoading ? <Loader /> : children}</>;
};