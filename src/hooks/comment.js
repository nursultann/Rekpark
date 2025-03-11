import { useState, useEffect } from 'react';
import {
    fetchComments as apiFetchComments,
    createComment as apiCreateComment,
    deleteComments as apiDeleteComment,
} from '../api';

const useProductComments = (productId) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            const response = await apiFetchComments(productId);
            setComments(response);
            setLoading(false);
        };

        fetchComments();
    }, [productId]);

    const createComment = async (text, productId, userId, parentId = null) => {
        const response = await apiCreateComment(text, productId, userId, parentId);
        if (response) {
            setComments([response, ...comments]);
        }
    };

    const deleteComment = async (id) => {
        const response = await apiDeleteComment(id);
        if (response) {
            setComments(comments.filter((comment) => comment.id !== id));
        }
    };

    return { comments, loading, createComment, deleteComment };
};

export default useProductComments;
