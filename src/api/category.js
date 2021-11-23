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