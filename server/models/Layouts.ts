import mongoose, { Document, Model, Schema } from "mongoose";


// Interfaces
interface faqItems extends Document {
    question: string;
    answer: string;
}

interface Category extends Document {
    title: string;
}

interface BannerImage extends Document {
    public_id: string;
    url: string;
}

interface Layout extends Document {
    type: string;
    faq: faqItems[];
    categories: Category[];
    banner: {
        image: BannerImage;
        title: string;
        subTitle: string;
    }
}


// Schemas
const FaqSchema = new mongoose.Schema<faqItems>({
    question: {
        type: String,
    },
    answer: {
        type: String,
        required: true
    }

});

const CategorySchema = new mongoose.Schema<Category>({
    title: {
        type: String,
    }
});

const BannerImageSchema = new mongoose.Schema<BannerImage>({
    public_id: {
        type: String,
    },
    url: {
        type: String,
    },
});

const LayoutSchema = new mongoose.Schema<Layout>({
    type: {
        type: String,
    },
    faq: [FaqSchema],
    categories: [CategorySchema],
    banner: {
        image: BannerImageSchema,
        title: { type: String },
        subTitle: { type: String },
    },
});


const LayoutModel: Model<Layout> = mongoose.models.layout || mongoose.model("layout", LayoutSchema);

export default LayoutModel;