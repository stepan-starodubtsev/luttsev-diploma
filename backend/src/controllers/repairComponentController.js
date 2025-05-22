const {
    getAllRepairComponents,
    getRepairComponentById,
    createRepairComponent,
    deleteRepairComponent
} = require("../services/RepairComponentService");
const {updateRepairComponent} = require("../services/RepairComponentService");
const {repairComponentToDto} = require("../dtos/repairComponent.dto");

module.exports = {
    async getAll(req, res) {
        const repairComponents = await getAllRepairComponents();
        if (!repairComponents) {
            return res.status(404).send({})
        } else {
            res.json(repairComponents.map(repairComponent => repairComponentToDto(repairComponent)));
        }
    },

    async getById(req, res) {
        const repairComponentDTO = await getRepairComponentById(req.params.id);
        res.json(repairComponentToDto(repairComponentDTO));
    },

    async create(req, res) {
        const newRepairComponent = await createRepairComponent(req.body);
        res.status(201).json(repairComponentToDto(newRepairComponent));
    },

    async update(req, res) {
        const repairComponentDTO = await updateRepairComponent(req.params.id, req.body);
        res.json(repairComponentToDto(repairComponentDTO));
    },

    async delete(req, res) {
        await deleteRepairComponent(req.params.id);
        res.status(204).send();
    }
};
