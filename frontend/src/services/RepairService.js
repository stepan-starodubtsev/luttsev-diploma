import apiClient from "../utils/apiClient.js";

export async function getRepairs() {
    try {
        const response = await apiClient.get('/repairs');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getRepairById(repairId) {
    try {
        const response = await apiClient.get('/repairs/' + repairId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createRepair(repair) {
    try {
        const response = await apiClient.post(`/repairs`, repair);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateRepair(repairId, repair) {
    try {
        const response = await apiClient.put(`/repairs/${repairId}`, repair);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteRepair(repairId) {
    try {
        await apiClient.delete(`/repairs/${repairId}`);
    } catch (error) {
        throw error;
    }
}
