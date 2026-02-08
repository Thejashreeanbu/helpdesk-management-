import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArticle, resetArticle, deleteArticle } from '../knowledgeBaseSlice';
import { ArrowLeft, Calendar, User, Tag, Edit, Trash2 } from 'lucide-react';

const ArticleDetailsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { article, isLoading, isError, message } = useSelector((state) => state.knowledgeBase);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getArticle(id));
        return () => {
            dispatch(resetArticle());
        };
    }, [dispatch, id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            await dispatch(deleteArticle(id));
            navigate('/knowledge-base');
        }
    };

    const canManage = ['admin', 'manager', 'agent', 'super-admin'].includes(user?.role);

    if (isLoading) {
        return <div className="p-8 text-center text-primary animate-pulse font-mono">LOADING DATA STREAM...</div>;
    }

    if (isError) {
        return (
            <div className="p-8 text-center text-danger bg-danger/10 rounded-xl border border-danger/20">
                <p>{message}</p>
                <Link to="/knowledge-base" className="text-primary hover:text-white mt-4 inline-block transition-colors">Back to Knowledge Base</Link>
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="mb-6 flex items-center justify-between">
                <Link
                    to={article.category ? `/knowledge-base/category/${article.category._id}` : '/knowledge-base'}
                    className="flex items-center text-text-muted hover:text-primary transition-colors group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to {article.category?.name || 'Knowledge Base'}
                </Link>

                {canManage && (
                    <div className="flex space-x-2">
                        <Link to={`/knowledge-base/edit/${article._id}`} className="p-2 text-text-muted hover:text-primary hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10" title="Edit Article">
                            <Edit size={20} />
                        </Link>
                        <button onClick={handleDelete} className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors border border-transparent hover:border-danger/20" title="Delete Article">
                            <Trash2 size={20} />
                        </button>
                    </div>
                )}
            </div>

            <article className="glass-panel rounded-2xl overflow-hidden border border-white/10 relative">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="p-8 border-b border-white/5 relative z-10">
                    <div className="flex items-center space-x-2 mb-4">
                        <span className="badge badge-info">
                            {article.category?.name || 'Uncategorized'}
                        </span>
                        {!article.isPublic && (
                            <span className="badge badge-warning">
                                Internal
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl font-bold text-white mb-6 tracking-tight leading-tight">{article.title}</h1>

                    <div className="flex items-center text-sm text-text-muted space-x-6">
                        <div className="flex items-center">
                            <User size={16} className="mr-2 text-secondary" />
                            <span>{article.author?.name || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-secondary" />
                            <span>Last updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 prose prose-invert max-w-none relative z-10">
                    {/* Assuming plain text or safe HTML. For now simply mapping newlines */}
                    <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-normal text-lg">
                        {article.content}
                    </div>
                </div>

                {article.tags && article.tags.length > 0 && (
                    <div className="p-8 border-t border-white/5 bg-black/20 relative z-10">
                        <div className="flex items-center flex-wrap gap-2">
                            <Tag size={16} className="text-text-muted mr-2" />
                            {article.tags.map((tag, idx) => (
                                <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-sm text-text-muted hover:text-white hover:border-primary/50 transition-colors cursor-default">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
};

export default ArticleDetailsPage;
