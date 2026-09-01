"use client"
import React, { FC, useEffect, useState } from 'react';
import CoursePlayer from '@/app/utils/CoursePlayer';
import CourseContentList from './CourseContentList';
import {
    ArrowLeft,
    ArrowRight,
    MessageSquare,
    Star,
    FileText,
    Link as LinkIcon,
    Send,
    Lightbulb,
    CheckCircle2
} from 'lucide-react';
import { useAddNewQuestionMutation } from '@/redux/features/course/courseApi';
import toast from 'react-hot-toast';

type Props = {
    data: any;
    id: string;
    activeVideo: number;
    setActiveVideo: (activeVideo: number) => void;
    refetch: () => void;
};

const CourseContentMedia: FC<Props> = ({ data, id, activeVideo, setActiveVideo, refetch }) => {
    const [activeTab, setActiveTab] = useState(0); // 0: Overview, 1: Resources, 2: Q&A, 3: Reviews
    const [question, setQuestion] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);

    const currentLecture = data[activeVideo];

    const [answer, setAnswer] = useState("");
    const [answerId, setAnswerId] = useState("")


    const [addNewQuestion, { isSuccess, error, isLoading: questionCreationLoading }] = useAddNewQuestionMutation()

    const handleQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        if (question.length === 0) {
            toast.error("Question can't be empty!")
        } else {
            addNewQuestion({ question, courseID: id, contentID: data[activeVideo]._id })
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Question added successfully!");
            setQuestion('');
            refetch();
        }
        if (error) {
            if ("data" in error) {
                const errMessage = error as any;
                toast.error(errMessage);
            }
        }
    }, [])



    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!review.trim()) return;
        // Connect your add review mutation here
        setReview('');
    };

    return (
        <div className="w-full min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Player and Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <CoursePlayer
                        title={currentLecture?.title}
                        videoUrl={currentLecture?.videoURL}
                    />

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <button
                            type="button"
                            onClick={() => setActiveVideo(activeVideo === 0 ? 0 : activeVideo - 1)}
                            disabled={activeVideo === 0}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold transition"
                        >
                            <ArrowLeft className="w-4 h-4" /> Previous Lesson
                        </button>
                        <span className="text-xs text-slate-400">
                            Lesson {activeVideo + 1} of {data?.length || 0}
                        </span>
                        <button
                            type="button"
                            onClick={() => setActiveVideo(data && activeVideo === data.length - 1 ? activeVideo : activeVideo + 1)}
                            disabled={data && activeVideo === data.length - 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-xs font-semibold transition"
                        >
                            Next Lesson <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Section Header */}
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">{currentLecture?.title}</h1>
                        <p className="text-xs text-slate-400 mt-1">{currentLecture?.videoSection}</p>
                    </div>

                    {/* Tab Selection */}
                    <div className="flex items-center gap-6 border-b border-slate-800 text-sm font-medium">
                        {['Overview', 'Resources', 'Q&A', 'Reviews'].map((tab, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                className={`pb-3 relative transition ${activeTab === idx
                                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                                    : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Panes */}
                    <div className="pt-2">
                        {/* Tab 0: Overview */}
                        {activeTab === 0 && (
                            <div className="space-y-4 text-sm text-slate-300">
                                <p>{currentLecture?.description || "No description provided for this lesson."}</p>
                                {currentLecture?.suggestion && (
                                    <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-start gap-3">
                                        <Lightbulb className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-cyan-200">{currentLecture.suggestion}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab 1: Resources */}
                        {activeTab === 1 && (
                            <div className="space-y-3">
                                {currentLecture?.links?.length > 0 ? (
                                    currentLecture.links.map((link: any, index: number) => (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm text-slate-200 transition"
                                        >
                                            <LinkIcon className="w-4 h-4 text-cyan-400" />
                                            <span>{link.title}</span>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-500">No resources attached to this lesson.</p>
                                )}
                            </div>
                        )}

                        {/* Tab 2: Q&A */}
                        {activeTab === 2 && (
                            <div className="space-y-6">
                                <form onSubmit={handleQuestionSubmit} className="space-y-3">
                                    <textarea
                                        rows={3}
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        placeholder="Ask a question about this video..."
                                        className="w-full p-3 text-sm bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition"
                                        >
                                            <Send className="w-3.5 h-3.5" /> Submit Question
                                        </button>
                                    </div>
                                </form>

                                {/* Questions List */}
                                <div className="space-y-4">
                                    {currentLecture?.questions?.length > 0 ? (
                                        currentLecture.questions.map((q: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                                    <span className="font-semibold text-slate-200">{q.user?.name || "Student"}</span>
                                                </div>
                                                <p className="text-sm text-slate-300">{q.question}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 text-center py-4">No questions posted yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Reviews & Ratings */}
                        {activeTab === 3 && (
                            <div className="space-y-6">
                                <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-200">Leave a Review</h3>

                                    {/* Star Picker */}
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 focus:outline-none"
                                            >
                                                <Star
                                                    className={`w-6 h-6 ${(hoverRating || rating) >= star
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-600'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        rows={3}
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        placeholder="Write your detailed course feedback..."
                                        className="w-full p-3 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200"
                                    />

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold transition"
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Course Accordion Content List */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                        <h2 className="text-base font-bold text-slate-100">Course Content</h2>
                        <CourseContentList
                            data={data}
                            activeVideo={activeVideo}
                            setActiveVideo={setActiveVideo}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseContentMedia;