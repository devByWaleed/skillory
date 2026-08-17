"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Hero";

interface Props { }


const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return (
    <>
      <Heading
        title="Skillory | Learn In-Demand Skills with Expert-Led Online Courses"

        description="Skillory is an online learning platform offering expert-led courses in web development, programming, and tech skills. Learn at your own pace, track your progress, and turn skills into real-world results."

        keywords="Skillory, online courses, learn programming, web development courses, online learning platform, e-learning, tech courses, LMS, buy courses online, video courses"
      />

      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
      <Hero />
    </>
  )
}

export default Page