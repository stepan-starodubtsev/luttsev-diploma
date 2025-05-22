const { DataTypes } = require('sequelize');
const sequelize = require('../config/settingsDB');

const PtUser = sequelize.define('PtUser', {
    user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'user_id'
    },
    first_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'first_name'
    },
    last_name: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'last_name'
    },
    email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        field: 'email'
    },
    password_hash: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'password_hash'
    },
    role: {
        type: DataTypes.ENUM('INSTRUCTOR', 'COMMANDER', 'DEPARTMENT_EMPLOYEE', 'ADMIN'),
        allowNull: false,
        field: 'role'
    },
    pt_unit_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'pt_unit_id'
    }
}, {
    tableName: 'pt_users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = PtUser;