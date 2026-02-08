import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCategories, createCategory, deleteCategory,
    getArticles, deleteArticle
} from '../knowledgeBaseSlice';
import { Plus, Trash2, Edit2, Folder, FileText, Check, X, Shield, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ManageKnowledgeBase = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, articles, isLoading } = useSelector((state) => state.knowledgeBase);
    const [activeTab, setActiveTab] = useState('categories');

    // Category Form State
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getArticles({})); // Fetch all for management
    }, [dispatch]);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        await dispatch(createCategory(categoryForm));
        setIsAddingCategory(false);
        setCategoryForm({ name: '', description: '' });
    };

    const handleDeleteCategory = (id) => {
        if (window.confirm('Delete this category? All articles in it will be deleted!')) {
            dispatch(deleteCategory(id));
        }
    };

    const handleDeleteArticle = (id) => {
        if (window.confirm('Delete this article?')) {
            dispatch(deleteArticle(id));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Manage Knowledge Base</h1>
                    <p className="text-text-muted">Create and organize support articles.</p>
                </div>
                {activeTab === 'articles' && (
                    <Link to="/knowledge-base/create" className="btn btn-primary flex items-center shadow-lg shadow-primary/20">
                        <Plus size={18} className="mr-2" />
                        Create Article
                    </Link>
                )}
                {activeTab === 'categories' && (
                    <button
                        onClick={() => setIsAddingCategory(true)}
                        className="btn btn-primary flex items-center shadow-lg shadow-primary/20"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Category
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="glass-panel p-1 rounded-xl flex space-x-1 w-max border border-white/10">
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'categories'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Folder size={16} className="mr-2" />
                    Categories
                </button>
                <button
                    onClick={() => setActiveTab('articles')}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${activeTab === 'articles'
                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                            : 'text-text-muted hover:text-white hover:bg-white/5'
                        }`}
                >
                    <FileText size={16} className="mr-2" />
                    Articles
                </button>
            </div>

            {/* Content */}
            <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
                {activeTab === 'categories' && (
                    <div className="p-6">
                        {isAddingCategory && (
                            <form onSubmit={handleCreateCategory} className="mb-8 bg-white/5 p-6 rounded-xl border border-white/10 animate-in slide-in-from-top-4">
                                <h3 className="font-bold text-white mb-4 flex items-center">
                                    <Plus size={18} className="mr-2 text-primary" /> New Category
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Technical Support"
                                            className="input-field bg-black/20"
                                            value={categoryForm.name}
                                            onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-2">Description</label>
                                        <input
                                            type="text"
                                            placeholder="Brief description..."
                                            className="input-field bg-black/20"
                                            value={categoryForm.description}
                                            onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end mt-6 space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingCategory(false)}
                                        className="px-4 py-2 text-text-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors font-bold text-sm uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary text-sm"
                                    >
                                        Save Category
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 text-text-muted text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {categories.map(cat => (
                                        <tr key={cat._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-white flex items-center">
                                                <div className="p-2 bg-white/5 rounded-lg mr-3 text-primary group-hover:text-white group-hover:bg-primary transition-colors">
                                                    <Folder size={16} />
                                                </div>
                                                {cat.name}
                                            </td>
                                            <td className="px-6 py-4 text-text-muted text-sm">{cat.description}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteCategory(cat._id)}
                                                    className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr><td colSpan="3" className="px-6 py-8 text-center text-text-muted italic">No categories found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'articles' && (
                    <div className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 text-text-muted text-xs uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Visibility</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {articles.map(article => (
                                        <tr key={article._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-white">
                                                <Link to={`/knowledge-base/article/${article._id}`} className="hover:text-primary transition-colors flex items-center">
                                                    <FileText size={16} className="mr-3 text-text-muted group-hover:text-primary transition-colors" />
                                                    {article.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted text-sm">
                                                <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{article.category?.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {article.isPublic ? (
                                                    <span className="badge badge-success">Public</span>
                                                ) : (
                                                    <span className="badge badge-warning">Internal</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-text-muted text-sm font-mono">{new Date(article.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        to={`/knowledge-base/edit/${article._id}`}
                                                        className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-white/10 transition-colors"
                                                        title="Edit Article"
                                                    >
                                                        <Edit2 size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteArticle(article._id)}
                                                        className="p-2 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                                                        title="Delete Article"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {articles.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-text-muted italic">No articles found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageKnowledgeBase;
