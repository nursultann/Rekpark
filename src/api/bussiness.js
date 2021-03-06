import ApiClient from "./ApiClient";

export const fetchBussinessPlans = async () => {
    try {
        const response = await ApiClient.get('/business/plans');
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetching product error ', error);
    }

    return null;
};