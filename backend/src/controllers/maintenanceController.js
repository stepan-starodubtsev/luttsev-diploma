const {maintenanceToDto} = require("../dtos/maintenance.dto");
const {
    getAllMaintenances,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
} = require("../services/ptUserService");

module.exports = {
    async getAll(req, res) {
        const maintenances = await getAllMaintenances();
        if (!maintenances) {
            res.status(404).send({})
        } else {
            res.json(maintenances.map(maintenance => maintenanceToDto(maintenance)));
        }
    },

    async getById(req, res) {
        const maintenance = await getMaintenanceById(req.params.id);
        if (!maintenance) {
            res.status(404).send({})
        } else {
            res.json(maintenanceToDto(maintenance));
        }
    },

    async create(req, res) {
        const newMaintenance = await createMaintenance(req.body);
        res.status(201).json(maintenanceToDto(newMaintenance));
    },

    async update(req, res) {
        const maintenanceDTO = await updateMaintenance(req.params.id, req.body);
        res.json(maintenanceToDto(maintenanceDTO));
    },

    async delete(req, res) {
        await deleteMaintenance(req.params.id);
        res.status(204).send();
    }
};
