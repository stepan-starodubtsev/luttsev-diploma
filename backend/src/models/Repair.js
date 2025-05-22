const {DataTypes} = require('sequelize');
const sequelize = require('../config/settingsDB');
const User = require('./User');
const Vehicle = require('./Vehicle');

const Repair = sequelize.define('Repair', {
    type: {
        type: DataTypes.ENUM('unplanned', 'current', 'medium', 'capital'),
        allowNull: false
    },
    date: {type: DataTypes.DATEONLY, allowNull: false},
    repairReasonText: {type: DataTypes.TEXT, allowNull: true},
    workDescription: {type: DataTypes.TEXT, allowNull: true},
});

Repair.belongsTo(Vehicle, {foreignKey: 'vehicleId'});

module.exports = Repair;
