import mongoose, { Document, Model, Schema } from "mongoose";


// Interface
interface INotification extends Document {
    title: string;
    message: string;
    status: string;
    userID: string
}


// Schema
const NotificationSchema = new mongoose.Schema<INotification>({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "unread"
    },
    // userID: {
    //     type: String,
    //     required: true
    // },

}, { timestamps: true });


const NotificationModel: Model<INotification> = mongoose.models.notification || mongoose.model("notification", NotificationSchema);

export default NotificationModel;