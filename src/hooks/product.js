import { useState } from "react";
import { useEffectOnce } from "react-use";
import { fetchProduct, userDetails } from "../api";
import { useQuery } from 'react-query';

const useProductDetailsQuery = (productId) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);

    useEffectOnce(() => {
        const queryProduct = async () => {
            setIsLoading(true);
            const response = await fetchProduct(productId, {
                'with': 'category;customAttributeValues.customAttribute;region;city;user',
                'category_parents_tree': true,
            })

            if (response != null) {
                setProduct(response);
            }

            setIsLoading(false);
        }

        queryProduct();
    });

    return { product: product, isLoading: isLoading, error: error };
};

export { useProductDetailsQuery }
