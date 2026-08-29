"use client"
import { useGetCoursesAnalyticsQuery } from '@/redux/features/analytics/analyticsApi'
import React, { FC, useEffect, useState } from 'react'
import {
    BarChart, Bar, ResponsiveContainer,
    XAxis, YAxis, LabelList, CartesianGrid, Tooltip
} from "recharts"
import { useTheme } from 'next-themes'
import Loader from '../../Loader/Loader'

type Props = {}

const CourseAnalytics: FC<Props> = () => {
    const { data, isLoading, isError } = useGetCoursesAnalyticsQuery({});
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const analyticsData: any = [];

    data && data.courses.last12Months.forEach((item: any) => {
        analyticsData.push({ name: item.month, count: item.count });
    });

    const isDark = mounted && theme === "dark";
    const axisColor = isDark ? "#94a3b8" : "#64748b";
    const gridColor = isDark ? "#334155" : "#e2e8f0";
    const barColor = isDark ? "#FBBF24" : "#4F46E5";

    if (isLoading) return <Loader />;

    if (isError || analyticsData.length === 0) {
        return (
            <div className="w-full h-72 flex items-center justify-center">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                    No analytics data available yet.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold text-brand-900 dark:text-white mb-1">
                Courses Analytics
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                Courses created over the last 12 months
            </p>

            <div className="w-full h-72 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={analyticsData}
                        margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke={axisColor}
                            fontSize={12}
                            tickLine={false}
                            axisLine={{ stroke: gridColor }}
                        />
                        <YAxis
                            stroke={axisColor}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                                border: `1px solid ${gridColor}`,
                                borderRadius: "0.5rem",
                                fontSize: "13px",
                            }}
                            labelStyle={{ color: isDark ? "#f1f5f9" : "#0f172a" }}
                            cursor={{ fill: isDark ? "#33415555" : "#eef2ff" }}
                        />
                        <Bar dataKey="count" fill={barColor} radius={[6, 6, 0, 0]}>
                            <LabelList
                                dataKey="count"
                                position="top"
                                fill={axisColor}
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default CourseAnalytics