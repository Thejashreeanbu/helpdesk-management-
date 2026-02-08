import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    createArticle, updateArticle, getArticle, getCategories, resetArticle
} from '../knowledgeBaseSlice';
import { ArrowLeft, Save } from 'lucide-react';

const ArticleEditorPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams(); // If present, editing
    const isEditing = !!id;

    const { categories, article, isLoading, isSuccess } = useSelector((state) => state.knowledgeBase);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        isPublic: true,
        tags: ''
    });

    useEffect(() => {
        dispatch(getCategories());
        if (isEditing) {
            dispatch(getArticle(id));
        } else {
            dispatch(resetArticle());
        }

        return () => {
            dispatch(resetArticle());
        };
    }, [dispatch, id, isEditing]);

    // Populate form when article loads
    useEffect(() => {
        if (isEditing && article) {
            setFormData({
                title: article.title,
                content: article.content,
                category: article.category?._id || article.category, // Handle populated or ID
                isPublic: article.isPublic,
                tags: article.tags ? article.tags.join(', ') : ''
            });
        }
    }, [isEditing, article]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        if (isEditing) {
            await dispatch(updateArticle({ id, articleData: data }));
            navigate('/knowledge-base/manage'); // Navigate back to manage
        } else {
            await dispatch(createArticle(data));
            navigate('/knowledge-base/manage');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center text-text-muted hover:text-white transition-colors mb-2 text-sm uppercase tracking-widest font-bold">
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </button>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{isEditing ? 'Edit Article' : 'Create Article'}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8 space-y-8 border border-white/10 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

                <div className="relative z-10">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="input-field bg-black/20 text-xl font-bold"
                        placeholder="Article Title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Category</label>
                        <select
                            name="category"
                            required
                            className="input-field bg-black/20 appearance-none"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="" className="bg-slate-900">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id} className="bg-slate-900">{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center pt-6">
                        <label className="flex items-center text-sm font-bold text-white cursor-pointer group">
                            <input
                                type="checkbox"
                                name="isPublic"
                                className="w-5 h-5 text-primary rounded focus:ring-primary border-white/20 bg-black/40 mr-3 transition-all group-hover:scale-110"
                                checked={formData.isPublic}
                                onChange={handleChange}
                            />
                            Publicly Visible
                        </label>
                    </div>
                </div>

                <div className="relative z-10">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Content</label>
                    <textarea
                        name="content"
                        required
                        rows="12"
                        className="input-field bg-black/20 font-mono text-sm leading-relaxed h-96 resize-none"
                        placeholder="Write your article content here..."
                        value={formData.content}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="relative z-10">
                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Tags</label>
                    <input
                        type="text"
                        name="tags"
                        placeholder="guide, troubleshooting, email"
                        className="input-field bg-black/20"
                        value={formData.tags}
                        onChange={handleChange}
                    />
                    <p className="text-xs text-text-muted mt-1">Comma separated values</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5 relative z-10">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary px-8 py-3 text-sm"
                    >
                        <Save size={18} className="mr-2" />
                        {isLoading ? 'Saving...' : 'Save Article'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ArticleEditorPage;
