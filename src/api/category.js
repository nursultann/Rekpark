import { setCategories } from "../redux/actions/category_actions";

export const fetchCategoriesTree = () => dispatch => {
    try {
        const response = await ApiClient.get('/categories/tree');
        dispatch(setCategories(response.data.data));
    } catch(error) {
        console.log('FetchCategoriesErr', error);
    }
};