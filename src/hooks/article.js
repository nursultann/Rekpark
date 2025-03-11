import { useState, useEffect, useCallback } from 'react';
import { useEffectOnce } from 'react-use';
import { fetchArticles } from '../api/articles';
import { useQuery } from 'react-query';
import axios from '../config/axios_config';

const useArticleListQuery = () => {
    const articles = useQuery(['articles'], () => fetchArticles({ sub: true }));

    return {
        articles: articles.data,
        isLoading: articles.isLoading,
        isError: articles.isError,
        error: articles.error,
    }
};

export const useArticlesQuery = (initialOptions = {}) => {
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        total: 0,
        perPage: 15
    });
    const [filters, setFilters] = useState({
        categories: '', // Comma-separated category IDs
        type: '', // 'article' or 'news'
        ...initialOptions
    });

    // Fetch articles list
    const fetchArticles = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            let fixedFilters = filters;
            for (const key in filters) {
                if (filters[key] === '') {
                    delete fixedFilters[key];
                }
            }
            const params = {
                page,
                limit: pagination.perPage,
                ...fixedFilters
            };

            const response = await axios.get('/articles', { params });

            setArticles(response.data.data);
            setPagination({
                ...pagination,
                currentPage: page,
                total: response.data.meta?.total || 0
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch articles');
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.perPage]);

    // Fetch single article with comments
    const fetchArticleDetails = useCallback(async (articleId) => {
        if (!articleId) return;

        setLoading(true);
        setError(null);

        try {
            const [articleResponse, commentsResponse] = await Promise.all([
                axios.get(`/articles/${articleId}`),
                axios.get(`/articles/${articleId}/comments`)
            ]);

            const articleData = {
                ...articleResponse.data.data,
                comments: commentsResponse.data.data
            };

            setSelectedArticle(articleData);
            return articleData;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch article details');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Toggle article favorite status
    const toggleFavorite = useCallback(async (articleId) => {
        try {
            const response = await axios.post(`/articles/${articleId}/favorite`, {
                is_favorite: selectedArticle?.is_favorite ? false : true
            });

            // Update article in list if present
            setArticles(prevArticles =>
                prevArticles.map(article =>
                    article.id === articleId
                        ? { ...article, is_favorite: !article.is_favorite }
                        : article
                )
            );

            // Update selected article if present
            if (selectedArticle?.id === articleId) {
                setSelectedArticle(prev => ({
                    ...prev,
                    is_favorite: !prev.is_favorite
                }));
            }

            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update favorite status');
            throw err;
        }
    }, [selectedArticle]);

    // Handle comments
    const addComment = useCallback(async (articleId, comment) => {
        try {
            const response = await axios.post(`/articles/${articleId}/comments`, comment);

            // Update selected article comments if present
            if (selectedArticle?.id === articleId) {
                setSelectedArticle(prev => ({
                    ...prev,
                    comments: [...(prev.comments || []), response.data.data]
                }));
            }

            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment');
            throw err;
        }
    }, [selectedArticle]);

    const updateComment = useCallback(async (articleId, commentId, text) => {
        try {
            const response = await axios.patch(
                `/articles/${articleId}/comments/${commentId}`,
                { text }
            );

            // Update selected article comments if present
            if (selectedArticle?.id === articleId) {
                setSelectedArticle(prev => ({
                    ...prev,
                    comments: prev.comments.map(comment =>
                        comment.id === commentId
                            ? response.data.data
                            : comment
                    )
                }));
            }

            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update comment');
            throw err;
        }
    }, [selectedArticle]);

    const deleteComment = useCallback(async (articleId, commentId) => {
        try {
            await axios.delete(`/articles/${articleId}/comments/${commentId}`);

            // Update selected article comments if present
            if (selectedArticle?.id === articleId) {
                setSelectedArticle(prev => ({
                    ...prev,
                    comments: prev.comments.filter(comment => comment.id !== commentId)
                }));
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete comment');
            throw err;
        }
    }, [selectedArticle]);

    // Update filters
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters
        }));
    }, []);

    // Handle page change
    const handlePageChange = useCallback((page) => {
        fetchArticles(page);
    }, [fetchArticles]);

    // Reset filters
    const resetFilters = useCallback(() => {
        setFilters(initialOptions);
    }, [initialOptions]);

    // Fetch articles when filters change
    useEffect(() => {
        fetchArticles(1);
    }, [filters, fetchArticles]);

    return {
        articles,
        selectedArticle,
        loading,
        error,
        pagination,
        filters,
        fetchArticles,
        fetchArticleDetails,
        toggleFavorite,
        addComment,
        updateComment,
        deleteComment,
        updateFilters,
        handlePageChange,
        resetFilters
    };
};

export default useArticleListQuery;
