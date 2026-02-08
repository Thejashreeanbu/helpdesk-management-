import User from './user.model.js';
import { ApiError } from '../../utils/apiResponse.js';

export const createUser = async (userData) => {
    const { email } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User already exists');
    }
    return await User.create(userData);
};

export const getAllUsers = async (query) => {
    // Basic filtering could be added here
    return await User.find(query);
};

export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

// Update user
export const updateUser = async (id, updateBody) => {
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Explicitly allow updates to role and department
    if (updateBody.name) user.name = updateBody.name;
    if (updateBody.email) user.email = updateBody.email;
    if (updateBody.role) user.role = updateBody.role;
    if (updateBody.department) user.department = updateBody.department;

    await user.save();
    return user;
};

export const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};
