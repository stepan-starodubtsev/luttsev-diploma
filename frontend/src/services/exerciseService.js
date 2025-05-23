// frontend/src/src/services/exerciseService.js
import apiClient from "../utils/apiClient.js"; //

const API_URL = '/api/exercises'; // Припускаємо, що такий ендпоінт буде на бекенді

export async function getExercises() {
    try {
        const response = await apiClient.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching exercises:', error);
        throw error;
    }
}

export async function getExerciseById(exerciseId) {
    try {
        const response = await apiClient.get(`${API_URL}/${exerciseId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching exercise with id ${exerciseId}:`, error);
        throw error;
    }
}

export async function createExercise(exerciseData) {
    try {
        const response = await apiClient.post(API_URL, exerciseData);
        return response.data;
    } catch (error) {
        console.error('Error creating exercise:', error);
        throw error;
    }
}

export async function updateExercise(exerciseId, exerciseData) {
    try {
        const response = await apiClient.put(`${API_URL}/${exerciseId}`, exerciseData);
        return response.data;
    } catch (error) {
        console.error(`Error updating exercise with id ${exerciseId}:`, error);
        throw error;
    }
}

export async function deleteExercise(exerciseId) {
    try {
        const response = await apiClient.delete(`${API_URL}/${exerciseId}`);
        return response.data; // Або response.status, якщо бекенд повертає тільки статус
    } catch (error) {
        console.error(`Error deleting exercise with id ${exerciseId}:`, error);
        throw error;
    }
}