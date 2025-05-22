const Vehicle = require('../models/Vehicle');
const VehicleComponent = require('../models/VehicleComponent');
const AppError = require("../errors/AppError");
const {
    getVehicleComponentsByVehicleId, updateVehicleComponent, updateVehicleComponentsMileage
} = require("./VehicleComponentService");
const sequelize = require("../config/settingsDB");

    async function createVehicle(vehicleData) {
        const transaction = await  sequelize.transaction();

        try {
            const existingVehicle = await Vehicle.findOne({
                where: { manufacturerNumber: vehicleData.manufacturerNumber },
                transaction,
            });

            if (existingVehicle) {
                throw new AppError(`This vehicle manufacturer number is already in use`, 400);
            }

            let { components, ...vehicle } = vehicleData;

            const newVehicle = await Vehicle.create(vehicle, { transaction });

            components = await Promise.all(
                components.map(component => {
                    component.vehicleId = newVehicle.id;
                    return VehicleComponent.create(component, { transaction });
                })
            );

            await transaction.commit();

            return newVehicle;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async function getAllVehicles() {
        const vehicles = await Vehicle.findAll();
        if (vehicles.length === 0) {
            return null;
        }
        return vehicles;
    }

    async function getVehicleById(id) {
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            throw new AppError(`Vehicle with ID ${id} not found`, 404);
        }
        vehicle.components = getVehicleComponentsByVehicleId(vehicle.id);
        return vehicle;
    }

    async function updateVehicle(id, updateData) {
        const foundedVehicle = await Vehicle.findByPk(id);
        if (!foundedVehicle) {
            throw new AppError(`Vehicle with ID ${id} not found`, 404);
        }

        let {components, ...vehicle} = updateData;
        const newVehicle = await foundedVehicle.update(vehicle);
        if (components){
            components = await Promise.all(components.map(async (component) => {
                return await updateVehicleComponent(component.id, component);
            }));
        }
        return newVehicle;
    }

    async function deleteVehicle(id) {
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            throw new AppError(`Vehicle with ID ${id} not found`, 404);
        }
        (await getVehicleComponentsByVehicleId(vehicle.id)).forEach(component => component.destroy());
        await vehicle.destroy();
        return {message: `Vehicle with ID ${id} deleted`};
    }

    async function updateVehicleMileage(vehicleId, mileage, mileageDifference) {
        await updateVehicleComponentsMileage(vehicleId, mileage, mileageDifference);
        return await updateVehicle(vehicleId, {mileageSinceManufactured: mileage});
    }
    
module.exports = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
    updateVehicleMileage,
};