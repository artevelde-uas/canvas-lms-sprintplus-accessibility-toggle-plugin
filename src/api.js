import { api } from '@artevelde-uas/canvas-lms-app';


const pkg = require('../package.json');


export async function getUserData(scope = '') {
    const response = await api.get(`/users/self/custom_data/${scope}`, { ns: pkg.name });

    // If the API response contains a message, it indicates an error, so we throw it as an exception
    if (response.message !== undefined) {
        throw new Error(response.message);
    }

    return response.data;
}

export async function setUserData(scope = '', data) {
    const response = await api.put(`/users/self/custom_data/${scope}`, { data }, { ns: pkg.name });

    // If the API response contains a message, it indicates an error, so we throw it as an exception
    if (response.message !== undefined) {
        throw new Error(response.message);
    }

    return response.data;
}

export default api;
