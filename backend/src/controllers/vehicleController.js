const {vehicleToDto} = require("../dtos/vehicle.dto");
const {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle
} = require("../services/VehicleService");

module.exports = {
    async getAll(req, res) {
        const vehicles = await getAllVehicles();
        if (!vehicles) {
            res.status(404).send();
        } else {
            const vehiclesDTO = await Promise.all(
                vehicles.map(vehicle => vehicleToDto(vehicle))
            );
            res.json(vehiclesDTO);
        }
    },

    async getById(req, res) {
        const vehicleDTO = await getVehicleById(req.params.id);
        if (!vehicleDTO) {
            res.status(404).send();
        } else {
            res.json(await vehicleToDto(vehicleDTO));
        }
    },

    async create(req, res) {
        const newVehicle = await createVehicle(req.body);
        res.status(201).json(await vehicleToDto(newVehicle));
    },

    async update(req, res) {
        const vehicleDTO = await updateVehicle(req.params.id, req.body);
        res.json(await vehicleToDto(vehicleDTO));
    },

    async delete(req, res) {
        await deleteVehicle(req.params.id);
        res.status(204).send();
    }
};
