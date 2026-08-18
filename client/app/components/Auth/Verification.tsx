import React, { useRef, useState } from 'react'
import { toast } from "react-hot-toast";

type Props = {
    setRoute: (route: string) => void;
}

type VerifyNumber = {
    "0": string;
    "1": string;
    "2": string;
    "3": string;
}

const Verification = (props: Props) => {
    const [invalidError, setInvalidError] = useState(false);
    const inputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
        0: "",
        1: "",
        2: "",
        3: "",
    })

    const verificationHandler = async () => {
        setInvalidError(true)
    }
    const handleInputChange = (index: number, value: string) => {
        setInvalidError(false);
        const newVerifyNumber = { ...verifyNumber, [index]: value };
        setVerifyNumber(newVerifyNumber);

        if (value === "" && index > 0) {
            inputRefs[index - 1].current?.focus();
        } else if (value.length === 1 && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6">
            {/* Icon */}
            <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2L4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-brand-600 dark:text-accent-400"
                            fill="none"
                        />
                        <path
                            d="M9 12l2 2 4-4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-brand-600 dark:text-accent-400"
                        />
                    </svg>
                </div>
            </div>

            <h1 className="mt-5 text-2xl font-josefin font-bold text-center text-brand-900 dark:text-white">
                Verify your account
            </h1>
            <p className="mt-2 text-sm text-center text-slate-600 dark:text-slate-300">
                Enter the 4-digit code sent to your email
            </p>

            {/* OTP inputs */}
            <div className="mt-8 flex items-center justify-center gap-3">
                {Object.keys(verifyNumber).map((key, index) => (
                    <input
                        key={key}
                        ref={inputRefs[index]}
                        type="number"
                        inputMode="numeric"
                        maxLength={1}
                        value={verifyNumber[key as keyof VerifyNumber]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className={`w-14 h-14 text-center text-xl font-semibold rounded-xl border bg-white dark:bg-surface-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors ${invalidError
                            ? "border-red-500"
                            : "border-slate-200 dark:border-surface-800"
                            }`}
                    />
                ))}
            </div>

            {invalidError && (
                <p className="mt-3 text-center text-xs text-red-500">
                    Invalid verification code. Please try again.
                </p>
            )}

            <button
                onClick={verificationHandler}
                className="mt-8 w-full py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors"
            >
                Verify OTP
            </button>

            <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-300">
                Go back to sign in?{" "}
                <span
                    onClick={() => props.setRoute("Login")}
                    className="text-brand-600 dark:text-accent-400 font-medium cursor-pointer"
                >
                    Sign in
                </span>
            </p>
        </div>
    )
}

export default Verification