import apiClient from "../utils/apiClient.js";

export async function getUsers() {
    try {
        const response = await apiClient.get('/users');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUserById(userId) {
    try {
        const response = await apiClient.get('/users/' + userId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createUser(user) {
    try {
        const response = await apiClient.post(`/users`, user);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateUser(userId, user) {
    try {
        const response = await apiClient.put(`/users/${userId}`, user);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        await apiClient.delete(`/users/${userId}`);
    } catch (error) {
        throw error;
    }
}
