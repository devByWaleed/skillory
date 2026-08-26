"use client"
import React, { FC, useEffect, useState } from 'react'
import axios from "axios"

type Props = {
    videoUrl: string;
    title: string;
}

const CoursePlayer: FC<Props> = ({ videoUrl, title }) => {
    const [videoData, setVideoData] = useState({
        otp: "",
        playbackInfo: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!videoUrl) return;

        setLoading(true);
        setError("");

        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/course/getVdoCipherOTP`, {
            videoID: videoUrl,
        })
            .then((res) => {
                setVideoData(res.data);
            })
            .catch(() => {
                setError("Unable to load video preview.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [videoUrl]);

    if (!videoUrl) {
        return (
            <div className="w-full aspect-video rounded-xl border border-dashed border-slate-200 dark:border-surface-700 flex items-center justify-center">
                <p className="text-sm text-slate-400 dark:text-slate-500">
                    Add a demo video URL to see a preview
                </p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {title && (
                <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">{title}</p>
            )}
            <div style={{ paddingTop: "56%", position: "relative" }} className="rounded-xl overflow-hidden bg-slate-100 dark:bg-surface-800">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-sm text-slate-400 dark:text-slate-500">Loading preview...</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
                        <p className="text-sm text-red-500">{error}</p>
                    </div>
                )}

                {videoData.otp && videoData.playbackInfo !== "" && (
                    <iframe
                        src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
                        style={{
                            border: 0,
                            maxWidth: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "100%",
                        }}
                        allowFullScreen
                        allow="encrypted-media"
                    />
                )}
            </div>
        </div>
    );
};

export default CoursePlayer;