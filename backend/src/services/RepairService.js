const Repair = require('../models/Repair');
const AppError = require("../errors/AppError");
const {getRepairComponentsByRepairId, updateRepairComponent, updateRepairComponentsCategory} = require("./RepairComponentService");
const sequelize = require("../config/settingsDB");
const RepairComponent = require("../models/RepairComponent");
const Vehicle = require("../models/Vehicle");
const {getVehicleComponentsByVehicleId} = require("./VehicleComponentService");

module.exports = {
    async getAllRepairs() {
        const repairs = await Repair.findAll();
        if (repairs.length === 0) {
            return null;
        }
        return repairs;
    },

    async getRepairById(id) {
        const repair = await Repair.findByPk(id);
        if (!repair) {
            throw new AppError(`Repair with ID ${id} not found`, 404);
        }
        return repair;
    },

    async getRepairsByVehicleId(vehicleId) {
        const repairs = await Repair.findAll({where: vehicleId});
        if (repairs.length === 0) {
            return null;
        }
        return repairs;
    },

    async createRepair(repairData) {
        const transaction = await  sequelize.transaction();
        let newRepair;
        let componentRepairs;
        try {
            const existingRepair = await Repair.findOne({where: {vehicleId: repairData.vehicleId}});
            if (existingRepair) {
                throw new AppError(`This repair is already in use by vehicle with id ${repairData.vehicleId}`, 400);
            }

            let { componentRepairs: componentRepairsTemp, ...repair } = repairData;

            newRepair = await Repair.create(repair, { transaction });

            componentRepairsTemp = await Promise.all(
                componentRepairsTemp.map(componentRepair => {
                    componentRepair.repairId = newRepair.id;
                    return RepairComponent.create(componentRepair, { transaction });
                })
            );
            componentRepairs = componentRepairsTemp;
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        await updateRepairComponentsCategory(newRepair, componentRepairs);
        return newRepair;
    },

    async updateRepair(id, updateData) {
        const existingRepair = await Repair.findByPk(id);
        if (!existingRepair) {
            throw new AppError(`Repair with ID ${id} not found`, 404);
        }

        let {componentRepairs, ...repair} = updateData;
        const newRepair = await existingRepair.update(repair);
        componentRepairs = await Promise.all(componentRepairs.map(componentRepairs => {
            return updateRepairComponent(componentRepairs.id, componentRepairs);
        }));

        await updateRepairComponentsCategory(newRepair, componentRepairs);
        return newRepair;
    },

    async deleteRepair(id) {
        const repair = await Repair.findByPk(id);
        if (!repair) {
            throw new AppError(`Repair with ID ${id} not found`, 404);
        }
        (await getRepairComponentsByRepairId(repair.id)).forEach(repairComponent => repairComponent.destroy());
        await repair.destroy();
        return {message: `Repair with ID ${id} deleted`};
    },
};
