import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Book, Folder, ChevronRight, Plus, ExternalLink } from 'lucide-react';
import { getCategories, getArticles, reset } from '../knowledgeBaseSlice';

const KnowledgeBasePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, articles, isLoading } = useSelector((state) => state.knowledgeBase);
    const { user } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getCategories());
        // Fetch recent/popular articles limited to 5? 
        // Logic for backend to support 'limit' or 'sort' is there (default sort by createdAt).
        dispatch(getArticles({}));
        return () => {
            // dispatch(reset()); // Maybe don't reset to keep cache?
        }
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/knowledge-base/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const canManage = ['admin', 'manager', 'agent', 'super-admin'].includes(user?.role);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl border-primary/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 max-w-3xl">
                    <h1 className="text-4xl font-bold mb-4 text-white tracking-tight">How can we help you today?</h1>
                    <p className="text-text-muted mb-8 text-lg">Search for articles, guides, and troubleshooting steps.</p>

                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full pl-14 pr-4 py-4 rounded-xl text-white bg-black/40 border border-white/10 shadow-lg focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:outline-none transition-all placeholder-text-muted text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={24} />
                        <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 btn btn-primary py-2 px-6 rounded-lg">
                            Search
                        </button>
                    </form>
                </div>

                {canManage && (
                    <div className="absolute top-8 right-8 hidden md:block">
                        <Link to="/knowledge-base/manage" className="glass-card px-4 py-2 rounded-lg flex items-center space-x-2 text-white hover:text-primary hover:bg-white/5 transition-all border border-white/10">
                            <Plus size={18} />
                            <span>Manage Content</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Categories Grid */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center tracking-wide">
                    <Folder className="mr-3 text-primary" size={24} />
                    Browse by Category
                </h2>

                {isLoading && categories.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-white/5 rounded-xl animate-pulse border border-white/5"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/knowledge-base/category/${category._id}`}
                                className="glass-card p-6 rounded-xl hover:shadow-primary/10 hover:border-primary/30 group block relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Folder size={64} className="text-white" />
                                </div>
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-lg shadow-primary/5">
                                        <Book size={24} />
                                    </div>
                                    <ChevronRight className="text-text-muted group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                                <p className="text-text-muted text-sm line-clamp-2">{category.description}</p>
                            </Link>
                        ))}
                        {categories.length === 0 && (
                            <div className="col-span-3 text-center py-10 text-text-muted bg-white/5 rounded-xl border border-dashed border-white/10">
                                No categories found.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recent Articles */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center tracking-wide">
                    <Book className="mr-3 text-secondary" size={24} />
                    Recent Articles
                </h2>
                <div className="glass-panel rounded-xl overflow-hidden divide-y divide-white/5">
                    {articles.slice(0, 5).map((article) => (
                        <Link
                            key={article._id}
                            to={`/knowledge-base/article/${article._id}`}
                            className="block p-5 hover:bg-white/5 transition-colors group"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-md font-bold text-white mb-1 group-hover:text-primary transition-colors flex items-center">
                                        {article.title}
                                        <ExternalLink size={12} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-muted" />
                                    </h3>
                                    <div className="flex items-center space-x-3 text-xs text-text-muted">
                                        <span className="bg-white/10 px-2 py-0.5 rounded text-white border border-white/5 hover:bg-white/20 transition-colors">{article.category?.name || 'Uncategorized'}</span>
                                        <span>•</span>
                                        <span className="font-mono">{new Date(article.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {article.isPublic ? (
                                    <span className="badge badge-success">Public</span>
                                ) : (
                                    <span className="badge badge-warning">Internal</span>
                                )}
                            </div>
                        </Link>
                    ))}
                    {articles.length === 0 && !isLoading && (
                        <div className="p-8 text-center text-text-muted">No articles found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBasePage;
