import ApiClient from "./ApiClient";

export const fetchCar = async (s, params = {}) => {
    try {
        let url = `/car/${s}`;
        if (params.hasOwnProperty('where') && params.where) {
            const whereParams = JSON.stringify(params.where);
            url += `?where=${whereParams}`;
            params.where = null;
        }

        console.log('fetchCarUrl', url)
        const response = await ApiClient.get(url, params);
        if (response.status === 200 || response.status === 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('FetchCarErr', error);
    }

    return null;
};