import { useState, useEffect } from 'react';
import { useEffectOnce } from 'react-use';
import { fetchArticles } from '../api/articles';
import { useQuery } from 'react-query';

const useArticleListQuery = () => {
    const articles = useQuery(['articles'], () => fetchArticles({ sub: true }));

    return {
        articles: articles.data,
        isLoading: articles.isLoading,
        isError: articles.isError,
        error: articles.error,
    }
};

export default useArticleListQuery;
