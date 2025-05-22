const User = require('../models/User.model');
const AppError = require("../errors/AppError");
const bcrypt = require("bcryptjs");
const trainingSessionService = require('./trainingSessionService');
const sequelize = require('../config/settingsDB');

module.exports = {
    async createUser(userData) {
        const existingUserByEmail = await User.findOne({where: {email: userData.email}});
        if (existingUserByEmail) {
            throw new AppError(`User with email ${userData.email} already exists`, 400);
        }

        if (!userData.password_hash && userData.password) {
            userData.password_hash = await bcrypt.hash(userData.password, 10);
            delete userData.password;
        } else if (!userData.password_hash && !userData.password) {
            throw new AppError('Password is required to create a user', 400);
        }

        const ptUser = await User.create(userData);
        const userToReturn = {...ptUser.toJSON()};
        delete userToReturn.password_hash;
        return userToReturn;
    },

    async getAllUsers() {
        const ptUsers = await User.findAll({
            attributes: {exclude: ['password_hash']}
        });
        if (!ptUsers || ptUsers.length === 0) {
            return null;
        }
        return ptUsers;
    },

    async getUserById(id) {
        const ptUser = await User.findByPk(id, {
            attributes: {exclude: ['password_hash']}
        });
        if (!ptUser) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }
        return ptUser;
    },

    async updateUser(id, updateData) {
        const ptUser = await User.findByPk(id);
        if (!ptUser) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }

        if (updateData.password) {
            updateData.password_hash = await bcrypt.hash(updateData.password, 10);
            delete updateData.password;
        }

        await ptUser.update(updateData);
        const updatedUserToReturn = {...ptUser.toJSON()};
        delete updatedUserToReturn.password_hash;
        return updatedUserToReturn;
    },

    async deleteUser(id) {
        const ptUser = await User.findByPk(id);
        if (!ptUser) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }

        const sessions = await trainingSessionService.getAllTrainingSessions({conducted_by_user_id: id});
        if (sessions && sessions.length > 0) {
            for (const session of sessions) {
                await trainingSessionService.deleteTrainingSession(session.session_id);
            }
        }

        await ptUser.destroy();
        return {message: `User with ID ${id} deleted successfully`};
    }
};