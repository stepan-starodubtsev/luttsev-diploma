const {vehicleComponentToDto} = require("../dtos/vehicleComponent.dto");
const {
    getAllVehicleComponents,
    getVehicleComponentById,
    createVehicleComponent,
    updateVehicleComponent,
    deleteVehicleComponent
} = require("../services/VehicleComponentService");

module.exports = {
    async getAll(req, res) {
        const vehicleComponents = await getAllVehicleComponents();
        if (!vehicleComponents) {
            res.status(404).send();
        } else {
            res.json(await Promise.all(vehicleComponents.map(vehicleComponent => vehicleComponentToDto(vehicleComponent))));
        }
    },

    async getById(req, res) {
        const vehicleComponentDTO = await getVehicleComponentById(req.params.id);
        if (!vehicleComponentDTO) {
            res.status(404).send();
        } else {
            res.json(await vehicleComponentToDto(vehicleComponentDTO));
        }
    },

    async create(req, res) {
        const newVehicleComponent = await createVehicleComponent(req.body);
        res.status(201).json(await vehicleComponentToDto(newVehicleComponent));
    },

    async update(req, res) {
        const vehicleComponentDTO = await updateVehicleComponent(req.params.id, req.body);
        res.json(await vehicleComponentToDto(vehicleComponentDTO));
    },

    async delete(req, res) {
        await deleteVehicleComponent(req.params.id);
        res.status(204).send();
    }
};
