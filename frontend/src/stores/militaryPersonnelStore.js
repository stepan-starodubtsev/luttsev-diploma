// frontend/src/src/stores/militaryPersonnelStore.js
import { makeAutoObservable, runInAction, flow } from 'mobx';
import {
    getMilitaryPersonnel,
    getMilitaryPersonnelById,
    createMilitaryPersonnel,
    updateMilitaryPersonnel,
    deleteMilitaryPersonnel
} from '../services/militaryPersonnelService.js';
import unitStore from "./unitStore.js"; // Для завантаження підрозділів

class MilitaryPersonnelStore {
    personnelList = []; // Перейменовано з 'personnel' для уникнення конфлікту з можливою властивістю
    selectedPersonnel = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this, {
            loadPersonnel: flow, // Змінено для узгодженості
            loadPersonnelById: flow,
            addPersonnel: flow,
            updatePersonnel: flow,
            removePersonnel: flow
        });
    }

    *loadPersonnel(filters = {}) {
        this.loading = true;
        this.error = null;
        try {
            // Завантажуємо підрозділи, якщо вони ще не завантажені,
            // оскільки вони можуть знадобитися для відображення в таблиці або фільтрації
            if (unitStore.units.length === 0 && !unitStore.loading) {
                yield unitStore.loadUnits();
            }
            const data = yield getMilitaryPersonnel(filters);
            runInAction(() => {
                this.personnelList = data || [];
            });
        } catch (error) {
            console.error("Failed to load military personnel", error);
            runInAction(() => {
                this.error = error.message || "Не вдалося завантажити особовий склад";
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *loadPersonnelById(personnelId) {
        this.loading = true;
        this.error = null;
        this.selectedPersonnel = null;
        try {
            const data = yield getMilitaryPersonnelById(personnelId);
            runInAction(() => {
                this.selectedPersonnel = data;
            });
            return data;
        } catch (error) {
            console.error(`Failed to load military personnel ${personnelId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося завантажити дані військовослужбовця ${personnelId}`;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *addPersonnel(personnelData) {
        this.loading = true;
        this.error = null;
        try {
            const newPersonnel = yield createMilitaryPersonnel(personnelData);
            runInAction(() => {
                this.personnelList.push(newPersonnel);
            });
            return newPersonnel;
        } catch (error) {
            console.error("Failed to add military personnel", error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || "Не вдалося додати військовослужбовця";
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *updatePersonnel(personnelId, personnelData) {
        this.loading = true;
        this.error = null;
        try {
            const updated = yield updateMilitaryPersonnel(personnelId, personnelData);
            runInAction(() => {
                const index = this.personnelList.findIndex(p => p.military_person_id === personnelId);
                if (index !== -1) {
                    this.personnelList[index] = updated;
                }
                if (this.selectedPersonnel && this.selectedPersonnel.military_person_id === personnelId) {
                    this.selectedPersonnel = updated;
                }
            });
            return updated;
        } catch (error) {
            console.error(`Failed to update military personnel ${personnelId}`, error);
            runInAction(() => {
                this.error = error.response?.data?.message || error.message || `Не вдалося оновити дані військовослужбовця ${personnelId}`;
            });
            throw error;
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    *removePersonnel(personnelId) {
        this.loading = true;
        this.error = null;
        const originalPersonnelList = [...this.personnelList];
        try {
            runInAction(() => {
                this.personnelList = this.personnelList.filter(p => p.military_person_id !== personnelId);
            });
            yield deleteMilitaryPersonnel(personnelId);
        } catch (error) {
            console.error(`Failed to delete military personnel ${personnelId}`, error);
            runInAction(() => {
                this.error = error.message || `Не вдалося видалити військовослужбовця ${personnelId}`;
                this.personnelList = originalPersonnelList;
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    clearSelectedPersonnel() {
        this.selectedPersonnel = null;
    }
}

const militaryPersonnelStore = new MilitaryPersonnelStore();
export default militaryPersonnelStore;