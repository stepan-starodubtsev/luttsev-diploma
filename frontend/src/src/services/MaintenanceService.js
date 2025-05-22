import apiClient from "../utils/apiClient.js";

export async function getMaintenances() {
    try {
        const response = await apiClient.get('/maintenance');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMaintenanceById(maintenanceId) {
    try {
        const response = await apiClient.get('/maintenance/' + maintenanceId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createMaintenance(maintenance) {
    try {
        const response = await apiClient.post(`/maintenance`, maintenance);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateMaintenance(maintenanceId, maintenance) {
    try {
        const response = await apiClient.put(`/maintenance/${maintenanceId}`, maintenance);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteMaintenance(maintenanceId) {
    try {
        await apiClient.delete(`/maintenance/${maintenanceId}`);
    } catch (error) {
        throw error;
    }
}
