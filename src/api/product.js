import ApiClient from "./ApiClient";

export const fetchProducts = async () => {
    try {
        const response = await ApiClient.get('/products');
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch(error) {
        console.log('fetching products error ', error);
    }

    return null;
};