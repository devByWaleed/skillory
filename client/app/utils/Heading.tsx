import { assets } from "@/public/assets/assets";
import React, { FC, useState } from "react";

interface HeadProps {
    title: string;
    description: string;
    keywords: string;
}


const Heading: FC<HeadProps> = ({ title, description, keywords }) => {
    return (
        <>
            <title>{title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <link rel="icon" href={assets.skillory_favicon} type="image/svg+xml" />
        </>
    )
}

export default Heading;