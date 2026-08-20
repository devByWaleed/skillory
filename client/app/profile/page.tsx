"use client"
import React, { FC, useState } from 'react'
import Protected from '../components/hooks/useProtected'
import Header from '../components/Header';
import Modal from '../utils/Modal';
import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';
import Verification from '../components/Auth/Verification';
import { useSelector } from 'react-redux';
import Heading from '../utils/Heading';
import Profile from '../components/Profile/Profile';

type Props = {}

const page = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(0);
    const [route, setRoute] = useState("Login");

    const { user } = useSelector((state: any) => state.auth);


    return (
        <div>
            <Protected>
                <Heading
                    title={`${user.name} Profile | Skillory`}

                    description="Skillory is an online learning platform offering expert-led courses in web development, programming, and tech skills. Learn at your own pace, track your progress, and turn skills into real-world results."

                    keywords="Skillory, online courses, learn programming, web development courses, online learning platform, e-learning, tech courses, LMS, buy courses online, video courses"
                />
                <Header open={open} setOpen={setOpen} activeItem={activeItem} />
                <Modal open={open} setOpen={setOpen} setRoute={setRoute}>
                    {route === "Login" && <Login setOpen={setOpen} setRoute={setRoute} />}
                    {route === "Sign-Up" && <SignUp setRoute={setRoute} />}
                    {route === "Verification" && <Verification setRoute={setRoute} />}
                </Modal>

                <Profile
                    user={user}
                />
            </Protected>
        </div>
    )
}

export default page