import ApiClient from "./ApiClient";

export const login = async (phone, password, onSuccess, onError) => {
    try {
        const params = { 'phone': phone, 'password': password };
        const response = await ApiClient.post('/login', params);
        if (response.status == 200 || response.status == 201) {
            if (onSuccess != null) onSuccess(response.data.data);
        }
    } catch (error) {
        if (onError != null) onError(error);
    }
};
export const register = async (params, onSuccess = null, onError = null) => {
    await ApiClient.post('/register', params).then(response => {
        if (response.status == 200 || response.status == 201) {
            if (onSuccess != null) onSuccess(response.data.data);
        }
    }).catch(error => {
        if (onError != null) onError(error);
    });
};
export const passwordChange = async (params, onSuccess = null, onError = null) => {
    console.log('params', params);
    await ApiClient.post('/user/change/password', params).then(response => {
        if (response.status == 200 || response.status == 201) {
            if (onSuccess != null) onSuccess(response.data.data);
        }
    }).catch(error => {
        if (onError != null) onError(error);
    });
};
export const userDetails = async (params) => {
    try {
        const response = await ApiClient.get('/user', params);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('fetch user details error ', error.response);
    }

    return null;
};
export const checkPhone = async (phone) => {
    try {
        const response = await ApiClient.get('/user/check', { 'phone': phone });
        if (response.status == 200 || response.status == 201) {
            return true;
        }
    } catch (error) {
        return false;
    }
};
export const changePassword = async (password) => {

}
export const deleteAd = async (id) => {
    try {
        const response = await ApiClient.delete('/products/' + id);
        if (response.status == 200 || response.status == 201) {
            return response.data.data;
        }
    } catch (error) {
        console.log('Error', error.response);
    }

    return null;
};
export const userSettings = async (params, onSuccess = null, onError = null) => {
    await ApiClient.post('/user', params, 'multipart/form-data').then(response => {
        if (response.status == 200 || response.status == 201) {
            if (onSuccess != null) onSuccess(response.data.data);
        }
    }).catch(error => {
        if (onError != null) onError(error);
    });
};
