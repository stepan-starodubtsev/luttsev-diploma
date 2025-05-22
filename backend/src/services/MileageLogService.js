const AppError = require("../errors/AppError");
const MileageLog = require("../models/MileageLog");
const {updateVehicleMileage} = require("./VehicleService");
const {Op} = require("sequelize");

module.exports = {
    async createMileageLog(mileageLogData) {
        await updateVehicleMileage(mileageLogData.vehicleId, mileageLogData.mileage, mileageLogData.mileageDifference);
        return await MileageLog.create(mileageLogData);
    },

    async getAllMileageLogs() {
        const mileageLogs = await MileageLog.findAll();
        if (mileageLogs.length === 0) {
            return null;
        }
        return mileageLogs;
    },

    async getMileagesLogsByVehicleIdForThisYear(vehicleId) {
        const startOfYear = new Date().getFullYear();
        const mileageLogs = await MileageLog.findAll({
            where: {
                vehicleId,
                createdAt: {
                    [Op.gte]: startOfYear,
                },
            },
            order: [['createdAt', 'ASC']],
        });
        if (mileageLogs.length === 0) {
            return null;
        }
        return mileageLogs;
    },

    async getMileageLogById(id) {
        const mileageLog = await MileageLog.findByPk(id);
        if (!mileageLog) {
            throw new AppError(`MileageLog with ID ${id} not found`, 404);
        }
        return mileageLog;
    },


    async deleteMileageLog(id) {
        const mileageLog = await MileageLog.findByPk(id);
        if (!mileageLog) {
            throw new AppError(`MileageLog with ID ${id} not found`, 404);
        }
        const newMileage = mileageLog.mileage - mileageLog.mileageDifference;
        const newMileageDifference = -(mileageLog.mileageDifference);
        await mileageLog.destroy();
        await updateVehicleMileage(mileageLog.vehicleId, newMileage, newMileageDifference);
        return {message: `MileageLog with ID ${id} deleted`};
    }
};
