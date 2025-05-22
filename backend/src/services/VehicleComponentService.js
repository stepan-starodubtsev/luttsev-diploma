const VehicleComponent = require('../models/VehicleComponent');
const AppError = require("../errors/AppError");
const sequelize = require("../config/settingsDB");

async function createVehicleComponent(vehicleComponentData) {
    const foundedVehicleComponent = await VehicleComponent.findOne(
        {where: {manufacturerNumber: vehicleComponentData.manufacturerNumber}});
    if (foundedVehicleComponent) {
        throw new AppError(`This vehicle component manufacturer number is already in use`, 400);
    }

    return await VehicleComponent.create(vehicleComponentData);
}

async function getAllVehicleComponents() {
    const vehicleComponents = await VehicleComponent.findAll();
    if (vehicleComponents.length === 0) {
        return null;
    }

    return vehicleComponents;
}

async function getVehicleComponentsByVehicleId(vehicleId) {
    const vehicleComponents = await VehicleComponent.findAll({where: {vehicleId: vehicleId}});
    if (vehicleComponents.length === 0) {
        return null;
    }
    return vehicleComponents;
}

async function getVehicleComponentsByIds(ids) {
    const t = await sequelize.transaction();
    let vehicleComponents;
    try {
        const componentPromises = ids.map((id) => {
            return VehicleComponent.findByPk(id, {transaction: t})
        });
        vehicleComponents = await Promise.all(componentPromises);
    } catch (e) {
        console.error(e);
        throw new AppError('Something was wrong when vehicle components searching', 400);
    }
    if (vehicleComponents.length === 0) {
        return null;
    }
    return vehicleComponents;
}

async function getVehicleComponentById(id) {
    const vehicleComponent = await VehicleComponent.findByPk(id);
    if (!vehicleComponent) {
        throw new AppError(`Vehicle component with ID ${id} not found`, 404);
    }
    return vehicleComponent;
}

async function updateVehicleComponent(id, updateData) {
    const vehicleComponent = await VehicleComponent.findByPk(id);
    if (!vehicleComponent) {
        throw new AppError(`Vehicle component with ID ${id} not found`, 404);
    }

    await vehicleComponent.update(updateData);
    return vehicleComponent;
}

async function deleteVehicleComponent(id) {
    const vehicleComponent = await VehicleComponent.findByPk(id);
    if (!vehicleComponent) {
        throw new AppError(`Vehicle component with ID ${id} not found`, 404);
    }
    await vehicleComponent.destroy();
    return {message: `Vehicle component with ID ${id} deleted`};
}

async function updateVehicleComponentsMileage(vehicleId, mileage, mileageDifference) {
    const components = await getVehicleComponentsByVehicleId(vehicleId);
    const t = await sequelize.transaction();
    let updatedComponents;
    try {
        updatedComponents = await Promise.all(components.map(async (vehicleComponent) => {
            const newMileageSinceManufactured = (vehicleComponent.mileageSinceManufactured || 0) + mileageDifference;
            const newMileageAfterLastRepair = (vehicleComponent.mileageAfterLastRepair || 0) + mileageDifference;

            return await vehicleComponent.update(
                {
                    mileageSinceManufactured: newMileageSinceManufactured,
                    mileageAfterLastRepair: newMileageAfterLastRepair,
                },
                {transaction: t}
            );
        }));
        await t.commit();
    } catch (e) {
        if (t) {
            await t.rollback();
        }
        throw new AppError(`Error updating vehicle components mileage for vehicleId: ${vehicleId}`, 500);
    }

    return updatedComponents;
}

async function updateVehicleComponentsCategory(vehicleComponentIds, newCategory) {
    let components = await getVehicleComponentsByIds(vehicleComponentIds);
    const t = await sequelize.transaction();
    try {
        components = await Promise.all(components.map(async (vehicleComponent) => {
            await vehicleComponent.update(
                {conditionCategory: newCategory},
                {transaction: t}
            );
        }));
        await t.commit();
    } catch (e) {
        console.error(e);
        throw new AppError('Something was wrong when vehicle components updating', 400);
    }
    return components;
}

module.exports = {
    createVehicleComponent,
    getAllVehicleComponents,
    getVehicleComponentsByVehicleId,
    getVehicleComponentById,
    updateVehicleComponent,
    deleteVehicleComponent,
    updateVehicleComponentsMileage,
    updateVehicleComponentsCategory
};