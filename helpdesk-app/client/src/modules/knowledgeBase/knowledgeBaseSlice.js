import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import knowledgeBaseService from './knowledgeBase.service';

const initialState = {
    articles: [],
    article: null,
    categories: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Fetch Categories
export const getCategories = createAsyncThunk(
    'knowledgeBase/getCategories',
    async (_, thunkAPI) => {
        try {
            return await knowledgeBaseService.getCategories();
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create Category
export const createCategory = createAsyncThunk(
    'knowledgeBase/createCategory',
    async (categoryData, thunkAPI) => {
        try {
            return await knowledgeBaseService.createCategory(categoryData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
    'knowledgeBase/deleteCategory',
    async (id, thunkAPI) => {
        try {
            await knowledgeBaseService.deleteCategory(id);
            return id;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Fetch Articles
export const getArticles = createAsyncThunk(
    'knowledgeBase/getArticles',
    async (params, thunkAPI) => {
        try {
            return await knowledgeBaseService.getArticles(params);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get Article
export const getArticle = createAsyncThunk(
    'knowledgeBase/getArticle',
    async (id, thunkAPI) => {
        try {
            return await knowledgeBaseService.getArticle(id);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create Article
export const createArticle = createAsyncThunk(
    'knowledgeBase/createArticle',
    async (articleData, thunkAPI) => {
        try {
            return await knowledgeBaseService.createArticle(articleData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Update Article
export const updateArticle = createAsyncThunk(
    'knowledgeBase/updateArticle',
    async ({ id, articleData }, thunkAPI) => {
        try {
            return await knowledgeBaseService.updateArticle(id, articleData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Delete Article
export const deleteArticle = createAsyncThunk(
    'knowledgeBase/deleteArticle',
    async (id, thunkAPI) => {
        try {
            await knowledgeBaseService.deleteArticle(id);
            return id;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const knowledgeBaseSlice = createSlice({
    name: 'knowledgeBase',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        resetArticle: (state) => {
            state.article = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Categories
            .addCase(getCategories.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Category
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
                state.isSuccess = true;
            })
            // Delete Category
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter((c) => c._id !== action.payload);
                state.isSuccess = true;
            })
            // Get Articles
            .addCase(getArticles.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getArticles.fulfilled, (state, action) => {
                state.isLoading = false;
                state.articles = action.payload;
            })
            .addCase(getArticles.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Article
            .addCase(getArticle.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.article = action.payload;
            })
            .addCase(getArticle.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Article
            .addCase(createArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.articles.push(action.payload);
            })
            // Update Article
            .addCase(updateArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.article = action.payload;
            })
            // Delete Article
            .addCase(deleteArticle.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.articles = state.articles.filter((a) => a._id !== action.payload);
            });
    },
});

export const { reset, resetArticle } = knowledgeBaseSlice.actions;
export default knowledgeBaseSlice.reducer;
