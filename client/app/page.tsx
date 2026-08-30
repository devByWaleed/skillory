"use client";
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Modal from "./utils/Modal";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Verification from "./components/Auth/Verification";
import { useSelector } from "react-redux";
import Courses from "./components/Route/Courses";
import Reviews from "./components/Route/Reviews";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";


interface Props { }


const Page: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");

  const { user } = useSelector((state: any) => state.auth);

  console.log(user);


  return (
    <>
      <Heading
        title="Skillory | Learn In-Demand Skills with Expert-Led Online Courses"

        description="Skillory is an online learning platform offering expert-led courses in web development, programming, and tech skills. Learn at your own pace, track your progress, and turn skills into real-world results."

        keywords="Skillory, online courses, learn programming, web development courses, online learning platform, e-learning, tech courses, LMS, buy courses online, video courses"
      />

      <Header open={open} setOpen={setOpen} activeItem={activeItem} />
      <Modal open={open} setOpen={setOpen} setRoute={setRoute}>
        {route === "Login" && <Login setOpen={setOpen} setRoute={setRoute} />}
        {route === "Sign-Up" && <SignUp setRoute={setRoute} />}
        {route === "Verification" && <Verification setRoute={setRoute} />}
      </Modal>
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
      <Footer />
    </>
  )
}

export default Page