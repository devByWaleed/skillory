"use client"
import React, { FC, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiFillGithub, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useRegisterMutation } from "@/redux/auth/authApi";

type Props = {
    setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
    // name: Yup.string().name("Invalid Name!").required("Please enter your name"),
    email: Yup.string().email("Invalid Email!").required("Please enter your email"),
    password: Yup.string().required("Please enter your password").min(8)
});

const SignUp: FC<Props> = ({ setRoute }) => {
    const [show, setShow] = useState(false);
    const { register } = useRegisterMutation()

    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: schema,
        onSubmit: async ({ email, password }) => {
            const data = { name, email, password };

            // setRoute("Verification")
        }
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <h1 className="text-2xl font-josefin font-bold text-center text-brand-900 dark:text-white">
                Sign Up to Skillory
            </h1>
            <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-300">
                Welcome! Create your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`mt-1.5 w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${errors.email && touched.email
                            ? "border-red-500"
                            : "border-slate-200 dark:border-surface-800"
                            }`}
                    />
                    {errors.name && touched.name && (
                        <span className="mt-1 block text-xs text-red-500">{errors.name}</span>
                    )}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Email
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`mt-1.5 w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${errors.email && touched.email
                            ? "border-red-500"
                            : "border-slate-200 dark:border-surface-800"
                            }`}
                    />
                    {errors.email && touched.email && (
                        <span className="mt-1 block text-xs text-red-500">{errors.email}</span>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                        Password
                    </label>
                    <div className="relative mt-1.5">
                        <input
                            id="password"
                            name="password"
                            type={show ? "text" : "password"}
                            value={values.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full px-4 py-2.5 pr-11 rounded-lg border bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${errors.password && touched.password
                                ? "border-red-500"
                                : "border-slate-200 dark:border-surface-800"
                                }`}
                        />
                        {show ? (
                            <AiOutlineEyeInvisible
                                onClick={() => setShow(false)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400"
                            />
                        ) : (
                            <AiOutlineEye
                                onClick={() => setShow(true)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-slate-500 dark:text-slate-400"
                            />
                        )}
                    </div>
                    {errors.password && touched.password && (
                        <span className="mt-1 block text-xs text-red-500">{errors.password}</span>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
                >
                    Sign Up
                </button>

                <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                    Already have an account?{" "}
                    <span onClick={() => setRoute("Login")} className="text-brand-600 dark:text-accent-400 font-medium cursor-pointer">
                        Login
                    </span>
                </p>
                <div className="flex items-center gap-3 py-1">
                    <div className="flex-1 h-px bg-slate-200 dark:bg-surface-800" />
                    <span className="text-xs text-slate-400 dark:text-slate-500">Or continue with</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-surface-800" />
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        aria-label="Continue with Google"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-slate-200 dark:border-surface-800 hover:bg-brand-50 dark:hover:bg-surface-800 transition-colors"
                    >
                        <FcGoogle className="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Google</span>
                    </button>

                    <button
                        type="button"
                        aria-label="Continue with GitHub"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-slate-200 dark:border-surface-800 hover:bg-brand-50 dark:hover:bg-surface-800 transition-colors"
                    >
                        <AiFillGithub className="w-5 h-5 text-slate-900 dark:text-white" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">GitHub</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;