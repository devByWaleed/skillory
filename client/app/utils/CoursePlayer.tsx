import React, { useEffect, useState } from 'react'
import axios from "axios"


type Props = {
    videoUrl: string;
    title: string;
}

const CoursePlayer = ({ videoUrl, title }) => {
    const [videoData, setVideoData] = useState({
        otp: "",
        playbackInfo: "",
    })

    useEffect(() => {
        axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/course/getVdoCipherOTP`, {
            videoID: videoUrl,
        }).then((res) => {
            setVideoData(res.data)
        })


    }, [videoUrl])


    return (
        <div>
            <div style={{ paddingTop: "56%", position: "relative" }}>
                {
                    videoData.otp && videoData.playbackInfo !== "" && (
                        <iframe src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData?.playbackInfo}`}
                            style={{
                                border: 0,
                                maxWidth: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: "100%",
                                width: "100%",

                            }}
                            allowFullScreen={true} allow="encrypted-media"></iframe>
                    )
                }
            </div>
        </div>
    )
}

export default CoursePlayer