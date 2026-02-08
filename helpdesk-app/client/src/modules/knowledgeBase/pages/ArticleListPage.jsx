import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getArticles, getCategories } from '../knowledgeBaseSlice';
import { FileText, ArrowLeft, Search, Clock, Folder } from 'lucide-react';

const ArticleListPage = () => {
    const dispatch = useDispatch();
    const { categoryId } = useParams();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');

    const { articles, categories, isLoading } = useSelector((state) => state.knowledgeBase);

    // Find current category name if validating by category
    const currentCategory = categories.find(c => c._id === categoryId);

    useEffect(() => {
        // If we don't have categories yet, fetch them to display breadcrumbs/titles properly
        if (categories.length === 0) {
            dispatch(getCategories());
        }

        const params = {};
        if (categoryId) params.category = categoryId;
        if (searchQuery) params.search = searchQuery;

        dispatch(getArticles(params));
    }, [dispatch, categoryId, searchQuery]);

    const title = searchQuery
        ? `Search results for "${searchQuery}"`
        : currentCategory
            ? currentCategory.name
            : 'Articles';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
            <div className="flex items-center space-x-6 mb-8">
                <Link to="/knowledge-base" className="p-3 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
                    {currentCategory && <p className="text-text-muted mt-2">{currentCategory.description}</p>}
                    {searchQuery && <p className="text-text-muted mt-2 font-mono text-sm">Found {articles.length} results</p>}
                </div>
            </div>

            {/* Articles List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse border border-white/5"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {articles.map((article) => (
                            <Link
                                key={article._id}
                                to={`/knowledge-base/article/${article._id}`}
                                className="block glass-card p-6 rounded-xl hover:shadow-primary/20 hover:border-primary/40 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2 flex items-center">
                                            {article.title}
                                            {!article.isPublic && (
                                                <span className="ml-3 badge badge-warning text-xs">Internal</span>
                                            )}
                                        </h3>
                                        <p className="text-text-muted line-clamp-2 mb-4 text-sm leading-relaxed">{article.content.substring(0, 200).replace(/<[^>]*>?/gm, '')}...</p>

                                        <div className="flex items-center space-x-4 text-xs text-text-muted font-medium">
                                            <span className="flex items-center">
                                                <Clock size={14} className="mr-1.5 text-secondary" />
                                                {new Date(article.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center">
                                                <Folder size={14} className="mr-1.5 text-primary" />
                                                {article.category?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {articles.length === 0 && (
                            <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                                <Search size={64} className="mx-auto text-white/20 mb-6" />
                                <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                                <p className="text-text-muted">Try adjusting your search or category.</p>
                                <Link to="/knowledge-base" className="btn btn-primary mt-6 inline-flex">Back to Knowledge Base</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ArticleListPage;
