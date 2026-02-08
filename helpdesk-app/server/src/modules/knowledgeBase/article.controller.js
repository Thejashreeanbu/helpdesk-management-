import Article from './article.model.js';
import Category from './category.model.js';
import { ApiResponse, ApiError } from '../../utils/apiResponse.js';

// @desc    Create new article
// @route   POST /api/v1/knowledge-base/articles
// @access  Internal (Manager/Admin/Agent)
export const createArticle = async (req, res, next) => {
    try {
        // Validate category exists
        const category = await Category.findById(req.body.category);
        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        const article = await Article.create({
            ...req.body,
            author: req.user._id
        });

        res.status(201).json(new ApiResponse(201, article, 'Article created successfully'));
    } catch (error) {
        if (error.code === 11000) {
            return next(new ApiError(400, 'Article with this title already exists'));
        }
        next(error);
    }
};

// @desc    Get all articles (with search and filter)
// @route   GET /api/v1/knowledge-base/articles
// @access  Public
export const getAllArticles = async (req, res, next) => {
    try {
        const { search, category, platform, isPublic } = req.query;
        let query = {};

        // Search Filter
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } }
            ];
        }

        // Category Filter
        if (category) {
            query.category = category;
        }

        // Visibility Filter
        // If user is not logged in (or public API), force isPublic=true
        // If we are strictly checking public access in route, we might not have req.user
        // Assuming this route might be used by guests too.
        // If req.user is undefined, we assume guest.

        // However, `req.user` might be populated if auth middleware ran.
        // Let's assume we want to support both modes. 
        // If explicitly requesting private articles, need to be authorized.

        if (!req.user) {
            query.isPublic = true;
        } else {
            // Logged in user can see everything or filter?
            // If they are regular User, maybe only public + internal user docs? 
            // For now, let's say "isPublic: true" shows public docs.
            // If `isPublic` param is passed, use it, otherwise show all authorized?
            // Let's simplify: 
            // If `isPublic` query param is present, use it.
            // If not present:
            //   - Guests -> isPublic: true
            //   - Agents/Admins -> Show all
            //   - Users -> Show all (if we consider logged-in == internal access) or just public? 

            // Per requirements: "Public and internal visibility".
            // Let's assume "Internal" means logged in.
            // So if logged in, show all. If guest, show public only.
            // We can refine this later.
        }

        // Actually, let's be explicit if query param provided
        if (isPublic !== undefined) {
            query.isPublic = isPublic === 'true';
        } else if (!req.user) {
            query.isPublic = true;
        }

        const articles = await Article.find(query)
            .populate('category', 'name slug')
            .populate('author', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(new ApiResponse(200, articles, 'Articles retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get single article
// @route   GET /api/v1/knowledge-base/articles/:id
// @access  Public
export const getArticle = async (req, res, next) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('category', 'name slug')
            .populate('author', 'name email');

        if (!article) {
            throw new ApiError(404, 'Article not found');
        }

        // Access check
        if (!article.isPublic && !req.user) {
            throw new ApiError(403, 'Access denied. Please log in to view this article.');
        }

        // Increment views
        article.views += 1;
        await article.save({ validateBeforeSave: false });

        res.status(200).json(new ApiResponse(200, article, 'Article retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Update article
// @route   PUT /api/v1/knowledge-base/articles/:id
// @access  Internal
export const updateArticle = async (req, res, next) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!article) {
            throw new ApiError(404, 'Article not found');
        }

        res.status(200).json(new ApiResponse(200, article, 'Article updated successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Delete article
// @route   DELETE /api/v1/knowledge-base/articles/:id
// @access  Internal
export const deleteArticle = async (req, res, next) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            throw new ApiError(404, 'Article not found');
        }

        res.status(200).json(new ApiResponse(200, null, 'Article deleted successfully'));
    } catch (error) {
        next(error);
    }
};
