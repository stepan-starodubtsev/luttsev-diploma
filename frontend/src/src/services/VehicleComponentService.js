import apiClient from "../utils/apiClient.js";

export async function getVehicleComponents() {
    try {
        const response = await apiClient.get('/vehicle-components');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getVehicleComponentById(vehicleComponentId) {
    try {
        const response = await apiClient.get('/vehicle-components/' + vehicleComponentId);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createVehicleComponent(vehicleComponent) {
    try {
        const response = await apiClient.post(`/vehicle-components`, vehicleComponent);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateVehicleComponent(vehicleComponentId, vehicleComponent) {
    try {
        const response = await apiClient.put(`/vehicle-components/${vehicleComponentId}`, vehicleComponent);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteVehicleComponent(vehicleComponentId) {
    try {
        await apiClient.delete(`/vehicle-components/${vehicleComponentId}`);
    } catch (error) {
        throw error;
    }
}
