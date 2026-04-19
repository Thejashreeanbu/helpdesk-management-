import * as userService from './user.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';

// @desc    Create a user (Admin only)
// @route   POST /api/v1/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers(req.query);
        res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
    try {
        // RBAC Logic
        if (req.user.role === 'admin') {
            // 1. Cannot update Super Admin or other Admins
            const targetUser = await userService.getUserById(req.params.id);
            if (targetUser.role === 'super-admin' || targetUser.role === 'admin') {
                return next(new ApiResponse(403, null, 'Admins cannot update Super Admins or other Admins'));
            }

            // 2. Cannot promote to Admin or Super Admin
            if (req.body.role === 'admin' || req.body.role === 'super-admin') {
                return next(new ApiResponse(403, null, 'Admins cannot promote users to Admin or Super Admin'));
            }
        }

        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
    try {
        // RBAC: Admin cannot delete Super Admin or other Admins
        if (req.user.role === 'admin') {
            const targetUser = await userService.getUserById(req.params.id);
            if (targetUser.role === 'super-admin' || targetUser.role === 'admin') {
                return next(new ApiResponse(403, null, 'Admins cannot delete Super Admins or other Admins'));
            }
        }

        await userService.deleteUser(req.params.id);
        res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
    } catch (error) {
        next(error);
    }
};
