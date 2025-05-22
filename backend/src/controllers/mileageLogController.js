const {mileageLogToDto} = require("../dtos/mileageLog.dto");
const {
    getAllMileageLogs,
    createMileageLog,
    getMileageLogById,
    deleteMileageLog
} = require("../services/ptUnitService");

module.exports = {
    async getAll(req, res) {
        const mileageLogs = await getAllMileageLogs();
        if (!mileageLogs) {
            res.status(404).send({})
        } else {
            res.json(mileageLogs.map(mileageLog => mileageLogToDto(mileageLog)));
        }
    },

    async getById(req, res) {
        const mileageLogDTO = await getMileageLogById(req.params.id);
        if (!mileageLogDTO) {
            res.status(404).send({})
        } else {
            res.json(mileageLogToDto(mileageLogDTO));
        }
    },

    async create(req, res) {
        const newMileageLog = await createMileageLog(req.body);
        res.status(201).json(mileageLogToDto(newMileageLog));
    },

    async delete(req, res) {
        await deleteMileageLog(req.params.id);
        res.status(204).send();
    }
};
