const RepairComponent = require('../models/RepairComponent');
const AppError = require("../errors/AppError");
const { repairComponentToDto } = require("../dtos/repairComponent.dto");
const {updateVehicleComponentsCategory} = require("./VehicleComponentService");

module.exports = {
    async createRepairComponent(repairComponentData) {
        const foundedRepairComponent = await RepairComponent.findOne({ where: { vehicleComponentId: repairComponentData.vehicleComponentId, repairId: repairComponentData.repairId } });
        if (foundedRepairComponent) {
            throw new AppError(`This repair component is already in use in this repair`, 400);
        }

        return await RepairComponent.create(repairComponentData);
    },

    async getAllRepairComponents() {
        const repairComponents = await RepairComponent.findAll();
        if (repairComponents.length === 0) {
            return null;
        }
        return repairComponents;
    },

    async getRepairComponentById(id) {
        const repairComponent = await RepairComponent.findByPk(id);
        if (!repairComponent) {
            throw new AppError(`Repair component with ID ${id} not found`, 404);
        }
        return repairComponent;
    },

    async getRepairComponentsByRepairId(repairId) {
        const repairComponents = await RepairComponent.findAll({where: { repairId: repairId }});
        if (repairComponents.length === 0) {
            return null;
        }
        return repairComponents;
    },

    async updateRepairComponent(id, updateData) {
        const repairComponent = await RepairComponent.findByPk(id);
        if (!repairComponent) {
            throw new AppError(`Repair component with ID ${id} not found`, 404);
        }

        await repairComponent.update(updateData);
        return repairComponent;
    },

    async deleteRepairComponent(id) {
        const repairComponent = await RepairComponent.findByPk(id);
        if (!repairComponent) {
            throw new AppError(`RepairComponent with ID ${id} not found`, 404);
        }
        await repairComponent.destroy();
        return { message: `RepairComponent with ID ${id} deleted` };
    },

    async updateRepairComponentsCategory(repair, componentRepairs) {
        let newCategory;
        if (repair.type === 'capital') {
            newCategory = '4';
        } else {
            newCategory = '3';
        }

        if (repair.workDescription !== ''){
            newCategory = '2';
        }

        const componentRepairsIds = componentRepairs.map(componentRepairs => componentRepairs.vehicleComponentId);
        await updateVehicleComponentsCategory(componentRepairsIds, newCategory);
    }
};
