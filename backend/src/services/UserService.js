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

        const user = await User.create(userData);
        const userToReturn = {...user.toJSON()};
        delete userToReturn.password_hash;
        return userToReturn;
    },

    async getAllUsers() {
        const users = await User.findAll({
            attributes: {exclude: ['password_hash']}
        });
        if (!users || users.length === 0) {
            return null;
        }
        return users;
    },

    async getUserById(id) {
        const user = await User.findByPk(id, {
            attributes: {exclude: ['password_hash']}
        });
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }
        return user;
    },

    async getUserByEmail(email) {
        const user = await User.findOne({where: {email: email}}, {
            attributes: {exclude: ['password_hash']}
        });
        if (!user) {
            throw new AppError(`User with email ${email} not found`, 404);
        }
        return user;
    },

    async updateUser(id, updateData) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }

        if (updateData.password) {
            updateData.password_hash = await bcrypt.hash(updateData.password, 10);
            delete updateData.password;
        }

        await user.update(updateData);
        const updatedUserToReturn = {...user.toJSON()};
        delete updatedUserToReturn.password_hash;
        return updatedUserToReturn;
    },

    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }

        const sessions = await trainingSessionService.getAllTrainingSessions({conducted_by_user_id: id});
        if (sessions && sessions.length > 0) {
            for (const session of sessions) {
                await trainingSessionService.deleteTrainingSession(session.session_id);
            }
        }

        await user.destroy();
        return {message: `User with ID ${id} deleted successfully`};
    }
};