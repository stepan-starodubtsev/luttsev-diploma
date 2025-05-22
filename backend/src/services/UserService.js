const User = require('../models/User');
const bcrypt = require("bcryptjs");
const AppError = require("../errors/AppError");

module.exports = {
    async createUser(userData) {
        const foundedUser = await User.findOne({ where: { username: userData.username } });
        if (foundedUser) {
            throw new AppError(`This username is already in use`, 400);
        }

        const passwordHash = await bcrypt.hash(userData.password, 10);
        const user = await User.create({
            name: userData.name,
            username: userData.username,
            passwordHash: passwordHash,
            role: userData.role
        });

        return user;
    },

    async getAllUsers() {
        const users = await User.findAll();
        if (users.length === 0) {
            return null;
        }
        return users;
    },

    async getUserById(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }
        return user;
    },

    async updateUser(id, updateData) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }

        if (updateData.password) {
            const isSamePassword = await bcrypt.compare(updateData.password, user.passwordHash);

            if (!isSamePassword) {
                updateData.passwordHash = await bcrypt.hash(updateData.password, 10);
            }

            delete updateData.password;
        }

        await user.update(updateData);
        return user;
    },

    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new AppError(`User with ID ${id} not found`, 404);
        }
        await user.destroy();
        return { message: `User with ID ${id} deleted` };
    }
};
