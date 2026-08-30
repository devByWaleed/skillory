"use client";

import React, { FC } from "react";
import { useGetUsersAnalyticsQuery, useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import { ShoppingBag, Users, ArrowUpRight } from "lucide-react";
import Loader from "../../Loader/Loader";
import UsersAnalytics from "../Analytics/UserAnalytics";
import AllInvoices from "../Order/AllInvoices";

type Props = {
    open?: boolean;
    value?: number;
};

const DashboardWidgets: FC<Props> = () => {
    const { data: usersData, isLoading: usersLoading } = useGetUsersAnalyticsQuery({});
    const { data: ordersData, isLoading: ordersLoading } = useGetOrdersAnalyticsQuery({});

    if (usersLoading || ordersLoading) return <Loader />;

    const totalOrders = ordersData?.orders?.last12Months?.reduce(
        (acc: number, curr: { count: number }) => acc + curr.count,
        0
    ) || 0;

    const totalUsers = usersData?.users?.last12Months?.reduce(
        (acc: number, curr: { count: number }) => acc + curr.count,
        0
    ) || 0;

    return (
        <div className="w-full space-y-6">
            {/* Top Section: Analytics & Stat Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Left Column: User Analytics Chart (Responsive 8 Cols) */}
                <div className="lg:col-span-8 bg-white dark:bg-surface-800 p-5 md:p-6 rounded-[--radius-card] border border-surface-100 dark:border-surface-800/80 shadow-xs flex flex-col justify-between">
                    <div className="w-full flex-1">
                        <UsersAnalytics />
                    </div>
                </div>

                {/* Right Column: Stat Cards Stack (Responsive 4 Cols) */}
                <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                    {/* Card 1: Sales Obtained */}
                    <div className="bg-white dark:bg-surface-800 p-5 md:p-6 rounded-[--radius-card] border border-surface-100 dark:border-surface-800/80 shadow-xs flex items-start justify-between">
                        <div className="flex flex-col justify-between h-full space-y-4">
                            <div className="p-3 w-max rounded-xl bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h4 className="text-2xl md:text-3xl font-bold font-josefin text-brand-900 dark:text-white">
                                    {totalOrders}
                                </h4>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                    Sales Obtained
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                            <span>+120%</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                    </div>

                    {/* Card 2: New Users */}
                    <div className="bg-white dark:bg-surface-800 p-5 md:p-6 rounded-[--radius-card] border border-surface-100 dark:border-surface-800/80 shadow-xs flex items-start justify-between">
                        <div className="flex flex-col justify-between h-full space-y-4">
                            <div className="p-3 w-max rounded-xl bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400">
                                <Users className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <h4 className="text-2xl md:text-3xl font-bold font-josefin text-brand-900 dark:text-white">
                                    {totalUsers}
                                </h4>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                    New Users
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                            <span>+150%</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Space for Recent Transactions or Data Tables */}
            <div className="w-full">
                <AllInvoices isDashboard={true} />
            </div>
        </div>
    );
};

export default DashboardWidgets;