import ApiClient from "./ApiClient";

export const fetchProducts = async (params = { limit: 20, offset: 0 }) => {
    try {
        if (!params.hasOwnProperty('offset')) params['offset'] = 0;
        if (!params.hasOwnProperty('limit')) params['limit'] = 20;
        
        const response = await ApiClient.get('/products', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};

export const fetchProduct = async (id, params) => {
    try {
        const response = await ApiClient.get(`/products/${id}`, params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching product error ', error);
    }

    return null;
};

export const createProduct = async (params) => {
    try {
        const response = await ApiClient.post('/products', params, 'multipart/form-data');
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};

export const updateProduct = async (id, params = {}) => {
    try {
        if (!params.hasOwnProperty('_method')) params['_method'] = 'PATCH';

        const response = await ApiClient.post(`/products/${id}`, params, 'multipart/form-data');
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};