"use client"
import React, { FC, useEffect, useState } from 'react';
import CoursePlayer from '@/app/utils/CoursePlayer';
import CourseContentList from './CourseContentList';
import {
    ArrowLeft,
    ArrowRight,
    Star,
    Link as LinkIcon,
    Send,
    Lightbulb
} from 'lucide-react';
import { BiMessage } from 'react-icons/bi';
import {
    useAddNewQuestionMutation,
    useAddAnswerInQuestionMutation,
    useAddReviewInCourseMutation,
    useAddReviewInReviewMutation
} from '@/redux/features/course/courseApi';
import toast from 'react-hot-toast';
import { format } from 'timeago.js';

type Props = {
    data: any;
    id: string;
    activeVideo: number;
    setActiveVideo: (activeVideo: number) => void;
    refetch: () => void;
    courseData?: any; // Contains overall course data including reviews
    user?: any;       // Pass current user object
};

const CourseContentMedia: FC<Props> = ({ data, id, activeVideo, setActiveVideo, refetch, courseData, user }) => {
    const [activeTab, setActiveTab] = useState(0); // 0: Overview, 1: Resources, 2: Q&A, 3: Reviews
    const [question, setQuestion] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [clearReplyFor, setClearReplyFor] = useState("");
    const [answerId, setAnswerId] = useState("");

    const currentLecture = data?.[activeVideo];

    // RTK Query Mutations
    const [addNewQuestion, { isSuccess: questionSuccess, error: questionError, isLoading: questionCreationLoading }] = useAddNewQuestionMutation();
    const [addAnswerInQuestion, { isSuccess: answerSuccess, error: answerError, isLoading: answerLoading }] = useAddAnswerInQuestionMutation();
    const [addReviewInCourse, { isSuccess: reviewSuccess, error: reviewError, isLoading: reviewLoading }] = useAddReviewInCourseMutation();
    const [addReviewInReview, { isSuccess: replyReviewSuccess, error: replyReviewError, isLoading: replyReviewLoading }] = useAddReviewInReviewMutation();

    const handleQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) {
            toast.error("Question can't be empty!");
            return;
        }
        addNewQuestion({ question, courseID: id, contentID: data[activeVideo]?._id });
    };

    const handleAnswerSubmit = (questionId: string, answerText: string) => {
        if (!answerText.trim()) {
            toast.error("Answer cannot be empty!");
            return;
        }
        addAnswerInQuestion({
            answer: answerText,
            courseID: id,
            contentID: data[activeVideo]?._id,
            questionID: questionId
        });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please select a star rating!");
            return;
        }

        if (!review.trim()) {
            toast.error("Review text can't be empty!");
            return;
        }

        addReviewInCourse({ review, rating, courseID: id });
    };

    const handleReviewReplySubmit = (reviewID: string, comment: string) => {
        if (!comment.trim()) {
            toast.error("Reply text cannot be empty!");
            return;
        }
        addReviewInReview({ comment, courseID: id, reviewID });
    };

    // Effect for handling Toast Notifications & Resetting Inputs
    useEffect(() => {
        if (questionSuccess) {
            toast.success("Question added successfully!");
            setQuestion('');
            refetch();
        }

        if (answerSuccess) {
            toast.success("Reply added successfully!");
            refetch();
            setClearReplyFor(answerId);
        }

        if (reviewSuccess) {
            toast.success("Review added successfully!");
            setReview("");
            setRating(0);
            refetch();
        }

        if (replyReviewSuccess) {
            toast.success("Admin reply added successfully!");
            refetch();
        }

        const errors = [
            { err: questionError },
            { err: answerError },
            { err: reviewError },
            { err: replyReviewError },
        ];

        errors.forEach(({ err }) => {
            if (err && "data" in (err as any)) {
                toast.error((err as any).data.message || "An error occurred");
            }
        });

    }, [
        questionSuccess,
        answerSuccess,
        reviewSuccess,
        replyReviewSuccess,
        questionError,
        answerError,
        reviewError,
        replyReviewError,
        refetch
    ]);

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
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-xs font-semibold transition"
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
                                            disabled={questionCreationLoading}
                                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                                        >
                                            <Send className="w-3.5 h-3.5" /> Submit Question
                                        </button>
                                    </div>
                                </form>

                                <CommentReply
                                    data={data}
                                    activeVideo={activeVideo}
                                    handleAnswerSubmit={handleAnswerSubmit}
                                    setAnswerId={setAnswerId}
                                    answerLoading={answerLoading}
                                    clearReplyFor={clearReplyFor}
                                />
                            </div>
                        )}

                        {/* Tab 3: Reviews & Ratings */}
                        {activeTab === 3 && (
                            <div className="space-y-6">
                                {/* Create Review Form (For Students) */}
                                {user?.role !== "admin" && (
                                    <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-200">Leave a Review</h3>

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
                                                disabled={reviewLoading}
                                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
                                            >
                                                {reviewLoading ? "Submitting..." : "Submit Review"}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* List Course Reviews and Admin Reply Controls */}
                                <div className="space-y-4">
                                    {courseData?.reviews?.length > 0 ? (
                                        courseData.reviews.map((item: any, index: number) => (
                                            <ReviewItem
                                                key={item._id || index}
                                                item={item}
                                                user={user}
                                                handleReviewReplySubmit={handleReviewReplySubmit}
                                                replyReviewLoading={replyReviewLoading}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 text-center py-4">No reviews yet for this course.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Course Content Accordion */}
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

/* --- Component for Questions & Replies --- */
const CommentReply = ({
    data,
    activeVideo,
    handleAnswerSubmit,
    setAnswerId,
    answerLoading,
    clearReplyFor
}: any) => {
    return (
        <div className="w-full my-3 space-y-4">
            {data[activeVideo]?.questions?.length > 0 ? (
                data[activeVideo].questions.map((item: any, index: number) => (
                    <CommentItem
                        key={item._id || index}
                        item={item}
                        handleAnswerSubmit={handleAnswerSubmit}
                        setAnswerId={setAnswerId}
                        answerLoading={answerLoading}
                        clearReplyFor={clearReplyFor}
                    />
                ))
            ) : (
                <p className="text-sm text-slate-500 text-center py-4">No questions posted yet.</p>
            )}
        </div>
    );
};

const CommentItem = ({
    item,
    handleAnswerSubmit,
    setAnswerId,
    answerLoading,
    clearReplyFor
}: any) => {
    const [replyActive, setReplyActive] = useState(false);
    const [localAnswer, setLocalAnswer] = useState("");

    useEffect(() => {
        if (clearReplyFor === item._id) {
            setLocalAnswer("");
        }
    }, [clearReplyFor, item._id]);

    const onSubmit = () => {
        if (!localAnswer.trim()) {
            toast.error("Answer cannot be empty!");
            return;
        }
        handleAnswerSubmit(item._id, localAnswer);
    };

    const replyCount = item?.questionReplies?.length || 0;

    return (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
                <img
                    src={item?.user?.avatar?.url || "/avatar.png"}
                    alt={item?.user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
                <div>
                    <h5 className="text-xs font-semibold text-slate-200">{item?.user?.name || "Student"}</h5>
                    <p className="text-[10px] text-slate-500">
                        {item?.createdAt ? format(item.createdAt) : "Just now"}
                    </p>
                </div>
            </div>

            <p className="text-sm text-slate-300 pl-11">{item?.question}</p>

            <div className="pl-11 flex items-center gap-4 text-xs text-slate-400">
                <button
                    type="button"
                    onClick={() => {
                        setReplyActive(!replyActive);
                        setAnswerId(item._id);
                    }}
                    className="flex items-center gap-1.5 hover:text-cyan-400 transition"
                >
                    <BiMessage className="w-4 h-4" />
                    <span>
                        {!replyActive
                            ? replyCount > 0
                                ? `All Replies (${replyCount})`
                                : "Reply"
                            : "Hide Replies"}
                    </span>
                </button>
            </div>

            {replyActive && (
                <div className="pl-11 pt-2 space-y-3 border-t border-slate-800/60 mt-3">
                    {item?.questionReplies?.map((reply: any, idx: number) => (
                        <div key={reply._id || idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={reply?.user?.avatar?.url || "/avatar.png"}
                                        alt={reply?.user?.name || "User"}
                                        className="w-5 h-5 rounded-full object-cover"
                                    />
                                    <h6 className="text-xs font-semibold text-slate-200">{reply?.user?.name || "User"}</h6>
                                </div>
                                <span className="text-[10px] text-slate-500">
                                    {reply?.createdAt ? format(reply.createdAt) : "Just now"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 pl-7">{reply?.answer}</p>
                        </div>
                    ))}

                    <textarea
                        rows={2}
                        value={localAnswer}
                        onChange={(e) => setLocalAnswer(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-200"
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            disabled={answerLoading}
                            onClick={onSubmit}
                            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-md text-xs font-medium transition"
                        >
                            Submit Reply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* --- Component for Individual Course Reviews & Admin Replies --- */
const ReviewItem = ({ item, user, handleReviewReplySubmit, replyReviewLoading }: any) => {
    const [isReplying, setIsReplying] = useState(false);
    const [reply, setReply] = useState("");

    const onSubmitReply = () => {
        if (!reply.trim()) {
            toast.error("Reply text cannot be empty!");
            return;
        }
        handleReviewReplySubmit(item._id, reply);
        setReply("");
        setIsReplying(false);
    };

    const replies = item?.commentReplies || [];

    return (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            {/* Header: User Info & Rating */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={item?.user?.avatar?.url || "/avatar.png"}
                        alt={item?.user?.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                        <h5 className="text-xs font-semibold text-slate-200">{item?.user?.name || "Student"}</h5>
                        <p className="text-[10px] text-slate-500">
                            {item?.createdAt ? format(item.createdAt) : "Just now"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${item?.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Review Comment */}
            <p className="text-xs text-slate-300 pl-11">{item?.review}</p>

            {/* Existing Admin Replies */}
            {replies.length > 0 && (
                <div className="pl-11 space-y-2 pt-2">
                    {replies.map((rep: any, idx: number) => (
                        <div key={rep._id || idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={rep?.user?.avatar?.url || "/avatar.png"}
                                        alt={rep?.user?.name || "Admin"}
                                        className="w-5 h-5 rounded-full object-cover"
                                    />
                                    <h6 className="text-xs font-semibold text-cyan-400">{rep?.user?.name || "Admin"}</h6>
                                </div>
                                <span className="text-[10px] text-slate-500">
                                    {rep?.createdAt ? format(rep.createdAt) : "Just now"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-300 pl-7">{rep?.comment}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Admin Reply Action & Form */}
            {user?.role === "admin" && (
                <div className="pl-11 pt-2">
                    {!isReplying ? (
                        <button
                            type="button"
                            onClick={() => setIsReplying(true)}
                            className="flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
                        >
                            <BiMessage className="w-4 h-4" /> Add Reply
                        </button>
                    ) : (
                        <div className="space-y-2 mt-2">
                            <textarea
                                rows={2}
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Write official admin reply..."
                                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-200"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsReplying(false)}
                                    className="px-3 py-1.5 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs rounded-md font-medium transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={replyReviewLoading}
                                    onClick={onSubmitReply}
                                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs rounded-md font-medium transition"
                                >
                                    Submit Reply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseContentMedia;