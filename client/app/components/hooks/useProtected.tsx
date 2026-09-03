"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import userAuth from "./userAuth";
import { useLoadUserQuery } from "@/redux/features/api/apiSlice";
import Loader from "../Loader/Loader";

export default function Protected({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const isAuthenticated = userAuth();

    const {
        isLoading,
        isFetching,
    } = useLoadUserQuery(undefined);

    useEffect(() => {
        if (
            !isLoading &&
            !isFetching &&
            !isAuthenticated
        ) {
            router.replace("/");
        }
    }, [
        isLoading,
        isFetching,
        isAuthenticated,
        router,
    ]);

    if (isLoading || isFetching) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}


// Old Version
/*
import { redirect } from "next/navigation";
import userAuth from "./userAuth";


interface ProtectedProps {
    children: React.ReactNode;
}

export default function Protected({ children }: ProtectedProps) {
    const isAuthnticated = userAuth();

    return isAuthnticated ? children : redirect("/");
}
*/