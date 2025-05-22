import apiClient from "../utils/apiClient.js";

export async function getRepairComponents() {
    try {
        const response = await apiClient.get('/repairComponents');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getRepairComponentById(repairComponentId) {
    try {
        const response = await apiClient.get('/repair-components/' + repairComponentId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createRepairComponent(repairComponent) {
    try {
        const response = await apiClient.post(`/repair-components`, repairComponent);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateRepairComponent(repairComponentId, repairComponent) {
    try {
        const response = await apiClient.put(`/repair-components/${repairComponentId}`, repairComponent);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteRepairComponent(repairComponentId) {
    try {
        await apiClient.delete(`/repair-components/${repairComponentId}`);
    } catch (error) {
        throw error;
    }
}
