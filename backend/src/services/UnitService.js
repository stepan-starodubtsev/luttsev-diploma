const Unit = require('../models/Unit.model');
const AppError = require("../errors/AppError");
const sequelize = require('../config/settingsDB');

const militaryPersonnelService = require('./militaryPersonnelService');
const trainingSessionService = require('./trainingSessionService');
const UserService = require('./UserService');


module.exports = {
    async createUnit(unitData) {
        const existingUnit = await Unit.findOne({ where: { unit_name: unitData.unit_name } });
        if (existingUnit) {
            throw new AppError(`Unit with name "${unitData.unit_name}" already exists`, 400);
        }
        return await Unit.create(unitData);
    },

    async getAllUnits() {
        const Units = await Unit.findAll();
        if (!Units || Units.length === 0) {
            return null;
        }
        return Units;
    },

    async getUnitById(id) {
        const Unit = await Unit.findByPk(id);
        if (!Unit) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }
        return Unit;
    },

    async updateUnit(id, updateData) {
        const Unit = await Unit.findByPk(id);
        if (!Unit) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }
        if (updateData.unit_name && updateData.unit_name !== Unit.unit_name) {
            const existingUnit = await Unit.findOne({ where: { unit_name: updateData.unit_name } });
            if (existingUnit) {
                throw new AppError(`Unit with name "${updateData.unit_name}" already exists`, 400);
            }
        }
        await Unit.update(updateData);
        return Unit;
    },

    async deleteUnit(id) {
        const Unit = await Unit.findByPk(id);
        if (!Unit) {
            throw new AppError(`Unit with ID ${id} not found`, 404);
        }

        const transaction = await sequelize.transaction();
        try {
            const usersInUnit = await UserService.getAllUsers({ _unit_id: id });
            if (usersInUnit) {
                for (const user of usersInUnit) {
                    await UserService.updateUser(user.user_id, { _unit_id: null }, { transaction });
                }
            }

            const personnelInUnit = await militaryPersonnelService.getAllMilitaryPersonnel({ _unit_id: id });
            if (personnelInUnit) {
                for (const person of personnelInUnit) {
                    await militaryPersonnelService.deleteMilitaryPersonnel(person.military_person_id, { transaction });
                }
            }

            const sessionsInUnit = await trainingSessionService.getAllTrainingSessions({ _unit_id: id });
            if (sessionsInUnit) {
                for (const session of sessionsInUnit) {
                    await trainingSessionService.deleteTrainingSession(session.session_id, { transaction });
                }
            }

            await Unit.destroy({ transaction });

            await transaction.commit();
            return { message: `Unit with ID ${id} and all associated data deleted successfully` };
        } catch (error) {
            await transaction.rollback();
            if (error instanceof AppError) throw error;
            throw new AppError(`Could not delete Unit with ID ${id}: ${error.message}`, 500);
        }
    }
};