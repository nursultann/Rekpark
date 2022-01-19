import client from "../config/axios_config";
class ApiClient {
    get = (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        return client.get(url, {params: {...body}});
    };
    post = (url, body, contentType = 'application/json') => {
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