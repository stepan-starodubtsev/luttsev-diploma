import apiClient from "../utils/apiClient.js";

export async function getUnits() {
    try {
        const response = await apiClient.get('/units');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUnitById(unitId) {
    try {
        const response = await apiClient.get('/units/' + unitId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createUnit(unit) {
    try {
        const response = await apiClient.post(`/units`, unit);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateUnit(unitId, unit) {
    try {
        const response = await apiClient.put(`/units/${unitId}`, unit);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteUnit(unitId) {
    try {
        await apiClient.delete(`/units/${unitId}`);
    } catch (error) {
        throw error;
    }
}
