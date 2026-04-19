import express from 'express';
import {
    createCategory,
    getAllCategories,
    getCategory,
    updateCategory,
    deleteCategory
} from './category.controller.js';
import {
    createArticle,
    getAllArticles,
    getArticle,
    updateArticle,
    deleteArticle
} from './article.controller.js';
import { protect, authorize } from '../../middlewares/auth.middleware.js';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import User from '../users/user.model.js';

const router = express.Router();

// Middleware to optionally populate req.user if token exists
const optionalProtect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        // If token invalid, just proceed as guest
        next();
    }
};

// Category Routes
router.route('/categories')
    .get(getAllCategories)
    .post(protect, authorize('admin', 'manager', 'super-admin'), createCategory);

router.route('/categories/:id')
    .get(getCategory)
    .put(protect, authorize('admin', 'manager', 'super-admin'), updateCategory)
    .delete(protect, authorize('admin', 'manager', 'super-admin'), deleteCategory);

// Article Routes
router.route('/articles')
    .get(optionalProtect, getAllArticles)
    .post(protect, authorize('admin', 'manager', 'agent', 'super-admin'), createArticle);

router.route('/articles/:id')
    .get(optionalProtect, getArticle)
    .put(protect, authorize('admin', 'manager', 'agent', 'super-admin'), updateArticle)
    .delete(protect, authorize('admin', 'manager', 'agent', 'super-admin'), deleteArticle);

export default router;
