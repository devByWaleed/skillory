import mongoose, { Document, Model } from "mongoose";


// Interfaces
interface IComment extends Document {
    user: object;
    comment: string;
    commentReplies?: IComment[];
}

interface IReview extends Document {
    user: object;
    rating: number;
    comment: string;
    commentReplies: IComment[];
}

interface ILink extends Document {
    title: string;
    url: string;
}

interface ICourseData extends Document {
    title: string;
    description: string;
    videoURL: string;
    // videoThumbnail: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: ILink[];
    suggestion: string;
    questions: IComment[];
}

interface ICourse extends Document {
    name: string;
    description: string;
    price?: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoURL: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: IReview[];
    courseData: ICourseData[];
    ratings?: number;
    purchased?: number;
}


// Schemas
const ReviewSchema = new mongoose.Schema<IReview>({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
});

const LinkSchema = new mongoose.Schema<ILink>({
    title: String,
    url: String
});

const CommentSchema = new mongoose.Schema<IComment>({
    user: Object,
    comment: String,
    commentReplies: [Object],
});

const CourseDataSchema = new mongoose.Schema<ICourseData>({
    videoURL: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [LinkSchema],
    suggestion: String,
    questions: [CommentSchema]
});


const CourseSchema = new mongoose.Schema<ICourse>({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    estimatedPrice: {
        type: String,
    },
    thumbnail: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    tags: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    demoURL: {
        type: String,
        required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [ReviewSchema],
    courseData: [CourseDataSchema],
    ratings: {
        type: Number,
        default: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
});



const CourseModel: Model<ICourse> = mongoose.models.course || mongoose.model("course", CourseSchema);

export default CourseModel;