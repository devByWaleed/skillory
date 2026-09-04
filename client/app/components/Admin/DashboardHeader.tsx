"use client"
import React, { FC, useEffect, useState, useRef } from 'react'
import { Sun, Moon, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { format } from "timeago.js"
import {
    useGetAllNotificationsQuery,
    useUpdateNotificationMutation,
} from '@/redux/features/notification/notificationApi'
import { socketId } from '@/app/utils/socketId'

type Props = {}

const DashboardHeader: FC<Props> = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [openNotifications, setOpenNotifications] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);


    const { data, refetch } = useGetAllNotificationsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });
    const [updateNotification, { isSuccess }] = useUpdateNotificationMutation();

    useEffect(() => {
        setMounted(true);
        audioRef.current = new Audio("/notification.wav");
    }, []);

    // Sync fetched notifications, keep only unread ones visible
    useEffect(() => {
        if (data) {
            setNotifications(
                data.notifications.filter((item: any) => item.status === "unread")
            );
        }
        if (isSuccess) {
            refetch();
        }
        audioRef.current?.load();
    }, [data, isSuccess]);

    // Listen for real-time broadcasts
    useEffect(() => {
        socketId.on("newNotification", (data: any) => {
            setNotifications((prev) => [data, ...prev]);
            audioRef.current?.play().catch(() => {
                // Browsers block autoplay until the user has interacted with the page at least once
            });
        });
    }, []);

    const handleNotificationStatusChange = async (id: string) => {
        await updateNotification(id);
    };

    return (
        <header className="w-full flex items-center justify-end gap-3 px-6 py-4 border-b border-slate-200 dark:border-surface-700 bg-white dark:bg-surface-800">

            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="p-2 rounded-full hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
            >
                {!mounted ? (
                    <div className="w-5 h-5" />
                ) : theme === "dark" ? (
                    <Sun className="w-5 h-5 text-accent-400" />
                ) : (
                    <Moon className="w-5 h-5 text-brand-700" />
                )}
            </button>

            <div className="relative">
                <button
                    onClick={() => setOpenNotifications(!openNotifications)}
                    aria-label="Toggle notifications"
                    className="relative p-2 rounded-full hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
                >
                    <Bell className="w-5 h-5 text-brand-900 dark:text-white" />
                    {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                    )}
                </button>

                {openNotifications && (
                    <>
                        <div
                            onClick={() => setOpenNotifications(false)}
                            className="fixed inset-0 z-40"
                        />

                        <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] max-h-96 overflow-y-auto bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-xl shadow-lg z-50">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-surface-700 sticky top-0 bg-white dark:bg-surface-800">
                                <p className="text-sm font-semibold text-brand-900 dark:text-white">
                                    Notifications
                                </p>
                            </div>

                            <div className="p-2">
                                {notifications.length > 0 ? (
                                    notifications.map((item: any, index: number) => (
                                        <div
                                            key={item._id || index}
                                            className="flex gap-3 p-3 rounded-lg hover:bg-brand-50 dark:hover:bg-surface-700 transition-colors"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0">
                                                <Bell className="w-4 h-4 text-brand-600 dark:text-accent-400" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-brand-900 dark:text-white">
                                                    {item.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                    {item.message}
                                                </p>
                                                <div className="flex items-center justify-between mt-1.5">
                                                    <p className="text-xs text-slate-400 dark:text-slate-500">
                                                        {item.createdAt ? format(item.createdAt) : "Just now"}
                                                    </p>
                                                    {item._id && (
                                                        <button
                                                            onClick={() => handleNotificationStatusChange(item._id)}
                                                            className="text-xs font-medium text-brand-600 dark:text-accent-400 hover:underline"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
                                        No new notifications.
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </header>
    )
}

export default DashboardHeader