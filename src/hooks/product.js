import { useState } from "react";
import { useEffectOnce } from "react-use";
import { fetchProduct, userDetails, fetchProducts as apiFetchProducts } from "../api";
import { fetchSearchProducts } from "../api/product";
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

const useProductsPaginatedQuery = ({ limit = 20, searchText } = {}) => {
    const [products, setProducts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [reachEnd, setReachEnd] = useState(false);

    const [loading, setLoading] = useState(false);

    const fetchProducts = async () => {
        if (loading) return;
        setLoading(true);
        console.log('fetching products limit', limit, 'offset', offset, 'searchText', searchText);
        let results = products.concat(await apiFetchProducts({
            offset: offset, 'with': 'user;region;city',
            ...(searchText && { searchText: searchText })
        }));
        if (results != null) {
            setProducts(results);
            setOffset(offset + limit);
            if (results.length < limit) {
                setReachEnd(true);
            }
        }
        setLoading(false);
    };

    const reset = () => {
        setProducts([]);
        setOffset(0);
        setReachEnd(false);
    };

    useEffectOnce(() => {
        fetchProducts();
    });

    return { products: products, fetchProducts: fetchProducts, reachEnd: reachEnd, isLoading: loading, reset: reset };
}

export { useProductDetailsQuery, useProductsPaginatedQuery }
