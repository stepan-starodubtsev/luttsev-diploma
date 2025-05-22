import {makeAutoObservable, runInAction} from 'mobx';
import {
    createMaintenance,
    deleteMaintenance,
    getMaintenanceById,
    getMaintenances,
    updateMaintenance,
} from '../services/MaintenanceService.js';
import {authStore} from "./authStore.js";
import {ROLES} from "../utils/constants.js";
import vehiclesStore from "./vehiclesStore.js";

class MaintenancesStore {
    maintenances = [];
    selectedMaintenance = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadMaintenances() {
        this.loading = true;
        try {
            const data = await getMaintenances();
            let filteredData;
            if (vehiclesStore.vehicles.length === 0) {
                await vehiclesStore.loadVehicles();
            }
            if (authStore.user.role === ROLES.UNIT_COMMANDER) {
                filteredData = data.filter((maintenance) => {
                    return !!vehiclesStore.findVehicleById(maintenance.vehicleId);
                });
            }
            if (data) {
                runInAction(() => {
                    this.maintenances = filteredData ?? data;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.error = error;
            });
        } finally {
            this.loading = false;
        }
    }

    async loadMaintenanceById(maintenanceId) {
        try {
            const maintenance = await getMaintenanceById(maintenanceId);
            runInAction(() => {
                this.selectedMaintenance = maintenance;
            });
        } catch (error) {
            this.error = error;
        }
    }

    async addMaintenance(newMaintenance) {
        try {
            const created = await createMaintenance(newMaintenance);
            runInAction(() => {
                this.maintenances.push(created);
            });
        } catch (error) {
            this.error = error;
        }
    }

    async updateMaintenance(maintenanceId, updatedMaintenance) {
        try {
            const updated = await updateMaintenance(maintenanceId, updatedMaintenance);
            runInAction(() => {
                this.maintenances = this.maintenances.map((u) =>
                    u.id === maintenanceId ? updated : u
                );
            });
        } catch (error) {
            this.error = error;
        }
    }

    async removeMaintenance(maintenanceId) {
        try {
            await deleteMaintenance(maintenanceId);
            runInAction(() => {
                this.maintenances = this.maintenances.filter((u) => u.id !== maintenanceId);
            });
        } catch (error) {
            this.error = error;
        }
    }
}

const maintenancesStore = new MaintenancesStore();
export default maintenancesStore;
