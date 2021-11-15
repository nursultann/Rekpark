import { token } from "../utils/local_storage";
import client from "./axios_config";

/*const response = await axios
            .get('http://univerosh.kg/testapp/public/api/products')
            .catch((err) => {
                console.log('Error', err);
            });*/

class ApiClient {
    get = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.get(url, body);
    };

    post = (url, body, contentType = 'multipart/form-data') => {
        setContentType(contentType);
        return client.post(url, body);
    };

    put = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.put(url, body);
    };

    patch = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.patch(url, body);
    };

    delete = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.delete(url, body);
    };
}

const setContentType = (contentType) => {
    client.defaults.headers['Content-Type'] = contentType;
};

export default new ApiClient();