import { api } from '@artevelde-uas/canvas-lms-app';


export async function getUserData(namespace, scope) {
    const response = await api.get(`/users/self/custom_data/${scope}`, { ns: namespace });

    return response.data;
}

export async function setUserData(namespace, scope, data) {
    const response = await api.put(`/users/self/custom_data/${scope}`, { data }, { ns: namespace });

    // If the API response contains a message, it indicates an error, so we throw it as an exception
    if (response.message !== undefined) {
        throw new Error(response.message);
    }

    return response.data;
}
