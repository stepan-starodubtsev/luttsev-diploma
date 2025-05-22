const Maintenance = require('../models/Maintenance');
const AppError = require("../errors/AppError");
const {updateVehicleComponentsCategory} = require("./VehicleComponentService");

module.exports = {
    async createMaintenance(maintenanceData) {
        const foundedMaintenance =
            await Maintenance.findOne({where: {vehicleId: maintenanceData.vehicleId, date: maintenanceData.date}});
        if (foundedMaintenance) {
            throw new AppError(`This maintenance is already in use by vehicle with id ${maintenanceData.vehicleId}
             at ${maintenanceData.date}`, 400);
        }

        return await Maintenance.create(maintenanceData);
    },

    async getAllMaintenances() {
        const maintenances = await Maintenance.findAll();
        if (maintenances.length === 0) {
            return null;
        }
        return maintenances;
    },

    async getMaintenanceById(id) {
        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) {
            throw new AppError(`Maintenance with ID ${id} not found`, 404);
        }
        return maintenance;
    },

    async getMaintenancesByVehicleId(vehicleId) {
        const maintenances = await Maintenance.findAll({where: vehicleId});
        if (maintenances.length === 0) {
            return null;
        }
        return maintenances;
    },

    async updateMaintenance(id, updateData) {
        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) {
            throw new AppError(`Maintenance with ID ${id} not found`, 404);
        }

        await maintenance.update(updateData);
        return maintenance;
    },

    async deleteMaintenance(id) {
        const maintenance = await Maintenance.findByPk(id);
        if (!maintenance) {
            throw new AppError(`Maintenance with ID ${id} not found`, 404);
        }
        await maintenance.destroy();
        return {message: `Maintenance with ID ${id} deleted`};
    }
};
