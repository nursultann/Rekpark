import { fetchProduct, userDetails } from "../api";
import { useQuery } from 'react-query';

const useProductDetailsQuery = (productId) => {
    const query = useQuery(['product', productId], () => fetchProduct(productId, {
        'with': 'category;customAttributeValues.customAttribute;region;city;user',
        'category_parents_tree': true,
    }));

    return { product: query.data, isLoading: query.isLoading, error: query.error };
};

export { useProductDetailsQuery }
