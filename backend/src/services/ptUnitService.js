const PtUnit = require('../models/ptUnit.model');
const AppError = require("../errors/AppError");
const sequelize = require('../config/settingsDB');

const militaryPersonnelService = require('./militaryPersonnelService');
const trainingSessionService = require('./trainingSessionService');
const ptUserService = require('./ptUserService');


module.exports = {
    async createPtUnit(unitData) {
        const existingUnit = await PtUnit.findOne({ where: { unit_name: unitData.unit_name } });
        if (existingUnit) {
            throw new AppError(`Unit with name "${unitData.unit_name}" already exists`, 400);
        }
        return await PtUnit.create(unitData);
    },

    async getAllPtUnits() {
        const ptUnits = await PtUnit.findAll();
        if (!ptUnits || ptUnits.length === 0) {
            return null;
        }
        return ptUnits;
    },

    async getPtUnitById(id) {
        const ptUnit = await PtUnit.findByPk(id);
        if (!ptUnit) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }
        return ptUnit;
    },

    async updatePtUnit(id, updateData) {
        const ptUnit = await PtUnit.findByPk(id);
        if (!ptUnit) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }
        if (updateData.unit_name && updateData.unit_name !== ptUnit.unit_name) {
            const existingUnit = await PtUnit.findOne({ where: { unit_name: updateData.unit_name } });
            if (existingUnit) {
                throw new AppError(`Unit with name "${updateData.unit_name}" already exists`, 400);
            }
        }
        await ptUnit.update(updateData);
        return ptUnit;
    },

    async deletePtUnit(id) {
        const ptUnit = await PtUnit.findByPk(id);
        if (!ptUnit) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }

        const transaction = await sequelize.transaction();
        try {
            const usersInUnit = await ptUserService.getAllPtUsers({ pt_unit_id: id });
            if (usersInUnit) {
                for (const user of usersInUnit) {
                    await ptUserService.updatePtUser(user.user_id, { pt_unit_id: null }, { transaction });
                }
            }

            const personnelInUnit = await militaryPersonnelService.getAllMilitaryPersonnel({ pt_unit_id: id });
            if (personnelInUnit) {
                for (const person of personnelInUnit) {
                    await militaryPersonnelService.deleteMilitaryPersonnel(person.military_person_id, { transaction });
                }
            }

            const sessionsInUnit = await trainingSessionService.getAllTrainingSessions({ pt_unit_id: id });
            if (sessionsInUnit) {
                for (const session of sessionsInUnit) {
                    await trainingSessionService.deleteTrainingSession(session.session_id, { transaction });
                }
            }

            await ptUnit.destroy({ transaction });

            await transaction.commit();
            return { message: `Unit with ID ${id} and all associated data deleted successfully` };
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not delete Unit with ID ${id}: ${error.message}`, 500);
        }
    }
};