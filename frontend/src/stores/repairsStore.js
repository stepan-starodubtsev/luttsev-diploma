import {makeAutoObservable, runInAction} from 'mobx';
import {createRepair, deleteRepair, getRepairById, getRepairs, updateRepair,} from '../services/RepairService.js';
import vehiclesStore from "./vehiclesStore.js";
import {ROLES} from "../utils/constants.js";
import {authStore} from "./authStore.js";

class RepairsStore {
    repairs = [];
    tempRepair = null;
    selectedRepair = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
        this.clearTempRepair();
    }

    async loadRepairs() {
        this.loading = true;
        try {
            const data = await getRepairs();
            let filteredData;
            if (vehiclesStore.vehicles.length === 0) {
                await vehiclesStore.loadVehicles();
            }
            if (authStore.user.role === ROLES.UNIT_COMMANDER) {
                filteredData = data.filter((repair) => {
                    return !!vehiclesStore.findVehicleById(repair.vehicleId);
                });
            }
            if (data) {
                runInAction(() => {
                    this.repairs = filteredData ?? data;
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

    async loadRepairById(repairId) {
        try {
            const repair = await getRepairById(repairId);
            runInAction(() => {
                this.selectedRepair = repair;
            });
        } catch (error) {
            this.error = error;
        }
    }

    async addRepair() {
        try {
            const created = await createRepair(this.prepareTempRepairToSending(this.tempRepair));
            runInAction(() => {
                this.repairs.push(created);
                this.tempRepair = created;
            });
            this.updateVehicleCategory();
        } catch (error) {
            this.error = error;
        }
    }

    async updateRepair(repairId) {
        try {
            const updated = await updateRepair(repairId, this.tempRepair);
            runInAction(() => {
                this.repairs = this.repairs.map((u) =>
                    u.id === repairId ? updated : u
                );
                this.tempRepair = updated;
            });
            this.updateVehicleCategory();
        } catch (error) {
            this.error = error;
        }
    }

    async removeRepair(repairId) {
        try {
            await deleteRepair(repairId);
            runInAction(() => {
                this.repairs = this.repairs.filter((u) => u.id !== repairId);
            });
        } catch (error) {
            this.error = error;
        }
    }

    async removeRepairComponent(repairComponentId) {
        runInAction(() => {
            this.tempRepair.componentRepairs = this.tempRepair.componentRepairs
                .filter((component) => component.id !== repairComponentId);
        });
    }

    setTempRepair(repair) {
        runInAction(() => {
            this.tempRepair = repair;
        });
    }

    findComponentRepairById(repairComponentId) {
        return repairsStore.tempRepair.componentRepairs
            .find(repairComponent => repairComponent.id === parseInt(repairComponentId));
    }

    indexOfComponentRepairById(repairComponentId) {
        return repairsStore.tempRepair.componentRepairs
            .findIndex((component) => component.id === parseInt(repairComponentId));
    }

    clearTempRepair() {
        this.tempRepair = {
            type: '',
            date: '',
            repairReasonText: '',
            workDescription: '',
            componentRepairs: [],
            vehicleId: '',
        };
    }

    prepareTempRepairToSending(repair) {
        const componentRepairs = repair.componentRepairs.map((component) => {
            const {id, ...newComponent} = component;
            return newComponent;
        })
        console.log("repair: ", repair);
        return {componentRepairs, ...repair};
    }

    updateVehicleCategory() {
        this.tempRepair.componentRepairs.forEach(componentRepair => {
            let newCategory;
            if (this.tempRepair.type === 'capital') {
                newCategory = '4';
            } else {
                newCategory = '3';
            }

            if (this.tempRepair.workDescription !== '') {
                newCategory = '2';
            }

            vehiclesStore.updateComponentConditionCategory(this.tempRepair.vehicleId,
                componentRepair.vehicleComponentId, newCategory)
        })
    }
}

const repairsStore = new RepairsStore();
export default repairsStore;
