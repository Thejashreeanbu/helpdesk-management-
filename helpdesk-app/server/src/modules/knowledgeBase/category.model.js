import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters'],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});


// Create category slug from the name
// Create category slug from the name
categorySchema.pre('save', function () {
    if (this.name) {
        this.slug = slugify(this.name, { lower: true });
    }
});

// Cascade delete articles when a category is deleted
// Cascade delete articles when a category is deleted
categorySchema.pre('deleteOne', { document: true, query: false }, async function () {
    console.log(`Articles being removed from category ${this._id}`);
    await mongoose.model('Article').deleteMany({ category: this._id });
});

// Reverse populate with virtuals
categorySchema.virtual('articles', {
    ref: 'Article',
    localField: '_id',
    foreignField: 'category',
    justOne: false,
});

export default mongoose.model('Category', categorySchema);
