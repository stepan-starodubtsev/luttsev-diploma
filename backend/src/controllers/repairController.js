const {repairToDto} = require("../dtos/repair.dto");
const {
    getAllRepairs,
    getRepairById,
    createRepair,
    updateRepair,
    deleteRepair
} = require("../services/RepairService");

module.exports = {
    async getAll(req, res) {
        const repairs = await getAllRepairs();
        if (!repairs) {
            res.status(404).send({});
        } else {
            const repairsDTO = await Promise.all(
                repairs.map(repair => repairToDto(repair))
            );
            res.json(repairsDTO);
        }
    },

    async getById(req, res) {
        const repairDTO = await getRepairById(req.params.id);
        if (!repairDTO) {
            res.status(404).send({});
        } else {
            res.json(await repairToDto(repairDTO));
        }
    },

    async create(req, res) {
        const newRepair = await createRepair(req.body);
        res.status(201).json(await repairToDto(newRepair));
    },

    async update(req, res) {
        const repairDTO = await updateRepair(req.params.id, req.body);
        res.json(await repairToDto(repairDTO));
    },

    async delete(req, res) {
        await deleteRepair(req.params.id);
        res.status(204).send();
    }
};