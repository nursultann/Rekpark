import ApiClient from "./ApiClient";

export const fetchComments = async (productId) => {
    try {
        const response = await ApiClient.get(`/products/${productId}/comments`, {
            'with': 'user;parent.user',
            'orderBy': 'created_at',
            'sortedBy': 'desc',
        });
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('comments err ', error.response);
    }

    return null;
}

export const createComment = async (text, productId, userId, parentId = null) => {
    try {
        const response = await ApiClient.post('/comments', {
            'text': text,
            'advertisement_id': productId,
            'user_id': userId,
            'parent_id': parentId
        });
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('create comment error ', error.response);
    }

    return null;
};

export const deleteComments = async (id) => {
    try {
        const response = await ApiClient.delete(`/comments/${id}`);
        if (response.status == 200 || response.status == 201) {
            return response.data;
        }
    } catch (error) {
        console.log('create product error ', error.response);
    }

    return null;
};

export const answerComment = async (text, productId, userId, parentId) => {
    try {
        console.log(parentId);
        const response = await ApiClient.post(`/comments`, { 'text': text, 'advertisement_id': productId, 'user_id': userId, 'parent_id': parentId });
        if (response.status == 200 || response.status == 201) {
            return response.data;
        }
    } catch (error) {
        console.log('create product error ', error.response);
    }

    return null;
};