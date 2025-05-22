import apiClient from "../utils/apiClient.js";

export async function getMileageLogs() {
    try {
        const response = await apiClient.get('/mileage-logs');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getMileageLogById(mileageLogId) {
    try {
        const response = await apiClient.get('/mileage-logs/' + mileageLogId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createMileageLog(mileageLog) {
    try {
        const response = await apiClient.post(`/mileage-logs`, mileageLog);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateMileageLog(mileageLogId, mileageLog) {
    try {
        const response = await apiClient.put(`/mileage-logs/${mileageLogId}`, mileageLog);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteMileageLog(mileageLogId) {
    try {
        await apiClient.delete(`/mileage-logs/${mileageLogId}`);
    } catch (error) {
        throw error;
    }
}
