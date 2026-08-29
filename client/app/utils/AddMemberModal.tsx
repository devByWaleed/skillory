"use client"
import React, { FC, useState } from 'react'
import { X } from "lucide-react"
import { useUpdateUserRoleMutation } from '@/redux/features/user/userApi'
import toast from 'react-hot-toast'

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    refetch: () => void;
}

const AddMemberModal: FC<Props> = ({ open, setOpen, refetch }) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("admin");
    const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUserRole({ email, role }).unwrap();
            toast.success(`Role updated to ${role} successfully!`);
            setEmail("");
            setRole("admin");
            setOpen(false);
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update role");
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            className="fixed inset-0 z-70 flex items-center justify-center bg-black/50 backdrop-blur-[2px] px-4"
        >
            <div className="relative w-full max-w-sm bg-white dark:bg-surface-900 rounded-2xl shadow-xl p-6">
                <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-brand-50 dark:hover:bg-surface-800"
                >
                    <X className="w-5 h-5 text-brand-900 dark:text-white" />
                </button>

                <h2 className="text-lg font-semibold text-brand-900 dark:text-white">Update member role</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Enter the email of an existing user and choose their new role.
                </p>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label htmlFor="member-email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                            Email
                        </label>
                        <input
                            id="member-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="mt-1.5 w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="member-role" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                            Role
                        </label>
                        <select
                            id="member-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="mt-1.5 w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                    >
                        {isLoading ? "Updating..." : "Update role"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddMemberModal;