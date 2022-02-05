import ApiClient from "./ApiClient";

export const fetchCategoriesTree = async (params = {}) => {
    try {
        const response = await ApiClient.get('/categories/tree', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch(error) {
        console.log('FetchCategoriesErr', error);
    }

    return null;
};
export const fetchCategoryProducts = async (id,sub,wit,params = { limit: 20, offset: 0 }) => {
    try {
        if (!params.hasOwnProperty(sub)) {
            if (!params.hasOwnProperty('offset')) params['offset'] = 0;
            if (!params.hasOwnProperty('limit')) params['limit'] = 20;
        }
        const response = await ApiClient.get(`/categories/${id}?with=advertisements;customAttribute;children`, params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching products error ', error);
    }

    return null;
};