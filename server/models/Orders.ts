import mongoose, { Document, Model, Schema } from "mongoose";


// Interface
export interface IOrder extends Document {
    courseID: string;
    userID: string;
    payment_info: object
}


// Schema
const OrderSchema = new mongoose.Schema<IOrder>({
    courseID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    payment_info: {
        type: Object,
        // required: true
    }

}, { timestamps: true });


const OrderModel: Model<IOrder> = mongoose.models.order || mongoose.model("order", OrderSchema);

export default OrderModel;