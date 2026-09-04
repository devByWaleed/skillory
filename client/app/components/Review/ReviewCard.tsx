"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, MessageSquare } from 'lucide-react';

export type ReviewItemType = {
    _id?: string;
    user?: {
        _id?: string;
        name?: string;
        avatar?: {
            url?: string;
        } | string;
    };
    rating: number;
    comment?: string;
    message?: string;
    name?: string;
    role?: string;
    avatar?: {
        url?: string;
    } | string | null;
    commentReplies?: Array<{
        _id?: string;
        user?: {
            name?: string;
            avatar?: { url?: string } | string;
        };
        comment: string;
        createdAt?: string;
    }>;
    createdAt?: string;
};

type ReviewCardProps = {
    item: ReviewItemType;
    canReply?: boolean;
    replyLoading?: boolean;
    onReply?: (reviewId: string, comment: string) => Promise<void>;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
    item,
    canReply = false,
    replyLoading = false,
    onReply
}) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    // Extract avatar URL safely whether avatar is a string or object
    const avatar = item.user?.avatar ?? item.avatar;
    const avatarUrl = typeof avatar === 'string'
        ? avatar
        : avatar?.url || "/avatar.png";
    const reviewerName = item.user?.name || item.name || "Anonymous User";
    const reviewComment = item.comment || item.message || "";

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (onReply && item._id && replyText.trim()) {
            await onReply(item._id, replyText);
            setReplyText("");
            setShowReplyInput(false);
        }
    };

    return (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700">
                            <Image
                                src={avatarUrl}
                                alt={reviewerName}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h5 className="text-xs font-semibold text-slate-200">
                                {reviewerName}
                            </h5>
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${item.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Display review comment */}
                <p className="text-xs text-slate-300 pl-11">{reviewComment}</p>

                {/* Nested Admin Replies */}
                {item.commentReplies && item.commentReplies.length > 0 && (
                    <div className="pl-11 space-y-2 pt-2 border-t border-slate-800/80">
                        {item.commentReplies.map((reply, idx) => (
                            <div key={reply._id || idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                                <div className="flex items-center gap-2">
                                    <h6 className="text-[11px] font-semibold text-cyan-400">
                                        {reply.user?.name || "Admin Response"}
                                    </h6>
                                </div>
                                <p className="text-xs text-slate-300">{reply.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Reply Input Toggle */}
            {canReply && (
                <div className="pl-11 pt-2">
                    <button
                        type="button"
                        onClick={() => setShowReplyInput(!showReplyInput)}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{showReplyInput ? "Cancel Reply" : "Reply to Review"}</span>
                    </button>

                    {showReplyInput && (
                        <form onSubmit={handleSubmitReply} className="mt-3 space-y-2">
                            <textarea
                                rows={2}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Write an official response..."
                                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-200"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={replyLoading || !replyText.trim()}
                                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-md text-xs font-medium transition"
                                >
                                    {replyLoading ? "Submitting..." : "Post Reply"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewCard;















// "use client"

// import React, { FC, useState } from 'react'
// import { Star, Quote } from "lucide-react"
// import { BiMessage } from 'react-icons/bi'
// import { format } from 'timeago.js'

// type Props = {
//     item: any;
//     canReply?: boolean;
//     replyLoading?: boolean;
//     onReply?: (reviewID: string, comment: string) => Promise<void> | void;
// }

// const ReviewCard: FC<Props> = ({ item, canReply, replyLoading, onReply }) => {
//     const [isReplying, setIsReplying] = useState(false);
//     const [replyText, setReplyText] = useState("");

//     const handleSubmitReply = async () => {
//         if (!replyText.trim() || !onReply) return;
//         await onReply(item.id || item._id, replyText);
//         setReplyText("");
//         setIsReplying(false);
//     };

//     const replies = item.commentReplies || [];

//     return (
//         <div className="h-full flex flex-col bg-white dark:bg-surface-800 border border-slate-200 dark:border-surface-700 rounded-2xl p-5 sm:p-6">
//             <Quote className="w-6 h-6 text-brand-100 dark:text-surface-700 shrink-0" />

//             {/* Rating */}
//             <div className="mt-3 flex items-center gap-0.5">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                     <Star
//                         key={i}
//                         className={`w-4 h-4 ${i < item.rating
//                             ? "fill-accent-400 text-accent-400"
//                             : "text-slate-200 dark:text-surface-700"
//                             }`}
//                     />
//                 ))}
//             </div>

//             {/* Review text */}
//             <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
//                 {item.message || item.review}
//             </p>

//             {/* Existing Replies */}
//             {replies.length > 0 && (
//                 <div className="mt-4 space-y-2 pt-3 border-t border-slate-100 dark:border-surface-700">
//                     {replies.map((rep: any, idx: number) => (
//                         <div key={rep._id || idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
//                             <div className="flex items-center justify-between">
//                                 <span className="font-semibold text-cyan-600 dark:text-cyan-400">
//                                     {rep?.user?.name || "Admin"}
//                                 </span>
//                                 <span className="text-[10px] text-slate-400">
//                                     {rep?.createdAt ? format(rep.createdAt) : "Just now"}
//                                 </span>
//                             </div>
//                             <p className="text-slate-600 dark:text-slate-300">{rep?.comment}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {/* Admin Reply Action */}
//             {canReply && (
//                 <div className="mt-3 pt-3 border-t border-slate-100 dark:border-surface-700">
//                     {!isReplying ? (
//                         <button
//                             type="button"
//                             onClick={() => setIsReplying(true)}
//                             className="flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
//                         >
//                             <BiMessage className="w-4 h-4" /> Add Admin Reply
//                         </button>
//                     ) : (
//                         <div className="space-y-2 mt-2">
//                             <textarea
//                                 rows={2}
//                                 value={replyText}
//                                 onChange={(e) => setReplyText(e.target.value)}
//                                 placeholder="Write official admin reply..."
//                                 className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 text-slate-800 dark:text-slate-200"
//                             />
//                             <div className="flex justify-end gap-2">
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsReplying(false)}
//                                     className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-md font-medium transition"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="button"
//                                     disabled={replyLoading}
//                                     onClick={handleSubmitReply}
//                                     className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs rounded-md font-medium transition"
//                                 >
//                                     {replyLoading ? "Submitting..." : "Submit Reply"}
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* Avatar + name */}
//             <div className="mt-5 pt-4 border-t border-slate-100 dark:border-surface-700 flex items-center gap-3">
//                 {item.avatar ? (
//                     <img
//                         src={item.avatar}
//                         alt={item.name}
//                         className="w-10 h-10 rounded-full object-cover shrink-0"
//                     />
//                 ) : (
//                     <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center shrink-0">
//                         <span className="text-sm font-semibold text-brand-600 dark:text-accent-400">
//                             {item.name?.charAt(0).toUpperCase()}
//                         </span>
//                     </div>
//                 )}
//                 <div className="min-w-0">
//                     <p className="text-sm font-semibold text-brand-900 dark:text-white truncate">
//                         {item.name}
//                     </p>
//                     {item.role && (
//                         <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
//                             {item.role}
//                         </p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ReviewCard