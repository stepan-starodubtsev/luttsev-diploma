const {unitToDto} = require("../dtos/unit.dto");
const {
    getAllUnits,
    getUnitById,
    createUnit,
    updateUnit,
    deleteUnit
} = require("../services/locationService");

module.exports = {
    async getAll(req, res) {
        const units = await getAllUnits();
        if (!units) {
            res.status(404).send({});
        } else {
            res.json(units.map(unit => unitToDto(unit)));
        }
    },

    async getById(req, res) {
        const unitDTO = await getUnitById(req.params.id);
        if (!unitDTO) {
            res.status(404).send({});
        } else {
            res.json(unitToDto(unitDTO));
        }
    },

    async create(req, res) {
        const newUnit = await createUnit(req.body);
        res.status(201).json(unitToDto(newUnit));
    },

    async update(req, res) {
        const unitDTO = await updateUnit(req.params.id, req.body);
        res.json(unitToDto(unitDTO));
    },

    async delete(req, res) {
        await deleteUnit(req.params.id);
        res.status(204).send();
    }
};
