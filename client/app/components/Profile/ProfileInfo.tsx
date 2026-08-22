"use client"
import React, { FC, useEffect, useRef, useState } from 'react'
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { Camera } from "lucide-react";
import { assets } from "@/public/assets/assets";
import { useEditProfileMutation, useUpdateAvatarMutation } from '@/redux/user/userApi';
import { useLoadUserQuery } from '@/redux/api/apiSlice';
import toast from 'react-hot-toast';

type Props = {
    user: any;
    avatar: string | null;
}

// const schema = Yup.object().shape({
//     name: Yup.string().required("Please enter your name"),
//     email: Yup.string().email("Invalid Email!").required("Please enter your email"),
// });

const ProfileInfo: FC<Props> = ({ user, avatar }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState(user && user.name);
    const [updateAvatar, { isSuccess, error }] = useUpdateAvatarMutation();
    const [editProfile, { isSuccess: success, error: updateError }] = useEditProfileMutation();
    const [loadUser, setLoadUser] = useState(false)
    const { } = useLoadUserQuery(undefined, { skip: true });

    // const formik = useFormik({
    //     initialValues: {
    //         name: user?.name || "",
    //         email: user?.email || "",
    //     },
    //     validationSchema: schema,
    //     enableReinitialize: true,
    //     onSubmit: async (values) => {
    //         console.log(values, avatar);
    //     }
    // });

    // const { errors, touched, values, handleChange } = formik;

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const file = e.target.files?.[0];
        if (!file) return;

        const fileReader = new FileReader();
        fileReader.onload = () => {
            if (fileReader.readyState === 2) {
                const avatar = fileReader.result
                updateAvatar(
                    avatar
                )
            }
        };
        fileReader.readAsDataURL(file);
    };

    useEffect(() => {
        if (isSuccess || success) {
            setLoadUser(true)
        }

        if (error || updateError) {
            console.log(error);

        }
        if (success) {
            toast.success("Profile updated successfully!");
        }


    }, [isSuccess, error, success, updateError])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (name !== "") {
            await editProfile({
                name: name,
            })
        }
    }

    return (
        <div className="w-full max-w-lg">
            <h2 className="text-xl font-josefin font-bold text-brand-900 dark:text-white">
                My account
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Update your photo and personal details.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Avatar upload */}
                <div className="flex flex-col items-center sm:flex-row sm:items-center gap-4">
                    <div className="relative w-20 h-20 shrink-0">
                        <Image
                            src={avatar || (user?.avatar ? user.avatar.url : assets.default_avatar)}
                            alt="Profile avatar"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border border-slate-200 dark:border-surface-700"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Change profile photo"
                            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-600 hover:bg-brand-700 flex items-center justify-center border-2 border-white dark:border-surface-900 transition-colors"
                        >
                            <Camera className="w-3.5 h-3.5 text-white" />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-sm font-medium text-brand-900 dark:text-white">
                            Profile photo
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            JPG, PNG or WEBP. Max 2MB.
                        </p>
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Full name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className={`mt-1.5 w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 `}
                    />
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Email
                    </label>
                    <input
                        type="text"
                        readOnly
                        value={user?.email}
                        placeholder="you@example.com"
                        className={`mt-1.5 w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 `}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
                >
                    Save changes
                </button>
            </form>
        </div>
    )
}

export default ProfileInfo