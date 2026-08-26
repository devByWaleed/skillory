"use client"
import { useUpdatePasswordMutation } from '@/redux/features/user/userApi';
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type Props = {}

const ChangePassword: FC<Props> = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [updatePassword, { isSuccess, error }] = useUpdatePasswordMutation();

    const passwordChangeHandler = async (e: any) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Password do not match")
        } else {
            await updatePassword({ oldPassword, newPassword })
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success("Password changed successfully!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }

        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData.error.message)
            }
        }

    }, [isSuccess, error]);


    return (
        <div className="w-full max-w-lg">
            <h2 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                Change password
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Update your password to keep your account secure.
            </p>

            <form onSubmit={passwordChangeHandler} className="mt-8 space-y-5">
                {/* Old password */}
                <div>
                    <label htmlFor="oldPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Current password
                    </label>
                    <div className="relative mt-1.5">
                        <input
                            id="oldPassword"
                            name="oldPassword"
                            type={showOld ? "text" : "password"}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-11 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                        />
                        {showOld ? (
                            <AiOutlineEyeInvisible
                                onClick={() => setShowOld(false)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400"
                            />
                        ) : (
                            <AiOutlineEye
                                onClick={() => setShowOld(true)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400"
                            />
                        )}
                    </div>
                </div>

                {/* New password */}
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        New password
                    </label>
                    <div className="relative mt-1.5">
                        <input
                            id="newPassword"
                            name="newPassword"
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-11 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                        />
                        {showNew ? (
                            <AiOutlineEyeInvisible
                                onClick={() => setShowNew(false)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400"
                            />
                        ) : (
                            <AiOutlineEye
                                onClick={() => setShowNew(true)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400"
                            />
                        )}
                    </div>
                </div>

                {/* Confirm password */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Confirm new password
                    </label>
                    <div className="relative mt-1.5">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirm ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 pr-11 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                        />
                        {showConfirm ? (
                            <AiOutlineEyeInvisible
                                onClick={() => setShowConfirm(false)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400"
                            />
                        ) : (
                            <AiOutlineEye
                                onClick={() => setShowConfirm(true)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400"
                            />
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
                >
                    Update password
                </button>
            </form>
        </div>
    )
}

export default ChangePassword