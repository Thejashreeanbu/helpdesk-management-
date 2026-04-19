import mongoose from 'mongoose';
import slugify from 'slugify';

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    slug: {
        type: String,
        unique: true,
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: true, // Publicly visible by default
    },
    tags: [{
        type: String,
        trim: true,
    }],
    views: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
});

// Create article slug from the title

articleSchema.pre('save', function () {
    if (this.title) {
        this.slug = slugify(this.title, { lower: true });
    }
});

export default mongoose.model('Article', articleSchema);
