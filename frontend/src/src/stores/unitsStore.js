import {makeAutoObservable, runInAction} from 'mobx';
import {createUnit, deleteUnit, getUnitById, getUnits, updateUnit,} from '../services/UnitService.js';

class UnitsStore {
    units = [];
    selectedUnit = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadUnits() {
        this.loading = true;
        try {
            const data = await getUnits();
            if (data) {
                runInAction(() => {
                    this.units = data;
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

    async loadUnitById(unitId) {
        try {
            const unit = await getUnitById(unitId);
            runInAction(() => {
                this.selectedUnit = unit;
            });
        } catch (error) {
            this.error = error;
        }
    }

    async addUnit(newUnit) {
        try {
            const created = await createUnit(newUnit);
            runInAction(() => {
                this.units.push(created);
            });
        } catch (error) {
            this.error = error;
        }
    }

    async updateUnit(unitId, updatedUnit) {
        try {
            const updated = await updateUnit(unitId, updatedUnit);
            runInAction(() => {
                this.units = this.units.map((u) =>
                    u.id === unitId ? updated : u
                );
            });
        } catch (error) {
            this.error = error;
        }
    }

    async removeUnit(unitId) {
        try {
            await deleteUnit(unitId);
            runInAction(() => {
                this.units = this.units.filter((u) => u.id !== unitId);
            });
        } catch (error) {
            this.error = error;
        }
    }
}

const unitsStore = new UnitsStore();
export default unitsStore;
