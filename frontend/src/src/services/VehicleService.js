import apiClient from "../utils/apiClient.js";

export async function getVehicles() {
    try {
        const response = await apiClient.get('/vehicles');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getVehicleById(vehicleId) {
    try {
        const response = await apiClient.get('/vehicles/' + vehicleId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createVehicle(vehicle) {
    try {
        const response = await apiClient.post(`/vehicles`, vehicle);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateVehicle(vehicleId, vehicle) {
    try {
        const response = await apiClient.put(`/vehicles/${vehicleId}`, vehicle);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteVehicle(vehicleId) {
    try {
        await apiClient.delete(`/vehicles/${vehicleId}`);
    } catch (error) {
        throw error;
    }
}
