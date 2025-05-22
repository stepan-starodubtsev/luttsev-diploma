import {makeAutoObservable, runInAction} from 'mobx';
import {createVehicle, deleteVehicle, getVehicleById, getVehicles, updateVehicle,} from '../services/VehicleService.js';
import {authStore} from "./authStore.js";
import {ROLES} from "../utils/constants.js";
import unitsStore from "./unitsStore.js";

class VehiclesStore {
    vehicles = [];
    tempVehicle = null;
    selectedVehicle = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
        this.clearTempVehicle();
    }

    async loadVehicles() {
        this.loading = true;
        try {
            const data = await getVehicles();
            let filteredData;
            if (unitsStore.units.length === 0) {
                await unitsStore.loadUnits();
            }
            if (authStore.user.role === ROLES.UNIT_COMMANDER) {
                const userUnit = unitsStore.units.find(unit => unit.commanderId === parseInt(authStore.user.id));
                filteredData = data.filter(vehicle => vehicle.unitId === userUnit.id);
            }
            if (data) {
                runInAction(() => {
                    this.vehicles = filteredData ?? data;
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

    async loadVehicleById(vehicleId) {
        try {
            const vehicle = await getVehicleById(vehicleId);
            runInAction(() => {
                this.selectedVehicle = vehicle;
            });
        } catch (error) {
            this.error = error;
        }
    }

    async addVehicle() {
        try {
            const created = await createVehicle(this.prepareTempVehicleToSending(this.tempVehicle));
            runInAction(() => {
                this.vehicles.push(created);
            });
        } catch (error) {
            this.error = error;
        }
    }

    async updateVehicle(vehicleId) {
        try {
            const {conditionCategory, ...newVehicle} = this.tempVehicle;
            console.log('newVehicle: ', newVehicle);
            const updated = await updateVehicle(vehicleId, newVehicle);
            console.log('updated: ', updated);
            runInAction(() => {
                updated.conditionCategory = conditionCategory;
                this.vehicles = this.vehicles.map((u) =>
                    u.id === vehicleId ? updated : u
                );
            });
        } catch (error) {
            this.error = error;
        }
    }

    async removeVehicle(vehicleId) {
        try {
            await deleteVehicle(vehicleId);
            runInAction(() => {
                this.vehicles = this.vehicles.filter((u) => u.id !== vehicleId);
            });
        } catch (error) {
            this.error = error;
        }
    }

    async removeVehicleComponent(vehicleComponentId) {
        runInAction(() => {
            this.tempVehicle.components = this.tempVehicle.components
                .filter((component) => component.id !== vehicleComponentId);
        });
    }

    setTempVehicle(vehicle) {
        runInAction(() => {
            this.tempVehicle = vehicle;
        });
    }

    findComponentById(vehicleComponentId) {
        return vehiclesStore.tempVehicle.components
            .find(vehicleComponent => vehicleComponent.id === parseInt(vehicleComponentId));
    }

    findVehicleById(vehicleId) {
        return vehiclesStore.vehicles.find(vehicle => vehicle.id === parseInt(vehicleId));
    }

    indexOfComponentById(vehicleComponentId) {
        return vehiclesStore.tempVehicle.components
            .findIndex((component) => component.id === parseInt(vehicleComponentId));
    }

    indexOfVehicleById(vehicleId) {
        return vehiclesStore.vehicles
            .findIndex((vehicle) => vehicle.id === parseInt(vehicleId));
    }

    clearTempVehicle() {
        this.tempVehicle = {
            name: '',
            type: '',
            licensePlate: '',
            manufacturerNumber: '',
            manufacturedAt: '',
            operationGroup: '',
            mileageSinceManufactured: '',
            annualResourceNorm: '',
            conditionCategory: '',
            fuelType: '',
            oilType: '',
            components: [],
            unitId: '',
        };
    }

    updateComponentConditionCategory(vehicleId, vehicleComponentId, conditionCategory) {
        runInAction(() => {
            const vehicle = this.findVehicleById(vehicleId);
            if (vehicle.conditionCategory !== conditionCategory) {
                vehicle.conditionCategory = conditionCategory;
            }
            const vehicleComponent = vehicle.components
                .find((component) => component.id === parseInt(vehicleComponentId));
            vehicleComponent.conditionCategory = conditionCategory;
            console.log(vehicleComponent);
        });
    }

    prepareTempVehicleToSending(vehicle) {
        const {conditionCategory, ...newVehicle} = vehicle
        newVehicle.components = newVehicle.components.map((component) => {
            const {id, ...newComponent} = component;
            return newComponent;
        })
        return newVehicle;
    }
}

const vehiclesStore = new VehiclesStore();
export default vehiclesStore;
