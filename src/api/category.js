import ApiClient from "./ApiClient";

export const fetchCategoriesTree = async () => {
    try {
        const response = await ApiClient.get('/categories/tree');
        return response.data.data;
    } catch(error) {
        console.log('FetchCategoriesErr', error);
    }
};