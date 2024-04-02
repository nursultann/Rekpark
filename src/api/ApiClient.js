import client from "../config/axios_config";

class ApiClient {
    get = async (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        const req = await client.get(url, {params: {...body}});
        console.log(url, 'cached', req.headers)
        return req
    };
    post = async (url, body, contentType = 'application/json') => {
        setContentType(contentType);
        console.log(url, body)
        const req = await client.post(url, body);
        console.log(url, req.headers)
        return req
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
    // client.defaults.headers['Accept-Encoding'] = 'gzip';
};

export default new ApiClient();